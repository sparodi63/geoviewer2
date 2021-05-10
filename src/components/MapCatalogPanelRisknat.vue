<template>
  <div v-show="risknatForm.showForm">
    <el-form :inline="true" :model="risknatForm" ref="risknat-form">
      <div>
        <el-select
          v-model="risknatForm.selectedType"
          size="mini"
          placeholder="Seleziona Tipo "
          @change="onChangeRisknatType"
        >
          <el-option
            v-for="item in risknatForm.typeList"
            :key="item.codice"
            :label="item.label"
            :value="item.codice"
          ></el-option>
        </el-select>
        <el-select
          v-model="risknatForm.selectedTarget"
          v-show="risknatForm.showTargetCombo"
          size="mini"
          filterable
          placeholder="Seleziona Dataset"
          @change="onChangeRisknatCombo"
        >
          <el-option
            v-for="item in risknatForm.targetList"
            :key="item.codice"
            :label="item.label"
            :value="item.codice"
          ></el-option>
        </el-select>
        <el-select
          v-model="risknatForm.selectedArea"
          v-show="risknatForm.showAreaCombo"
          size="mini"
          filterable
          placeholder="Seleziona Dataset"
          @change="onChangeRisknatCombo"
        >
          <el-option
            v-for="item in risknatForm.areaList"
            :key="item.codice"
            :label="item.label"
            :value="item.codice"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-checkbox v-model="risknatForm.zoom">Zoom sul Dataset</el-checkbox>
      </div>
      <div>
        <el-button
          type="primary"
          @click="infoDatasetRisknat"
          class="gv-map-catalog-button"
          size="mini"
        >
          <span>Info sul Datset</span>
        </el-button>
        <el-button type="primary" @click="submitRisknat" class="gv-map-catalog-button" size="mini">
          <span>Carica</span>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';

import getRiskNatConfig from '../services/getRiskNatConfig';
import getConfig from '../services/getConfig';
import getGeoJSON from '../services/getGeoJSON';

import { Button, Input, Form, Checkbox, Select, Option } from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-map-catalog-panel-risknat',
  props: ['panel'],
  data() {
    return {
      risknatForm: {
        idMap: '2039',
        typeList: [
          { codice: 'target', label: 'Target' },
          { codice: 'area', label: 'Aree Anomale' },
        ],
        targetList: [],
        areaList: [],
        selectedType: 'target',
        selectedTarget: null,
        selectedArea: null,
        showTargetCombo: true,
        showAreaCombo: false,
        showForm: false,
        zoom: true,
        layerDataset: null,
        livelli: [],
      },
    };
  },
  mounted() {
    this.loadRisknatConfig();
  },
  methods: {
    // RISKNAT
    submitRisknat() {
      const selectedDataset = this.getSelectedDatasetRisknat();
      if (!selectedDataset) return;
      const layersConfig = this.risknatForm.livelli.filter(livello => {
        return livello.id == selectedDataset.livello;
      });
      // console.log('submitRisknat risknatFrom', this.risknatForm);
      this.loadLayerRisknat(layersConfig[0]);
    },
    loadLayerRisknat(layerConfig) {
      layerConfig.visible = true;
      const idMap = layerConfig.idMap;
      GV.config.addMapConfig({
        id: idMap,
        addLayerConfig: true,
        name: 'RISKNAT',
        flagGeoserver: true,
        downloadConfig: this.downloadConfig,
        metaData: this.metaData,
        layers: [layerConfig],
      });
    },
    getSelectedDatasetRisknat() {
      if (!this.risknatForm.selectedTarget && !this.risknatForm.selectedArea) return null;
      const selectedDatasetId = this.risknatForm.selectedTarget || this.risknatForm.selectedArea;
      const selectedDataset = this.risknatForm.selectedTarget
        ? this.risknatForm.targetList.filter(item => item.codice == selectedDatasetId)
        : this.risknatForm.areaList.filter(item => item.codice == selectedDatasetId);
      return selectedDataset[0];
    },
    infoDatasetRisknat() {
      const selectedDataset = this.getSelectedDatasetRisknat();
      if (!selectedDataset) return;
      const label = selectedDataset.label;
      const pdfUrl = `/RiskNat/pdf/${label}.pdf`;
      window.open(pdfUrl);
    },
    onChangeRisknatType(value) {
      if (value === 'target') {
        this.risknatForm.showTargetCombo = true;
        this.risknatForm.showAreaCombo = false;
        this.risknatForm.selectedArea = null;
      } else {
        this.risknatForm.showTargetCombo = false;
        this.risknatForm.showAreaCombo = true;
        this.risknatForm.selectedTarget = null;
      }
    },
    onChangeRisknatCombo(value) {
      const layer = GV.app.map.getLayerByName('RisknatDataset');
      const features = this.risknatForm.layerDataset.features.filter(
        item => item.properties.ID == value || item.properties.id == value
      );
      if (layer && features && features[0] && features[0].geometry) {
        GV.app.map.clearLayer('RisknatDataset');
        if (GV.app.map.type === 'openlayers') {
          const source = layer.getSource();
          // source.clear(true);
          for (const feature of features) {
            const olFeature = new ol.format.GeoJSON().readFeature(feature, {
              featureProjection: 'EPSG:3857',
            });
            source.addFeature(olFeature);
          }
          GV.app.map.fit(layer.getSource().getExtent(), {
            maxZoom: 17,
          });
        } else {
          layer.addData(features[0].geometry);
          if (this.risknatForm.zoom) {
            GV.app.map.fitBounds(layer.getBounds(), { maxZoom: 17 });
          }
        }
      }
    },
    loadRisknatConfig(panel) {
      getRiskNatConfig().then(data => {
        this.risknatForm.targetList = data.target;
        this.risknatForm.areaList = data.aree;
      });

      const baseUrl =
        GV.globals.DEFAULT_PROXY +
        `https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=application%2Fjson&typeName=`;
      const url = `${baseUrl}M1324:L3449`;
      getGeoJSON(url).then(response => {
        this.loadRisknatDataset(response.data);
        this.risknatForm.showForm = true;
      });
      getConfig(this.risknatForm.idMap).then(data => {
        // console.log('getConfig', data.data.data);
        this.risknatForm.livelli = data.data.data.layers;
        this.risknatForm.downloadConfig = data.data.data.downloadConfig;
        this.risknatForm.metaData = data.data.data.metaData;
      });
    },
    loadRisknatDataset(data) {
      this.risknatForm.layerDataset = data;
      let style;
      if (GV.app.map.type === 'openlayers') {
        style = {
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3,
          }),
        };
      } else {
        style = {
          color: '#ffcc00',
          fillOpacity: 0,
          weight: 1,
          opacity: 1,
        };
      }
      GV.app.map.loadLayers([
        {
          name: 'RisknatDataset',
          type: 'JSON',
          style: style,
          visible: true,
          data: null,
        },
      ]);
    },
  },
};
</script>

<style>
.gv-map-catalog-button {
  margin-top: 10px;
  font-size: 12px;
}

.gv-map-catalog-button span {
  font-family: 'Raleway', Arial, sans-serif;
}
</style>
