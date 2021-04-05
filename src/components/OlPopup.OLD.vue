<template>
  <div class="ol-popup gv-inverted-color-scheme" id="ol-popup">
    <div v-draggable id="ol-popup-title" class="ol-popup-title gv-color-scheme">
      <b>{{ title }}</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
      ></el-button>
    </div>
    <div class="ol-popup-body" id="ol-popup-body">
      <div class="ol-popup-result"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Table } from 'element-ui';
Vue.use(Table);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'ol-popup',
  props: {
    properties: String,
    title: String,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    closePanel: function() {
      let div = document.getElementById('ol-popup');
      if (!div) return;
      div.parentNode.removeChild(div);
    },
  },
};
</script>

<style scoped>
.ol-popup {
  position: absolute;
  left: 0;
  top: 0;
  width: 690px;
  margin-left: 20px;
  margin-top: 190px;
  z-index: 800;
}

.ol-popup-title {
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

.ol-popup-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.ol-popup-body {
  margin: 10px;
}

.ol-popup-scuola {
  margin: 10px;
}

.ol-popup-result {
  margin-top: 10px;
  margin-left: 5px;
}

.ol-popup-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: bold;
  color: #ffffff;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
  opacity: 0.5;
}

span {
  margin-right: 20px;
}
</style>

<style>
.el-table td {
  vertical-align: top !important;
}
</style>
