// -------------------------------------------------------------------------------- //
// CSS
require('style!../node_modules/leaflet/dist/leaflet.css');
require('style!./assets/css/base.css');
require('style!./assets/css/mapskin/css/mapskin.css');
require('style!font-awesome/css/font-awesome.css');
require('style!./assets/css/leaflet.draw.css');
require('style!./assets/css/cesium-navigation.css');

// -------------------------------------------------------------------------------- //
// Shims/Polyfill
require('./polyfill/findIndex');
require('./polyfill/find');
require('./polyfill/startsWith');
require('es6-promise').polyfill();
// -------------------------------------------------------------------------------- //
// Imports
import draggable from './directives/draggable';
import globals from './globals';
import getUrlParam from './util/getUrlParam';
import log from './util/log';
import dragbox from './util/dragbox';
import mountComponent from './util/mountComponent';
import notification from './util/notification';
import buildFindOptionsFromQueryStringParams from './util/buildFindOptionsFromQueryStringParams';
//
import insertAgCoordinate from './services/insertAgCoordinate';
import insertGeomPraticaGenio from './services/insertGeomPraticaGenio';
import getS3TokenBbox from './services/getS3TokenBbox';
import getS3Token from './services/getS3Token';
import getAuth from './services/getAuth';
import getGeneric from './services/getGeneric';

//
import config from './config';
import Vue from 'vue';
import App from './components/App.vue';
//
import tools from './tools';

// -------------------------------------------------------------------------------- //

// -- CONFIGURAZIONE SENTRY
// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'
// Raven.config('https://9851ab4f0d814bf38ca41fd968c5264d@sentry.io/305915')
//   .addPlugin(RavenVue, Vue)
//   .install()

/* // SESSION-STACK 
function handleRouteError(err) {
  Raven.captureException(err)
  Raven.showReportDialog()
}
!(function(a, b) {
  var c = window
  ;(c.SessionStack = a),
    (c[a] =
      c[a] ||
      function() {
        ;(c[a].q = c[a].q || []), c[a].q.push(arguments)
      }),
    (c[a].t = b)
  var d = document.createElement('script')
  ;(d.async = 1), (d.src = 'https://cdn.sessionstack.com/sessionstack.js')
  var e = document.getElementsByTagName('script')[0]
  e.parentNode.insertBefore(d, e)
})('sessionstack', '8e98440cc80c44af95b66c1cc984a8cf')
sessionstack('getSessionId', function(s) {
  s &&
    Raven.setDataCallback(function(t) {
      return (
        (t.contexts = t.contexts || {}),
        (t.contexts.sessionstack = {
          session_id: s,
          timestamp: new Date().getTime(),
        }),
        t
      )
    })
}) */

// -- DEFINIZIONE GV
window.GV = {
  init(options) {
    if (options.application.auth) {
      const opts = options.application.auth.options;
      switch (options.application.auth.type) {
        case 'NAM':
          getAuth(opts.ruolo).then(resp => {
            if (resp.success) {
              this.initConfig(options);
            } else {
              notification('ACCESSO ALLA APPLICAZIONE NON AUTORIZZATO');
            }
          });
          break;
        case 'S3':
          getS3Token(opts.s3Token, opts.s3TokenType, opts.s3TokenProv).then(resp => {
            if (resp.success && resp.found) {
              this.initConfig(options);
            } else {
              notification('ACCESSO ALLA APPLICAZIONE NON AUTORIZZATO');
            }
          });
          break;
      }
    } else {
      this.initConfig(options);
    }
  },
  initConfig(options) {
    GV.config = config;
    config.init(options);
    Vue.component('gv-app', App);
    const vm = new Vue({
      el: '#gv-container',
      template: '<gv-app></gv-app>',
    });
    return vm;
  },
  mountLegend() {
    mountComponent({
      elId: 'gv-legend',
      clear: true,
      containerId: GV.config.containerId,
      vm: new Vue({
        template: `<gv-legend ref="gv-legend"></gv-legend>`,
      }),
    });
  },
  dragbox,
  globals,
  log,
  eventBus: new Vue(),
  utils: {
    getUrlParam: getUrlParam,
    buildFindOptionsFromQueryStringParams: buildFindOptionsFromQueryStringParams,
    insertAgCoordinate: insertAgCoordinate,
    notification: notification,
    insertGeomPraticaGenio: insertGeomPraticaGenio,
    getS3TokenBbox: getS3TokenBbox,
    getS3Token: getS3Token,
    getGeneric: getGeneric,
  },
  tools: tools,
};
