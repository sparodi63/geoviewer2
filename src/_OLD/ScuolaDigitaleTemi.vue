<template>
  <div class="gv-scuola-digitale-temi gv-color-scheme" >
    <el-select placeholder="Visualizza Tema" v-model="tema" size="mini" filterable @change="onChange">
        <el-option v-for="item in temi" :key="item.id"  :value="item.id" :label="item.label" >
        </el-option>
    </el-select>
  </div>
</template>


<script>
import Vue from 'vue'
import { Select, Option } from 'element-ui'
Vue.use(Select)
Vue.use(Option)
// import getConfig from '../services/getAtlanteGeochimicoConfig'

export default {
  name: 'gv-scuola-digitale-temi',
  data() {
    return {
      tema: null,
      downloadConfig: null,
      metaData: null,
      temi: [],
      layersLabel: [],
      layerConfig: {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function(cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_01',
                iconSize: L.point(28, 28),
              })
            },
            showCoverageOnHover: false,
            maxClusterRadius: 80,
          },
        },
        name: 'tema',
        visible: true,
        geomSubType: 'POINT',
        url: null,
        legend: {
          label: null,
          icon: null,
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [
          {
            name: 'TIPO 01',
            filter: {
              key: 'TIPO',
              value: '01',
            },
            style: {
              iconUrl: null,
              iconSize: [32, 37],
              iconAnchor: [16, 37],
              popupAnchor: [0, -37],
            },
          },
        ],
      },
    }
  },
  methods: {
    onChange(value) {
      console.log(value)
      // rende layer "base" non visibili

      // aggiunge layer tema selezionato
      this.layerConfig.url = `http://srvcarto.regione.liguria.it/geoviewer2/data/scuoladigitale/temi${value}.json`
      this.layerConfig.legend.label = this.layersLabel[value]
      this.layerConfig.legend.url = `/geoviewer2/static/img/scuoladigitale/legend/temi0${value}.png`
      this.layerConfig.classes[0].style.iconUrl = `/geoviewer2/static/img/scuoladigitale/legend/temi0${value}.png`
      this.loadLayer(layersConfig)

      // const layersConfig = this.livelli.filter(livello => {
      //   return livello.id == value
      // })
      // this.loadLayer(layersConfig[0])
      // this.showLegend(layersConfig[0])
    },
    loadLayer(layerConfig) {
      // const idMap = layerConfig.idMap
      // GV.config.removeMap(idMap)
      // GV.config.addMapConfig({
      //   id: idMap,
      //   name: 'Atlante Geochimico',
      //   flagGeoserver: true,
      //   downloadConfig: this.downloadConfig,
      //   metaData: this.metaData,
      //   layers: [layerConfig],
      // })
    },
  },
  mounted: function() {
    this.temi = [
      { id: 0, label: 'Nessuno' },
      { id: 1, label: 'Coding e Robotica educativa' },
      { id: 2, label: 'Comunicazione digitale' },
      { id: 3, label: 'Contenuti digitali' },
      { id: 4, label: 'Smart users' },
    ]
    this.layerLabels = this.temi.map(tema => {
      return tema.label
    })
    // getConfig().then(data => {
    //   this.livelli = data.layers
    //   this.downloadConfig = data.downloadConfig
    //   this.metaData = data.metaData
    // })
  },
}
</script>

<style >
.gv-scuola-digitale-temi {
  position: absolute;
  margin-top: 150px;
  margin-left: 10px;
  width: 250px;
  z-index: 800;
  padding: 10px;
}
</style>