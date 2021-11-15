/*

  PARAMETRI 
  - target = PROD / STAGING
  - app = nome della dir della applicazione
    se app="LIB" viene fatto deploy della libreria

  UTILIZZO
  npm run deploy <TARGET> <APP>

  D:\Tomcat\webapps\ROOT\geoviewer2\deploy.bat <TARGET> <APP>
  D:\Tomcat\webapps\ROOT\geoviewer2\deploy.bat STAGING LIB
  D:\Tomcat\webapps\ROOT\geoviewer2\deploy.bat STAGING geoportale

*/

require('shelljs/global');
const fs = require('fs');
const path = require('path');
const config = require('../config');

console.log('Deploy Geoviewer2\n\n');

const target = process.argv[2];
const app = process.argv[3];

if (
  target !== 'LOCAL' &&
  target !== 'TEST' &&
  target !== 'PROD' &&
  target !== 'STAGING' &&
  target !== 'PROD-PROT' &&
  target !== 'STAGING-PROT'
) {
  console.log(
    '\n\n ATTENZIONE!!! Parametro "target" non corretto (LOCAL/TEST/PROD/STAGING/PROD-PROT/STAGING-PROT) '
  );
  return;
}
if (app === '') {
  console.log(
    '\n\n ATTENZIONE!!! Parametro "app" deve essere impostato (impostare a "LIB" per deploy libreria) '
  );
  return;
}

console.log(`Deploy in ambiente:${target}\n`);

const version = Date.now().toString();
const type = app === 'LIB' ? 'LIB' : 'APP';

if (type === 'LIB') deployLib(target);
if (type === 'APP') deployApp(target);

function deployLib(target) {
  // const backUpPath = path.join(
  //   config.build.assetsRoot,
  //   config.deploy.backUpDir,
  //   `static.${version}`
  // );

  // console.log(` BackUp su ${backUpPath}\n`);
  // cp('-R', config.build.assetsRoot, backUpPath);

  const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
  console.log('assetsPath', assetsPath);

  if (config.deploy.baseDeployDir[target]) {
    const distPath = path.join(config.deploy.baseDeployDir[target], 'dist/');
    console.log('distPath', distPath);
    console.log(`\n\nDeploy libreria - Versione ${version}\n`);
    // rm('-rf', staticPath);
    cp('-R', assetsPath, distPath);
  }
}

function deployApp(target) {
  const appsDir = '/pages/apps';
  const appsSourceBasePath = path.resolve(__dirname, '..' + appsDir);
  const appSourcePath = path.join(appsSourceBasePath, app);
  console.log('appSourcePath', appSourcePath);

  const appTargetPath = path.join(path.join(config.deploy.baseDeployDir[target], appsDir), app);
  console.log('appTargetPath', appTargetPath);

  // return;

  if (!fs.existsSync(appSourcePath)) {
    console.log(` ATTENZIONE! Applicazione ${appSourcePath} non esiste\n`);
    return;
  }

  console.log(`\nDeploy applicazione ${app}\n`);
  rm('-rf', appTargetPath);
  cp('-R', appSourcePath, appTargetPath);
}

/* 
function deployAppOLD(target) {
  const appsDir = '/pages/apps';
  const appsSourceBasePath = path.resolve(__dirname, '..' + appsDir);
  const appSourcePath = path.join(appsSourceBasePath, app);
  const appsTargetBasePath = path.join(config.deploy.baseDeployDir[target], appsDir);
  const appTargetPath = path.join(appsTargetBasePath, app);
  const backUpPath = path.join(appsSourceBasePath, config.deploy.backUpDir, `${app}.${version}`);
  const appsTargetBasePath2 = path.join(config.deploy.baseDeployDir2[target], appsDir);
  const appTargetPath2 = path.join(appsTargetBasePath2, app);
  const appsTargetBasePath0 = path.join(config.deploy.baseDeployDir0[target], appsDir);
  const appTargetPath0 = path.join(appsTargetBasePath0, app);
  const appsTargetBasePath3 = path.join(config.deploy.baseDeployDir3[target], appsDir);
  const appTargetPath3 = path.join(appsTargetBasePath3, app);

  // console.log(appsSourceBasePath)
  // console.log(backUpPath)
  // return

  if (!fs.existsSync(appSourcePath)) {
    console.log(` ATTENZIONE! Applicazione ${appSourcePath} non esiste\n`);
    return;
  }

  console.log(` Deploy applicazione ${app} su ${appTargetPath0} - Versione ${version}\n`);
  rm('-rf', appTargetPath0);
  cp('-R', appSourcePath, appTargetPath0);

  console.log(` BackUp su ${backUpPath}\n`);
  cp('-R', appTargetPath2, backUpPath);

  console.log(` Deploy applicazione ${app} su ${appTargetPath2} - Versione ${version}\n`);
  rm('-rf', appTargetPath2);
  cp('-R', appSourcePath, appTargetPath2);

  if (config.deploy.baseDeployDir4[target]) {
    const appsTargetBasePath4 = path.join(config.deploy.baseDeployDir4[target], appsDir);
    const appTargetPath4 = path.join(appsTargetBasePath4, app);
    console.log(` Deploy applicazione ${app} su ${appTargetPath4} - Versione ${version}\n`);
    rm('-rf', appTargetPath4);
    cp('-R', appSourcePath, appTargetPath4);
  }

  console.log(` Deploy applicazione ${app} su ${appTargetPath3} - Versione ${version}\n`);
  rm('-rf', appTargetPath3);
  cp('-R', appSourcePath, appTargetPath3);
}

function deployLibOLD(target) {
  const backUpPath = path.join(
    config.build.assetsRoot,
    config.deploy.backUpDir,
    `static.${version}`
  );

  console.log(` BackUp su ${backUpPath}\n`);
  cp('-R', config.build.assetsRoot, backUpPath);

  const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);

  // switch (target) {
  //   case 'TEST':
  //     break;
  // }

  // geoservices/apps/viewer in locale
  if (config.deploy.baseDeployDir0[target]) {
    const distPath0 = path.join(config.deploy.baseDeployDir0[target], 'dist/');
    const staticPath0 = path.join(distPath0, config.build.assetsSubDirectory);
    console.log(` Deploy libreria ${app} su ${staticPath0} - Versione ${version}\n`);
    rm('-rf', staticPath0);
    cp('-R', assetsPath, staticPath0);
  }

  // geoservices/apps/viewer
  if (config.deploy.baseDeployDir2[target]) {
    const distPath2 = path.join(config.deploy.baseDeployDir2[target], 'dist/');
    const staticPath2 = path.join(distPath2, config.build.assetsSubDirectory);
    console.log(
      ` Deploy libreria ${app} da ${assetsPath} su ${staticPath2} - Versione ${version}\n`
    );
    rm('-rf', staticPath2);
    cp('-R', assetsPath, staticPath2);
  }

  // SRVCARTO2
  if (config.deploy.baseDeployDir4[target]) {
    const distPath4 = path.join(config.deploy.baseDeployDir4[target], 'dist/');
    const staticPath4 = path.join(distPath4, config.build.assetsSubDirectory);
    console.log(` Deploy libreria ${app} su ${staticPath4} - Versione ${version}\n`);
    rm('-rf', staticPath4);
    cp('-R', assetsPath, staticPath4);
  }

  // SRVCARTO PROT
  if (config.deploy.baseDeployDir3[target]) {
    const distPath3 = path.join(config.deploy.baseDeployDir3[target], 'dist/');
    const staticPath3 = path.join(distPath3, config.build.assetsSubDirectory);
    console.log(` Deploy libreria ${app} su ${staticPath3} - Versione ${version}\n`);
    rm('-rf', staticPath3);
    cp('-R', assetsPath, staticPath3);
  }
}
 */
