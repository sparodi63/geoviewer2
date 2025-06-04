<template>
  <div class="atlante-geochimico gv-color-scheme">
    <div id="ag-title" class="ag-title gv-color-scheme">
      Atlante Geochimico
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>
    <div id="ag-wrapper" class="ag-wrapper gv-color-scheme">
      <el-select
        placeholder="Seleziona Elemento"
        filterable
        v-model="livello"
        size="mini"
        @change="onChange"
      >
        <el-option v-for="item in livelli" :key="item.id" :value="item.id" :label="item.title">
          <span style="font-size: 16px">{{ item.title }}</span>
        </el-option>
      </el-select>
      <div class="ag-legend" v-show="showLegend">
        <gv-iframe-panel
          class="gv-iframe-panel"
          :src="legendUrl"
          height="237"
          width="249"
        ></gv-iframe-panel>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
import mountComponent from '../util/mountComponent';
import getConfig from '../services/getAtlanteGeochimicoConfig';
import InfoWmsManager from '../controls/InfoWmsManager';
import getFeatureInfo from '../services/getFeatureInfo';
Vue.component('gv-atlante-geochimico-scheda-panel', () => import('./AtlanteGeochimicoScheda.vue'));

export default {
  data() {
    return {
      livelli: [],
      livello: null,
      downloadConfig: null,
      metaData: null,
      layerConfig: null,
      show: true,
      showLegend: false,
      legendUrl: null,
      baseMapConfigId: 2037,
    };
  },
  methods: {
    toggleCollapseClass() {
      return this.show
        ? 'gv-panel-collapse gv-color-scheme el-icon-arrow-up'
        : 'gv-panel-collapse gv-color-scheme el-icon-arrow-down';
    },
    hidePanel: function () {
      if (this.show) {
        document.getElementById('ag-wrapper').style.display = 'none';
      } else {
        document.getElementById('ag-wrapper').style.display = 'block';
      }
      this.show = !this.show;
    },
    onChange(value) {
      const layerConfig = this.livelli.filter((livello) => {
        return livello.id == value;
      });
      this.layerConfig = layerConfig[0];
      this.loadLayer(layerConfig[0]);
      this.legendUrl = `/geoservices/REST/atlante_geochimico/legenda/?id=${this.layerConfig.id}`;
      this.showLegend = true;
      this.cleanUpDownload();
    },
    cleanUpDownload() {
      const dlPanel = document.getElementById('gv-map-download');
      if (dlPanel) {
        dlPanel.parentNode.removeChild(dlPanel);
      }
      const layerMacrobacini = GV.app.map.getLayerByName('SelezioneMacrobacino');
      if (layerMacrobacini) {
        GV.app.map.removeLayer(layerMacrobacini);
      }
      // Riattivo controllo
      if (GV.config.activeControl) GV.config.activeControl.activate();
    },
    loadLayer(layerConfig) {
      layerConfig.visible = true;
      layerConfig.legend.popUpFlag = false;
      layerConfig.multiClasse = false;
      const idMap = layerConfig.idMap;
      GV.config.removeMap(idMap);
      GV.config.removeMap(this.baseMapConfigId);
      GV.config.addMapConfig({
        id: idMap,
        name: 'Atlante Geochimico',
        flagGeoserver: true,
        flagDownload: true,
        downloadConfig: this.downloadConfig,
        metaData: this.metaData,
        layers: [layerConfig],
      });
      GV.config.addRlMap(this.baseMapConfigId.toString(), true, false);
    },
    subscribeMapEvent(event) {
      // GV.eventBus.$on('map-click', event => {
      GV.app.map.on('click', (event) => {
        const wmsUrl = this.getWmsUrl(event);
        console.log(wmsUrl);
        if (this.layerConfig && this.layerConfig.visible) {
          getFeatureInfo(wmsUrl).then((features) => {
            this.showInfo(features);
          });
        }
      });
    },
    showInfo(features) {
      const data = {
        pcdf: features[0].properties.GRAY_INDEX,
        pest: features[1].properties.GRAY_INDEX,
        plower: features[2].properties.GRAY_INDEX,
        pupper: features[3].properties.GRAY_INDEX,
        Q1: features[4].properties.GRAY_INDEX,
        Q2: features[5].properties.GRAY_INDEX,
        Q3: features[6].properties.GRAY_INDEX,
        QCD: features[7].properties.GRAY_INDEX,
        cifre: this.layerConfig.infoOptions.cifreSignificative,
        unitaMisura: this.layerConfig.infoOptions.unitaMisura,
        titolo: this.layerConfig.title,
      };

      mountComponent({
        elId: 'gv-atlante-geochimico-scheda-panel',
        clear: true,
        vm: new Vue({
          template: `<gv-atlante-geochimico-scheda-panel :pcdf="pcdf" :pest="pest" :plower="plower" :pupper="pupper" :Q1="Q1" :Q2="Q2" :Q3="Q3" :QCD="QCD" :cifre="cifre" :unitaMisura="unitaMisura" :titolo="titolo"></gv-atlante-geochimico-scheda-panel>`,
          data: data,
        }),
      });
    },
    getWmsUrl(event) {
      if (!this.layerConfig) {
        // console.error('Configurazione Layer non trovata');
        return;
      }
      const infoFormat = 'application/json';
      this.layerConfig.wmsParams.infoFormat = 'application/json';
      this.layerConfig.infoBuffer = 0;
      return InfoWmsManager.getGetFeatureInfoUrl(this.layerConfig, event);
    },
  },
  mounted: function () {
    getConfig().then((data) => {
      this.livelli = data.layers.sort((a, b) => a.title.localeCompare(b.title));
      this.livelli.forEach((livello) => {
        livello.title = livello.title.replace('2', '₂').replace('3', '₃').replace('5', '₅');
      });
      this.downloadConfig = data.downloadConfig;
      this.metaData = data.metaData;
    });
    GV.config.addRlMap(this.baseMapConfigId.toString(), true, false);
    this.subscribeMapEvent(event);
  },
};
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
.ag-title {
  margin-top: -4px;
  padding-bottom: 3px;
  font-weight: bold;
}
.ag-legend {
  margin-top: 10px;
}
</style>

<style>
.multi-legend {
  margin-top: 80px !important;
}
.gv-panel-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  opacity: 1;
}
</style>
