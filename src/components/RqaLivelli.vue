<template>
  <div class="rqa gv-color-scheme">
    <div class="rqa-title gv-color-scheme">
      RQA: Indicatori
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>
    <div id="rqa-wrapper" class="rqa-wrapper gv-color-scheme">
      <div class="combo">
        <el-select
          placeholder="Tipologia Indicatori"
          v-model="tipo"
          size="mini"
          @change="onChangeTipi"
        >
          <el-option v-for="item in tipi" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </div>

      <div v-show="showIndicatoriGiorno" class="combo">
        <el-select
          filterable
          placeholder="Indicatori Giornalieri"
          v-model="indicatoreGiorno"
          size="mini"
          @change="onChangeIndicatoriGiorno"
        >
          <el-option
            v-for="item in indicatoriGiorno"
            :key="item.id"
            :value="item.id"
            :label="item.nome"
          >
          </el-option>
        </el-select>
      </div>

      <div v-show="showIndicatoriGiorno" class="combo">
        <el-date-picker
          size="mini"
          v-model="giorno"
          type="date"
          placeholder="Giorno"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>

      <div v-show="showIndicatoriAnno" class="combo">
        <el-select
          filterable
          placeholder="Indicatori Annuali"
          v-model="indicatoreAnno"
          size="mini"
          @change="onChangeIndicatoriAnno"
        >
          <el-option
            v-for="item in indicatoriAnno"
            :key="item.id"
            :value="item.id"
            :label="item.nome"
          >
          </el-option>
        </el-select>
      </div>

      <div v-show="showIndicatoriAnno" class="combo">
        <el-select filterable placeholder="Anno" v-model="anno" size="mini" @change="onChangeAnni">
          <el-option v-for="item in anni" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </div>

      <!-- <el-row type="flex" class="row-bg" justify="left"> -->
      <el-button
        id="gv-cem-elaborazioni-carica-livello"
        v-show="showSubmit"
        title="Carica Livello"
        @click="loadLayer"
        class="gv-inverted-color-scheme rqa-button"
        size="mini"
        >Carica</el-button
      >
      <!-- <el-button
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
      > -->
      <!-- </el-row> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Row, DatePicker } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(DatePicker);
import axios from 'axios';
// import mountComponent from '../util/mountComponent';

export default {
  data() {
    return {
      idMap: null,
      mapConfig: null,
      baseLayerGG: null,
      baseLayerAA: null,
      tipi: [],
      indicatoriGiorno: [],
      indicatoriAnno: [],
      anni: [],
      tipo: null,
      // tipo: 'G',
      indicatoreGiorno: null,
      giorno: null,
      indicatoreAnno: null,
      anno: null,
      date: null,
      show: true,
      buttonDisabled: true,
    };
  },
  methods: {
    onChangeTipi(value) {
      this.tipo = value;
      this.indicatoreGiorno = null;
      this.giorno = null;
      this.indicatoreAnno = null;
      this.anno = null;
    },
    onChangeIndicatoriGiorno(value) {
      this.indicatoreGiorno = value;
    },
    onChangeIndicatoriAnno(value) {
      this.indicatoreAnno = value;
    },
    onChangeAnni(value) {
      this.anno = value;
    },
    loadLayer() {
      GV.config.removeMap(this.idMap);
      this.mapConfig.layers = [];
      let layer;
      if (this.tipo === 'G') {
        layer = this.baseLayerGG;
        layer.wmsParams.styles = `RQA_${this.indicatoreGiorno}`;
        layer.wmsParams.cql_filter = `cod_indicatore='${this.indicatoreGiorno}' AND giorno='${this.giorno}'`;
        const indicatore = this.indicatoriGiorno.find(ind => ind.id === this.indicatoreGiorno).nome;
        layer.legend.label = `${indicatore} (${this.giorno})`;
      } else {
        layer = this.baseLayerAA;
        layer.wmsParams.styles = `RQA_${this.indicatoreAnno}`;
        layer.wmsParams.cql_filter = `cod_indicatore='${this.indicatoreAnno}' AND anno=${this.anno}`;
        const indicatore = this.indicatoriAnno.find(ind => ind.id === this.indicatoreAnno).nome;
        layer.legend.label = `${indicatore} (${this.anno})`;
      }
      this.mapConfig.layers = [layer];
      GV.config.addMapConfig(this.mapConfig);
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
    toggleCollapseClass() {
      return this.show
        ? 'gv-panel-collapse gv-color-scheme el-icon-arrow-up'
        : 'gv-panel-collapse gv-color-scheme el-icon-arrow-down';
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('rqa-wrapper').style.display = 'none';
      } else {
        document.getElementById('rqa-wrapper').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
  computed: {
    showIndicatoriGiorno() {
      return this.tipo == 'G';
    },
    showIndicatoriAnno() {
      return this.tipo == 'A';
    },
    showSubmit() {
      return (this.indicatoreGiorno && this.giorno) || (this.indicatoreAnno && this.anno);
    },
  },
  mounted: function() {
    axios
      .get('/geoservices/REST/rqa/app-config/')
      .then(response => response.data.data)
      .then(data => {
        this.tipi = data.tipi;
        this.indicatoriGiorno = data.indicatoriGiorno;
        this.indicatoriAnno = data.indicatoriAnno;
        this.anni = data.anni;
        this.mapConfig = data.mapConfig;
        this.idMap = data.mapConfig.id;
        const baseLayerGG = data.mapConfig.layers.filter(layer => {
          return (
            layer.idMap === data.mapConfig.id && layer.dbSchema.tableName === 'V_RQA_INDICATORI_GG'
          );
        })[0];
        const baseLayerAA = data.mapConfig.layers.filter(layer => {
          return (
            layer.idMap === data.mapConfig.id && layer.dbSchema.tableName === 'V_RQA_INDICATORI_AA'
          );
        })[0];
        this.baseLayerGG = baseLayerGG;
        this.baseLayerAA = baseLayerAA;
      });
  },
};
</script>

<style scoped>
.rqa {
  width: 270px;
  z-index: 800;
  padding: 5px;
}
.rqa-title {
  padding-left: 10px;
  font-weight: bold;
}

.rqa-button {
  margin-left: 10px;
  margin-bottom: 10px;
  /* float: left; */
}

.label {
  display: inline-block;
  width: 120px;
}
.combo {
  max-width: 200px;
  width: 200px;
  margin: 10px;
}
.gv-panel-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}
</style>

<style>
.el-select-dropdown__item {
  overflow: visible;
}
.el-select-dropdown__empty {
  display: none;
}
.el-date-table td.today span {
  color: #409eff !important;
}
.el-select-dropdown__list {
  max-width: 800px !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 250px !important;
}
</style>
