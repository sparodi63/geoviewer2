<template>
  <div class="gv-cultura-ricerca gv-inverted-color-scheme" id="gv-cultura-ricerca">
    <div
      v-draggable
      id="gv-cultura-ricerca-title"
      class="gv-cultura-ricerca-title gv-color-scheme"
    >
      <b>LUOGHI DELLA CULTURA IN LIGURIA</b>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>

    <div class="gv-cultura-ricerca-body" id="gv-cultura-ricerca-body">
        <!-- <span class="gv-cultura-ricerca-luoghi">RICERCA</span> 
        <el-select
          id="gv-seach-input"
          v-model="luoghi"
          filterable
          clearable
          remote
          size="small"
          placeholder="Ricerca un luogo per nome o indirizzo..."
          :remote-method="search"
          @change="onSelectSearch"
          :loading="loading"
          loading-text="Caricamento... "
          no-match-text="Nessun elemento trovato"
          no-data-text="Nessun elemento trovato"
          style="width: 370px !important;"
        >
          <el-option
            v-for="item in searchResults"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
      
      <div id="gv-cultura-ricerca-filtri">
        <div class="gv-cultura-ricerca-filtri-title"> FILTRI </div>
        <el-select
          v-model="raggruppamento"
          size="small"
          placeholder="Raggruppamento"
          style="width: 170px !important;"
          @change="onChangeRaggruppamento"
        >
          <el-option
            v-for="item in raggruppamenti"
            :key="item.id"
            :value="item.id"
            :label="item.raggruppamento"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="categoria"
          size="small"
          filterable
          collapse-tags
          placeholder="Categoria"
          style="width: 270px !important;"
        >
          <el-option
            v-for="item in categorie"
            :key="item.id"
            :value="item.id"
            :label="item.categoria"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="itinerario"
          size="small"
          filterable
          collapse-tags
          placeholder="Itinerario"
          style="width: 270px !important;"
        >
          <el-option
            v-for="item in itinerari"
            :key="item.id"
            :value="item.id"
            :label="item.itinerario"
          >
          </el-option>
        </el-select>
      </div>
      <div class="gv-cultura-ricerca-buttons">
        <el-button id="gv-cultura-ricerca-submit" type="info" size="mini" @click="filterLuoghi"
          >Applica</el-button
        >
        <el-button id="gv-cultura-ricerca-reset" type="info" size="mini" @click="reset"
          >Annulla Filtro</el-button
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

// Vue.component('gv-cultura-ricerca-results', () =>
//   import(/* webpackChunkName: "ScuolaDigitaleRicercaResults" */ './ScuolaDigitaleRicercaResults')
// );
// Vue.component('gv-cultura-info', () =>
//   import(/* webpackChunkName: "ScuolaDigitaleRicercaResults" */ './ScuolaDigitaleInfo')
// );

export default {
  name: 'gv-cultura-ricerca',
  data() {
    let categorie = GV.globals.CULTURA_CONFIG.categorie
    categorie.push({
      id: 0,
      categoria: 'Tutte',
    }) 
    categorie = categorie.sort((a,b) => a.id - b.id)

    let raggruppamenti = GV.globals.CULTURA_CONFIG.raggruppamenti
    raggruppamenti.push({
      id: 0,
      raggruppamento: 'Tutti',
      categorie: categorie
    }) 
    raggruppamenti = raggruppamenti.sort((a,b) => a.id - b.id)

    return {
      raggruppamenti: raggruppamenti,
      raggruppamento: null,
      categorie: categorie,
      categoria: null,
      province: null,
      provincia: null,
      comuni: null,
      comune: null,
      itinerari: GV.globals.CULTURA_CONFIG.itinerari,
      itinerario: null,
      layers: ['scuole_01', 'scuole_02', 'scuole_03', 'scuole_04', 'scuole_06', 'scuole_07'],
      propertyName: 'NOME',
      searchResult: [],
      luoghi: null,
      filterResult: [],
      loading: false,
      show: false,
      showRicercaScuola: true,
      showRicercaTemi: false,
      markerArray: [],
    };
  },
  async mounted() {
    // console.log('CONFIG', GV.globals.CULTURA_CONFIG)
    // this.raggruppamenti = GV.globals.CULTURA_CONFIG.raggruppamenti.sort((a,b) => a.id - b.id)
  },
  methods: {
    onChangeRaggruppamento(value) {
      // console.log(value)
      this.categorie = this.raggruppamenti.filter(r => r.id === value)[0].categorie
    },
    search(query) {
      this.searchResults = [];
      // console.log(query)
      if (query.length < 3) {
        return;
      }
      fetch(`/geoservices/REST/cultura/ricercaLuoghi?q=${query}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // console.log(data.results)
            this.searchResults = data.results;
            // TODO: find e evidenziazione luogo 
          } else {
            throw data.message;
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert(error);
        });
    },
    // filterData(text) {
    //   let results = [];
    //   text = text.replace(/[*+?^${}()|[\]\\]/g, '');
    //   if (text === '') {
    //     return [];
    //   }
    //   this.layers.forEach(sLayer => {
    //     GV.app.map.eachLayer(layer => {
    //       if (layer.name === sLayer) {
    //         if (layer instanceof L.LayerGroup) {
    //           layer.eachLayer(m => {
    //             let loc = m.getLatLng();
    //             loc.layer = m;
    //             const key = m.feature.properties[this.propertyName];
    //             if (new RegExp(text, 'i').test(key)) {
    //               const addLabel = this.additionalLabel
    //                 ? m.feature.properties[this.additionalLabel]
    //                 : null;
    //               const label = this.additionalLabel ? `${key} (${addLabel})` : key;
    //               const value = m.feature.properties.COD_MECC;
    //               results.push({
    //                 label: label,
    //                 value: value,
    //                 location: loc,
    //               });
    //             }
    //           });
    //         }
    //       }
    //     });
    //   });
    //   return results;
    // },
    onSelectSearch(value) {
      console.log('onSelectSearch', value)
      // this.luoghi = value;
      // TODO find + zoom su luogo trovato
    },
    async filterLuoghi() {
      const data = {
        raggruppamento: this.raggruppamento,
        categoria: this.categoria,
        provincia: this.provincia,
        comune: this.comune,
        itinerario: this.itinerario,
      }
      console.log(data)
      fetch(`/geoservices/REST/cultura/filtraLuoghi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => response.json())
        .then(data => {
          if (data.success) {
            // console.log('fetch')
            this.filterResult = data.results
            this.filtraMappa();
            // console.log('filtro mappa')
          } else {
            throw data.message;
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert(error);
        });
    },
    filtraMappa() {
      this.markerArray = [];
      GV.globals.CULTURA_LAYERS.forEach(layer => {
        GV.config.removeLayer(layer.name);
        layer.filter = feature => {
          if (this.luogoInFiltro(feature)) return true;
        };
        GV.config.addLayerToMap(layer, 0);
      });
    },
    luogoInFiltro(feature) {
      let found = false;
      for (let luogo of this.filterResult) {
        if (feature.properties.OID == luogo) {
          found = true;
          break;
        }
      }
      return found;
    },
    reset() {
    },
    closeResultPanels() {
    },
    showInfo() {
    },
    showResults() {
    },
    handleLink(index, link) {
      window.open(link);
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-cultura-ricerca-body').style.display = 'block';
        document.getElementById('gv-cultura-ricerca').style.width = '480px';
      } else {
        document.getElementById('gv-cultura-ricerca-body').style.display = 'none';
        document.getElementById('gv-cultura-ricerca').style.width = '190px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-cultura-ricerca-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-cultura-ricerca-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style scoped>
.gv-cultura-ricerca {
  position: absolute;
  left: 0;
  top: 0;
  width: 480px;
  margin-left: 10px;
  margin-top: 20px;
  z-index: 800;
}

.gv-cultura-ricerca-luoghi {
  margin-left: 10px;
}

.gv-cultura-ricerca-title {
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

.gv-cultura-ricerca-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-cultura-ricerca-body {
  margin: 10px;
}

.gv-cultura-ricerca-filtri-title {
  margin-left: 10px;
  margin-top: 20px;
}

.gv-cultura-ricerca-label {
  display: inline-block;
  width: 150px;
}

.gv-cultura-ricerca-buttons {
  margin-top: 10px;
  margin-left: 5px;
}
.gv-cultura-ricerca-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-cultura-ricerca-collapse {
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

.el-select .el-input .el-select__caret {
  color: black !important;
  font-size: 16px !important;
  font-weight: 800;
}
</style>
