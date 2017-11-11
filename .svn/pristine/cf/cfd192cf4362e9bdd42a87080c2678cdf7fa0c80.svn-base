// -------------------------------------------------------------------------------- //
// CSS
require('style!../node_modules/leaflet/dist/leaflet.css')
require('style!./assets/css/base.css')
require('style!./assets/css/mapskin/css/mapskin.css')
require('style!font-awesome/css/font-awesome.css')
// -------------------------------------------------------------------------------- //
// Shims/Polyfill
require('./polyfill/findIndex')
require('./polyfill/find')
require('./polyfill/startsWith')
require('es6-promise').polyfill()

//
import globals from './globals'
import getUrlParam from './util/getUrlParam'
import log from './util/log'
import mountComponent from './util/mountComponent'
import * as config from './config'
import Vue from 'vue'
import App from './components/App.vue'
Vue.component('gv-app', App)

const eventBus = new Vue()

const initConfig = function(options) {
  GV.config = config
  config.set(options)
}

const init = function(options) {
  initConfig(options)
  return new Vue({
    el: '#gv-container',
    template: '<gv-app></gv-app>',
  })
}

const mountLegend = function() {
  mountComponent({
    elId: 'gv-legend',
    clear: true,
    containerId: GV.config.containerId,
    vm: new Vue({
      template: `<gv-legend ref="gv-legend"></gv-legend>`,
    }),
  })
}

window.GV = {
  initConfig,
  init,
  globals,
  log,
  eventBus,
  mountLegend,
  utils: {
    getUrlParam: getUrlParam,
  },
  Buttons: [],
}

// -------------------------------------------------------------------------------- //
// Bottoni
var req = require.context('./buttons', true, /^(.*\.(js$))[^.]*$/gim)
req.keys().forEach(function(script) {
  //   console.log(script.replace('./','').replace('.js',''))
  req(script)
})

