<template>
    <div  class="gv-map-catalog-panel gv-inverted-color-scheme" id="gv-map-catalog-panel">
        <gv-title v-draggable :title="title" :hide="true" :divId="'gv-map-catalog-panel'"></gv-title>
        <div class="gv-map-catalog-panel-body">
            <el-tabs v-model="activeTab" type="border-card">
                <el-tab-pane v-if="panels.repertorio" :label="panels.repertorio.label" name="repertorio">
                    <form @submit.prevent.stop @keyup.enter="submitRepertorio">
                        <el-row class="gv-map-catalog-panel-form" type="flex" justify="left">
                            <el-col :span="11">
                                <el-input id="gv-map-catalog-panel-repertorio-search" placeholder="Ricerca..." v-model="formData.query" size="mini">
                                <i style="cursor:default;" slot="suffix" class="el-input__icon el-icon-circle-close" @click="handleRepertorioIconClick"></i>
                                </el-input>
                            </el-col>
                            <el-col v-if="showEnti" :span="20">
                                <span class="gv-map-catalog-label">nelle cartografie di </span>
                                <el-select v-model="formData.ente" size="mini" filterable clearable placeholder="tutti gli enti" @change="onChangeEnte">
                                    <el-option v-for="item in enti" :key="item.value" :label="item.value" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </form>
                    <div class="gv-map-catalog-tree">
                        <el-tree id="gv-map-catalog-repertorio-tree" :data="panels.repertorio.tree" :props="defaultProps" @node-click="handleNodeClick" node-key="id" accordion :render-content="renderContent" :default-expanded-keys="expanded_nodes"></el-tree>
                    </div>
                </el-tab-pane>

                <el-tab-pane v-if="panels.canali" :label="panels.canali.label" name="canali">
                    <div class="gv-map-catalog-tree">
                        <el-tree :data="panels.canali.tree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>
                </el-tab-pane>

                <el-tab-pane v-if="panels.wms" :label="panels.wms.label" name="wms">
                  <div @submit.prevent.stop @keyup.enter="submitWms">
                    <el-form :inline="true" :model="wmsForm" ref="wms-form" >
                      <el-form-item >
                        <el-input style="width: 450px;" size="mini" placeholder="URL Servizio (http://example.org/?&service=WMS&request=GetCapabilities) " v-model="wmsForm.URL" ref="wmsUrl"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" size="mini" @click="submitWms">Lista Livelli</el-button>
                      </el-form-item>
                      <el-form-item v-if="wmsForm.showLayerList" :label="wmsForm.serviceTitle">
                      </el-form-item>
                      <el-form-item v-if="wmsForm.showLayerList" label="Livelli">
                        <el-select v-model="wmsForm.layerList.name" style="width: 350px;" size="mini" placeholder="Seleziona Livello per caricarlo in mappa" @change="onChangeWmsLayerList">
                            <el-option v-for="layer in wmsForm.layerList" :key="layer.name" :label="layer.title" :value="layer.name">
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>

                <el-tab-pane v-if="panels.kml" :label="panels.kml.label" name="kml">
                  <div @submit.prevent.stop @keyup.enter="submitKml">
                    <el-form :model="kmlForm" ref="kml-form" >
                      <el-form-item >
                        <el-input style="width: 450px;" size="mini" placeholder="Inserisci la URL di un file KML/GPX/JSON - Es.: http://example.org/file.kml " v-model="kmlForm.URL">
                                                        <i style="cursor:default;" slot="suffix" class="el-input__icon el-icon-circle-close" @click="handleKmlIconClick"></i>

                        </el-input>
                      </el-form-item>
                      <el-form-item >

                        <el-upload
                          action="/geoservices/REST/utils/file_upload"
                          :limit="1"
                          :file-list="kmlForm.fileList"
                          :auto-upload="false"
                          :on-success="onKmlUploadSuccess"
                          ref="kmlUpload">
                          <el-button slot="trigger" size="small" type="primary">Seleziona un file locale di tipo KML/GPX/JSON</el-button>
                        </el-upload>

                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" size="mini" @click="submitKml">Carica Livello</el-button>
                      </el-form-item>
                    </el-form>
                  </div>

                </el-tab-pane>


            </el-tabs>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

import mountComponent from '../util/mountComponent'
import getCatalog from '../services/getCatalog'
import getScheda from '../services/getScheda'
import getCanali from '../services/getCanali'
import getWmsCapabilities from '../services/getWmsCapabilities'
import getKmlUrl from '../services/getKmlUrl'

Vue.component('gv-map-info-panel', () => import('./MapInfoPanel.vue'))

import { Button, ButtonGroup, Row, Col, Tabs, TabPane, Tree, Input, Form, FormItem, Select, Option, Upload } from 'element-ui'
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)

import lang from 'element-ui/lib/locale/lang/it'
import locale from 'element-ui/lib/locale'
locale.use(lang)

export default {
  name: 'gv-map-catalog-panel',
  data() {
    if (!GV.config.enti) {
      GV.config.enti = ['Regione Liguria']
    }
    const enti = GV.config.enti.filter(ente => ente !== 'REGIONE LIGURIA').map(ente => {
      return {
        value: ente
          .toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace('Di', 'di'),
      }
    })
    enti.unshift({
      value: 'Regione Liguria',
    })

    const config = GV.config.application.layout.legend.options.addMapConfig

    let panels = config.panels
    let activeTab = config.activePanel || Object.keys(config.panels)[0]

    const width = window.matchMedia('(min-width: 620px)').matches ? 600 : 400

    return {
      title: 'CATALOGHI CARTOGRAFIE',
      panels: panels,
      showEnti: window.matchMedia('(min-width: 620px)').matches,
      defaultProps: {
        children: 'children',
        label: 'text',
      },
      catalogoCompleto: true,
      formData: {
        query: '',
        ente: '',
        download: false,
      },
      enti: enti,
      activeTab: activeTab,
      expanded_nodes: [],
      width: width,
      wmsForm: {
        // URL: 'http://geoservizi2.regione.liguria.it/geoserver/M1662/wms?&service=WMS&request=GetCapabilities',
        URL: '',
        serviceTitle: '',
        showLayerList: false,
        layerList: [],
      },
      kmlForm: {
        URL: '',
        fileList: [],
      },
    }
  },
  mounted() {
    // Carico i tree per i pannelli di tipo tree
    Object.keys(this.panels).forEach(panelName => {
      const panel = this.panels[panelName]
      if (panel.type === 'tree') {
        this.loadTree(panel)
      }
    })
  },
  methods: {
    submitWms() {
      const url = this.$refs.wmsUrl.value
      if (!url) {
        return
      }
      getWmsCapabilities(url).then(capabilities => {
        this.wmsForm.showLayerList = true
        const serviceTitle = capabilities.WMS_Capabilities.Service.Title
        // const version = capabilities.WMS_Capabilities.Service._version
        const url = capabilities.WMS_Capabilities.Service.OnlineResource['_xlink:href']
        let layers = capabilities.WMS_Capabilities.Capability.Layer.Layer
        if (!Array.isArray(layers)) {
          layers = [layers]
        }
        const formats = capabilities.WMS_Capabilities.Capability.Request.GetMap.Format
        let format = null
        formats.forEach(item => {
          if ((item === 'image/png' || item === 'image/jpeg' || item === 'image/gif') && !format) {
            format = item
          }
        })

        this.wmsForm.serviceTitle = 'Servizio: ' + serviceTitle

        layers.forEach(layer => {
          const popUpUrl =
            layer.Style && layer.Style.LegendURL && layer.Style.LegendURL.OnlineResource ? layer.Style.LegendURL.OnlineResource['_xlink:href'] : null

          this.wmsForm.layerList.push({
            serviceTitle: serviceTitle,
            name: layer.Name,
            title: layer.Title,
            type: 'WMS',
            opacity: 1,
            visible: true,
            legend: {
              popUpFlag: popUpUrl ? 1 : 0,
              popUpUrl: popUpUrl,
              label: layer.Title,
              icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/classi.gif',
            },
            wmsParams: {
              url: url,
              format: format,
              name: layer.Name,
              layers: layer.Name,
              transparent: true
            },
          })
        })
      })
    },
    onChangeWmsLayerList(value) {
      this.wmsForm.layerList.forEach(layer => {
        if (layer.name === value) {
          GV.config.addMapConfig({
            addLayerConfig: true,
            id: layer.serviceTitle,
            name: layer.serviceTitle,
            layers: [layer],
          })
        }
      })
    },
    wmsKeyEnterHandler() {
      submitWms()
    },
    // INIZIO KML
    submitKml() {
      const url = this.kmlForm.URL
      if (url) {
        getKmlUrl(url).then(data => {
          const url = data.file
          const fileName = data.name
          const type = data.type
          this.loadKml(url, fileName, type)
        })
      } else {
        this.$refs.kmlUpload.submit()
      }
    },
    onKmlUploadSuccess() {
      var file = this.$refs.kmlUpload.uploadFiles[0].name
      if (file) {
        const url = '/geoservices/temp/' + file
        let type = null
        if (url.indexOf('.kml') > -1) type = 'KML'
        if (url.indexOf('.gpx') > -1) type = 'GPX'
        if (url.indexOf('.json') > -1) type = 'JSON'

        if (!type) {
          console.log('Tipo File non ammesso: I file devono avere estensione kml o gpx o json')
          return
        }
        const fileName = file
          .replace('.kml', '')
          .replace('.gpx', '')
          .replace('.json', '')
        this.loadKml(url, fileName, type)
      }
    },
    loadKml(url, fileName, type) {
      this.$refs.kmlUpload.clearFiles()
      this.kmlForm.URL = ''
      GV.config.addMapConfig({
        addLayerConfig: true,
        id: 'kml-gpx-json',
        name: 'KML/GPX/JSON',
        layers: [
          {
            url: url,
            name: fileName,
            title: fileName,
            visible: true,
            type: 'JSON',
            subType: type,
            projection: 'EPSG:4326',
            infoOptions: { infoPopUp: 'simple', infoWidth: 300, infoHeight: 300 },
            inRange: true,
            pointToLayer: function(feature, latlng) {
              return L.marker(latlng, {
                icon: L.icon({
                  iconUrl: 'http://geoportale.regione.liguria.it/geoviewer2/static/img/marker-icon.png',
                  iconSize: [12, 20],
                  iconAnchor: [6, 10],
                  popupAnchor: [0, -20],
                }),
              })
            },
            zoomToLayerExtent: true,
            basePopup: true,
            legend: {
              label: fileName,
              icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/classi.gif',
            },
          },
        ],
      })
    },
    handleKmlIconClick() {
      this.kmlForm.URL = ''
    },
    onChangeEnte(value) {
      this.submitRepertorio()
    },
    submitRepertorio() {
      const panel = this.panels['repertorio']
      const filtriImpostati = this.formData.query !== '' || this.formData.ente !== ''

      if (filtriImpostati) {
        const params = {
          q: this.formData.query,
          ente: this.formData.ente.toUpperCase(),
        }
        getCatalog(params).then(data => {
          panel.tree = GV.config.catalog = data.children
          panel.tree.forEach(macro => {
            this.expanded_nodes.push(macro.id)
            if (params.ente !== 'REGIONE LIGURIA' || params.q) {
              macro.children.forEach(cat => {
                this.expanded_nodes.push(cat.id)
              })
            }
          })
        })
        this.expanded_nodes = ['REPERTORIO ENTI LOCALI']
        this.catalogoCompleto = false
      } else {
        if (this.catalogoCompleto) {
          return
        }
        panel.tree = GV.config.catalog = GV.config.catalogFull
        panel.tree.forEach(node => {
          this.expanded_nodes.push(node.id)
        })
        this.catalogoCompleto = true
      }
    },
    handleRepertorioIconClick() {
      this.formData.query = ''
      this.submitRepertorio()
    },
    handleNodeClick(data) {
      const idMap = data.idMap
      if (!idMap) {
        return
      }
      getScheda(idMap).then(data => {
        if (!data) {
          console.error('Scheda non trovata')
          return
        }
        GV.config.schedaInfoCartografia = data
        mountComponent({
          elId: 'gv-map-info-panel',
          clear: true,
          vm: new Vue({
            template: `<gv-map-info-panel visible="true" idMap="${idMap}" addToMapButton="true"></gv-map-info-panel>`,
          }),
        })
      })
    },
    loadTree(panel) {
      switch (panel.name) {
        case 'repertorio':
          // Se repertorio è in cache lo recupero
          if (GV.config.catalog) {
            panel.tree = GV.config.catalog
            panel.tree.forEach(node => {
              this.expanded_nodes.push(node.id)
            })
          } else {
            getCatalog().then(data => {
              panel.tree = GV.config.catalog = GV.config.catalogFull = data.children
              panel.tree.forEach(node => {
                this.expanded_nodes.push(node.id)
              })
            })
          }
          break
        case 'canali':
          getCanali(panel.options).then(data => {
            panel.tree = data.children
          })
          break
      }
    },
    renderContent(h, { node, data, store }) {
      if (node.data.type === 'MAPPA') {
        return <span style="font-size: 12px; ">{node.label}</span>
      }

      if (node.data.type === 'CATEGORIA') {
        return <span style="font-size: 12px; font-weight: bold; ">{node.label}</span>
      }

      if (node.data.type === 'MACROCATEGORIA') {
        return <span style="font-size: 12px; font-weight: bold; background-color: #ddd; padding: 5px; ">{node.label}</span>
      }
    },
  },
}
</script>

<style scoped>
.gv-map-catalog-tree {
  max-height: 400px;
  height: 400px;
  width: 580px;
  overflow: auto;
}

.gv-map-catalog-panel {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  background-color: #fff;
  z-index: 800;
}

.gv-map-catalog-panel table {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
}

.gv-map-catalog-panel-th {
  white-space: nowrap;
  width: auto;
  padding: 5px 5px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-map-catalog-panel table tr td {
  padding: 5px;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-map-catalog-panel-form {
  padding: 0px 10px 5px;
  width: 580px;
}

.gv-button-ricerca span {
  font-family: 'Raleway', Arial, sans-serif;
  font-weight: bold;
}

.gv-map-catalog-label {
  font-size: 12px;
  padding-left: 5px;
  font-family: 'Raleway', Arial, sans-serif;
}

@media (max-width: 650px) {
  .gv-map-catalog-tree {
    width: 400px;
    height: 350px;
  }
  .gv-map-catalog-panel-form {
    width: 400px;
  }
  .el-select {
    position: relative;
    width: 110px;
  }
}
</style>

<style>
.el-tree-node__label {
  font-size: 12px !important;
}

.el-tabs__item.is-active {
  color: #24386c !important;
}

.el-tabs__header {
  margin: 0 0 5px !important;
}
</style>