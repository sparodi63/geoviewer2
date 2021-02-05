<template>
  <button
    id="gv-button-ricerca-catastale"
    title="Ricerche Catastali"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import mountComponent from '../../util/mountComponent';
import Vue from 'vue';
import { Button } from 'element-ui';
Vue.use(Button);

Vue.component('gv-ricerca-catastale', () => import('../S3RicercaCatastale.vue'));

const name = 'gv-ricerca-catastale-button';

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);

    return {
      active: false,
      options: options,
      cssClass: 'gv-ricerca-catastale-button gv-button fa fa-building',
      cssActiveClass: 'gv-button-selected',
    };
  },

  methods: {
    onClick() {
      mountComponent({
        elId: 'gv-ricerca-catastale',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-ricerca-catastale></gv-ricerca-catastale>`,
        }),
      });
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass;
    },
  },
  mounted: function() {},
};
</script>

<style>
.gv-ricerca-catastale-button {
  font-size: 12px;
}
</style>
