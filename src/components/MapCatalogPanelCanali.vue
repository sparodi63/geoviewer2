<template>
  <div id="gv-map-catalog-panel-canali">
    <div class="gv-map-catalog-tree">
      <el-tree
        :data="panel.tree"
        show-checkbox
        @check-change="handleSelectionChange"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <el-button type="primary" @click="submitMultiSel" class="gv-map-catalog-button" size="mini">
      <span>Carica</span>
    </el-button>
  </div>
</template>

<script>
import Vue from 'vue';

import handleSelectionChange from '../mixins/MapCatalogTree';
import submitMultiSel from '../mixins/MapCatalogTree';
import handleNodeClick from '../mixins/MapCatalogTree';

import getCanali from '../services/getCanali';

Vue.component('gv-map-info-panel', () => import('./MapInfoPanel.vue'));

import { Button, Tree } from 'element-ui';
Vue.use(Button);
Vue.use(Tree);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-map-catalog-panel-canali',
  props: ['panel'],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'text',
      },
      expanded_nodes: [],
      multipleSelection: [],
    };
  },
  mounted() {
    // Carico i tree per i pannelli di tipo tree
    this.loadTree();
  },
  mixins: [handleSelectionChange, submitMultiSel, handleNodeClick],
  methods: {
    loadTree() {
      if (this.panel.options.multiCanale) {
        this.panel.label = `Canali Tematici`;
        this.panel.tree = [];
        if (this.panel.options.canale) {
          const canali = this.panel.options.canale.toString().split(',');
          canali.forEach(canale => {
            const params = {
              tematici: this.panel.options.tematici,
              canale: canale,
              pub: this.panel.options.pub,
            };
            getCanali(params).then(data => {
              if (data) {
                this.panel.tree.push(data);
              }
            });
          });
        }
        if (this.panel.options.applicazione) {
          const applicazioni = this.panel.options.applicazione.split(',');
          applicazioni.forEach(applicazione => {
            const params = {
              applicazione: applicazione,
              tematici: this.panel.options.tematici,
              pub: this.panel.options.pub,
            };
            getCanali(params).then(data => {
              if (data) {
                this.panel.tree.push(data);
              }
            });
          });
        }
      } else {
        getCanali(this.panel.options).then(data => {
          if (data) {
            this.panel.tree = data.children;
            this.panel.label = `Canali Tematici: ${data.text}`;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.gv-map-catalog-tree {
  max-height: 400px;
  height: 400px;
  width: 580px;
  overflow: auto;
}

@media (max-width: 650px) {
  .gv-map-catalog-tree {
    width: 400px;
    height: 350px;
  }
}
</style>

<style>
.el-tree-node__label {
  font-size: 12px !important;
}

.el-tree-node {
  white-space: normal !important;
  padding: 5px;
}

.gv-map-catalog-button {
  margin-top: 10px;
  font-size: 12px;
}

.gv-map-catalog-button span {
  font-family: 'Raleway', Arial, sans-serif;
}
</style>
