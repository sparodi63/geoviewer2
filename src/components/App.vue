<template>
    <div id="gv-container">
        <gv-header v-if="showHeader"></gv-header>
        <gv-map v-if="leafletMap" ref="gv-map"></gv-map>
        <gv-legend v-if="showLegend" ref="gv-legend"></gv-legend>
        <div class="gv-tool-container">
          <div id="gv-tool-topleft" class="gv-tool-top gv-tool-left"/>
          <div id="gv-tool-topright" class="gv-tool-top gv-tool-right" />
          <div id="gv-tool-bottomleft" class="gv-tool-bottom gv-tool-left" />
          <div id="gv-tool-bottomright" class="gv-tool-bottom gv-tool-right" />
        </div>
    </div>
</template>


<script>
import isTouch from '../util/isTouch'
import getProtocol from '../util/getProtocol'
import mountComponent from '../util/mountComponent'
import Vue from 'vue'

// Componenti Vue
import Map from './Map'
Vue.component('gv-map', Map)
import Legend from './Legend'
Vue.component('gv-legend', Legend)
import Header from './Header'
Vue.component('gv-header', Header)
import Title from './Title'
Vue.component('gv-title', Title)

// Componenti lazy
// Vue.component('gv-map', () => import(/* webpackChunkName: "Map" */ './Map.vue'))
Vue.component('gv-iframe-panel', () => import(/* webpackChunkName: "iFrame" */ './IFrame.vue'))
Vue.component('gv-info-wms-list', () => import(/* webpackChunkName: "InfoWmsList" */ './InfoWmsList.vue'))
Vue.component('gv-info-wms-html', () => import(/* webpackChunkName: "InfoWmsHtml" */ './InfoWmsHtml.vue'))

export default {
  name: 'gv-app',
  data() {
    let mapType = 'leaflet'
    if (GV.config.application.mapOptions && GV.config.application.mapOptions.type) {
      mapType = GV.config.application.mapOptions.type
    }
    return {
      leafletMap: mapType === 'leaflet',
      showHeader: GV.config.application.layout.header,
      showLegend: GV.config.application.layout.legend,
      showToolbar: GV.config.application.layout.toolbar,
    }
  },
  created() {
    GV.log('gv-app: created')
    GV.app = this
  },
  mounted() {
    GV.log('gv-app: mounted')

    this.addTools(GV.config.application.layout.tools)

    GV.eventBus.$emit('gv-app-mounted', this)
  },
  methods: {
    addTools() {
      if (GV.config.application.layout.tools) {
        var tools = GV.config.application.layout.tools
        tools.forEach(item => {
          const position = item.position || 'topleft'
          item.options = item.options || {}
          this.addTool(item, position)
        })
      }
    },
    addTool(item, position) {
      GV.tools.forEach(tool => {
        if (item.name === tool.name) {
          const itemId = item.name
          GV.log('gv-app: addTool -> ' + itemId)
          if (item.active) item.options.active = true
          const props = item.options.props
            ? item.options.props
                .map(prop => {
                  return `${Object.keys(prop)[0]}='${Object.values(prop)[0]}'`
                })
                .join(' ')
            : ''

          const containerId = 'gv-tool-' + position
          mountComponent({
            containerId: containerId,
            elId: itemId,
            vm: new Vue({
              template: `<${itemId} ${props}></${itemId}>`,
            }),
            toggleEl: false,
          })
        }
      })
    },
  },
}
</script>


<style>

</style>