<template>
  <div class="gv-scuoladigitale-ricerca-conn gv-inverted-color-scheme" id="gv-scuoladigitale-ricerca-conn">
    <div
      v-draggable
      id="gv-scuoladigitale-ricerca-conn-title"
      class="gv-scuoladigitale-ricerca-conn-title gv-color-scheme"
    >
      <b>RICERCHE</b>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button>
    </div>

    <div class="gv-scuoladigitale-ricerca-conn-body" id="gv-scuoladigitale-ricerca-conn-body">
      <div id="gv-scuoladigitale-ricerca-indirizzo">
        <gv-geocoder></gv-geocoder>
      </div>

      <div id="gv-scuoladigitale-ricerca-conn-scuola">
        <el-select
          id="gv-seach-input"
          v-model="scuola"
          filterable
          clearable
          remote
          size="mini"
          placeholder="Ricerca Scuola..."
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

Vue.component('gv-scuoladigitale-ricerca-conn-results', () =>
  import(/* webpackChunkName: "ScuolaDigitaleRicercaResults" */ './ScuolaDigitaleRicercaResults')
);
Vue.component('gv-scuoladigitale-info', () =>
  import(/* webpackChunkName: "ScuolaDigitaleRicercaResults" */ './ScuolaDigitaleInfo')
);

export default {
  name: 'gv-scuoladigitale-ricerca-conn',
  data() {
    return {
      tipi: [
        { id: 'scuola', label: 'Ricerca per nome scuola' },
        { id: 'temi', label: 'Ricerca per parole chiave' },
      ],
      tipo: 'scuola',
      ordini: [],
      scuole: [],
      layers: ['RTG', 'FWA', 'ADSL', 'FTTC', 'FTTH'],
      propertyName: 'ISTITUTO',
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
  mounted() {
  },
  methods: {
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
                  const value = m.feature.properties.ID;
                  console.log(label,value)
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
      const scuola = this.results.filter( result => {
        return result.value === value
      })
      if (scuola.length > 0) {
        let zoom = GV.app.map.getZoom()
        if (zoom < 17) zoom = 17
        GV.app.map.setView([scuola[0].location.lat, scuola[0].location.lng], zoom);
      }
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-ricerca-conn-body').style.display = 'block';
        document.getElementById('gv-scuoladigitale-ricerca-conn').style.width = '280px';
      } else {
        document.getElementById('gv-scuoladigitale-ricerca-conn-body').style.display = 'none';
        document.getElementById('gv-scuoladigitale-ricerca-conn').style.width = '190px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-scuoladigitale-ricerca-conn-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-ricerca-conn-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style scoped>
.gv-scuoladigitale-ricerca-conn {
  position: absolute;
  left: 0;
  top: 0;
  width: 280px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-scuoladigitale-ricerca-conn-title {
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

.gv-scuoladigitale-ricerca-conn-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-scuoladigitale-ricerca-conn-body {
  margin: 10px;
}

.gv-scuoladigitale-ricerca-conn-label {
  display: inline-block;
  width: 150px;
}

.gv-scuoladigitale-ricerca-conn-buttons {
  margin-top: 10px;
  margin-left: 5px;
}
.gv-scuoladigitale-ricerca-conn-result {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-scuoladigitale-ricerca-conn-collapse {
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
