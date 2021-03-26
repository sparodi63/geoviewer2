<template>
  <div
    class="gv-scuoladigitale-ricerca-results gv-inverted-color-scheme"
    id="gv-scuoladigitale-ricerca-results"
  >
    <div
      v-draggable
      id="gv-scuoladigitale-ricerca-results-title"
      class="gv-scuoladigitale-ricerca-results-title gv-color-scheme"
    >
      <b>RISULTATI RICERCA</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
      ></el-button>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>
    <div class="gv-scuoladigitale-ricerca-results-body" id="gv-scuoladigitale-ricerca-results-body">
      <div class="gv-scuoladigitale-ricerca-results-result">
        <div class="gv-scuoladigitale-ricerca-results-table">
          <el-table
            :data="listaProgetti"
            empty-text="Nessuna progetto trovato"
            style="font-size: 12px !important;"
            class="gv-inverted-color-scheme"
            height="300"
            size="mini"
            @current-change="selectRiga"
          >
            <el-table-column label="Anno" align="left" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.anno }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Nome Istituto" align="left" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.nome_istituto }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Ordine" align="left" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.ordine }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Titolo progetto" align="left" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.titolo_progetto }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Abstract" align="left" width="400">
              <template slot-scope="scope">
                <span>{{ scope.row.abstract }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.link_documentazione" title="link alla documentazione">
                  <el-button
                    size="mini"
                    style="width:20px;padding-left:5px;"
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

import { Table } from 'element-ui';
Vue.use(Table);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

import notification from '../util/notification';

export default {
  name: 'gv-scuoladigitale-ricerca-results',
  props: {
    listaProgetti: Array,
  },
  data() {
    return {
      flagRicerca: true,
      show: false,
    };
  },
  async mounted() {},
  methods: {
    selectRiga(row) {
      // console.log(row);
    },
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
    closePanel: function() {
      let div = document.getElementById('gv-scuoladigitale-ricerca-results');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.eventBus.$emit('scuoladigitale-close-panel', {
        flagRicerca: this.flagRicerca,
      });
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-ricerca-results-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-ricerca-results').style.width = '900px';
      } else {
        document.getElementById('gv-scuoladigitale-ricerca-results-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-ricerca-results').style.width = '190px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-scuoladigitale-ricerca-results-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-ricerca-results-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-ricerca-results {
  position: absolute;
  left: 0;
  top: 0;
  width: 900px;
  margin-left: 20px;
  margin-top: 190px;
  z-index: 800;
}

.gv-scuoladigitale-ricerca-results-title {
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

.gv-scuoladigitale-ricerca-results-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-scuoladigitale-ricerca-results-body {
  margin: 10px;
}

.gv-scuoladigitale-ricerca-results-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-scuoladigitale-ricerca-results-collapse {
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
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: bold;
  color: #ffffff;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
  opacity: 0.5;
}
</style>

<style>
.el-table td {
  vertical-align: top !important;
}
</style>
