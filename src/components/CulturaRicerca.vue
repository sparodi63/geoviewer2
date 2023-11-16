<template>
  <div
    v-if="visible"
    class="gv-cultura-ricerca gv-inverted-color-scheme"
    id="gv-cultura-ricerca"
    ref="gv-cultura-ricerca"
  >
    <div v-draggable id="gv-cultura-ricerca-title" class="gv-cultura-ricerca-title gv-color-scheme">
      <strong>RICERCHE</strong>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>

    <div class="gv-cultura-ricerca-body" id="gv-cultura-ricerca-body">
      <div id="gv-cultura-ricerca-filtri">
        <table>
          <tr v-if="itinerario">
            <td>
              <span><strong>ITINERARIO</strong></span>
            </td>
            <td>
              <span
                ><strong>&nbsp;&nbsp;{{ nomeItinerario }}</strong></span
              >
            </td>
          </tr>
          <tr v-if="flagRaggruppamento">
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
          <tr v-if="!flagRaggruppamento">
            <td>
              <span><strong>LIVELLO</strong></span>
            </td>
            <td>
              <span
                ><strong>&nbsp;&nbsp;{{ nomeRaggruppamento }}</strong></span
              >
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
        <el-button
          id="gv-cultura-ricerca-results-pdf-button"
          type="info"
          size="mini"
          alt="Stampa PDF"
          class="gv-cultura-ricerca-results-pdf-button"
          @click="stampaPDF"
          v-show="showResultsPanel"
          >Stampa PDF</el-button
        >
      </div>

      <div
        v-show="showResultsPanel"
        class="gv-cultura-ricerca-results-body"
        id="gv-cultura-ricerca-results-body"
      >
        <div class="gv-cultura-ricerca-results-result">
          <div class="gv-cultura-ricerca-results-table">
            <el-table
              :data="listaLuoghi"
              empty-text="Nessun luogo trovato"
              style="font-size: 12px !important"
              class="gv-inverted-color-scheme"
              :row-style="tableRowClassName"
              :show-header="false"
              height="300"
              size="mini"
              @current-change="selectRiga"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <strong>{{ props.row.properties.CATNAME }}</strong
                  ><br /><br />
                  <em>{{ props.row.properties.DESCRIZIONE_BREVE }}</em>
                </template>
              </el-table-column>
              <el-table-column prop="properties.NOME" align="left" width="200">
                <template slot-scope="props">
                  <strong>{{ props.row.properties.NOME }}</strong>
                </template>
              </el-table-column>
              <el-table-column prop="properties.NOMECOMUNE" align="left" width="200">
                <template slot-scope="props">
                  <span
                    >{{ props.row.properties.NOMECOMUNE }}
                    <span>( {{ props.row.properties.SIGLA_PROVINCIA }} ) </span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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

import notification from '../util/notification';
import TestScreenWidth from '../mixins/TestScreenWidth';

export default {
  name: 'gv-cultura-ricerca',
  mixins: [TestScreenWidth],
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
    const visible = !GV.globals.CULTURA_CONFIG.embed || !this.largeScreen;

    let nomeItinerario = '';
    if (filter.itinerario) {
      nomeItinerario = GV.globals.CULTURA_CONFIG.itinerari.filter((it) => {
        return it.id == filter.itinerario;
      })[0].itinerario;
      // console.log(nomeItinerario);
    }

    const flagRaggruppamento = GV.globals.CULTURA_CONFIG.filter.raggruppamento ? false : true;
    let nomeRaggruppamento = '';
    if (!flagRaggruppamento) {
      nomeRaggruppamento = GV.globals.CULTURA_CONFIG.raggruppamenti.filter((it) => {
        return it.id == GV.globals.CULTURA_CONFIG.filter.raggruppamento;
      })[0].raggruppamento;
      console.log(nomeRaggruppamento);
    }

    return {
      raggruppamenti: raggruppamenti,
      raggruppamento: filter.raggruppamento,
      flagRaggruppamento: flagRaggruppamento,
      nomeRaggruppamento: nomeRaggruppamento,
      categorie: categorie,
      categoria: filter.categoria,
      province: province,
      provincia: filter.provincia,
      comuni: comuni,
      comune: filter.comune,
      // itinerari: GV.globals.CULTURA_CONFIG.itinerari,
      itinerario: filter.itinerario,
      nomeItinerario: nomeItinerario,
      propertyName: 'NOME',
      luoghi: null,
      filterResult: [],
      listaLuoghi: [],
      loading: false,
      show: false,
      visible: visible,
      filtro: null,
      showResultsPanel: false,
    };
  },
  async mounted() {
    if (this.raggruppamento) this.onChangeRaggruppamento(this.raggruppamento);
    if (this.provincia) this.onChangeProvincia(this.provincia);
    this.filterLuoghi();
    const el = document.getElementById('gv-cultura-ricerca-filtri');
    if (el) el.focus();
    // console.log('screenWidth', this.screenWidth);
    // console.log('largeScreen', this.largeScreen);
    if (!this.largeScreen) {
      this.visible = false;
    }
    if (GV.globals.CULTURA_CONFIG.filter.luogo) {
      this.visible = false;
    }
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
    //   this.luoghi = value;
    // },
    filterLuoghi() {
      const divInfo = document.getElementById('gv-cultura-info');
      if (divInfo && !GV.globals.CULTURA_CONFIG.filter.luogo) divInfo.remove();
      this.listaLuoghi = GV.globals.CULTURA_CONFIG.luoghi
        .filter((luogo) => {
          if (this.raggruppamento && this.raggruppamento !== luogo.properties.ID_RAGGRUPPAMENTO)
            return false;
          // if (this.categoria && this.categoria !== luogo.properties.CATOID) return false
          if (this.categoria && !this.ricercaCategoria(luogo.properties.OID)) return false;
          if (this.provincia && this.provincia != luogo.properties.COD_PROV) return false;
          if (this.comune && this.comune != luogo.properties.COD_PROV + luogo.properties.COD_COM)
            return false;
          return true;
        })
        .sort((a, b) => {
          const res = a.properties.NOME < b.properties.NOME ? -1 : 1;
          return res;
        });

      if (this.listaLuoghi.length === 0) {
        notification('Nessun risultato trovato');
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
    zoomExtentsMap() {
      var bounds = L.latLngBounds([]);
      GV.globals.CULTURA_LAYERS.forEach((fl) => {
        const layer = GV.app.map.getLayerByName(fl.name);
        const layerBounds = layer.getBounds();
        bounds.extend(layerBounds);
      });
      bounds = bounds.pad(0.2);
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
    noFilter() {
      if (
        this.raggruppamento === 0 &&
        this.categoria === 0 &&
        this.provincia === 0 &&
        this.comune === 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    reset() {
      if (GV.globals.CULTURA_CONFIG.flagItinerario) {
        if (this.noFilter()) {
          return;
        } else {
          this.raggruppamento = 0;
          this.categoria = 0;
          this.provincia = 0;
          this.comune = 0;
          this.filterLuoghi();
          return;
        }
      }

      const raggruppamento = GV.globals.CULTURA_CONFIG.filter.raggruppamento
        ? GV.globals.CULTURA_CONFIG.filter.raggruppamento
        : 0;
      console.log(raggruppamento);
      this.raggruppamento = raggruppamento;
      this.categoria = 0;
      this.provincia = 0;
      this.comune = 0;
      this.onChangeRaggruppamento(raggruppamento);
      this.onChangeProvincia(0);

      this.filterLuoghi();

      if (this.flagRaggruppamento) this.showResultsPanel = false;
      const divInfo = document.getElementById('gv-cultura-info');
      if (divInfo) divInfo.remove();

      // GV.globals.CULTURA_LAYERS.forEach((layer) => {
      //   GV.config.removeLayer(layer.name);
      //   layer.filter = () => {
      //     return true;
      //   };
      //   GV.config.addLayerToMap(layer, 0);
      // });
      // this.zoomExtentsMap();
    },

    closeResultPanels() {},
    showInfo() {},
    showResults() {
      if (!GV.globals.CULTURA_CONFIG.flagItinerario && this.noFilter()) {
        return;
      }
      this.filtro = {
        comune: this.comune ? this.comune : null,
        provincia: this.provincia ? this.provincia : null,
        raggruppamento: this.raggruppamento ? this.raggruppamento : null,
        categoria: this.categoria ? this.categoria : null,
        itinerario: this.itinerario ? this.itinerario : null,
      };
      this.showResultsPanel = true;
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

    stampaPDF() {
      let loading = Loading.service({
        fullscreen: true,
        text: 'Preparazione Stampa',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      // let url = `${location.protocol}//${location.hostname}/geoservices/apps/cultura-print/?TYPE=PRINT`;
      let url = `/geoservices/REST/print/cultura/?TYPE=PRINT`;
      if (this.filtro.raggruppamento) url += `&RAGGRUPPAMENTO=${this.filtro.raggruppamento}`;
      if (this.filtro.categoria) url += `&CATEGORIA=${this.filtro.categoria}`;
      if (this.filtro.provincia) url += `&PROVINCIA=${this.filtro.provincia}`;
      if (this.filtro.comune) url += `&COMUNE=${this.filtro.comune}`;
      if (this.filtro.itinerario) url += `&ITINERARIO=${this.filtro.itinerario}`;

      // console.log(url);
      // window.open(url, '_blank');

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          loading.close();
          console.log(data);
          var popup = window.open(
            data.url
            // '',
            // 'menubar=yes,location=no,resizable=no,scrollbars=no,status=no'
          );
          popup.focus();
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(error);
        });
    },
    tableRowClassName() {
      return { cursor: 'pointer', 'background-color': '#c9c8c8' };
    },
    selectRiga(row) {
      GV.app.map.setView([row.geometry.coordinates[1], row.geometry.coordinates[0]], 19);
      const div = document.getElementById('gv-cultura-info');
      if (div) div.remove();
      GV.mount({
        elId: 'gv-cultura-info',
        toggleEl: true,
        template: `<gv-cultura-info :properties="properties" ></gv-cultura-info>`,
        data: {
          properties: row.properties,
        },
      });
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
  margin-left: 3px;
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

.gv-cultura-ricerca-results-result {
  margin-top: 10px;
  /* margin-left: 5px; */
}

.gv-cultura-ricerca-results-pdf-button {
  margin: 5px !important;
  float: right !important;
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
