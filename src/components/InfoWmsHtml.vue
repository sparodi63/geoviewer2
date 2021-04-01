<template>
  <div class="info-wms-html" :id="id">
    <gv-title v-draggable :title="title" :divId="id"></gv-title>
    <!-- <div v-bar> -->
    <gv-iframe-panel :html="html" :src="src" :height="height" :width="width"></gv-iframe-panel>
    <!-- </div> -->
  </div>
</template>

<script>
// import Vue from 'vue';
// import Vuebar from 'vuebar';
// Vue.use(Vuebar);

export default {
  name: 'gv-info-wms-html',
  props: ['title', 'src', 'html', 'width', 'height', 'id'],
  mounted() {
    console.log('TITLE ID: ', this.id);
    GV.eventBus.$on('title-close-panel', event => {
      if (event.divId === this.id) {
        GV.app.map.clearLayer('InfoWmsHilite');
      }
    });
  },
};
</script>

<style scoped>
.info-wms-html {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 80px;
  background-color: #fff;
  z-index: 800;
  /* overflow: hidden; */
}
</style>
