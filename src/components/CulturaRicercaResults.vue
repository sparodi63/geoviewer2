<template>
  <div
    v-if="visible"
    class="gv-cultura-ricerca-results gv-inverted-color-scheme"
    id="gv-cultura-ricerca-results"
  >
    <div
      v-draggable
      id="gv-cultura-ricerca-results-title"
      class="gv-cultura-ricerca-results-title gv-color-scheme"
    >
      <b>{{ title }}</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
        alt="Chiudi Panello"
      ></el-button>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
        alt="Nascondi Pannello"
      ></button>
      <el-button
        id="gv-cultura-ricerca-results-pdf-button"
        type="info"
        size="mini"
        alt="Stampa PDF"
        @click="stampaPDF"
        >Stampa PDF</el-button
      >
    </div>
    <!-- <div v-bar> -->
    <div class="gv-cultura-ricerca-results-body" id="gv-cultura-ricerca-results-body">
      <div class="gv-cultura-ricerca-results-result">
        <div class="gv-cultura-ricerca-results-table">
          <el-table
            :data="listaLuoghi"
            empty-text="Nessuna luogo trovato"
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
            <!-- <el-table-column prop="properties.INDIRIZZO_FORMAT" align="left" width="200"> -->
            <el-table-column prop="properties.NOMECOMUNE" align="left" width="200">
              <template slot-scope="props">
                <span v-if="!filtro.comune"
                  >{{ props.row.properties.NOMECOMUNE }}
                  <span v-if="!filtro.provincia"
                    >( {{ props.row.properties.SIGLA_PROVINCIA }} )
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import Vue from 'vue';

import { Table } from 'element-ui';
Vue.use(Table);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

import Vuebar from 'vuebar';
Vue.use(Vuebar);

import mountComponent from '../util/mountComponent';

export default {
  name: 'gv-cultura-ricerca-results',
  props: {
    listaLuoghi: Array,
    filtro: Object,
  },
  data() {
    const visible = !GV.globals.CULTURA_CONFIG.embed;
    return {
      flagRicerca: true,
      show: false,
      numProgetti: this.listaLuoghi.length,
      title: `RISULTATO RICERCA`,
      visible: visible,
      showComune: true,
      // indirizzo: this.componiIndirizzo(),
    };
  },
  async mounted() {
    console.log('filtro', this.filtro);
  },
  methods: {
    stampaPDF() {
      let url = `${location.protocol}//${location.hostname}/geoservices/apps/cultura-print/?TYPE=PRINT`;
      if (this.filtro.raggruppamento) url += `&RAGGRUPPAMENTO=${this.filtro.raggruppamento}`;
      if (this.filtro.categoria) url += `&CATEGORIA=${this.filtro.categoria}`;
      if (this.filtro.provincia) url += `&PROVINCIA=${this.filtro.provincia}`;
      if (this.filtro.comune) url += `&COMUNE=${this.filtro.comune}`;
      if (this.filtro.itinerario) url += `&ITINERARIO=${this.filtro.itinerario}`;
      window.open(url, '_blank');
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
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
    handleClickScuola(index, codice_scuola) {
      mountComponent({
        elId: 'gv-cultura-info',
        clear: true,
        vm: new Vue({
          template: `<gv-cultura-info :id="id" title="INFO SCUOLA" :flagRicerca="flagRicerca"></gv-cultura-info>`,
          data: {
            id: codice_scuola,
            flagRicerca: false,
          },
        }),
      });
    },
    closePanel: function () {
      let div = document.getElementById('gv-cultura-ricerca-results');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.eventBus.$emit('cultura-close-panel', {
        flagRicerca: this.flagRicerca,
      });
    },
    hidePanel: function (event) {
      if (this.show) {
        document.getElementById('gv-cultura-ricerca-results-body').style.display = 'block';
        document.getElementById('gv-cultura-ricerca-results').style.width = '480px';
        document.getElementById('gv-cultura-ricerca-results-pdf-button').style.display = 'block';
      } else {
        document.getElementById('gv-cultura-ricerca-results-body').style.display = 'none';
        document.getElementById('gv-cultura-ricerca-results').style.width = '200px';
        document.getElementById('gv-cultura-ricerca-results-pdf-button').style.display = 'none';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-cultura-ricerca-results-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-cultura-ricerca-results-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style scoped>
.gv-cultura-ricerca-results {
  position: absolute;
  left: 0;
  top: 0;
  width: 480px;
  margin-left: 10px;
  margin-top: 260px;
  z-index: 800;
}

.gv-cultura-ricerca-results-title {
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

.gv-cultura-ricerca-results-title a {
  margin-left: 540px;
  font-size: 15px;
  color: black;
  font-weight: 900;
}

.gv-cultura-ricerca-results-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-cultura-ricerca-results-body {
  /* margin: 10px; */
  /* overflow: auto;
  max-height: 300px;   */
}

.gv-cultura-ricerca-results-result {
  margin-top: 10px;
  margin-left: 5px;
}

#gv-cultura-ricerca-results-pdf-button {
  float: right;
}

.gv-cultura-ricerca-results-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  background-color: #5b565c !important;
  color: #ddd;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: 800;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
}
</style>

<style>
.el-table td {
  vertical-align: top !important;
}
.el-table__expanded-cell {
  background-color: #ccc;
  padding-left: 70px !important;
}
</style>
