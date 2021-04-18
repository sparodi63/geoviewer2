<template>
  <div id="gv-scuoladigitale-legend" class="gv-inverted-color-scheme">
    <div id="gv-scuoladigitale-legend-title" class="gv-scuoladigitale-legend-title gv-color-scheme">
      {{ title }}
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hideLegend"
        title="Nascondi Legenda"
      ></button>
    </div>
    <div id="gv-scuoladigitale-legend-wrapper" class="gv-scuoladigitale-legend-wrapper">
      <div>
        <div id="gv-scuoladigitale-legend-body" class="gv-inverted-color-scheme">
          <gv-legend-maps :options="options"></gv-legend-maps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
'use strict';
import Vue from 'vue';

import LegendMaps from './LegendMaps.vue';
Vue.component('gv-legend-maps', LegendMaps);

import { Select, Option, Button, Table, TableColumn } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);

import mountComponent from '../util/mountComponent';

Vue.component('gv-scuoladigitale-ricerca', () => import('./ScuolaDigitaleRicerca.vue'));

export default {
  name: 'gv-scuoladigitale-legend',
  data() {
    return {
      options: GV.config.getToolOptions('gv-scuoladigitale-legend'),
      maps: GV.config.maps,
      show: true,
      tema: 0,
      title: 'LEGENDA ICONE',
    };
  },
  mounted() {
    GV.log('gv-scuoladigitale-legend: mounted');
    GV.legend = this;
    this.changeMap(0);
    this.show = false;
    if (this.options.version === 2) {
      this.hideLegend();
      mountComponent({
        elId: 'gv-scuoladigitale-ricerca',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-scuoladigitale-ricerca></gv-scuoladigitale-ricerca>`,
        }),
      });
    }
  },
  methods: {
    changeMap(value) {
      if (GV.config.maps[0]) {
        GV.config.removeMap(GV.config.maps[0].id);
      }
      GV.config.addMapConfig(this.options.maps[value]);
    },
    showSearch() {
      mountComponent({
        elId: 'gv-scuoladigitale-ricerca',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-scuoladigitale-ricerca></gv-scuoladigitale-ricerca>`,
        }),
      });
    },
    hideLegend: function(event) {
      if (this.show) {
        document.getElementById('gv-scuoladigitale-legend-wrapper').style.display = 'block';
        document.getElementById('gv-scuoladigitale-legend').style.width = '260px';
      } else {
        document.getElementById('gv-scuoladigitale-legend-wrapper').style.display = 'none';
        document.getElementById('gv-scuoladigitale-legend').style.width = '150px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      console.log('legend', this.show);
      return this.show
        ? 'gv-scuoladigitale-legend-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-scuoladigitale-legend-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style>
#gv-scuoladigitale-legend {
  position: relative;
  float: right;
  right: 0;
  top: 0;
  margin-right: 10px;
  margin-top: 10px;
  width: 260px;
  z-index: 800;
  max-height: 430px;
}

.gv-scuoladigitale-legend-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-scuoladigitale-legend-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-scuoladigitale-legend-title {
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

.gv-scuoladigitale-legend-title-collapsed {
  height: 18px;
  padding-top: 0.1rem;
  padding-bottom: 0.3rem;
  padding-right: 0rem;
  padding-left: 0.5rem;
  margin-bottom: -1px;
  color: #ccc;
  cursor: default;
  font-weight: bold;
  font-family: 'Raleway', Arial, sans-serif !important;
  font-size: 14px;
}

.gv-scuoladigitale-legend-title span {
  font-size: 14px;
  font-weight: bold;
}

.gv-scuoladigitale-legend-close {
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  background-color: #24386c !important;
  color: #ccc !important;
  opacity: 1;
}

.gv-scuoladigitale-legend-buttons {
  padding-top: 3px;
  padding-right: 10px;
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  line-height: 1;
  font-size: 14px !important;
}

.gv-scuoladigitale-legend-footer {
  display: block;
  padding: 0.3rem 0.5rem;
  margin-bottom: -1px;
  cursor: default;
}

#gv-scuoladigitale-legend-body {
  width: 260px;
  max-height: 400px;
  cursor: default;
  overflow: hidden;
}

@media (max-height: 500px) {
  #gv-scuoladigitale-legend-body {
    overflow-y: scroll;
    max-height: 200px;
  }
}

#gv-scuoladigitale-legend-combo {
  padding: 5px;
}
#gv-scuoladigitale-legend-wrapper {
  display: block;
}

.el-input__suffix {
  right: 25px;
  transition: all 0.3s;
  pointer-events: none;
  color: #24386c;
}
.el-table .cell {
  word-break: normal !important;
  line-height: 15px !important;
}
</style>
