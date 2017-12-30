<template>
  <div  class="gv-layer-search gv-inverted-color-scheme" id="gv-layer-search">
    <gv-title v-draggable :title="title" :divId="'gv-layer-search'" :hide="true" :width="'360px'"></gv-title>
    <div class="gv-layer-search-body" id="gv-layer-search-body">
      <el-form :model="form" ref="form">
        <el-form-item>
          <el-select v-model="layer" size="mini" placeholder="Livello" @change="changeLayer" filterable>
              <el-option v-for="item in layers" :key="item.codice" :label="item.label" :value="item.codice" >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="column" size="mini" placeholder="Campo" no-data-text="Seleziona un livello" filterable>
              <el-option v-for="item in columns" :key="item.codice" :label="item.label" :value="item.codice">
              </el-option>
          </el-select>
          <el-select v-model="operatore" size="mini" placeholder="Operatore" class="gv-layer-search-operator-combo">
              <el-option v-for="item in operatori" :key="item.codice"  :value="item.label" :label="item.codice" >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="Valore" v-model="valore" size="mini" class="gv-layer-search-value"></el-input>
          <el-button v-show="showValueListButton" class="gv-layer-search-value-list-button" size="mini" @click="populateValueList">Lista Valori</el-button>
        </el-form-item>
        <el-form-item class="gv-layer-search-buttons">
          <el-button v-show="showSubmitButton" type="primary" size="mini" @click="submit">Ricerca</el-button>
        </el-form-item>
        <div v-show="showValueList">
          <el-table 
            :data="valueList"
            highlight-current-row
            @current-change="onChangeValueList"
            size="mini"
            border
            style="width: 100%">
            <el-table-column
              label="LISTA VALORI"
              style="word-wrap: break-word"
              property="value">
            </el-table-column>    
          </el-table>
          <el-pagination
          v-show="showPagination"
          small
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
        <div v-show="showResults">
          <el-table 
            :data="results"
            highlight-current-row
            @current-change="onChangeResults"
            size="mini"
            border
            style="width: 100%">
            <el-table-column
              label="RISULTATI RICERCA"
              style="word-wrap: break-word"
              property="label">
            </el-table-column>    
          </el-table>
          <el-pagination
          v-show="showPagination"
          small
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handlePageChangeResults"
          >
          </el-pagination>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import mountComponent from "../util/mountComponent";
import globals from "../globals";
import getQueryLayer from "../services/getQueryLayer";
import getQueryLayerValueList from "../services/getQueryLayerValueList";
import capitalize from "../util/capitalize";
import InfoWmsManager from "../controls/InfoWmsManager";
import getWFSFeature from "../services/getWFSFeature";

import {
  Button,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Notification,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

import lang from "element-ui/lib/locale/lang/it";
import locale from "element-ui/lib/locale";
locale.use(lang);

var VueCookie = require("vue-cookie");
Vue.use(VueCookie);

export default {
  name: "gv-layer-search",
  data() {
    return {
      title: "RICERCA LIVELLI",
      maps: GV.config.maps,
      operatori: [
        { codice: "=", label: "=" },
        { codice: "!=", label: "!=" },
        { codice: "<", label: "<" },
        { codice: ">", label: ">" },
        { codice: "<=", label: "<=" },
        { codice: ">=", label: ">=" }
      ],
      operatore: "=",
      layer: null,
      columns: [],
      column: null,
      valore: null,
      valueList: [],
      results: [],
      limit: 10,
      total: 0
    };
  },
  computed: {
    layers() {
      let layers = [];
      this.maps.forEach(map => {
        map.layers.forEach(layer => {
          if (
            layer.dbSchema &&
            layer.dbSchema.columns &&
            layer.dbSchema.columns.length > 0
          ) {
            const columns = layer.dbSchema.columns.map(column => {
              return {
                codice: column.name,
                label: capitalize(column.name.replace(/_/g, " ")),
                type: column.type
              };
            });
            layers.push({
              codice: layer.id,
              label: layer.legend.label,
              columns: columns
            });
          }
        });
      });
      return layers;
    },
    showValueListButton() {
      return this.layer && this.column;
    },
    showSubmitButton() {
      return this.layer && this.column && this.valore;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handlePageChange(page) {
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
    onChangeResults(item) {
      if (!item) return
      //TODO zoom + hilite
      InfoWmsManager.addHiliteLayer(GV.app.map);
      const layerName = `L${this.layer}`;
      const idAttr = (GV.config.getLayerConfig(layerName).cachePostGIS)? item.idField.toLowerCase() : item.idField;
      const cqlFilter = `${idAttr}=${item.id}`;

      getWFSFeature([layerName], cqlFilter)
        .then(features => {
          const layer = GV.app.map.getLayerByName("InfoWmsHilite");
          if (features && features[0] && features[0].geometry) {
            layer.clearLayers();
            layer.addData(features[0].geometry);
            GV.app.map.fitBounds(layer.getBounds(), { maxZoom: 15 });
            GV.app.map._container.style.cursor = "default";
                GV.config.hilitedLayer.push(layerName)
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    changeLayer(id) {
      this.column = null;
      this.valore = null;
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
    queryValueList(offset) {
      const column = this.column;
      const dataType = this.columns.filter(col => {
        return col.codice == column;
      })[0].type;
      getQueryLayerValueList(
        this.layer,
        column,
        dataType,
        offset,
        this.limit
      ).then(res => {
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
      //TODO controllo formato columns data
      const offset = 0;
      this.queryResults(offset);
    },
    queryResults(offset) {
      const column = this.column;
      const dataType = this.columns.filter(col => {
        return col.codice == column;
      })[0].type;
      const operator = this.operatore;
      const value = this.valore;
      getQueryLayer(
        this.layer,
        column,
        dataType,
        value,
        operator,
        offset,
        this.limit
      ).then(res => {
        this.results = res.data.data;
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
      if (this.closeWindow === "true") {
        window.close();
      } else {
        document
          .getElementById("gv-layer-search")
          .parentNode.removeChild(document.getElementById("gv-layer-search"));
      }
    },
    collapse: function(event) {
      if (this.show) {
        document.getElementById("gv-layer-search-body").style.display = "none";
      } else {
        document.getElementById("gv-layer-search-body").style.display = "block";
      }
      this.show = !this.show;
    },
    notification(message, type) {
      const title = type === "info" ? "" : "Attenzione";
      Notification({
        title: title,
        type: type || "error",
        duration: 5000,
        offset: 70,
        dangerouslyUseHTMLString: true,
        position: "bottom-left",
        message: message
      });
    }
  }
};
</script>

<style scoped>
.gv-layer-search {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  background-color: #fff;
  z-index: 800;
}

.gv-layer-search-body {
  margin: 10px;
}

.gv-layer-search-label {
  display: inline-block;
  width: 150px;
}

.gv-layer-search-value-list-button {
  float: right;
  margin-top: 10px;
}
.gv-layer-search-buttons {
  float: right;
}
.gv-layer-search-operator-combo {
  width: 100px;
}

.gv-layer-search-value {
  width: 250px;
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
}
</style>