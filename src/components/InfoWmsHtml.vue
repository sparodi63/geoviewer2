<template>
  <div class="info-wms-html" :id="id">
    <gv-title v-draggable :title="title" :divId="id"></gv-title>
    <gv-iframe-panel :html="html" :src="src" :height="height" :width="width"></gv-iframe-panel>
  </div>
</template>

<script>
export default {
  name: 'gv-info-wms-html',
  props: ['title', 'src', 'html', 'width', 'height', 'id'],
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
}
</style>
