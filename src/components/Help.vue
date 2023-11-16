<template>
  <div id="gv-help-aib-panel" class="gv-help-aib-panel">
    <gv-title title="Help Aib" :divId="'gv-help-aib-panel'"></gv-title>
    <div class="gv-help-aib-body gv-inverted-color-scheme"></div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Loading, Notification } from 'element-ui';

export default {
  name: 'gv-help-aib-panel',
  data() {
    console.log('gv-help-aib-panel data', GV.config.getToolOptions('gv-help-button'));
    return {
      options: GV.config.getToolOptions('gv-help-button'),
    };
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style>
.gv-help-aib-panel {
  position: absolute;
  width: 340px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-help-aib-body {
  padding: 5px;
  width: 330px;
  height: 200px;
}
</style>

