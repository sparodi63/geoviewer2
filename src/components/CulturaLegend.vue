<template>
  <div id="gv-cultura-legend" class="gv-inverted-color-scheme">
    <div id="gv-cultura-legend-title" class="gv-cultura-legend-title gv-color-scheme">
      {{ title }}
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hideLegend"
        title="Nascondi Legenda"
      ></button>
    </div>
    <div id="gv-cultura-legend-wrapper" class="gv-cultura-legend-wrapper">
      <div>
        <div id="gv-cultura-legend-body" class="gv-inverted-color-scheme">
          <gv-cultura-legend-maps :options="options"></gv-cultura-legend-maps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
'use strict';
import Vue from 'vue';

import LegendMaps from './LegendMaps.vue';
Vue.component('gv-cultura-legend-maps', LegendMaps);

import { Select, Option, Button, Table, TableColumn } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);

import mountComponent from '../util/mountComponent';
import loadComponent from '../util/loadComponent';

Vue.component('gv-cultura-ricerca', () => import('./CulturaRicerca.vue'));

export default {
  name: 'gv-cultura-legend',
  data() {
    const options = GV.config.getToolOptions('gv-cultura-legend')

    return {
      options: options,
      maps: GV.config.maps,
      show: true,
      tema: 0,
      title: 'LEGENDA',
    };
  },
  async mounted() {
    GV.log('gv-cultura-legend: mounted');
    GV.legend = this;
    GV.config.addMapConfig(this.options.maps[0]);
    this.show = false;
    this.hideLegend();
    mountComponent({
      elId: 'gv-cultura-ricerca',
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-cultura-ricerca></gv-cultura-ricerca>`,
      }),
    });
  },
  methods: {
    hideLegend: function(event) {
      if (this.show) {
        // document.getElementById('gv-cultura-legend-title').style.display = 'block';
        // document.getElementById('gv-cultura-legend-title-collapsed').style.display = 'none';
        document.getElementById('gv-cultura-legend-wrapper').style.display = 'block';
        document.getElementById('gv-cultura-legend').style.width = '260px';
      } else {
        // document.getElementById('gv-cultura-legend-title').style.display = 'none';
        // document.getElementById('gv-cultura-legend-title-collapsed').style.display = 'block';
        document.getElementById('gv-cultura-legend-wrapper').style.display = 'none';
        document.getElementById('gv-cultura-legend').style.width = '100px';
      }
      this.show = !this.show;
    },    
    toggleCollapseClass() {
      return this.show
        ? 'gv-cultura-legend-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-cultura-legend-collapse gv-color-scheme el-icon-arrow-up';
    },
  },
};
</script>

<style>
#gv-cultura-legend {
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

.gv-cultura-legend-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-cultura-legend-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-cultura-legend-title {
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

.gv-cultura-legend-title-collapsed {
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

.gv-cultura-legend-title span {
  font-size: 14px;
  font-weight: bold;
}

.gv-cultura-legend-close {
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

.gv-cultura-legend-buttons {
  padding-top: 3px;
  padding-right: 10px;
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  line-height: 1;
  font-size: 14px !important;
}

.gv-cultura-legend-footer {
  display: block;
  padding: 0.3rem 0.5rem;
  margin-bottom: -1px;
  cursor: default;
}

#gv-cultura-legend-body {
  width: 260px;
  max-height: 400px;
  cursor: default;
  overflow: hidden;
}

@media (max-height: 500px) {
  #gv-cultura-legend-body {
    overflow-y: scroll;
    max-height: 200px;
  }
}

#gv-cultura-legend-combo {
  padding: 5px;
}
#gv-cultura-legend-wrapper {
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
