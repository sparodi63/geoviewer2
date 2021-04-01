<template>
  <div class="gv-scuoladigitale-info gv-inverted-color-scheme" id="gv-scuoladigitale-info">
    <div
      v-draggable
      id="gv-scuoladigitale-info-title"
      class="gv-scuoladigitale-info-title gv-color-scheme"
    >
      <b>{{ title }}</b>
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
    <div class="gv-scuoladigitale-info-body" id="gv-scuoladigitale-info-body">
      <div class="gv-scuoladigitale-info-result">
        <div class="gv-scuoladigitale-info-scuola">
          <div>
            <span
              ><b>{{ nome }}</b></span
            >
            <span>{{ indirizzo }}</span>
          </div>
          <span v-if="sito"><a :href="sito" target="_black">Sito scuola</a></span>
        </div>
        <div class="gv-scuoladigitale-info-table">
          <el-table
            :data="progetti"
            empty-text="Nessuna risultato trovato"
            style="font-size: 12px !important;"
            class="gv-inverted-color-scheme"
            height="300"
            size="mini"
          >
            <el-table-column label="Anno" align="left" width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.anno }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Titolo progetto" align="left" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.titolo_progetto }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Abstract" align="left" width="390">
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

export default {
  name: 'gv-scuoladigitale-info',
  props: {
    id: String,
    title: String,
    flagRicerca: Boolean,
  },
  data() {
    return {
      nome: null,
      indirizzo: null,
      sito: null,
      progetti: [],
      show: false,
    };
  },
  async mounted() {
    const result = await axios.get(`/geoservices/REST/scuola/info/${this.id}`);
    if (result.data.data) {
      const scuola = await result.data.data.scuola;
      if (scuola) {
        this.nome = await scuola.NOME;
        this.indirizzo = await scuola.INDIRIZZO;
        this.sito = await scuola.SITO_WEB;
        this.progetti = await result.data.data.progetti;
      } else {
        // notification
      }
    }
  },
  methods: {
    closePanel: function() {
      let div = document.getElementById('gv-scuoladigitale-info');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.eventBus.$emit('scuoladigitale-close-panel', {
        flagRicerca: this.flagRicerca,
      });
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-info-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-info').style.width = '690px';
      } else {
        document.getElementById('gv-scuoladigitale-info-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-info').style.width = '200px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-scuoladigitale-info-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-info-collapse gv-color-scheme el-icon-arrow-up';
    },
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-info {
  position: absolute;
  left: 0;
  top: 0;
  width: 690px;
  margin-left: 20px;
  margin-top: 190px;
  z-index: 800;
}

.gv-scuoladigitale-info-title {
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

.gv-scuoladigitale-info-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-scuoladigitale-info-body {
  margin: 10px;
}

.gv-scuoladigitale-info-scuola {
  margin: 10px;
}

.gv-scuoladigitale-info-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-scuoladigitale-info-collapse {
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

span {
  margin-right: 20px;
}
</style>

<style>
.el-table td {
  vertical-align: top !important;
}
</style>
