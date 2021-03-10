<template>
  <div class="gv-scuoladigitale-ricerca gv-inverted-color-scheme" id="gv-scuoladigitale-ricerca">
    <gv-title
      v-draggable
      title="Ricerca Tematica"
      :divId="'gv-scuoladigitale-ricerca'"
      :hide="true"
    ></gv-title>
    <div class="gv-scuoladigitale-ricerca-body" id="gv-scuoladigitale-ricerca-body">
      <el-select
        v-model="ordini"
        size="small"
        collapse-tags
        multiple
        placeholder="Ordine Scuola"
        style="width: 170px !important;"
      >
        <el-option v-for="item in listaOrdini" :key="item.id" :value="item.id" :label="item.label">
        </el-option>
      </el-select>
      <el-select
        v-model="parole"
        size="small"
        multiple
        collapse-tags
        placeholder="Parole Chiave"
        style="width: 270px !important;"
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
      <div class="gv-scuoladigitale-ricerca-result" v-show="showResult">
        <div class="gv-scuoladigitale-ricerca-table">
          <el-table
            :data="listaProgetti"
            empty-text="Nessuna risultato trovato"
            style="font-size: 12px !important;"
            class="gv-inverted-color-scheme"
            height="300"
            size="mini"
            @current-change="selectRiga"
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
            <el-table-column label="Abstract" align="center" width="300">
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

import notification from '../util/notification';

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
      showResult: false,
      // buttonDisabled: true,
    };
  },
  computed: {
    // buttonDisabled() {
    //   console.log(this.listaProgetti.length);
    //   if (this.listaProgetti.length > 0) return false;
    //   return true;
    // },
  },
  watch: {
    // listaProgetti() {
    //   deep: true,
    //   handler(progetti) {
    //     console.log('sono qui');
    //     if (this.listaProgetti.length > 0) {
    //       this.buttonDisabled = false;
    //     } else {
    //       this.buttonDisabled = true;
    //     }
    //   }
    // },
  },
  async mounted() {
    let ordini = await axios.get('/geoservices/REST/scuola/ordini');
    this.listaOrdini = await ordini.data.data;
    let parole = await axios.get('/geoservices/REST/scuola/parole');
    this.listaParole = await parole.data.data;
  },
  methods: {
    async submit() {
      if (this.parole.length === 0) {
        notification('Selezionare almeno una parola chiave', 'warning');
        return;
      }
      const ordini = this.ordini.join(',');
      const parole = this.parole.join(',');
      let listaProgetti = await axios.get(
        `/geoservices/REST/scuola/ricerca?ordini=${ordini}&parole=${parole}`
      );
      const data = await listaProgetti.data.data;
      this.listaProgetti = data.progetti;
      this.listaScuole = data.scuole;
      this.filtraMappa();
      this.showResult = true;
      this.$el.style.width = '810px';
    },
    reset() {
      GV.globals.SCUOLA_DIGITALE_LAYERS.forEach(layer => {
        GV.config.removeLayer(layer.name);
        layer.filter = () => {
          return true;
        };
        GV.config.addLayerToMap(layer, 0);
      });
      this.listaProgetti = [];
      this.listaScuole = [];
      this.ordini = [];
      this.parole = [];
      this.showResult = false;
      this.$el.style.width = '480px';
    },
    filtraMappa() {
      GV.globals.SCUOLA_DIGITALE_LAYERS.forEach(layer => {
        GV.config.removeLayer(layer.name);
        layer.filter = feature => {
          if (this.scuolaInListaScuole(feature)) return true;
        };
        GV.config.addLayerToMap(layer, 0);
      });
    },
    scuolaInListaScuole(feature) {
      let found = false;
      this.listaScuole.forEach(scuola => {
        if (feature.properties.COD_MECC === scuola) found = true;
      });
      return found;
    },
    handleLink(index, link) {
      window.open(link);
    },
    selectRiga(row) {
      console.log(row);
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-ricerca {
  position: absolute;
  left: 0;
  top: 0;
  width: 480px;
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
  color: #24386c !important;
}
</style>
