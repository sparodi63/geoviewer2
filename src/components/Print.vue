<template>
    <div id="gv-print-panel" class="gv-print-panel">
        <gv-title title="Stampa" :divId="'gv-print-panel'" :hide="true"></gv-title>
        <div :class="setBodyClass()">
            <el-form :model="form" ref="form">
                <el-select class="gv-print-field" id="gv-print-format-select" v-model="format" size="mini" placeholder="Formato" @change="changeFormat">
                    <el-option v-for="item in formats" :key="item.codice" :label="item.label" :value="item.codice" >
                    </el-option>
                </el-select>
                <div v-show="showPDFPanel" id="gv-print-pdf-panel" class="gv-inverted-color-scheme">
                    <el-select id="gv-print-pdf-size-select" class="gv-print-field" v-model="pdfSize" size="mini" placeholder="Dimensione" @change="changePdfSize">
                        <el-option v-for="item in pdfSizes" :key="item.codice" :label="item.label" :value="item.codice" >
                        </el-option>
                    </el-select>                    
                    <el-select id="gv-print-pdf-orientation-select" class="gv-print-field" v-model="pdfOrientation" size="mini" placeholder="Dimensione" @change="changePdfOrientation">
                        <el-option v-for="item in pdfOrientations" :key="item.codice" :label="item.label" :value="item.codice" >
                        </el-option>
                    </el-select> 
                    <div class="gv-print-titolo">
                        <span class="gv-print-label">Titolo:</span>
                    <el-input
                        class="gv-print-field"
                        :autosize="{ minRows: 3, maxRows: 3}"
                        type="textarea"
                        size="small"
                        placeholder="Titolo"
                        v-model="printTitle">
                    </el-input>
                    </div>
                </div>
                <div v-show="showPNGPanel" id="gv-print-png-panel" class="gv-print-field gv-inverted-color-scheme">
                    <span class="gv-print-label">Larghezza (px)</span>
                    <el-input-number v-model="pngWidth" @change="changePngWidth" size="mini" :min="1" :max="2024" controls-position="right" ></el-input-number>
                    <br>
                    <span class="gv-print-label">Altezza (px)</span>
                    <el-input-number v-model="pngHeight" @change="changePngHeight" size="mini" :min="1" :max="2024" controls-position="right" ></el-input-number>
                </div>
                <el-checkbox class="gv-print-field gv-inverted-color-scheme" v-model="scale">Mantieni Scala</el-checkbox>
                <el-button id="gv-print-panel-submit" class="gv-print-submit" ref="button" type="primary" @click="submit" size="mini" :disabled="buttonDisabled">
                    <span>Stampa</span>
                </el-button>
            </el-form>
        </div>

    </div>
</template>

<script>
import Vue from 'vue'
import print from '../services/print'
import printLegend from '../services/printLegend'

import { Button, Input, InputNumber, Form, FormItem, Select, Option, Notification } from 'element-ui'
Vue.use(Button)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)

import { Loading } from 'element-ui'

export default {
  name: 'gv-print-panel',
  data() {
    return {
      title: 'STAMPA',
      format: 'pdf',
      formats: [{ codice: 'pdf', label: 'File PDF' }, { codice: 'png', label: 'Immagine PNG' }],
      showPDFPanel: true,
      showPNGPanel: false,
      pdfSize: 'A4',
      pdfSizes: [{ codice: 'A3', label: 'A3' }, { codice: 'A4', label: 'A4' }, { codice: 'A5', label: 'A5' }],
      pdfOrientation: 'portrait',
      pdfOrientations: [{ codice: 'portrait', label: 'Verticale' }, { codice: 'landscape', label: 'Orizzontale' }],
      printTitle: null,
      pngWidth: document.getElementById('gv-container').scrollWidth,
      pngHeight: document.getElementById('gv-container').scrollHeight,
      scale: true,
    }
  },
  methods: {
    changeFormat(id) {
      this.format = id
      if (this.format === 'pdf') {
        this.showPDFPanel = true
        this.showPNGPanel = false
      } else {
        this.showPNGPanel = true
        this.showPDFPanel = false
      }
    },
    setBodyClass() {
      return this.format === 'pdf'
        ? 'gv-print-panel-body gv-inverted-color-scheme gv-print-panel-body-pdf'
        : 'gv-print-panel-body gv-inverted-color-scheme gv-print-panel-body-png'
    },
    changePdfSize(id) {
      this.pdfSize = id
    },
    changePdfOrientation(id) {
      this.pdfOrientation = id
    },
    changePngWidth(value) {
      this.pngWidth = value
    },
    changePngHeight(value) {
      this.pngHeight = value
    },
    submit() {
      let width = this.pngWidth
      let height = this.pngHeight

      if (this.format === 'pdf') {
        const ratio = document.getElementById('gv-container').scrollHeight / document.getElementById('gv-container').scrollWidth
        switch (this.pdfSize) {
          case 'A4':
            if (this.pdfOrientation === 'portrait') {
              width = 900
              height = parseInt(width * ratio)
            } else {
              height = 800
              width = parseInt(height / ratio)
            }
            break
          case 'A3':
            if (this.pdfOrientation === 'portrait') {
              width = 1400
              height = parseInt(width * ratio)
            } else {
              height = 1150
              width = parseInt(height / ratio)
            }
            break
          case 'A5':
            if (this.pdfOrientation === 'portrait') {
              width = 750
              height = parseInt(width * ratio)
            } else {
              height = 600
              width = parseInt(height / ratio)
            }
            break
        }
      }

      // costruisco configurazione
      const baseLayer = {
        name: GV.config.getActiveBaseLayer().printType,
        type: GV.config.getActiveBaseLayer().printType,
      }
      const layers = GV.config
        .getLayersConfig(layer => {
          return layer.visible
        })
        .reverse()

      let maps = []

      GV.config.maps.forEach(map => {
        const mapLayers = map.layers.filter(layer => {
          return layer.visible && layer.inRange
        })

        if (mapLayers.length > 0) {
          const map2 = {
            name: map.name,
            layers: mapLayers,
          }
          maps.push(map2)
        }
      })

      const data = {
        printConfig: {
          fileType: this.format,
          title: this.printTitle,
          width: width,
          height: height,
          pageSize: this.pdfSize,
          orientation: this.pdfOrientation,
        },
        mapOptions: {
          projection: 'EPSG:3857',
          extent: GV.app.map.getExtentAsString(),
          center: {
            lon: L.Projection.SphericalMercator.project(GV.app.map.getCenter()).x,
            lat: L.Projection.SphericalMercator.project(GV.app.map.getCenter()).y,
          },
          zoom: GV.app.map.getZoom(),
          flagSameScale: this.scale,
          scale: GV.app.map.getScale(),
        },
        baseLayers: [baseLayer],
        maps: maps,
        layers: layers,
      }

      let loading = Loading.service({
        fullscreen: true,
        text: 'Preparazione Stampa',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      print(data).then(response => {
        loading.close()
        // console.log(response)
        var popup = window.open(response.url, '', 'menubar=yes,location=no,resizable=no,scrollbars=no,status=no')
        popup.focus()
      })

      if (this.format === 'pdf') {
        printLegend(data).then(response => {
          loading.close()
          // console.log(response)
          response.url.forEach(url => {
            const popup = window.open(url, '', 'menubar=yes,location=no,resizable=no,scrollbars=no,status=no')
            popup.focus()
          })
        })
      }
    },
  },
  mounted: function() {
    this.printTitle = GV.config.maps[0].name
  },
}
</script>

<style>
.gv-print-panel {
  position: absolute;
  width: 270px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-print-panel-body {
  position: absolute;
  padding: 5px;
  overflow-y: auto;
  width: 260px;
}

.gv-print-panel-body-pdf {
  height: 260px;
}

.gv-print-panel-body-png {
  height: 140px;
}

.gv-print-field {
  padding: 5px;
}

.gv-print-titolo {
  width: 250px;
}

.gv-print-submit {
  margin: 5px;
  float: right;
}

.gv-print-label {
  margin: 5px;
  display: inline-block;
  width: 105px;
}
</style>
