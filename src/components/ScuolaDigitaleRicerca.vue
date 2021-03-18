<template>
  <div class="gv-scuoladigitale-ricerca gv-inverted-color-scheme" id="gv-scuoladigitale-ricerca">
    <div
      v-draggable
      id="gv-scuoladigitale-ricerca-title"
      class="gv-scuoladigitale-ricerca-title gv-color-scheme"
    >
      <b>RICERCHE</b>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>

    <div class="gv-scuoladigitale-ricerca-body" id="gv-scuoladigitale-ricerca-body">
      <el-select
        placeholder="Scegli Visualizzazione"
        v-model="tipo"
        size="mini"
        @change="changeTipo"
      >
        <el-option
          v-for="item in tipi"
          :key="item.id"
          :value="item.id"
          :label="item.label"
        ></el-option>
      </el-select>
      <div v-show="showRicercaScuola" id="gv-scuoladigitale-ricerca-scuola">
        <el-select
          id="gv-seach-input"
          v-model="scuole"
          filterable
          clearable
          remote
          size="small"
          placeholder="Ricerca per nome scuola..."
          :remote-method="search"
          @change="onChange"
          :loading="loading"
          loading-text="Caricamento... "
          no-match-text="Nessun elemento trovato"
          no-data-text="Nessun elemento trovato"
        >
          <el-option
            v-for="item in results"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div v-show="showRicercaTemi" id="gv-scuoladigitale-ricerca-temi">
        <el-select
          v-model="ordini"
          size="small"
          collapse-tags
          multiple
          placeholder="Ordine Scuola"
          style="width: 170px !important;"
        >
          <el-option
            v-for="item in listaOrdini"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          >
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
          <el-option
            v-for="item in listaParole"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          >
          </el-option>
        </el-select>
      </div>
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
      tipi: [
        { id: 'scuola', label: 'Ricerca per nome scuola' },
        { id: 'temi', label: 'Ricerca per parole chiave' },
      ],
      tipo: 'scuola',
      ordini: [],
      scuole: [],
      layers: ['scuole_01', 'scuole_02', 'scuole_03', 'scuole_04', 'scuole_06', 'scuole_07'],
      propertyName: 'DENOMINAZIONE',
      results: [],
      listaOrdini: [],
      parole: [],
      listaParole: [],
      listaProgetti: [],
      listaScuole: [],
      showResult: false,
      loading: false,
      show: false,
      showRicercaScuola: true,
      showRicercaTemi: false,
    };
  },
  async mounted() {
    let ordini = await axios.get('/geoservices/REST/scuola/ordini');
    this.listaOrdini = await ordini.data.data;
    let parole = await axios.get('/geoservices/REST/scuola/parole');
    this.listaParole = await parole.data.data;
  },
  methods: {
    changeTipo(value) {
      console.log(value);
      if (value === 'scuola') {
        this.showRicercaScuola = true;
        this.showRicercaTemi = false;
      }
      if (value === 'temi') {
        this.showRicercaScuola = false;
        this.showRicercaTemi = true;
      }
    },
    search(query) {
      this.results = [];
      if (query.length < 3) {
        return;
      }
      this.results = this.filterData(query);
      // console.log(results);
    },
    filterData(text) {
      let results = [];
      text = text.replace(/[*+?^${}()|[\]\\]/g, '');
      if (text === '') {
        return [];
      }
      this.layers.forEach(sLayer => {
        GV.app.map.eachLayer(layer => {
          if (layer.name === sLayer) {
            if (layer instanceof L.LayerGroup) {
              layer.eachLayer(m => {
                let loc = m.getLatLng();
                loc.layer = m;
                const key = m.feature.properties[this.propertyName];
                if (new RegExp(text, 'i').test(key)) {
                  const addLabel = this.additionalLabel
                    ? m.feature.properties[this.additionalLabel]
                    : null;
                  const label = this.additionalLabel ? `${key} (${addLabel})` : key;
                  const value = m.feature.properties.COD_MECC;
                  results.push({
                    label: label,
                    value: value,
                    location: loc,
                  });
                }
              });
            }
          }
        });
      });
      return results;
    },
    onChange(value) {
      console.log(value);
      this.listaScuole = [value];
      this.filtraMappa();
    },
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
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-ricerca-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-ricerca').style.width = '480px';
      } else {
        document.getElementById('gv-scuoladigitale-ricerca-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-ricerca').style.width = '110px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-scuoladigitale-ricerca-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-ricerca-collapse gv-color-scheme el-icon-arrow-up';
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
  margin-left: 20px;
  margin-top: 20px;
  z-index: 800;
}

.gv-scuoladigitale-ricerca-title {
  position: relative;
  display: block;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-right: 0rem;
  padding-left: 0.5rem;
  margin-bottom: -1px;
  color: #ccc;
  cursor: default;
  font-weight: 800;
  font-family: 'Raleway', Arial, sans-serif !important;
  font-size: 14px;
}

.gv-scuoladigitale-ricerca-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-scuoladigitale-ricerca-body {
  margin: 10px;
}

.gv-scuoladigitale-ricerca-label {
  display: inline-block;
  width: 150px;
}

.gv-scuoladigitale-ricerca-buttons {
  margin-top: 10px;
  margin-left: 5px;
}
.gv-scuoladigitale-ricerca-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-scuoladigitale-ricerca-collapse {
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
