<template>
  <button id="gv-button-help-aib" title="Help" @click="onClick" :class="setClass()" />
</template>

<script>
import mountComponent from '../../util/mountComponent';
import Vue from 'vue';

// Vue.component('gv-help-aib-panel', () => import('../HelpAib.vue'));

const name = 'gv-help-aib-button';

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);
    return {
      name: name,
      active: false,
      options: options,
      cssClass: 'gv-button fa fa-question',
      // cssClass: 'gv-help3D-button gv-button fa fa-question',
      cssActiveClass: 'gv-button-selected',
    };
  },
  methods: {
    onClick() {
      const url =
        'https://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/aib/MANUALE_WEBGIS_CAIB.pdf';
      window.open(url, '_blank');
      // mountComponent({
      //   elId: 'gv-help-aib-panel',
      //   containerId: GV.config.containerId,
      //   toggleEl: true,
      //   vm: new Vue({
      //     template: `<gv-help-aib-panel></gv-help-aib-panel>`,
      //   }),
      // });
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass;
    },
  },
  mounted: function () {},
};
</script>

<style></style>

