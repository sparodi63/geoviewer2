<template>
  <div id="gv-fototeca-carrello-panel" class="gv-fototeca-carrello-panel">
    <gv-title title="Carrello" :divId="'gv-fototeca-carrello-panel'"></gv-title>
    <div class="gv-fototeca-carrello-body gv-inverted-color-scheme">
      <div class="gv-fototeca-carrello-tree">
        <el-tree
          :data="data"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="expandedNodes"
          empty-text="Nessun fotogramma selezionato"
        ></el-tree>
      </div>
      <el-row type="flex" class="row-bg" justify="left">
        <el-button
          id="gv-button-fototeca-carrello-scarica"
          icon="el-icon-download"
          title="Scarica Immagini"
          @click="download"
          :disabled="buttonDisabled"
          class="gv-color-scheme"
          size="mini"
          >Scarica Immagini</el-button
        >
        <el-button
          id="gv-button-fototeca-carrello-empty"
          icon="el-icon-error"
          title="Svuota"
          @click="empty"
          :disabled="buttonDisabled"
          class="gv-color-scheme"
          size="mini"
          >Svuota Carrello</el-button
        >
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <div class="gv-fototeca-carrello-licenza">
          I dati sono ceduti con licenza d’uso
          <a href="http://creativecommons.org/licenses/by/3.0/deed.it" target="_blank">CC BY 3.0</a>
          <!-- <a href="http://creativecommons.org/licenses/by/3.0/deed.it" target="_blank"
            ><img alt="Creative Commons BY" src="http://i.creativecommons.org/l/by/3.0/80x15.png"
          /></a> -->
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Loading, Tree, Row, Button } from 'element-ui';
Vue.use(Tree);
Vue.use(Row);
Vue.use(Button);
import getFototecaZipFiles from '../services/getFototecaZipFiles';
import notification from '../util/notification';

export default {
  name: 'gv-fototeca-carrello-panel',
  data() {
    return {
      options: GV.config.getToolOptions('gv-fototeca-carrello-button'),
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      data: GV.globals.FOTOTECA_CARRELLO,
    };
  },
  computed: {
    expandedNodes() {
      return this.data.map(volo => {
        return volo.id;
      });
    },
    buttonDisabled() {
      return this.data.length === 0;
    },
  },
  methods: {
    download() {
      const data = this.data.map(volo => {
        return {
          dir: volo.dir,
          foto: volo.children.map(foto => {
            return foto.file;
          }),
        };
      });
      getFototecaZipFiles(data).then(response => {
        // var window = window.open(response.url, '_blank');
        if (response.success) {
          notification(`File disponibile a questa <a href=${response.url}>URL</a> `, 'info', 0);
        } else {
          notification(
            `Non e' stato possibile elaborare la richiesta: ${response.message}`,
            'error',
            0
          );
        }
        this.empty();
      });
    },
    empty() {
      GV.globals.FOTOTECA_CARRELLO = [];
      this.data = GV.globals.FOTOTECA_CARRELLO;
    },
  },
  mounted() {},
};
</script>

<style>
.gv-fototeca-carrello-panel {
  position: absolute;
  width: 340px;
  right: 0px;
  top: 0px;
  margin-right: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-fototeca-carrello-body {
  padding: 5px;
  width: 330px;
  height: 300px;
}

.gv-fototeca-carrello-tree {
  max-height: 240px;
  height: 240px;
  width: 330px;
  overflow: auto;
}
.el-row {
  padding: 5px 0px 5px 0px !important;
}
</style>
