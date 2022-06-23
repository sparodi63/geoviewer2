<template>
  <div v-if="visible" class="gv-cultura-ricerca gv-inverted-color-scheme" id="gv-cultura-ricerca">
    <div v-draggable id="gv-cultura-ricerca-title" class="gv-cultura-ricerca-title gv-color-scheme">
      <b>RICERCHE</b>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>

    <div class="gv-cultura-ricerca-body" id="gv-cultura-ricerca-body">
      <div id="gv-cultura-ricerca-filtri">
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

        <!-- <div class="gv-cultura-ricerca-filtri-title"> FILTRI </div> -->
        <table>
          <tr>
            <td>
              <span>LIVELLO </span>
            </td>
            <td>
              <el-select
                v-model="raggruppamento"
                size="small"
                placeholder="Raggruppamento"
                style="width: 270px !important"
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
            </td>
          </tr>
          <tr>
            <td>
              <span>CATEGORIA </span>
            </td>
            <td>
              <el-select
                v-model="categoria"
                size="small"
                filterable
                collapse-tags
                placeholder="Categoria"
                style="width: 270px !important"
              >
                <el-option
                  v-for="item in categorie"
                  :key="item.id"
                  :value="item.id"
                  :label="item.categoria"
                >
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>
              <span>PROVINCIA </span>
            </td>
            <td>
              <el-select
                v-model="provincia"
                size="small"
                placeholder="Provincia"
                style="width: 270px !important"
                @change="onChangeProvincia"
              >
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :value="item.id"
                  :label="item.provincia"
                >
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>
              <span>COMUNE </span>
            </td>
            <el-select
              v-model="comune"
              size="small"
              filterable
              collapse-tags
              placeholder="Comune"
              style="width: 270px !important"
            >
              <el-option
                v-for="item in comuni"
                :key="item.id"
                :value="item.id"
                :label="item.comune"
              >
              </el-option>
            </el-select>
            <td></td>
          </tr>
          <!-- <tr>
            <td>
              <span>ITINERARIO </span>
            </td>
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
            <td>
            </td>
          </tr> -->
        </table>
      </div>
      <div class="gv-cultura-ricerca-buttons">
        <el-button
          alt="Applica"
          id="gv-cultura-ricerca-submit"
          type="info"
          size="mini"
          @click="filterLuoghi"
          >Applica</el-button
        >
        <el-button
          alt="Annulla Filtro"
          id="gv-cultura-ricerca-reset"
          type="info"
          size="mini"
          @click="reset"
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

Vue.component('gv-cultura-ricerca-results', () =>
  import(/* webpackChunkName: "CulturaRicercaResults" */ './CulturaRicercaResults')
);

// Vue.component('gv-cultura-info', () =>
//   import(/* webpackChunkName: "ScuolaDigitaleRicercaResults" */ './ScuolaDigitaleInfo')
// );

export default {
  name: 'gv-cultura-ricerca',
  data() {
    let raggruppamenti = GV.globals.CULTURA_CONFIG.raggruppamenti;
    for (const rg of raggruppamenti) {
      rg.categorie.unshift({
        id: 0,
        categoria: 'Tutte',
      });
    }
    raggruppamenti = raggruppamenti.sort((a, b) => a.id - b.id);

    let categorie = GV.globals.CULTURA_CONFIG.categorie;
    categorie.unshift({
      id: 0,
      categoria: 'Tutte',
    });

    raggruppamenti.unshift({
      id: 0,
      raggruppamento: 'Tutti',
      categorie: categorie,
    });

    let province = GV.globals.CULTURA_CONFIG.province;
    for (const pr of province) {
      pr.comuni.unshift({
        id: 0,
        comune: 'Tutti',
      });
      pr.comuni = pr.comuni.sort((a, b) => a.id - b.id);
    }
    let comuni = GV.globals.CULTURA_CONFIG.comuni;
    comuni.push({
      id: 0,
      comune: 'Tutti',
    });
    comuni = comuni.sort((a, b) => a.id - b.id);
    province.push({
      id: 0,
      provincia: 'Tutte',
      comuni: comuni,
    });
    province = province.sort((a, b) => a.id - b.id);

    const filter = GV.globals.CULTURA_CONFIG.filter;
    const visible = !GV.globals.CULTURA_CONFIG.embed;

    return {
      raggruppamenti: raggruppamenti,
      raggruppamento: filter.raggruppamento,
      categorie: categorie,
      categoria: filter.categoria,
      province: province,
      provincia: filter.provincia,
      comuni: comuni,
      comune: filter.comune,
      // itinerari: GV.globals.CULTURA_CONFIG.itinerari,
      // itinerario: filter.itinerario,
      propertyName: 'NOME',
      luoghi: null,
      filterResult: [],
      listaLuoghi: [],
      loading: false,
      show: false,
      visible: visible,
    };
  },
  async mounted() {
    if (this.raggruppamento) this.onChangeRaggruppamento(this.raggruppamento);
    if (this.provincia) this.onChangeProvincia(this.provincia);
    this.filterLuoghi();
  },
  methods: {
    onChangeRaggruppamento(value) {
      this.categorie = this.raggruppamenti.filter((r) => r.id === value)[0].categorie;
      this.categoria = 0;
    },
    onChangeProvincia(value) {
      this.comuni = this.province.filter((r) => r.id === value)[0].comuni;
      this.comune = 0;
    },
    // search(query) {
    //   this.searchResults = [];
    //   if (query.length < 3) {
    //     return;
    //   }
    //   fetch(`/geoservices/REST/cultura/ricercaLuoghi?q=${query}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data.success) {
    //         this.searchResults = data.results;
    //       } else {
    //         throw data.message;
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error:', error);
    //       alert(error);
    //     });
    // },
    // onSelectSearch(value) {
    //   console.log('onSelectSearch', value);
    //   this.luoghi = value;
    // },
    filterLuoghi() {
      if (
        !GV.globals.CULTURA_CONFIG.flagItinerario &&
        this.raggruppamento === 0 &&
        this.categoria === 0 &&
        this.provincia === 0 &&
        this.comune === 0
        // && this.itinerario === 0
      ) {
        return;
      }

      this.listaLuoghi = GV.globals.CULTURA_CONFIG.luoghi
        .filter((luogo) => {
          if (this.raggruppamento && this.raggruppamento !== luogo.properties.ID_RAGGRUPPAMENTO)
            return false;
          // if (this.categoria && this.categoria !== luogo.properties.CATOID) return false
          if (this.categoria && !this.ricercaCategoria(luogo.properties.OID)) return false;
          if (this.provincia && this.provincia !== luogo.properties.COD_PROV) return false;
          if (this.comune && this.comune !== luogo.properties.COD_PROV + luogo.properties.COD_COM)
            return false;
          return true;
        })
        .sort((a, b) => {
          const res = a.properties.NOME < b.properties.NOME ? -1 : 1;
          return res;
        });

      if (this.listaLuoghi.length === 0) {
        notification('Nessun risultato trovato');
        // console.log('vuoto')
      } else {
        this.showResults();
        this.filtraMappa();
        this.zoomExtentsMap();
      }
    },
    ricercaCategoria(oid) {
      const filter = GV.globals.CULTURA_CONFIG.categorieRicerca.filter((cat) => {
        if (cat.id == oid && cat.catoid === this.categoria) return true;
      });
      if (filter.length > 0) return true;
      return false;
    },
    // async filterLuoghiOLD() {
    //   const data = {
    //     raggruppamento: this.raggruppamento,
    //     categoria: this.categoria,
    //     provincia: this.provincia,
    //     comune: this.comune,
    //     itinerario: this.itinerario,
    //   }

    //   if (this.raggruppamento===0 && this.categoria===0 && this.provincia===0 && this.comune===0 && this.itinerario===0){
    //     return
    //   }

    //   fetch(`/geoservices/REST/cultura/filtraLuoghi`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    //   }).then(response => response.json())
    //     .then(data => {
    //       if (data.success) {
    //         // console.log('fetch')
    //         this.filterResult = data.results
    //         console.log(this.filterResult)
    //         this.showResults();
    //         this.filtraMappa();
    //         // console.log('filtro mappa')
    //       } else {
    //         throw data.message;
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Error:', error);
    //       alert(error);
    //     });
    // },
    zoomExtentsMap() {
      var bounds = L.latLngBounds([]);
      GV.globals.CULTURA_LAYERS.forEach((fl) => {
        const layer = GV.app.map.getLayerByName(fl.name);
        const layerBounds = layer.getBounds();
        bounds.extend(layerBounds);
      });
      GV.app.map.fitBounds(bounds);
    },
    filtraMappa() {
      GV.globals.CULTURA_LAYERS.forEach((layer) => {
        GV.config.removeLayer(layer.name);
        layer.filter = (feature) => {
          let found = false;
          for (let luogo of this.listaLuoghi) {
            if (feature.properties.OID == luogo.properties.OID) {
              found = true;
              break;
            }
          }
          return found;
        };
        // debugger;
        GV.config.addLayerToMap(layer, 0);
      });
    },
    reset() {
      this.raggruppamento = 0;
      this.categoria = 0;
      this.provincia = 0;
      this.comune = 0;
      this.onChangeRaggruppamento(0);
      this.onChangeProvincia(0);
      const div = document.getElementById('gv-cultura-ricerca-results');
      if (div) div.remove();
      GV.globals.CULTURA_LAYERS.forEach((layer) => {
        GV.config.removeLayer(layer.name);
        layer.filter = () => {
          return true;
        };
        GV.config.addLayerToMap(layer, 0);
      });
      this.zoomExtentsMap();
    },
    closeResultPanels() {},
    showInfo() {},
    showResults() {
      const filtro = {
        comune: this.comune ? this.comune : null,
        provincia: this.provincia ? this.provincia : null,
        raggruppamento: this.raggruppamento ? this.raggruppamento : null,
        categoria: this.categoria ? this.categoria : null,
        // itinerario: this.itinerario ? this.itinerario : null,
      };
      mountComponent({
        elId: 'gv-cultura-ricerca-results',
        clear: true,
        vm: new Vue({
          template: `<gv-cultura-ricerca-results :listaLuoghi="listaLuoghi" :filtro="filtro"></gv-cultura-ricerca-results>`,
          data: {
            listaLuoghi: this.listaLuoghi,
            filtro: filtro,
          },
        }),
      });
    },
    handleLink(index, link) {
      window.open(link);
    },
    hidePanel: function (event) {
      if (this.show) {
        document.getElementById('gv-cultura-ricerca-body').style.display = 'block';
        document.getElementById('gv-cultura-ricerca').style.width = '480px';
      } else {
        document.getElementById('gv-cultura-ricerca-body').style.display = 'none';
        document.getElementById('gv-cultura-ricerca').style.width = '110px';
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
  /* color: black; */
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
