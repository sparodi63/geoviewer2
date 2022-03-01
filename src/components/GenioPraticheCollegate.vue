<template>
  <div id="gv-genio-pratiche-collegate-panel" class="gv-genio-pratiche-collegate-panel">
    <gv-title title="Pratiche Collegate" :divId="'gv-genio-pratiche-collegate-panel'"></gv-title>
    <div class="gv-genio-pratiche-collegate-body gv-inverted-color-scheme">
      <div class="gv-genio-pratiche-collegate-table">
        <el-table
          :data="praticheCollegate"
          :show-header="false"
          empty-text="Nessuna pratica collegata"
          :cell-style="{ padding: '2px', maxHeight: '10px' }"
        >
          <el-table-column 
            align="center" 
            width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.prat_col }}</span>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-button
                v-show="georeferenced(scope.row.georef)"
                size="mini"
                type="primary"
                @click="localizza(scope.row.prat_col)"
                icon="el-icon-location"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading, Notification } from 'element-ui';

import getGenioPraticheCollegate from '../services/getGenioPraticheCollegate';

export default {
  name: 'gv-genio-pratiche-collegate-panel',
  data() {
    return {
      options: GV.config.getToolOptions('gv-genio-pratiche-collegate-button'),
      praticheCollegate: [],
    };
  },
  computed: {},
  methods: {
    georeferenced(georef) {
      return georef === 'SI';
    },
    localizza(codPrat) {
      const findOptions = {
        layers: [this.options.idLayerPratica, this.options.idLayerPraticaDe],
        cqlFilter: "CODICE_PRATICA='" + codPrat + "'",
      };
      console.log(findOptions);
      GV.app.map.find(findOptions);
    },
  },
  mounted() {
    getGenioPraticheCollegate(this.options.prov, this.options.codicePratica)
      .then(data => {
        // loading.close();
        if (data) {
          this.praticheCollegate = data;
        }
      })
      .catch(error => {
        loading.close();
        console.error(error);
      });
  },
};
</script>

<style>
.gv-genio-pratiche-collegate-panel {
  position: absolute;
  width: 240px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-genio-pratiche-collegate-body {
  padding: 5px;
  width: 230px;
  height: 210px;
}

.gv-genio-pratiche-collegate-table {
  padding: 5px;
  overflow-y: auto;
  width: 220px;
  height: 200px;
  /* max-height: 210px; */
}
</style>
