<template>
  <div class="atlante-geochimico gv-color-scheme" >
    <!-- <span class="label">Selezione Livello</span> -->
    <el-select placeholder="Seleziona Livello" v-model="livello" size="mini" filterable @change="onChange">
        <el-option v-for="item in livelli" :key="item.codice"  :value="item.codice" :label="item.nome" >
        </el-option>
    </el-select>
  </div>
</template>


<script>
import Vue from 'vue'
import { Select, Option } from 'element-ui'
Vue.use(Select)
Vue.use(Option)
import getLivelli from '../services/getAtlanteGeochimicoLivelli'
import getLayerConfig from '../services/getLayerConfig'
import mountComponent from '../util/mountComponent'

Vue.component('gv-multi-legend-panel', () => import('./MultiLegendPanel.vue'))

export default {
  data() {
    return {
      livello: null,
      livelli: [],
    }
  },
  methods: {
    onChange(value) {
      getLayerConfig(value, null, true).then(layersConfig => {
        this.loadLayer(layersConfig[0])
        this.showLegend(layersConfig[0])
      })
    },
    loadLayer(layerConfig) {
      layerConfig.visible = true
      const idMap = layerConfig.idMap
      GV.config.removeMap(idMap)
      GV.config.addMapConfig({
        id: idMap,
        flagGeoserver: true,
        layers: [layerConfig],
      })
    },
    showLegend(layerConfig) {
      mountComponent({
        elId: 'gv-multi-legend-panel',
        containerId: GV.config.containerId,
        clear: true,
        vm: new Vue({
          template: `<gv-multi-legend-panel 
            visible="true" 
            src="${layerConfig.wmsParams.url}LAYER=${layerConfig.name}&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&" 
            height="120" 
            width="250" 
            :title="false"  
            noClose="true">
            </gv-multi-legend-panel>`,
        }),
      })
    },
  },
  mounted: function() {
    getLivelli().then(livelli => {
      this.livelli = livelli
    })
  },
}
</script>

<style scoped>
.atlante-geochimico {
  width: 250px;
  z-index: 800;
  padding: 10px;
}
.label {
  display: inline-block;
  width: 120px;
}
</style>