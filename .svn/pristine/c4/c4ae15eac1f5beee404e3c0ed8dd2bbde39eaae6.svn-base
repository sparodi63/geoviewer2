/*

  PARAMETRI 
  - target = PROD / STAGING
  - app = nome della dir della applicazione
    se app="LIB" viene fatto deploy della libreria

  UTILIZZO
  npm run deploy <TARGET> <APP>

  E:\Tomcat6\webapps\ROOT\geoviewer2\deploy.bat <TARGET> <APP>
  E:\Tomcat6\webapps\ROOT\geoviewer2\deploy.bat STAGING LIB
  E:\Tomcat6\webapps\ROOT\geoviewer2\deploy.bat STAGING geoportale

*/

require('shelljs/global')
const fs = require('fs');
const path = require('path')
const config = require('../config')

console.log('Deploy Geoviewer2\n\n')

const target = process.argv[2]
const app = process.argv[3]

if (target !== 'PROD' && target !== 'STAGING') {
    console.log('\n\n ATTENZIONE!!! Parametro "target" deve essere "PROD" o "STAGING" ')
    return
}
if (app === '') {
    console.log('\n\n ATTENZIONE!!! Parametro "app" deve essere impostato (impostare a "LIB" per deploy libreria) ')
    return
}

console.log(` Deploy in ambiente:${target}\n`)

const version = Date.now().toString()
const type = (app === "LIB") ? "LIB" : "APP"

if (type === "LIB") deployLib(target)
if (type === "APP") deployApp(target)

function deployLib(target) {
    const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
    const distPath = path.join(config.deploy.baseDeployDir[target], 'dist/')
    const staticPath = path.join(distPath, config.build.assetsSubDirectory)
    const backUpPath = path.join(distPath, config.deploy.backUpDir, `static.${version}`)
    const geoviewerPath = staticPath.replace('geoviewer2','geoviewer') 


    console.log(` BackUp su ${backUpPath}\n`)
    cp('-R', staticPath, backUpPath)

    console.log(` Deploy libreria ${app} su ${staticPath} - Versione ${version}\n`)
    rm('-rf', staticPath)
    cp('-R', assetsPath, staticPath)

    console.log(` Deploy libreria ${app} su ${geoviewerPath} - Versione ${version}\n`)
    rm('-rf', geoviewerPath)
    cp('-R', assetsPath, geoviewerPath)
}

function deployApp(target) {
    const appsDir = '/pages/apps'
    const appsSourceBasePath = path.resolve(__dirname, '..' + appsDir)
    const appsTargetBasePath = path.join(config.deploy.baseDeployDir[target], appsDir)
    const appSourcePath = path.join(appsSourceBasePath, app)
    const appTargetPath = path.join(appsTargetBasePath, app)
    const backUpPath = path.join(appsTargetBasePath, config.deploy.backUpDir, `${app}.${version}`)

    if (!fs.existsSync(appSourcePath)) {
        console.log(` ATTENZIONE! Applicazione ${appSourcePath} non esiste\n`)
        return
    }

    console.log(` BackUp su ${backUpPath}\n`)
    cp('-R', appTargetPath, backUpPath)

    console.log(` Deploy applicazione ${app} su ${appTargetPath} - Versione ${version}\n`)
    rm('-rf', appTargetPath)
    cp('-R', appSourcePath, appTargetPath)
}