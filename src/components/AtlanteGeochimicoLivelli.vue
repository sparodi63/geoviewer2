<template>
  <div class="atlante-geochimico gv-color-scheme">
    <div id="gv-legend-title" class="gv-legend-title gv-color-scheme">
      TITOLO
    </div>
    <el-select placeholder="Seleziona Livello" v-model="livello" size="mini" @change="onChange">
      <el-option v-for="item in livelli" :key="item.id" :value="item.id" :label="item.title">
        <span style="font-size: 16px">{{ item.title }}</span>
      </el-option>
    </el-select>
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
      baseMapConfig: {
        id: 2037,
        name: 'Atlante Geochimico (Livelli Vettoriali)',
        extent: null,
        extent_3857: null,
        type: 'V',
        projection: 'EPSG:3003',
        flagGeoserver: true,
        downloadSuInteroTerritorio: false,
        flagDownload: false,
        flagDownloadExtranet: false,
        ancillaryMaps: [],
        layers: [
          {
            id: 6718,
            idMap: 2037,
            type: 'WMS',
            name: 'L7705',
            title: 'Punti Campionamento',
            visible: true,
            attribution: null,
            minScale: 300000,
            maxScale: 500,
            opacity: 1,
            geomType: 'VECTOR',
            geomSubType: 'POINT',
            queryable: true,
            order: 101,
            multiClasse: false,
            wmsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?',
              name: 'L7705',
              transparent: true,
              format: 'image/png8',
              infoFormat: null,
              format_options: 'antialias:text',
            },
            tmsParams: null,
            flagBaseVectorLayer: false,
            flagDownload: false,
            downloadSuInteroTerritorio: false,
            wfsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wfs?',
              typeName: 'L7705',
            },
            legend: {
              label: 'Punti Campionamento',
              icon:
                'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?LAYER=L7705&RULE=R0&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:off',
              popUpFlag: 0,
              popUpUrl: null,
              popUpWidth: 0,
              popUpHeight: 0,
            },
            infoOptions: {
              infoUrl:
                'http://srvcarto.regione.liguria.it/info/repertoriocartografico/siraAtlanteGeochimico2020_Punti.xsl',
              infoTarget: null,
              infoWidth: 0,
              infoHeight: 0,
              infoIdAttr: 'id',
              infoLabelAttr: null,
            },
            classes: [
              {
                filter: null,
                legendLabel: 'Classe Base',
                legendIcon: null,
              },
            ],
            rasterFilePath: null,
            flagGeoserver: true,
            cacheMinZoomLevel: null,
            cacheMaxZoomLevel: null,
            footprint: null,
            cachePostGIS: false,
            cacheVersion: 0,
            cacheVersionTest: 0,
            mapTitle: 'Atlante Geochimico Appoggio Vettoriale',
          },
          {
            id: 6718,
            idMap: 2037,
            type: 'WMS',
            name: 'L6718',
            title: 'Dominio di Calcolo',
            visible: true,
            attribution: null,
            minScale: 0,
            maxScale: 0,
            opacity: 1,
            geomType: 'VECTOR',
            geomSubType: 'POLYGON',
            queryable: true,
            order: 101,
            multiClasse: false,
            wmsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?',
              name: 'L6718',
              transparent: true,
              format: 'image/png8',
              infoFormat: null,
              format_options: 'antialias:text',
            },
            tmsParams: null,
            flagBaseVectorLayer: false,
            flagDownload: false,
            downloadSuInteroTerritorio: false,
            wfsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wfs?',
              typeName: 'L6718',
            },
            legend: {
              label: 'Dominio di Calcolo',
              icon:
                'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?LAYER=L6718&RULE=R0&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:off',
              popUpFlag: 0,
              popUpUrl: null,
              popUpWidth: 0,
              popUpHeight: 0,
            },
            infoOptions: {
              // 'http://srvcarto.regione.liguria.it/info/repertoriocartografico/siraAtlanteGeochimico2020_MacroBacini.xsl'
              infoUrl: '/geoservices/apps/info/atlante_geochimico/info_dominio/?ID=${nom_mb}',
              infoTarget: null,
              infoWidth: 580,
              infoHeight: 585,
              infoIdAttr: 'cod_mb',
              infoLabelAttr: null,
            },
            classes: [
              {
                filter: null,
                legendLabel: 'Classe Base',
                legendIcon: null,
              },
            ],
            dbSchema: {
              schema: null,
              tableName: 'mng_bac',
              columns: [
                {
                  name: 'ogc_fid',
                  type: 'integer',
                },
                {
                  name: 'cod_mb',
                  type: 'numeric',
                },
                {
                  name: 'nom_mb',
                  type: 'character varying',
                },
              ],
            },
            rasterFilePath: null,
            flagGeoserver: true,
            cacheMinZoomLevel: null,
            cacheMaxZoomLevel: null,
            footprint: null,
            cachePostGIS: false,
            cacheVersion: 0,
            cacheVersionTest: 0,
            mapTitle: 'Atlante Geochimico Appoggio Vettoriale',
          },
          {
            id: 7650,
            idMap: 2037,
            type: 'WMS',
            name: 'L7650',
            title: 'Griglia',
            visible: true,
            attribution: null,
            minScale: 0,
            maxScale: 0,
            opacity: 1,
            geomType: 'VECTOR',
            geomSubType: 'POLYGON',
            queryable: false,
            order: 101,
            multiClasse: false,
            wmsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?',
              name: 'L7650',
              transparent: true,
              format: 'image/png8',
              infoFormat: null,
              format_options: 'antialias:text',
            },
            tmsParams: null,
            flagBaseVectorLayer: false,
            flagDownload: false,
            downloadSuInteroTerritorio: false,
            wfsParams: {
              url: 'https://geoservizi.regione.liguria.it/geoserver/M2037/wfs?',
              typeName: 'L7650',
            },
            legend: {
              label: 'Griglia',
              icon:
                'https://geoservizi.regione.liguria.it/geoserver/M2037/wms?LAYER=L7650&RULE=R0&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:off',
              popUpFlag: 0,
              popUpUrl: null,
              popUpWidth: 0,
              popUpHeight: 0,
            },
            infoOptions: {
              infoUrl: null,
              infoTarget: null,
              infoWidth: 0,
              infoHeight: 0,
              infoIdAttr: 'id_cella',
              infoLabelAttr: null,
            },
            classes: [
              {
                filter: null,
                legendLabel: 'Classe Base',
                legendIcon: null,
              },
            ],
            dbSchema: {
              schema: null,
              tableName: 'mng_celle',
              columns: [
                {
                  name: 'ogc_fid',
                  type: 'integer',
                },
                {
                  name: 'id_cella',
                  type: 'numeric',
                },
              ],
            },
            rasterFilePath: null,
            flagGeoserver: true,
            cacheMinZoomLevel: null,
            cacheMaxZoomLevel: null,
            footprint: null,
            cachePostGIS: false,
            cacheVersion: 0,
            cacheVersionTest: 0,
            mapTitle: 'Atlante Geochimico Appoggio Vettoriale',
          },
        ],
        ruoli: 'PUBBLICO',
      },
    };
  },
  methods: {
    onChange(value) {
      const layerConfig = this.livelli.filter(livello => {
        return livello.id == value;
      });
      this.layerConfig = layerConfig[0];
      this.loadLayer(layerConfig[0]);
      this.showLegend(layerConfig[0]);
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
      GV.config.removeMap(this.baseMapConfig.id);
      GV.config.addMapConfig({
        id: idMap,
        name: 'Atlante Geochimico',
        flagGeoserver: true,
        flagDownload: true,
        downloadConfig: this.downloadConfig,
        metaData: this.metaData,
        layers: [layerConfig],
      });
      GV.config.addMapConfig(this.baseMapConfig);
    },
    showLegend(layerConfig) {
      mountComponent({
        elId: 'gv-multi-legend-panel',
        containerId: GV.config.containerId,
        clear: true,
        vm: new Vue({
          template: `<gv-multi-legend-panel
            visible="true"
            src="http://srvcarto.regione.liguria.it/geoservices/REST/atlante_geochimico/legenda/?id=${layerConfig.id}"
            height="290"
            width="250"
            :title="false"
            noClose="true">
            </gv-multi-legend-panel>`,
        }),
      });
    },
    subscribeMapEvent(event) {
      GV.app.map.on('click', event => {
        const wmsUrl = this.getWmsUrl(event);
        getFeatureInfo(wmsUrl).then(features => {
          this.showInfo(features);
        });
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
      };
      mountComponent({
        elId: 'gv-atlante-geochimico-scheda-panel',
        clear: true,
        vm: new Vue({
          template: `<gv-atlante-geochimico-scheda-panel :pcdf="pcdf" :pest="pest" :plower="plower" :pupper="pupper" :Q1="Q1" :Q2="Q2" :Q3="Q3" :QCD="QCD" :cifre="cifre" :unitaMisura="unitaMisura" ></gv-atlante-geochimico-scheda-panel>`,
          data: data,
        }),
      });
    },
    getWmsUrl(event) {
      if (!this.layerConfig) {
        console.error('Configurazione Layer non trovata');
        return;
      }
      let url = GV.globals.DEFAULT_PROXY + this.layerConfig.infoOptions.infoQueryUrl;
      const infoFormat = 'application/json';
      const infoBuffer = 0;
      const wmsUrl = InfoWmsManager.buildWMSOptions(
        url,
        this.layerConfig.infoOptions.infoQueryLayers,
        event.latlng,
        infoFormat,
        infoBuffer
      );
      return wmsUrl;
    },
  },
  mounted: function() {
    GV.config.addMapConfig(this.baseMapConfig);
    //  TODO - NON RIMUOVERE MAPPA BASE ALL'AVVIO
    GV.config.removeMap(this.baseMapConfig.id);
    getConfig().then(data => {
      this.livelli = data.layers.sort((a, b) => a.title.localeCompare(b.title));
      this.livelli.forEach(livello => {
        livello.title = livello.title
          .replace('2', '₂')
          .replace('3', '₃')
          .replace('5', '₅');
      });
      this.downloadConfig = data.downloadConfig;
      this.metaData = data.metaData;
    });
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
</style>

<style>
.multi-legend {
  margin-top: 80px !important;
}
</style>
