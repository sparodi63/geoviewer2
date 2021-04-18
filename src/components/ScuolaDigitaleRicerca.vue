<template>
  <div class="gv-scuoladigitale-ricerca gv-inverted-color-scheme" id="gv-scuoladigitale-ricerca">
    <div
      v-draggable
      id="gv-scuoladigitale-ricerca-title"
      class="gv-scuoladigitale-ricerca-title gv-color-scheme"
    >
      <b>RICERCHE TEMATICHE</b>
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
        size="small"
        @change="changeTipo"
        style="margin-bottom: 5px !important;"
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
          v-model="scuola"
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
          style="width: 370px !important;"
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

import { Loading } from 'element-ui';
Vue.use(Loading);

import mountComponent from '../util/mountComponent';
import notification from '../util/notification';

import ScuolaDigitaleRicercaResults from './ScuolaDigitaleRicercaResults';
Vue.component('gv-scuoladigitale-ricerca-results', ScuolaDigitaleRicercaResults);

import ScuolaDigitaleInfo from './ScuolaDigitaleInfo';
Vue.component('gv-scuoladigitale-info', ScuolaDigitaleInfo);

export default {
  name: 'gv-scuoladigitale-ricerca',
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
      scuola: null,
      listaScuole: [],
      loading: false,
      show: false,
      showRicercaScuola: true,
      showRicercaTemi: false,
      markerArray: [],
    };
  },
  async mounted() {
    const listaOrdini = await axios.get('/geoservices/REST/scuola/ordini');
    this.listaOrdini = await listaOrdini.data.data;

    let parole = await axios.get('/geoservices/REST/scuola/parole');
    this.listaParole = await parole.data.data;
    GV.eventBus.$on('scuoladigitale-close-panel', e => {
      if (e.flagRicerca) this.reset();
    });
  },
  methods: {
    changeTipo(value) {
      this.reset();
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
      this.scuola = value;
      this.listaScuole = [value];
    },
    async submit() {
      this.closeResultPanels();
      if (this.tipo === 'temi') {
        if (this.parole.length === 0) {
          notification('Selezionare almeno una parola chiave', 'warning');
          return;
        }
        const target = document.getElementById('gv-scuoladigitale-ricerca');
        const loading = Loading.service({
          text: 'Ricerca in corso...',
          target: target,
        });
        const ordini = this.ordini.join(',');
        const parole = this.parole.join(',');
        let listaProgetti = await axios.get(
          `/geoservices/REST/scuola/ricerca?ordini=${ordini}&parole=${parole}`
        );
        if (loading) loading.close();
        const data = await listaProgetti.data.data;
        if (data) {
          this.listaProgetti = data.progetti;
          this.listaScuole = data.scuole;
          this.showResults();
          this.filtraMappa(false);
        }
      } else {
        if (!this.scuola) {
          notification('Selezionare una scuola tramite la ricerca', 'warning');
          return;
        }
        this.showInfo();
        this.filtraMappa(true);
      }
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
      this.scuole = [];
      this.scuola = null;
      this.results = [];
      this.ordini = [];
      // this.ordini = [0];
      this.parole = [];
      this.closeResultPanels();
    },
    closeResultPanels() {
      const resultDiv = document.getElementById('gv-scuoladigitale-ricerca-results');
      if (resultDiv) resultDiv.parentNode.removeChild(resultDiv);
      const infoDiv = document.getElementById('gv-scuoladigitale-info');
      if (infoDiv) infoDiv.parentNode.removeChild(infoDiv);
    },
    showInfo() {
      mountComponent({
        elId: 'gv-scuoladigitale-info',
        clear: true,
        vm: new Vue({
          template: `<gv-scuoladigitale-info :id="id" title="RISULTATO RICERCA" :flagRicerca="flagRicerca"></gv-scuoladigitale-info>`,
          data: {
            id: this.scuola,
            flagRicerca: true,
          },
        }),
      });
    },
    showResults() {
      mountComponent({
        elId: 'gv-scuoladigitale-ricerca-results',
        clear: true,
        vm: new Vue({
          template: `<gv-scuoladigitale-ricerca-results :listaProgetti="listaProgetti"></gv-scuoladigitale-ricerca-results>`,
          data: {
            listaProgetti: this.listaProgetti,
          },
        }),
      });
    },
    filtraMappa(zoom) {
      this.markerArray = [];
      GV.globals.SCUOLA_DIGITALE_LAYERS.forEach(layer => {
        GV.config.removeLayer(layer.name);
        layer.filter = feature => {
          if (this.scuolaInListaScuole(feature, zoom)) return true;
        };
        GV.config.addLayerToMap(layer, 0);
      });
    },
    scuolaInListaScuole(feature, zoom) {
      let found = false;
      for (let scuola of this.listaScuole) {
        if (feature.properties.COD_MECC === scuola) {
          found = true;
          if (zoom) {
            GV.app.map.setView(
              [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
              14
            );
          }
          break;
        }
      }
      return found;
    },
    handleLink(index, link) {
      window.open(link);
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-ricerca-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-ricerca').style.width = '480px';
      } else {
        document.getElementById('gv-scuoladigitale-ricerca-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-ricerca').style.width = '190px';
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
  margin-left: 10px;
  margin-top: 50px;
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
  color: black;
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
