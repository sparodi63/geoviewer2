<template>
  <div class="gv-layer-search-topo gv-inverted-color-scheme" id="gv-layer-search-topo">
    <gv-title
      v-draggable
      :title="title"
      :divId="'gv-layer-search-topo'"
      :noClose="true"
      :collapsible="'gv-layer-search-topo-body'"
      :collapsedWidth="'180px'"
    ></gv-title>
    <div class="gv-layer-search-topo-body" id="gv-layer-search-topo-body">
      <el-form :model="form" ref="form">
        <el-form-item>
          MAPPA:
          <el-select
            id="gv-layer-search-topo-map-select"
            v-model="map"
            size="mini"
            @change="changeMap"
            filterable
          >
            <el-option
              v-for="item in maps"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>LIVELLO:</span>
          <el-select
            id="gv-layer-search-topo-layer-select"
            v-model="layer"
            size="mini"
            placeholder="Livelli"
            @change="changeLayer"
            filterable
          >
            <el-option
              v-for="item in layers"
              :key="item.codice"
              :label="item.label"
              :value="item.codice"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="showAlfaParams">
          <el-select
            id="gv-layer-search-topo-column-select"
            v-model="column"
            size="mini"
            placeholder="Campo"
            no-data-text="Seleziona un livello"
            filterable
            class="gv-layer-search-topo-column-combo"
          >
            <el-option
              v-for="item in columns"
              :key="item.codice"
              :label="item.label"
              :value="item.codice"
            ></el-option>
          </el-select>
          <el-select
            v-model="operatore"
            size="mini"
            placeholder="Operatore"
            class="gv-layer-search-topo-operator-combo"
          >
            <el-option
              v-for="item in operatori"
              :key="item.codice"
              :value="item.label"
              :label="item.codice"
            ></el-option>
          </el-select>
          <el-input
            style="width: 200px"
            placeholder="Valore"
            v-model="valore"
            size="mini"
            id="gv-layer-search-topo-value"
          ></el-input>
          <el-button
            id="gv-layer-search-topo-value-list-button"
            v-show="showValueListButton"
            size="mini"
            type="primary"
            @click="populateValueList"
            >Lista Valori</el-button
          >
          <el-button
            id="gv-layer-search-topo-clear"
            v-show="showClearButton"
            size="mini"
            type="primary"
            @click="clearAlfaFields"
            >Pulisci</el-button
          >
        </el-form-item>
        <el-form-item>
          <span class="gv-map-download-label">Selezione Territoriale</span>
          <el-select
            id="gv-layer-search-topo-selterr"
            v-model="selezioneTerritoriale"
            size="mini"
            @change="changeSelezioneTerritoriale"
          >
            <el-option
              v-for="item in selezioniTerritoriali"
              :key="item.codice"
              :value="item.codice"
              :label="item.descrizione"
            ></el-option>
          </el-select>
          <span v-show="showSelectComuni" class="gv-map-download-label">Comune</span>
          <el-select
            id="gv-map-download-comuni"
            v-show="showSelectComuni"
            v-model="comune"
            size="mini"
            filterable
          >
            <el-option
              v-for="item in comuni"
              :key="item.codice"
              :value="item.codice"
              :label="item.nome"
            ></el-option>
          </el-select>
          <el-button
            id="gv-map-download-rect-reset"
            v-show="showRectReset"
            type="primary"
            size="mini"
            @click="rectReset"
            >Reimposta</el-button
          >
          <el-button
            id="gv-map-download-comuni-reset"
            v-show="showComuniReset"
            type="primary"
            size="mini"
            @click="comuniReset"
            >Reimposta</el-button
          >
        </el-form-item>
        <el-form-item class="gv-layer-search-topo-buttons">
          <el-button
            id="gv-layer-search-topo-submit-button"
            v-show="showSubmitButton"
            type="primary"
            size="mini"
            @click="submit"
            >Ricerca</el-button
          >
        </el-form-item>
        <div
          id="gv-layer-search-topo-value-list-panel"
          style="width: 350px;"
          v-show="showValueList"
        >
          <el-table
            id="gv-layer-search-topo-value-list-table"
            :data="valueList"
            highlight-current-row
            @current-change="onChangeValueList"
            size="mini"
            border
            style="width: 80%"
          >
            <el-table-column
              label="LISTA VALORI"
              style="word-wrap: break-word"
              property="value"
            ></el-table-column>
          </el-table>
          <el-pagination
            v-show="showPagination"
            small
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>

        <div id="gv-layer-search-topo-results-panel" v-if="showResults">
          <el-table
            id="gv-layer-search-topo-results-table"
            :data="dataTable"
            highlight-current-row
            @cell-click="onSelectResultsRow"
            size="mini"
            border
            style="width: 100%"
            :cell-style="{ padding: '0', maxHeight: '10px' }"
          >
            <el-table-column
              v-for="(column, index) in dataTableLabels"
              :key="index"
              :label="column"
              :min-width="dataTableWidths[index]"
            >
              <template slot-scope="scope">
                <div
                  :title="scope.row[index]"
                  style="height:20px; overflow:hidden; white-space: nowrap; "
                >
                  {{ scope.row[index] }}
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-show="showPagination"
            small
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handlePageChangeResults"
          ></el-pagination>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

require('leaflet-draw');
require('style!../../node_modules/leaflet-draw/dist/leaflet.draw.css');

import mountComponent from '../util/mountComponent';
import globals from '../globals';
import getQueryLayer from '../services/getQueryLayerTopo';
import getQueryLayerTopoValueList from '../services/getQueryLayerTopoValueList';
import capitalize from '../util/capitalize';
import InfoWmsManager from '../controls/InfoWmsManager';
import getWFSFeature from '../services/getWFSFeature';
import notification from '../util/notification';
import getGeoJSON from '../services/getGeoJSON';

import {
  Button,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Tooltip,
} from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Tooltip);

import { Loading } from 'element-ui';
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

export default {
  name: 'gv-layer-search-topo',
  data() {
    return {
      title: 'RICERCHE SUI LIVELLI',
      configMaps: GV.config.maps,
      // maps: GV.config.maps.filter(map => map.type !== "R"),
      operatori: [
        { codice: '=', label: '=' },
        { codice: '!=', label: '!=' },
        { codice: '<', label: '<' },
        { codice: '>', label: '>' },
        { codice: '<=', label: '<=' },
        { codice: '>=', label: '>=' },
        { codice: 'LIKE', label: 'LIKE' },
      ],
      operatore: '=',
      map: null,
      layers: [],
      layer: null,
      columns: [],
      column: null,
      valore: null,
      valueList: [],
      // results: [],
      dataTable: [],
      dataTableLabels: [],
      dataTableWidths: [],
      idList: [],
      limit: 10,
      total: 0,
      selezioniTerritoriali: [
        { codice: 0, descrizione: 'Nessuna' },
        { codice: 1, descrizione: 'Rettangolo' },
        { codice: 2, descrizione: 'Selezione per Comune' },
      ],
      selezioneTerritoriale: 0,
      showRectReset: false,
      showComuniReset: false,
      bbox: null,
      comune: null,
      layersWithSameStructure: false,
      comuni: [],
    };
  },
  computed: {
    maps() {
      return this.configMaps.filter(map => map.type !== 'R');
    },
    showSelectComuni() {
      return this.selezioneTerritoriale === 2;
    },
    showValueListButton() {
      return (this.layer || this.layersWithSameStructure) && this.column;
    },
    showClearButton() {
      return (this.layer || this.layersWithSameStructure) && this.column;
    },
    showAlfaParams() {
      return this.layer || this.layersWithSameStructure;
    },
    showSubmitButton() {
      return (
        // (this.layer && this.column && this.valore) ||
        // (this.map && this.bbox) ||
        // (this.map && this.comune) ||
        // (this.map && this.layersWithSameStructure & this.column && this.valore)
        this.layer || (this.map && this.layersWithSameStructure)
      );
    },
  },
  watch: {
    configMaps() {
      this.maps.filter(map => map.type !== 'R');
    },
    comune(comune) {
      this.syncComune(comune);
      this.showComuniReset = this.comune ? true : false;
    },
  },
  mounted() {
    this.addLayerRettangolo();
    this.addLayerComuni();
    //this.map=GV.config.maps[0].id
  },
  methods: {
    handlePageChange(page) {
      if (this.showResults) return;
      const offset = this.limit * (page - 1);
      this.queryValueList(offset);
    },
    handlePageChangeResults(page) {
      const offset = this.limit * (page - 1);
      this.queryResults(offset);
    },
    onChangeValueList(item) {
      if (item) {
        this.valore = item.value;
        this.showValueList = false;
      }
    },
    onSelectResultsRow(row) {
      // console.log(row);
      // console.log(this.dataTable.indexOf(row));
      // const index = this.dataTable.indexOf(row);
      // console.log(this.dataTable);
      // console.log(this.idList);
      // console.log(index);
      // console.log(this.idList[index]);
      // const value = this.idList[index];

      if (!row) return;

      InfoWmsManager.addHiliteLayer(GV.app.map);

      let layerName = null;
      if (this.layer) {
        layerName = `L${this.layer}`;
      } else {
        this.layers.forEach(layer => {
          if (row[0] === layer.label) layerName = `L${layer.codice}`;
        });
      }
      const value = row[1];

      const layerConfig = GV.config.getLayerConfig(layerName);
      const wfsParams = layerConfig.wfsParams;
      const idAttr = layerConfig.cachePostGIS
        ? layerConfig.infoOptions.infoIdAttr.toLowerCase()
        : layerConfig.infoOptions.infoIdAttr;
      const cqlFilter = `${idAttr}='${value}'`;

      getWFSFeature(wfsParams, cqlFilter)
        .then(features => {
          if (features && features[0] && features[0].geometry) {
            const layer = GV.app.map.getLayerByName('InfoWmsHilite');
            layer.clearLayers();
            layer.addData(features[0].geometry);
            GV.app.map.flyToBounds(layer.getBounds(), { maxZoom: 15 });
            GV.app.map._container.style.cursor = 'default';
            GV.config.hilitedLayer.push(layerName);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    changeMap(id) {
      this.showValueList = false;
      this.showResults = false;
      this.maps.forEach(map => {
        if (map.id === id) {
          this.layers = [];
          this.layers.push({
            codice: null,
            label: 'Tutti i livelli',
            columns: [],
          });
          map.layers.forEach(layer => {
            if (layer.geomType !== 'RASTER') {
              if (layer.dbSchema && layer.dbSchema.columns && layer.dbSchema.columns.length > 0) {
                const columns = layer.dbSchema.columns.map(column => {
                  return {
                    codice: column.name,
                    label: capitalize(column.name.replace(/_/g, ' ')),
                    type: column.type,
                  };
                });
                this.layers.push({
                  codice: layer.id,
                  label: layer.legend.label,
                  columns: columns,
                });
              }
            }
          });
          this.mapLayers = this.layers
            .filter(layer => (layer.codice |= null))
            .map(layer => layer.codice)
            .join(',');
          this.layer = this.layers[0].codice;
          let columns = [];
          this.layers.forEach(layer => {
            const columnsList = layer.columns
              .map(column => column.codice)
              .sort()
              .join(',');
            if (columnsList !== '') columns.push(columnsList);
          });
          this.layersWithSameStructure = this.checkLayersStructure(columns);
          if (this.layersWithSameStructure) this.columns = this.layers[1].columns;
        }
      });
      this.clearAlfaFields();
    },
    checkLayersStructure(columns) {
      let check = true;
      if (columns.length < 2) return true;
      let col = columns[0];
      columns.forEach(el => {
        if (el !== col) check = false;
        col = el;
      });
      return check;
    },
    changeLayer(id) {
      if (!this.layersWithSameStructure) this.clearAlfaFields();
      this.showValueList = false;
      this.showResults = false;

      this.layers.forEach(layer => {
        if (layer.codice === id) {
          this.columns = layer.columns;
        }
      });
    },
    populateValueList() {
      const offset = 0;
      this.queryValueList(offset);
    },
    clearAlfaFields() {
      this.column = null;
      this.valore = null;
    },
    queryValueList(offset) {
      const column = this.column;
      const dataType = this.columns.filter(col => {
        return col.codice == column;
      })[0].type;
      // const layer = this.layer === 0 ? this.layers[1].codice : this.layer;
      const layers = this.layer || this.mapLayers;
      getQueryLayerTopoValueList(layers, column, dataType, offset, this.limit).then(res => {
        this.valueList = res.data.data;
        this.total = res.data.count;
        this.showValueList = true;
        this.showResults = false;
        if (this.total > this.limit) {
          this.showPagination = true;
        } else {
          this.showPagination = false;
        }
      });
    },
    submit() {
      this.showValueList = false;
      this.showResults = false;
      const offset = 0;
      this.queryResults(offset);
    },
    queryResults(offset) {
      let loading = Loading.service({
        target: '#gv-layer-search-topo-body',
        text: 'Ricerca...',
      });
      const column = this.column;
      const dataTypes = this.columns.filter(col => {
        return col.codice == column;
      })[0];
      const dataType = dataTypes && dataTypes[0] ? dataTypes[0].type : null;
      const operator = this.operatore;
      const value = this.valore;
      const topoFeature = this.comune ? 'COMUNI_PER_DOWNLOAD' : null;
      const topoQuery = this.comune ? 'CODICE_COMUNE=' + this.comune : null;
      const layers = this.layer || this.mapLayers;
      const version = '2';
      getQueryLayer(
        layers,
        offset,
        this.limit,
        column,
        dataType,
        value,
        operator,
        this.bbox,
        topoFeature,
        topoQuery,
        version
      ).then(res => {
        loading.close();
        if (!res.data.success) {
          notification(res.data.message, 'error');
          return;
        }
        this.dataTable = res.data.dataTable;
        this.idList = res.data.idList;
        this.dataTableLabels = res.data.dataTableLabels;
        this.dataTableWidths = res.data.dataTableWidths;
        this.dataTableLabels.unshift('LIVELLO');
        this.dataTableWidths.unshift('150px');
        this.total = res.data.count;
        this.showValueList = false;
        this.showResults = true;
        if (this.total > this.limit) {
          this.showPagination = true;
        } else {
          this.showPagination = false;
        }
      });
    },
    cancel() {
      this.cleanUp();
    },
    cleanUp() {
      if (this.closeWindow === 'true') {
        window.close();
      } else {
        document
          .getElementById('gv-layer-search-topo')
          .parentNode.removeChild(document.getElementById('gv-layer-search-topo'));
      }
    },
    addLayerRettangolo() {
      this.drawnRectangle = new L.FeatureGroup();
      L.drawLocal.draw.handlers.rectangle.tooltip.start =
        'Clicca e trascina per disegnare un rettangolo';
      L.drawLocal.draw.handlers.simpleshape.tooltip.end =
        'Rilascia il mouse per terminare il disegno';
      GV.app.map.addLayer(this.drawnRectangle);
    },
    rectReset() {
      if (this.drawnRectangle) {
        this.drawnRectangle.clearLayers();
      }
      if (GV.app.map.drawRectangle) {
        GV.config.activeControl.deactivate();
        GV.app.map.drawRectangle.disable();
        GV.app.map.drawRectangle.enable();
      }
      this.bbox = null;
    },
    comuniReset() {
      this.comune = null;
    },
    addLayerComuni() {
      const baseUrl = `${globals.DEFAULT_PROXY}https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=application%2Fjson&typeName=`;
      const url = `${baseUrl}M1946:L6421`;
      getGeoJSON(url).then(response => {
        this.loadDataComuni(response.data);
      });
    },
    loadDataComuni(data) {
      if (GV.app.map.getLayerByName('SelezioneComune')) {
        GV.app.map.removeLayer(GV.app.map.getLayerByName('SelezioneComune'));
      }

      if (!data.features) {
        console.error('Layer Comuni con caricato');
        return;
      }
      this.comuni = data.features
        .map(feature => {
          return {
            codice: feature.properties.CODICE_COMUNE || feature.properties.codice_comune,
            nome: feature.properties.NOME_COMUNE || feature.properties.nome_comune,
          };
        })
        .sort(function(a, b) {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }
          return 0;
        });

      this.layerComuni = data;

      this.changeSelezioneTerritoriale(this.selezioneTerritoriale, true);
    },
    syncComune(comune) {
      const layerComuni = GV.app.map.getLayerByName('SelezioneComune');
      if (!layerComuni) {
        return;
      }
      layerComuni.eachLayer(layer => {
        layer.setStyle({ fillOpacity: 0, weight: 1 });
      });
      layerComuni.eachLayer(layer => {
        const codice =
          layer.feature.properties.CODICE_COMUNE || layer.feature.properties.codice_comune;
        if (codice === comune) {
          layer.setStyle({ fillOpacity: 0, weight: 4 });
        }
      });
    },
    changeSelezioneTerritoriale(codice, silent) {
      this.comune = null;
      this.bbox = null;

      if (codice === 1 || codice === 2) {
        GV.config.activeControl.deactivate();
      } else {
        GV.config.activeControl.activate();
      }

      if (codice === 1) {
        notification('Selezionare un rettangolo sulla mappa');
        // console.log(this.drawnRectangle)
        if (!GV.app.map.drawRectangle) {
          GV.app.map.addHandler('drawRectangle', L.Draw.Rectangle);
        }
        GV.app.map.drawRectangle.enable();
        GV.app.map.on(L.Draw.Event.CREATED, event => {
          this.drawnRectangle.addLayer(event.layer);
          const xMin = event.layer.getBounds()._southWest.lng;
          const yMin = event.layer.getBounds()._southWest.lat;
          const xMax = event.layer.getBounds()._northEast.lng;
          const yMax = event.layer.getBounds()._northEast.lat;
          this.bbox = `${xMin},${yMin},${xMax},${yMin},${xMax},${yMax},${xMin},${yMax},${xMin},${yMin}`;
          this.bboxSRS = '4326';
          this.showRectReset = true;
          // Riattivo controllo base
          setTimeout(function() {
            GV.config.activeControl.activate();
          }, 10);
        });
      } else {
        if (GV.app.map.drawRectangle) {
          GV.app.map.drawRectangle.disable();
        }
        if (this.drawnRectangle) {
          this.drawnRectangle.clearLayers();
        }
        this.showRectReset = false;
      }

      // Selezione per comune
      if (codice === 2) {
        GV.app.map.loadLayers([
          {
            name: 'SelezioneComune',
            type: 'JSON',
            style: {
              color: '#ffcc00',
              fillOpacity: 0,
              weight: 1,
              opacity: 1,
            },
            visible: true,
            data: this.layerComuni,
            onEachFeature: (feature, layer) => {
              layer.on('click', ev => {
                if (this.selezioneTerritoriale !== 2) {
                  return;
                }
                const codice = feature.properties.CODICE_COMUNE || feature.properties.codice_comune;
                this.comune = codice;
              });
            },
          },
        ]);
        if (!silent) notification('Selezionare un comune sulla mappa o dalla lista');
      } else {
        const layerComuni = GV.app.map.getLayerByName('SelezioneComune');
        if (layerComuni) {
          GV.app.map.removeLayer(layerComuni);
        }
      }
    },

    collapse: function(event) {
      if (this.show) {
        document.getElementById('gv-layer-search-topo-body').style.display = 'none';
      } else {
        document.getElementById('gv-layer-search-topo-body').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
};
</script>

<style scoped>
.gv-layer-search-topo {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  background-color: #fff;
  z-index: 800;
}

.gv-layer-search-topo-body {
  margin: 10px;
}

/* #gv-layer-search-topo-value-list-button {
  float: right;
} */

.gv-layer-search-topo-buttons {
  margin-top: -5px;
}

.gv-layer-search-topo-operator-combo {
  width: 80px;
}

.gv-layer-search-topo-column-combo {
  width: 180px;
}

#gv-layer-search-topo-results-panel {
  width: 800px;
}
</style>

<style>
#gv-layer-search-topo-value {
  width: 200px;
}
.el-table__body-wrapper {
  overflow-y: hidden !important;
}
</style>
