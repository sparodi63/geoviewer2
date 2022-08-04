<template>
  <div class="rqa gv-color-scheme">
    <div class="rqa-title gv-color-scheme">
      RQA: Indicatori
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      />
      <button
        id="rqa-download-button"
        title="Download Dati"
        @click="download"
        class="gv-color-scheme rqa-download-button el-icon-download"
        size="mini"
      />
    </div>
    <div id="rqa-wrapper" class="rqa-wrapper gv-color-scheme">
      <div class="combo">
        <el-select
          placeholder="Tipologia Indicatori"
          v-model="tipo"
          size="mini"
          @change="onChangeTipo"
        >
          <el-option v-for="item in tipi" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </div>

      <div v-show="showIndicatoriGiorno" class="combo">
        <el-select
          filterable
          placeholder="Indicatori Giornalieri"
          v-model="indicatore"
          size="mini"
          @change="onChangeIndicatore"
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
          :picker-options="datePickerOptions"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>

      <div v-show="showIndicatoriAnno" class="combo">
        <el-select
          filterable
          placeholder="Indicatori Annuali"
          v-model="indicatore"
          size="mini"
          @change="onChangeIndicatore"
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
        <el-select filterable placeholder="Anno" v-model="data" size="mini">
          <el-option v-for="item in anni" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </div>

      <div v-show="showLegend">
        <gv-iframe-panel
          class="gv-iframe-panel"
          :src="legendUrl"
          height="141"
          width="230"
        ></gv-iframe-panel>
      </div>
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
      indicatore: null,
      data: null,
      giorno: null,
      show: true,
      buttonDisabled: true,
      showLegend: false,
      legendUrl: null,
      datePickerOptions: {
        disabledDate: this.checkDate,
      },
    };
  },
  watch: {
    giorno() {
      this.data = this.giorno;
    },
    data() {
      if (!this.data) this.showLegend = false;
      if (this.data && this.indicatore) this.loadLayer();
    },
  },
  methods: {
    checkDate(date) {
      const today = new Date();
      const startYear = today.getFullYear() - 4;
      const startDate = new Date(`${startYear}-01-01`);
      return date > today || date < startDate;
    },
    onChangeTipo(value) {
      this.tipo = value;
      this.indicatore = null;
      this.data = null;
      this.giorno = null;
      this.showLegend = false;
    },
    onChangeIndicatore(value) {
      this.indicatore = value;
      if (this.data) this.loadLayer();
    },
    loadLayer() {
      GV.config.removeMap(this.idMap);
      this.mapConfig.layers = [];
      this.mapConfig.layers = [this.getLayer()];
      GV.config.addMapConfig(this.mapConfig);
      this.legendUrl = `/geoservices/REST/rqa/legenda/${this.indicatore}`;
      this.showLegend = true;
    },
    getLayer() {
      let layer = this.tipo === 'G' ? this.baseLayerGG : this.baseLayerAA;
      if (this.tipo === 'G') {
        layer.wmsParams.styles = `RQA_${this.indicatore}`;
        layer.wmsParams.cql_filter = `cod_indicatore='${this.indicatore}' AND giorno='${this.data}'`;
        const indicatore = this.indicatoriGiorno.find((ind) => ind.id === this.indicatore).nome;
        layer.legend.label = `${indicatore} (${this.data})`;
      } else {
        layer.wmsParams.styles = `RQA_${this.indicatore}`;
        layer.wmsParams.cql_filter = `cod_indicatore='${this.indicatore}' AND anno=${this.data}`;
        const indicatore = this.indicatoriAnno.find((ind) => ind.id === this.indicatore).nome;
        layer.legend.label = `${indicatore} (${this.data})`;
      }
      return layer;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-panel-collapse gv-color-scheme el-icon-arrow-up'
        : 'gv-panel-collapse gv-color-scheme el-icon-arrow-down';
    },
    hidePanel: function () {
      if (this.show) {
        document.getElementById('rqa-wrapper').style.display = 'none';
      } else {
        document.getElementById('rqa-wrapper').style.display = 'block';
      }
      this.show = !this.show;
    },
    setData(data) {
      this.tipi = data.tipi;
      this.indicatoriGiorno = data.indicatoriGiorno;
      this.indicatoriAnno = data.indicatoriAnno;
      this.anni = data.anni;
      this.mapConfig = data.mapConfig;
      this.idMap = data.mapConfig.id;
      this.baseLayerGG = data.mapConfig.layers.filter((layer) => {
        return layer.id === data.idLayerGG;
      })[0];
      this.baseLayerAA = data.mapConfig.layers.filter((layer) => {
        return layer.id === data.idLayerAA;
      })[0];
    },
    download() {
      this.downloadURI(
        'https://srvcarto.regione.liguria.it/dtuff/download_statico/2219/rqa-dati.zip'
      );
    },
    downloadURI(url) {
      var link = document.createElement('a');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.href = url;
      link.click();
    },
  },
  computed: {
    showIndicatoriGiorno() {
      return this.tipo == 'G';
    },
    showIndicatoriAnno() {
      return this.tipo == 'A';
    },
  },
  mounted: function () {
    axios
      .get('/geoservices/REST/rqa/app-config/')
      .then((response) => response.data.data)
      .then((data) => {
        this.setData(data);
      });
  },
};
</script>

<style scoped>
.rqa {
  width: 270px;
  z-index: 800;
  padding: 1px;
}
.rqa-title {
  padding: 5px;
  padding-left: 10px;
  font-weight: bold;
}

.rqa-button {
  margin-left: 10px;
  margin-bottom: 10px;
}

.rqa-download-button {
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 3px;
  border: 0;
  -webkit-appearance: none;
  font-size: 14px;
  font-weight: 800;
  float: right;
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
.gv-iframe-panel {
  overflow: hidden;
  margin: 10px;
  background-color: #eee;
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
