// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '../../../dist/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
  },
  dev: {
    env: require('./dev.env'),
    port: 8081,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/geoservices/**': 'http://localhost:8080/',
      '/geoservices/**': 'http://localhost/',
      '/geoviewer/**': 'http://localhost:8080/',
      '/geoviewer2/data/**': 'http://localhost:8080/',
      '/geoviewer2/static/**': 'http://localhost:8080/',
      '/info/**': 'http://localhost/',
    },
    cssSourceMap: false,
  },
  deploy: {
    baseDeployDir: {
      // LOCAL: 'D:/Tomcat/webapps/geoservices-fe/apps/viewer/',
      // TEST: 'K:/webapps/geoservices/apps/viewer/',
      // STAGING: 'G:/webapps/geoservices/apps/viewer_staging/',
      // PROD: 'G:/webapps/geoservices/apps/viewer/',
      LOCAL: 'D:/Progetti/geoapps/viewer/',
      TEST: 'N:/geoapps/viewer/',
      STAGING: 'J:/geoapps/viewer_staging/',
      PROD: 'J:/geoapps/viewer/',
      'STAGING-PROT': 'H:/webapps/geoservices/apps/viewer_staging/',
      'PROD-PROT': 'H:/webapps/geoservices/apps/viewer/',
    },
    backUpDir: '_BACKUP/',
  },
};
