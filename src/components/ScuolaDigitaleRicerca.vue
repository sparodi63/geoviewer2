<template>
  <div class="gv-scuoladigitale-ricerca gv-inverted-color-scheme" id="gv-scuoladigitale-ricerca">
    <gv-title
      v-draggable
      title="Ricerca Tematica"
      :divId="'gv-scuoladigitale-ricerca'"
      :hide="true"
      :width="'885px'"
    ></gv-title>
    <div class="gv-scuoladigitale-ricerca-body" id="gv-scuoladigitale-ricerca-body">
      <el-select v-model="ordini" size="small" collapse-tags multiple placeholder="Ordine Scuola">
        <el-option v-for="item in listaOrdini" :key="item.id" :value="item.id" :label="item.label">
        </el-option>
      </el-select>
      <el-select
        v-model="parole"
        size="small"
        multiple
        collapse-tags
        placeholder="Parole Chiave"
        style="width: 440px !important;"
      >
        <el-option v-for="item in listaParole" :key="item.id" :value="item.id" :label="item.label">
        </el-option>
      </el-select>
      <div class="gv-scuoladigitale-ricerca-buttons">
        <el-button id="gv-scuoladigitale-ricerca-submit" type="info" size="mini" @click="submit"
          >Conferma</el-button
        >
        <el-button id="gv-scuoladigitale-ricerca-reset" type="info" size="mini" @click="reset"
          >Annulla Selezione</el-button
        >
      </div>
      <div class="gv-scuoladigitale-ricerca-result">
        <el-table
          :data="listaProgetti"
          empty-text="Nessuna risultato trovato"
          :cell-style="{ padding: '2px', maxHeight: '10px' }"
        >
          <el-table-column label="Anno" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.anno }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Nome Istituto" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.nome_istituto }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Ordine" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.ordine }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Titolo progetto" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.titolo_progetto }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Abstract" align="center" width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.abstract }}</span>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <span title="link alla documentazione">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleLink(scope.$index, scope.row.link_documentazione)"
                  icon="el-icon-link"
                ></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

import { Button, Select, Option } from 'element-ui';
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-scuoladigitale-ricerca',
  props: {
    idMap: String,
    selFogli: String,
    field: String,
  },
  data() {
    return {
      ordini: [],
      listaOrdini: [],
      parole: [],
      listaParole: [],
      listaProgetti: [],
      listaScuole: [],
      layers: [],
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    let ordini = await axios.get('/geoservices/REST/scuola/ordini');
    this.listaOrdini = await ordini.data.data;
    let parole = await axios.get('/geoservices/REST/scuola/parole');
    this.listaParole = await parole.data.data;
    this.layers.push({
      scuole_01: GV.app.map.getLayerByName('scuole_01').geoJson,
    });
    console.log('MOUNTED', this.layers);
  },
  methods: {
    async submit() {
      const ordini = this.ordini.join(',');
      const parole = this.parole.join(',');
      let listaProgetti = await axios.get(
        `/geoservices/REST/scuola/ricerca?ordini=${ordini}&parole=${parole}`
      );
      const data = await listaProgetti.data.data;
      this.listaProgetti = data.progetti;
      this.listaScuole = data.scuole;
      this.filtraMappa();
    },
    reset() {
      GV.config.removeLayer('scuole_01');
      const layerConfig = GV.globals.SCUOLA_DIGITALE_LAYERS.filter(layer => {
        return (layer.name = 'scuole_01');
      })[0];
      layerConfig.filter = () => {
        return true;
      };
      GV.config.addLayerToMap(layerConfig, 0);
    },
    filtraMappa() {
      GV.config.removeLayer('scuole_01');
      const layerConfig = GV.globals.SCUOLA_DIGITALE_LAYERS.filter(layer => {
        return (layer.name = 'scuole_01');
      })[0];
      layerConfig.filter = feature => {
        if (feature.properties.COD_MECC === 'GEMM18400Q') return true;
      };
      GV.config.addLayerToMap(layerConfig, 0);
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-ricerca {
  position: absolute;
  left: 0;
  top: 0;
  width: 900px;
  margin-left: 100px;
  margin-top: 150px;
  z-index: 800;
}

.gv-scuoladigitale-ricerca-body {
  margin: 10px;
}

.gv-scuoladigitale-ricerca-label {
  display: inline-block;
  width: 150px;
}

.gv-scuoladigitale-ricerca-title {
  display: inline-block;
  font-weight: 800;
  width: 700px;
  margin-bottom: 20px;
}
.gv-scuoladigitale-ricerca-buttons {
  margin-top: 10px;
  margin-left: 5px;
}
.gv-scuoladigitale-ricerca-result {
  margin-top: 10px;
  margin-left: 5px;
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
