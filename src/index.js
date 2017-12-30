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
// -------------------------------------------------------------------------------- //
// Imports
import draggable from './directives/draggable'
import globals from './globals'
import getUrlParam from './util/getUrlParam'
import log from './util/log'
import dragbox from './util/dragbox'
import mountComponent from './util/mountComponent'
import buildFindOptionsFromQueryStringParams from './util/buildFindOptionsFromQueryStringParams'
import config from './config'
import Vue from 'vue'
import App from './components/App.vue'
// -------------------------------------------------------------------------------- //
// Tools
let tools = []
tools.push({ name: 'gv-geocoder'})
import Geocoder from './components/Geocoder.vue'
Vue.component('gv-geocoder', Geocoder)
tools.push({ name: 'gv-search'})
import Search from './components/Search.vue'
Vue.component('gv-search', Search)
tools.push({ name: 'gv-scalebar'})
import Scalebar from './components/Scalebar.vue'
Vue.component('gv-scalebar', Scalebar)
tools.push({ name: 'gv-inner-html'})
import InnerHtml from './components/InnerHtml.vue'
Vue.component('gv-inner-html', InnerHtml)
tools.push({ name: 'gv-add-map-button'})
import AddMap from './components/buttons/AddMap.vue'
Vue.component('gv-add-map-button', AddMap)
tools.push({ name: 'gv-info-button'})
import Info from './components/buttons/Info.vue'
Vue.component('gv-info-button', Info)
tools.push({ name: 'gv-coordinate-button' })
import Coordinate from './components/buttons/Coordinate.vue'
Vue.component('gv-coordinate-button', Coordinate)

tools.push({ name: 'gv-layer-search-button' })
import LayerSearch from './components/buttons/LayerSearch.vue'
Vue.component('gv-layer-search-button', LayerSearch)

tools.push({ name: 'atlante-geochimico-livelli'})
import AtlanteGeochimicoLivelli from './components/AtlanteGeochimicoLivelli.vue'
Vue.component('atlante-geochimico-livelli', AtlanteGeochimicoLivelli)


// -------------------------------------------------------------------------------- //
window.GV = {
  init(options) {
    this.initConfig(options)
    Vue.component('gv-app', App)
    const vm = new Vue({
      el: '#gv-container',
      template: '<gv-app></gv-app>',
    })
    return vm
  },
  initConfig(options) {
    GV.config = config
    config.init(options)
  },
  mountLegend() {
    mountComponent({
      elId: 'gv-legend',
      clear: true,
      containerId: GV.config.containerId,
      vm: new Vue({
        template: `<gv-legend ref="gv-legend"></gv-legend>`,
      }),
    })
  },
  dragbox,
  globals,
  log,
  eventBus: new Vue(),
  utils: {
    getUrlParam: getUrlParam,
    buildFindOptionsFromQueryStringParams: buildFindOptionsFromQueryStringParams,
  },
  tools: tools,
}
