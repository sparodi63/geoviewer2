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
      const layersConfig = this.risknatForm.livelli.filter((livello) => {
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
        ? this.risknatForm.targetList.filter((item) => item.codice == selectedDatasetId)
        : this.risknatForm.areaList.filter((item) => item.codice == selectedDatasetId);
      return selectedDataset[0];
    },
    infoDatasetRisknat() {
      const selectedDataset = this.getSelectedDatasetRisknat();
      if (!selectedDataset) return;
      const label = selectedDataset.label;
      const pdfUrl = 'https://srvcarto.regione.liguria.it' + this.getPdfUrl(label);
      window.open(pdfUrl);
    },
    getPdfUrl(label) {
      if (label === 'DS_CSKS1_A_2A-C1_F27_SANREMO')
        return `/RiskNat/xml/PST2013_CSK_F_27_SANREMO_A_CL001_Sanremo.xml`;
      if (label === 'DS_CSKS1_A_3A-C1_F32_BEDONIA')
        return `/RiskNat/xml/PST2013_CSK_F_32_CHIAVARI_A_CL102_Bedonia.xml`;
      if (label === 'DS_CSKS1_A_3A-C1_F32_CHIAVARI')
        return `/RiskNat/xml/PST2013_CSK_F_32_CHIAVARI_A_CL101_Chiavari.xml`;
      if (label === 'DS_CSKS1_A_3A-C1_F33_BETTOLA')
        return `/RiskNat/xml/PST2013_CSK_F_33_BETTOLA_A_CL001_Bettola.xml`;
      if (label === 'DS_CSKS1_D_7D-C1_F30_CHIAVARI')
        return `/RiskNat/xml/PST2013_CSK_F_30_CHIAVARI_D_CL001_Chiavari.xml`;
      if (label === 'DS_CSKS1_D_7D-C1_F30_GOTRA')
        return `/RiskNat/xml/PST2013_CSK_F_30_CHIAVARI_D_CL002_Gotra.xml`;
      if (label === 'DS_CSKS1_D_7D-C1_F30_REZZOAGLIO')
        return `/RiskNat/xml/PST2013_CSK_F_30_CHIAVARI_D_CL003_Rezzoaglio.xml`;
      if (label === 'DS_CSKS1_D_7D-C1_F31_BETTOLA')
        return `/RiskNat/xml/PST2013_CSK_F_31_BETTOLA_D_CL001_Bettola.xml`;
      if (label === 'DS_CSKS1_D_8D-C2_F28_IMPERIA')
        return `/RiskNat/xml/PST2013_CSK_F_28_IMPERIA_D_CL001_Imperia.xml`;
      if (label === 'DS_CSKS1_D_8D-C4_F29_SANREMO')
        return `/RiskNat/xml/PST2013_CSK_F_29_SANREMO_D_CL001_Sanremo.xml`;
      if (label === 'PS_ENVI_A_T215_F885_SARZANA')
        return `/RiskNat/xml/PST2009_ENVISAT_T215_F885_CL003_SARZANA.xml`;
      if (label === 'PS_ENVI_D_T208_F2709_RAPALLO')
        return `/RiskNat/xml/PST2009_ENVISAT_T208_F2709_CL002_RAPALLO.xml`;
      if (label === 'PS_ENVI_D_T437_F2709_SARZANA')
        return `/RiskNat/xml/PST2009_ENVISAT_T437_F2709_CL003_SARZANA.xml`;
      // if (label === 'PS_ENVI_A_T487_F873_LEVANTO')
      //   return `/RiskNat/xml/PST2013_CSK_F_30_CHIAVARI_D_CL002_Gotra.xml`;
      return `/RiskNat/pdf/${label}.pdf`;
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
        (item) => item.properties.ID == value || item.properties.id == value
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
      getRiskNatConfig().then((data) => {
        this.risknatForm.targetList = data.target;
        this.risknatForm.areaList = data.aree;
      });

      const baseUrl =
        GV.globals.DEFAULT_PROXY +
        `https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=application%2Fjson&typeName=`;
      const url = `${baseUrl}M1324:L3449`;
      getGeoJSON(url).then((response) => {
        this.loadRisknatDataset(response.data);
        this.risknatForm.showForm = true;
      });
      getConfig(this.risknatForm.idMap).then((data) => {
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
        // style = {
        //   stroke: new ol.style.Stroke({
        //     color: 'blue',
        //     width: 3,
        //   }),
        // };
        style = new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3,
          }),
        });
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
