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
      '/geoservices/**': 'http://localhost:8080/',
      '/geoviewer/**': 'http://localhost:8080/',
      '/geoviewer2/data/**': 'http://localhost:8080/',
      '/geoviewer2/static/**': 'http://localhost:8080/',
      '/info/**': 'http://localhost/',
    },
    cssSourceMap: false,
  },
  deploy: {
    baseDeployDir: {
      LOCAL: 'E:/tomcat6/webapps/geoservices/apps/viewer/',
      // 'TEST': 'O:/webapps/geoservices/apps/viewer/',
      STAGING: 'O:/webapps/geoservices/apps/viewer_staging/',
      PROD: 'O:/webapps/geoservices/apps/viewer/',
      'STAGING-PROT': 'N:/webapps/geoservices/apps/viewer_staging/',
      'PROD-PROT': 'N:/webapps/geoservices/apps/viewer/',
    },
    backUpDir: '_BACKUP/',
  },
};
