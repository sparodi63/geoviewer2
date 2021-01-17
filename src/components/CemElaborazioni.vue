<template>
  <div class="gv-cem-elaborazioni" id="gv-cem-elaborazioni">
    <gv-title title="Elaborazioni" :divId="'gv-cem-elaborazioni'" :hide="true"></gv-title>
    <div class="gv-cem-elaborazioni-body gv-inverted-color-scheme">
      <el-select
        placeholder="Seleziona Elaborazione"
        v-model="elaborazione"
        size="mini"
        filterable
        @change="onChange"
      >
        <el-option
          v-for="item in elaborazioni"
          :key="item.id"
          :value="item.id"
          :label="item.titolo"
        ></el-option>
      </el-select>
    </div>
    <el-row type="flex" class="row-bg" justify="left">
      <el-button
        id="gv-cem-elaborazioni-carica-livello"
        :disabled="buttonDisabled"
        title="Carica Livello"
        @click="loadLayer"
        class="gv-color-scheme"
        size="mini"
        >Carica</el-button
      >
      <el-button
        id="gv-cem-elaborazioni-zoom-livello"
        :disabled="buttonDisabled"
        title="Togli Livello"
        @click="removeLayer"
        class="gv-color-scheme"
        size="mini"
        >Togli</el-button
      >
      <el-button
        id="gv-cem-elaborazioni-zoom-livello"
        :disabled="buttonDisabled"
        title="Zoom Livello"
        @click="zoomLayer"
        class="gv-color-scheme"
        size="mini"
        >Zoom</el-button
      >
      <el-button
        id="gv-cem-elaborazioni-scheda"
        :disabled="buttonDisabled"
        title="Scheda"
        @click="showScheda"
        class="gv-color-scheme"
        size="mini"
        >Scheda</el-button
      >
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Row } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
import mountComponent from '../util/mountComponent';
import getCemElaborazioni from '../services/getCemElaborazioni';
Vue.component('gv-cem-scheda-panel', () => import('./CemScheda.vue'));

export default {
  data() {
    const options = GV.config.getToolOptions('gv-cem-elaborazioni-button');
    return {
      buttonDisabled: true,
      options: options,
      elaborazioni: [],
      elaborazione: null,
      elaborazioneSelezionata: null,
      livelli: [],
      layerConfig: {
        id: 7268,
        idMap: 'CEM_ELABORAZIONI',
        name: 'L7268',
        type: 'WMS',
        visible: true,
        flagGeoserver: true,
        multiClasse: true,
        queryable: true,
        opacity: 1,
        minScale: 0,
        maxScale: 0,
        wmsParams: {
          name: 'L7268',
          format: 'image/png8',
          url: 'https://geoservizi.regione.liguria.it/geoserver/M2123/wms?',
        },
        wfsParams: {
          url: 'https://geoservizi.regione.liguria.it/geoserver/M2123/wfs?',
          typeName: 'L7268',
        },
        legend: {
          icon: '/geoservices/apps/viewer/static/img/legend/classi.gif',
          popUpFlag: true,
          popUpWidth: 100,
          popUpHeight: 100,
          popUpUrl:
            'https://geoservizi.regione.liguria.it/geoserver/M2123/wms?LAYER=L7268&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&',
        },
        infoOptions: {
          infoUrl: 'http://srvcarto.regione.liguria.it/info/generico.xsl',
          infoTarget: null,
          infoWidth: 0,
          infoHeight: 0,
          infoIdAttr: 'id',
          infoLabelAttr: null,
        },
      },
    };
  },
  methods: {
    onChange(value) {
      const elab = this.elaborazioni.filter(el => {
        return el.id === value;
      });
      this.elaborazioneSelezionata = elab[0];
      this.showScheda();
      this.buttonDisabled = false;
    },
    loadLayer() {
      let layerConfig = Object.assign({}, this.layerConfig);
      layerConfig.wmsParams = Object.assign({}, this.layerConfig.wmsParams);
      layerConfig.legend = Object.assign({}, this.layerConfig.legend);
      layerConfig.name = 'CEM_' + this.elaborazione;
      layerConfig.title = this.elaborazioneSelezionata.titolo;
      layerConfig.legend.label = this.elaborazioneSelezionata.titolo;
      layerConfig.wmsParams.cql_filter = 'id_elaborazione=' + this.elaborazione;
      GV.config.addLayerToMap(layerConfig, 'CEM_ELABORAZIONI');
      GV.app.map.zoomToBound(this.elaborazioneSelezionata.bbox, 3003, null);
    },
    zoomLayer() {
      GV.app.map.zoomToBound(this.elaborazioneSelezionata.bbox, 3003, null);
    },
    removeLayer() {
      GV.config.removeLayer('CEM_' + this.elaborazione);
      const mapConfig = GV.config.getMapConfig('CEM_ELABORAZIONI');
      if (!mapConfig) this.addMapConfig();
    },
    showScheda() {
      mountComponent({
        elId: 'gv-cem-scheda-panel',
        clear: true,
        vm: new Vue({
          template: `<gv-cem-scheda-panel :titolo="titolo" :note="note" :tipo="tipo" :numValues="numValues" :siteFileName="siteFileName" :elevation="elevation" :side="side" ></gv-cem-scheda-panel>`,
          data: {
            titolo: this.elaborazioneSelezionata.titolo,
            note: this.elaborazioneSelezionata.note,
            tipo: this.elaborazioneSelezionata.tipoEsportazione,
            numValues: this.elaborazioneSelezionata.numValues,
            siteFileName: this.elaborazioneSelezionata.siteFileName,
            elevation: this.elaborazioneSelezionata.elevation,
            side: this.elaborazioneSelezionata.side,
          },
        }),
      });
    },
    addMapConfig() {
      GV.config.addMapConfig({
        id: 'CEM_ELABORAZIONI',
        name: 'Elaborazioni CEM',
        flagGeoserver: true,
        layers: [],
      });
    },
  },
  computed: {},
  mounted: function() {
    this.addMapConfig();
    getCemElaborazioni().then(data => {
      this.elaborazioni = data.elaborazioni;
      this.elaborazione = parseInt(this.options.idElab) || null;
      if (this.elaborazione) {
        this.onChange(this.elaborazione);
        this.loadLayer();
      }
    });
  },
};
</script>

<style scoped>
.gv-cem-elaborazioni {
  position: absolute;
  width: 280px;
  left: 0px;
  top: 0px;
  /* margin-left: 10px; */
  margin-top: 50px;
  z-index: 800;
  padding: 10px;
}

.gv-cem-elaborazioni-body {
  padding: 15px;
  overflow-y: auto;
  width: 250px;
  height: 25px;
}
</style>
