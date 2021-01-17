<template>
  <div id="gv-legend" class="gv-inverted-color-scheme">
    <div id="gv-legend-title" class="gv-legend-title gv-color-scheme">
      <b>LEGENDA</b>
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hideLegend"
        title="Nascondi Legenda"
      ></button>
      <el-button
        id="gv-legend-add-map"
        title="Aggiungi Mappe"
        v-show="options.showAddMap"
        @click="addMap"
        class="gv-color-scheme gv-legend-buttons ms ms-layers-add"
        size="mini"
      />
      <el-button
        id="gv-legend-add-map"
        title="Download Mappe"
        v-show="options.showDownloadTotale"
        @click="downloadMaps"
        class="gv-color-scheme gv-legend-buttons el-icon-download"
        size="mini"
      />
    </div>
    <div id="gv-legend-title-collapsed" class="gv-legend-title-collapsed gv-color-scheme">
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hideLegend"
        title="Mostra Legenda"
      ></button>
    </div>
    <div id="gv-legend-wrapper" class="gv-legend-wrapper">
      <!-- <div class="gv-legend-title gv-color-scheme">
            <el-button id="gv-legend-add-map" title="Aggiungi Mappe" v-show="options.showAddMap" @click="addMap" class="gv-color-scheme ms ms-layers-add" size="mini" />
      </div>-->
      <div v-bar>
        <div id="gv-legend-body">
          <!-- MAPPE -->
          <ul v-for="map in maps" class="gv-list-group" :key="map.id">
            <div class="gv-list-legend-map-item gv-inverted-color-scheme">
              <li>{{ map.name }}</li>
              <div class="gv-legend-map-tools gv-inverted-color-scheme">
                <el-button
                  title="Mostra/Nascondi Livelli in Legenda"
                  @click="toggleLayers(map)"
                  :class="getToggleLayersClass(map)"
                  size="mini"
                ></el-button>
                <el-button
                  :id="'gv-legend-scheda-' + map.id"
                  title="Visualizza Scheda"
                  v-if="checkAddMap(map)"
                  @click="showMapInfoPanel(map)"
                  class="gv-inverted-color-scheme gv-legend-map-tools-button"
                  icon="el-icon-document"
                  size="mini"
                ></el-button>
                <el-button
                  :id="'gv-legend-delete-' + map.id"
                  title="Elimina Mappa"
                  v-if="!options.noDeleteButton"
                  @click="remove(map)"
                  class="gv-inverted-color-scheme gv-legend-map-tools-button"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
                <el-button
                  :id="'gv-legend-transparency-' + map.id"
                  title="Trasparenza Livelli"
                  v-if="options.showLayersTransparency"
                  @click="layerTransparency(map)"
                  class="gv-inverted-color-scheme gv-legend-map-tools-button fa fa-sliders"
                  size="mini"
                ></el-button>
                <el-button
                  :id="'gv-legend-download-' + map.id"
                  title="Download Mappa"
                  v-if="isDownloadable(map)"
                  @click="download(map)"
                  class="gv-inverted-color-scheme gv-legend-map-tools-button"
                  icon="el-icon-download"
                  size="mini"
                ></el-button>
              </div>
            </div>
            <!-- LIVELLI -->
            <div v-show="showMapLayers(map)">
              <el-table
                :data="map.layers"
                :show-header="false"
                size="mini"
                empty-text=" "
                :row-class-name="layerClassName"
                style="width: 100%;line-height: 23px;"
              >
                <el-table-column align="center" width="30">
                  <template slot-scope="scope">
                    <img :src="iconUrl(scope.row)" width="20" @click="showLegendPanel(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column align="center" width="25">
                  <template slot-scope="scope">
                    <span>
                      <input
                        type="checkbox"
                        class="gv-layer-visibility-cb"
                        v-model="scope.row.visible"
                        @click="setLayerVisible(scope.row)"
                      />
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column style="word-break: normal;" property="legend.label"> -->
                <el-table-column style="word-break: normal;">
                  <template slot-scope="scope">
                    <el-popover
                      trigger="hover"
                      placement="left-start"
                      v-show="!scope.row.inRange"
                      offset="10"
                      popper-class="gv-layer-popover"
                    >
                      <p>{{ scope.row.scaleRangeLabel }}</p>
                      <div class="gv-legend-popover-button">
                        <el-button
                          title="Ricerca sul livello"
                          @click="layerSearch(scope.row)"
                          class="gv-color-scheme gv-legend-map-tools-button"
                          icon="el-icon-search"
                          size="mini"
                          v-show="options.layerPopover && options.layerPopover.find"
                        ></el-button>
                      </div>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.legend.label }}
                      </div>
                    </el-popover>
                    <el-popover
                      trigger="hover"
                      popper-class="popover-scala"
                      placement="left-start"
                      v-show="options.layerPopover && scope.row.inRange"
                      width="150"
                      offset="15"
                    >
                      <div class="gv-legend-transparency-layer-slider">
                        <el-slider
                          @change="setLayerTransparency(scope.row)"
                          v-model="scope.row.opacityBase100"
                        ></el-slider>
                      </div>
                      <el-row class="row-bg gv-legend-popover-buttons" type="flex" justify="left">
                        <div class="gv-legend-popover-button">
                          <el-button
                            title="Ricerca sul livello"
                            @click="layerSearch(scope.row)"
                            class="gv-color-scheme gv-legend-map-tools-button"
                            icon="el-icon-search"
                            size="mini"
                            v-show="options.layerPopover && options.layerPopover.find"
                          ></el-button>
                        </div>
                        <div class="gv-legend-popover-button">
                          <input
                            type="checkbox"
                            class="gv-layer-visibility-cb"
                            v-model="scope.row.visible"
                            @click="setLayerVisible(scope.row)"
                            v-show="options.layerPopover && options.layerPopover.visibility"
                          />
                        </div>
                      </el-row>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.legend.label }}
                      </div>
                    </el-popover>
                    <div
                      slot="reference"
                      class="name-wrapper"
                      v-show="!options.layerPopover && scope.row.inRange"
                    >
                      {{ scope.row.legend.label }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ul>
        </div>
      </div>
      <div class="gv-legend-footer gv-inverted-color-scheme">
        <gv-base-layer-switcher
          ref="gv-base-layer-switcher"
          v-if="options.showBaseLayerSwitcher"
        ></gv-base-layer-switcher>
      </div>
    </div>
  </div>
</template>

<script>
'use strict';
import Vue from 'vue';
import mountComponent from '../util/mountComponent';

import BaseLayerSwitcher from './BaseLayerSwitcher.vue';
Vue.component('gv-base-layer-switcher', BaseLayerSwitcher);

Vue.component('gv-map-info-panel', () => import('./MapInfoPanel.vue'));
Vue.component('gv-multi-legend-panel', () => import('./MultiLegendPanel.vue'));
Vue.component('gv-map-catalog-panel', () => import('./MapCatalogPanel.vue'));
Vue.component('gv-layers-transparency', () => import('./LayersTransparency.vue'));
Vue.component('gv-map-download', () => import('./Download.vue'));
Vue.component('gv-layer-search-legend', () => import('./LayerSearchLegend.vue'));

import { Select, Option, Button, Table, TableColumn, Popover, Slider, Row, Col } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Slider);
Vue.use(Row);
Vue.use(Col);

import Vuebar from 'vuebar';
Vue.use(Vuebar);

export default {
  name: 'gv-legend',
  data() {
    return {
      baseLayers: GV.config.baseLayers,
      maps: GV.config.maps,
      options: GV.config.application.layout.legend.options,
      show: true,
    };
  },
  mounted() {
    GV.log('gv-legend: mounted');
    GV.legend = this;
    if (this.options.showAddMap) {
      let showMapCatalogPanel = GV.config.idMap || GV.config.agAppMap ? false : true;
      if (this.options.showMapCatalogPanelOnStart) showMapCatalogPanel = true;
      if (this.options.dontShowMapCatalogPanelOnStart) showMapCatalogPanel = false;
      GV.config.loadCatalog({
        showMapCatalogPanel: showMapCatalogPanel,
        filterDownloadCatalog: this.options.filterDownloadCatalog,
      });
    }
    if (this.options.showDownloadPanelOnLoad && GV.config.idMap) {
      GV.eventBus.$on('gv-config-init', config => {
        this.openDownloadPanel(GV.config.idMap);
      });
    }
    if (this.options.collapsed || window.matchMedia('(max-width: 500px)').matches) {
      this.show = false;
    }
    this.hideLegend();
  },
  methods: {
    showMapLayers(map) {
      return map.showLayersInLegend;
    },
    toggleLayers(map) {
      map.showLayersInLegend = !map.showLayersInLegend;
    },
    hideLegend: function(event) {
      if (this.show) {
        document.getElementById('gv-legend-title').style.display = 'block';
        document.getElementById('gv-legend-title-collapsed').style.display = 'none';
        document.getElementById('gv-legend-wrapper').style.display = 'block';
        document.getElementById('gv-legend').style.width = '260px';
      } else {
        document.getElementById('gv-legend-title').style.display = 'none';
        document.getElementById('gv-legend-title-collapsed').style.display = 'block';
        document.getElementById('gv-legend-wrapper').style.display = 'none';
        document.getElementById('gv-legend').style.width = '26px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-legend-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-legend-collapse gv-color-scheme el-icon-arrow-up';
    },
    getToggleLayersClass(map) {
      return map.showLayersInLegend
        ? 'gv-inverted-color-scheme gv-legend-map-tools-button el-icon-arrow-up'
        : 'gv-inverted-color-scheme gv-legend-map-tools-button el-icon-arrow-down';
    },
    isDownloadable(map) {
      // debugger;
      if (this.options.noDownloadButton) return false;
      if (GV.globals.RL_CATALOG === 'pub' && map.flagDownload) return true;
      if (GV.globals.RL_CATALOG === 'int' && (map.flagDownloadExtranet || map.flagDownload))
        return true;
      // if (map && map.metaData) {
      //   return map.metaData.flag_download;
      // } else {
      //   return false;
      // }
      return false;
    },
    checkAddMap(map) {
      return this.options.showAddMap && GV.config.getMapConfig(map.id).metaData;
    },
    showMapInfoPanel: function(map) {
      GV.config.schedaInfoCartografia = GV.config.getMapConfig(map.id).metaData;
      const downloadable = this.isDownloadable(map);
      mountComponent({
        elId: 'gv-map-info-panel',
        containerId: GV.config.containerId,
        clear: true,
        vm: new Vue({
          template: `<gv-map-info-panel visible="true" idMap="${map.id}" downloadable="${downloadable}"></gv-map-info-panel>`,
        }),
      });
    },
    remove: function(map) {
      GV.config.removeMap(map.id);
    },
    download(map) {
      this.openDownloadPanel(map.id);
    },
    openDownloadPanel(idMap) {
      if (document.getElementById('gv-map-download')) {
        const element = document.getElementById('gv-map-download');
        element.parentNode.removeChild(element);
      }
      const closeWindow = this.options.downloadPanelCloseMode === 'closeWindow';
      mountComponent({
        elId: 'gv-map-download',
        containerId: GV.config.containerId,
        toggleEl: false,
        vm: new Vue({
          template: `<gv-map-download idMap="${idMap}" closeWindow="${closeWindow}"></gv-map-download>`,
        }),
      });
    },
    addMap: function() {
      mountComponent({
        elId: 'gv-map-catalog-panel',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-map-catalog-panel></gv-map-catalog-panel>`,
        }),
      });
    },
    downloadMaps: function() {
      mountComponent({
        elId: 'gv-download-totale-panel',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-download-totale-panel></gv-download-totale-panel>`,
        }),
      });
    },

    layerTransparency: function(map) {
      mountComponent({
        elId: 'gv-layers-transparency',
        containerId: GV.config.containerId,
        toggleEl: false,
        vm: new Vue({
          template: `<gv-layers-transparency idMap="${map.id}"></gv-layers-transparency>`,
        }),
      });
    },
    iconUrl: function(layer) {
      return layer.legend.icon;
    },
    getClass: function(layer) {
      return layer.inRange
        ? 'gv-list-legend-layer-item'
        : 'gv-list-legend-layer-item gv-list-legend-layer-disabled-item';
    },
    layerClassName({ row, rowIndex }) {
      return row.inRange
        ? 'gv-list-legend-layer-item'
        : 'gv-list-legend-layer-item gv-list-legend-layer-disabled-item';
    },
    setLayerVisible: function(layer) {
      GV.eventBus.$emit('set-layer-visible', {
        layer: layer,
        checked: !layer.visible,
      });
      const opacity = layer['opacityBase100'] / 100;
      GV.eventBus.$emit('set-layer-transparency', {
        layerName: layer.name,
        opacity: opacity,
      });
    },
    setLayerTransparency(layer) {
      const opacity = layer['opacityBase100'] / 100;
      GV.eventBus.$emit('set-layer-transparency', {
        layerName: layer.name,
        opacity: opacity,
      });
    },
    layerSearch(layer) {
      mountComponent({
        elId: 'gv-layer-search-legend',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-layer-search-legend layerId=${layer.id}></gv-layer-search-legend>`,
        }),
      });
    },
    showLegendPanel: function(layer) {
      if (layer.inRange && (layer.multiClasse || layer.flagRemote || layer.legend.popUpFlag)) {
        var url = null,
          html = null,
          width,
          height;
        if (layer.legend.popUpUrl && layer.legend.popUpFlag) {
          // se impostato attributo legendPopupUrl apro una finestra con il documento
          url = `${GV.globals.DEFAULT_PROXY}${layer.legend.popUpUrl}`;
          width = window.matchMedia('(max-width: 450px)').matches
            ? 300
            : layer.legend.popUpWidth || 600;
          height = window.matchMedia('(max-height: 620px)').matches
            ? 400
            : layer.legend.popUpHeight || 600;
        } else if (layer.multiClasse) {
          // se livello multiclasse apro una finestra con la legenda dei livelli multiclasse
          if (layer.flagGeoserver || layer.flagRemote) {
            url = `${GV.globals.DEFAULT_PROXY}${layer.wmsParams.url}LAYER=${layer.name}&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&`;
            width = window.matchMedia('(max-width: 450px)').matches ? 300 : 400;
            height = 350;
          } else {
            var classes = layer.classes;
            html = '<table width=100% border=0>';
            classes.forEach(function(cls) {
              html += '<tr>';
              html += '<td width=30><img src="' + cls.legendIcon + '"></td>';
              html += '<td >' + cls.legendLabel + '</td>';
              html += '</tr>';
            });
            html += '</table>';
          }
        } else if (layer.flagRemote) {
          url = `${GV.globals.DEFAULT_PROXY}${layer.wmsParams.url}LAYER=${layer.name}&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/gif`;
          width = window.matchMedia('(max-width: 450px)').matches ? 300 : 500;
          height = 350;
        }
        mountComponent({
          elId: 'gv-multi-legend-panel',
          containerId: GV.config.containerId,
          vm: new Vue({
            template: `<gv-multi-legend-panel visible="true" :src="src" :html="html" :height="height" :width="width" :title="title"></gv-multi-legend-panel>`,
            data: {
              // title: `LEGENDA - ${layer.legend.label}`,
              title: `LEGENDA`,
              src: url,
              html: html,
              width: width,
              height: height,
            },
          }),
        });
      }
    },
  },
};
</script>

<<style>
#gv-legend {
  position: absolute;
  float: right;
  right: 0;
  top: 0;
  margin-right: 10px;
  margin-top: 10px;
  width: 260px;
  z-index: 800;
  max-height: 430px;
}

.gv-legend-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-legend-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-legend-title {
  position: relative;
  display: block;
  padding-top: 0.3rem;
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

.gv-legend-title-collapsed {
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

.gv-legend-title span {
  font-size: 14px;
  font-weight: bold;
}

.gv-legend-close {
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

.gv-legend-buttons {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  line-height: 1;
  font-size: 14px !important;
}

.gv-list-group {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  background-color: #fff;
  width: 260px;
}

.gv-list-legend-layer-item {
  opacity: 1;
  filter: alpha(opacity=100);
}

.gv-list-legend-layer-disabled-item {
  opacity: 0.3;
  filter: alpha(opacity=30);
}

.gv-legend-layer-icon {
  padding-top: 3px;
}

.gv-legend-layer-icon img {
  width: 24px;
  height: 24px;
}

.gv-legend-map-tools {
  position: relative;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 260px;
}

.gv-list-legend-map-item {
  position: relative;
  display: block;
  padding: 0.1rem 0.5rem;
  margin-bottom: -1px;
  border: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}

.gv-legend-map-tools-button {
  position: relative;
  right: 0;
  bottom: 0;
  font-size: 14px;
  /* color: #24386C !important;
  background-color: #CCC !important;
  border-color: #CCC !important; */
  padding: 2px 2px;
}

.gv-legend-map-tools span {
  font-family: 'Raleway', Arial, sans-serif !important;
  font-size: 12px;
  font-weight: bold;
}

.gv-layer-visibility-span {
  position: absolute;
  top: 16%;
  left: 29px;
}

.gv-layer-title-span {
  position: absolute;
  top: 50%;
  left: 55px;
  margin-top: -7px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 180px;
}

.gv-legend-footer {
  display: block;
  padding: 0.3rem 0.5rem;
  margin-bottom: -1px;
  cursor: default;
}

#gv-legend-body {
  width: 260px;
  max-height: 400px;
  cursor: default;
  overflow: hidden;
}

#gv-legend-body:hover {
  overflow-y: scroll;
}

@media (max-height: 500px) {
  #gv-legend-body {
    overflow-y: scroll;
    max-height: 200px;
  }
}

#gv-legend-wrapper {
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

.popover-scala {
  line-height: 0 !important;
}

.el-popover__title {
  color: #2d2f33;
  font-size: 14px !important;
  line-height: 0 !important;
  margin-bottom: 8px !important;
}

.gv-legend-transparency-layer-slider {
  margin-left: 5px;
  margin-right: 10px;
  /* margin-top: -5x;
  margin-bottom: -5px; */
}

.gv-legend-popover-button {
  /* margin-left: 5px; */
  margin-right: 10px;
  /* margin-top: -5x;
  margin-bottom: -5px; */
}

.gv-legend-popover-buttons {
  background-color: #fff !important;
  padding: 5px 5px 5px 5px !important;
}

.gv-layer-popover {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-right: 5px !important;
  padding-left: 5px !important;
  line-height: 0.4 !important;
  font-size: 12px !important;
  min-width: 50px !important;
}
</style>
