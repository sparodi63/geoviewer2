<template>
  <div class="gv-genio-localizza gv-inverted-color-scheme" id="gv-genio-localizza">
    <gv-title v-draggable :title="title" :hide="true" :divId="'gv-genio-localizza'"></gv-title>
    <div class="gv-genio-localizza-body" id="gv-genio-localizza-body">
      <el-table
        :data="items"
        :show-header="false"
        size="mini"
        style="width: 100%;line-height: 23px;"
      >
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              id="gv-button-genio-localizza"
              title="Localizza"
              @click="localizza(scope.row)"
              >Localizza per {{ scope.row.label }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import globals from '../globals';
import getGenioReticolo from '../services/getGenioReticolo';
import { Loading } from 'element-ui';

import { Button, ButtonGroup, Table, TableColumn } from 'element-ui';
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
import notification from '../util/notification';

export default {
  name: 'gv-genio-localizza',
  data() {
    const options = GV.config.getToolOptions('gv-genio-localizza-button');
    let items = options.items;
    return {
      items: items,
      title: options.title,
    };
  },
  methods: {
    localizza(row) {
      if (!GV.config.getMapConfig(GV.config.idMap)) {
        notification('Configurazione non presente: attendere il caricamento della mappa');
        return;
      }
      if (row.findOptions.layers && row.findOptions.cqlFilter) {
        row.findOptions.notFoundAlert = true;
        GV.app.map.find(row.findOptions);
      }
      if (row.findOptions.zoomTo) {
        GV.config.zoomToCoord(row.findOptions.zoomTo);
      }
      if (row.findOptions.codiceIdro) {
        let loading = Loading.service({
          text: 'Ricerca...',
          background: 'rgba(0, 0, 0, 0.8)',
        });
        getGenioReticolo(row.findOptions.codiceIdro, row.findOptions.count)
          .then(data => {
            loading.close();
            if (data) {
              row.findOptions.cqlFilter = 'ID IN (' + data + ')';
              GV.app.map.find(row.findOptions);
            }
          })
          .catch(error => {
            loading.close();
            console.error(error);
          });
      }
    },
  },
};
</script>

<style scoped>
.gv-genio-localizza {
  position: absolute;
  width: 220px;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
  display: block;
}

.gv-genio-localizza table {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
}

.gv-genio-localizza-th {
  white-space: nowrap;
  width: auto;
  padding: 5px 5px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-genio-localizza table tr td {
  padding: 5px;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-genio-localizza-body {
  padding: 10px;
}

#gv-button-genio-localizza {
  width: 180px;
}
</style>
