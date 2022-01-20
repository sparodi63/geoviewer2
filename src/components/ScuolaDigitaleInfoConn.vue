<template>
  <div class="gv-scuoladigitale-info-conn gv-inverted-color-scheme" id="gv-scuoladigitale-info-conn">
    <div
      v-draggable
      id="gv-scuoladigitale-info-conn-title"
      class="gv-scuoladigitale-info-conn-title gv-color-scheme"
    >
      <b>Risultato Info</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
      ></el-button>
      <!-- <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button> -->
    </div>
    <div class="gv-scuoladigitale-info-conn-body" id="gv-scuoladigitale-info-conn-body">
      <div class="gv-scuoladigitale-info-conn-result">
        <div class="gv-scuoladigitale-info-conn-scuola">
              <TABLE width="92%">
                  <TBODY>
                    <TR>
                      <TD class="fogliaL">Istituto</TD>
                      <TD class="foglia">{{ properties.ISTITUTO }}</TD>
                    </TR>
                    <TR>
                      <TD class="fogliaL">Indirizzo</TD>
                      <TD class="foglia">{{ properties.INDIRIZZO }} - {{ properties.CAP }} - {{ properties.COMUNE }}</TD>
                    </TR>
                    <TR>
                      <TD class="fogliaL">Telefono</TD>
                      <TD class="foglia">{{ properties.TELEFONO }}</TD>
                    </TR>
                    <TR>
                      <TD class="fogliaL">Sede</TD>
                      <TD class="foglia">
                          {{ tipoSede }}
                      </TD>
                    </TR>
                    <TR>
                      <TD class="fogliaL">Connessione</TD>
                      <TD class="foglia">
                          <A v-bind:href="tipoConnURL" target="_blank">
                            <B>Connettività {{ tipoConn }}</B>
                          </A>                        
                      </TD>
                    </TR>
                  </TBODY>
               </TABLE>
        </div>
      </div>
    </div>  </div>
</template>

<script>
import Vue from 'vue';

import { Table } from 'element-ui';
Vue.use(Table);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-scuoladigitale-info-conn',
  props: {
    properties: Object,
  },
  data() {
    return {
      nome: null,
      indirizzo: null,
      sito: null,
      show: false,
    };
  },
  mounted() {
    console.log(this.properties)
  },
  beforeCreate() {
      let div = document.getElementById('gv-scuoladigitale-info-conn');
      if (!div) return;
      div.parentNode.removeChild(div);
  },
  computed: {
    tipoSede() {
      return this.properties.TIPO_SEDE === '1' ? 'Sede distaccata o succursale': 'Sede Amministrativa';
    },
    tipoConn() {
      let tipoConn 
      switch (this.properties.TIPO_CONNES) {
        case '1':
          tipoConn = 'FTTH'
          break;
        case '2':
          tipoConn = 'FTTC'
          break;
        case '3':
          tipoConn = 'ADSL'
          break;
        case '4':
          tipoConn = 'FWA'
          break;
        case '5':
          tipoConn = 'RTG / Senza copertura'
          break;
      }      
      return tipoConn;
    },
    tipoConnURL() {
      let tipoConn 
      switch (this.properties.TIPO_CONNES) {
        case '1':
          tipoConn = 'FTTH'
          break;
        case '2':
          tipoConn = 'FTTC'
          break;
        case '3':
          tipoConn = 'ADSL'
          break;
        case '4':
          tipoConn = 'FWA'
          break;
        case '5':
          tipoConn = 'RTG'
          break;
      }      
      return `https://srvcarto.regione.liguria.it/dtuff/img/Istituti_scolastici_connettivita/${tipoConn}.pdf`;
    },
  },
  methods: {
    closePanel: function() {
      let div = document.getElementById('gv-scuoladigitale-info-conn');
      if (!div) return;
      div.parentNode.removeChild(div);
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-info-conn-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-info-conn').style.width = '800px';
      } else {
        document.getElementById('gv-scuoladigitale-info-conn-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-info-conn').style.width = '200px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-scuoladigitale-info-conn-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-info-conn-collapse gv-color-scheme el-icon-arrow-up';
    },
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-info-conn {
  position: absolute;
  left: 0;
  top: 0;
  width: 450px;
  margin-left: 10px;
  margin-top: 160px;
  z-index: 800;
}

.gv-scuoladigitale-info-conn-title {
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

.gv-scuoladigitale-info-conn-title a {
  margin-left: 420px;
  font-size: 15px;
  color: black;
  font-weight: 900;
}

.gv-scuoladigitale-info-conn-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

/* .gv-scuoladigitale-info-conn-body {
  margin: 10px;
} */

.gv-scuoladigitale-info-conn-scuola {
  margin: 10px;
}

.gv-scuoladigitale-info-conn-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-scuoladigitale-info-conn-collapse {
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
  background-color: #e94e1b !important;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: 800;
  color: black;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
}

span {
  margin-right: 20px;
}

.fogliaL {
  width: 100px;
  font-weight: 800;
}
.foglia {
  font-weight: 400;
}
</style>

<style>
.el-table td {
  vertical-align: top !important;
}
</style>
