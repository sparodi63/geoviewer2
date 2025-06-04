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
      // '/geoservices/**': 'http://localhost/',
      '/geoservices/REST/download': {
        target: 'http://srvcarto2svil.regione.liguria.it',
        changeOrigin: true,
        pathRewrite: {
          '^/geoservices/REST/download': '/download/REST/download'
        }
      },
      '/geoservices/apps': {
        target: 'http://srvcarto2svil.regione.liguria.it',
        changeOrigin: true,
        pathRewrite: {
          '^/geoservices/apps': '/geoapps'
        }
      },
      '/geoservices/temp': {
        target: 'http://srvcarto2svil.regione.liguria.it',
        changeOrigin: true,
        pathRewrite: {
          '^/geoservices/temp': '/geoapps/temp'
        }
      },
      '/geoservices/data': {
        target: 'http://srvcarto2svil.regione.liguria.it',
        changeOrigin: true,
        pathRewrite: {
          '^/geoservices/data': '/geodata'
        }
      },
      '/geoservices': {
        target: 'http://srvcarto2svil.regione.liguria.it',
        changeOrigin: true,
        pathRewrite: {
          '^/geoservices': '/geoservices-be'
        }
      },
      // '/geoviewer/**': 'http://localhost:8080/',
      // '/geoviewer2/data/**': 'http://localhost:8080/',
      // '/geoviewer2/static/**': 'http://localhost:8080/',
      // '/info/**': 'http://srvcarto2svil.regione.liguria.it',
    },
    cssSourceMap: false,
  },
  deploy: {
    baseDeployDir: {
      // LOCAL: 'D:/Tomcat/webapps/geoservices-fe/apps/viewer/',
      // TEST: 'K:/webapps/geoservices/apps/viewer/',
      // STAGING: 'G:/webapps/geoservices/apps/viewer_staging/',
      // PROD: 'G:/webapps/geoservices/apps/viewer/',
      'TEST': 'F:/Progetti/geoapps/viewer/',
      'PROD': 'J:/geoapps/viewer/',
      'PROD-INT': 'L:/geoapps/viewer/',
      'PROD-PROT': 'H:/webapps/geoservices/apps/viewer/',
      'STAGING': 'J:/geoapps/viewer_staging/',
      'STAGING-PROT': 'H:/webapps/geoservices/apps/viewer_staging/',
    },
    backUpDir: '_BACKUP/',
  },
};
