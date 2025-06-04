<template>
  <button
    id="gv-button-ricerca-particella"
    title="Ricerca Particella Catastale"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import mountComponent from '../../util/mountComponent';
import Vue from 'vue';
import { Button } from 'element-ui';
Vue.use(Button);

Vue.component('gv-ricerca-particella', () => import('../RicercaParticellaCatastale.vue'));

const name = 'gv-ricerca-particella-button';

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);

    return {
      active: false,
      options: options,
      cssClass: 'gv-ricerca-particella-button gv-button fa fa-building',
      cssActiveClass: 'gv-button-selected',
    };
  },

  methods: {
    onClick() {
      mountComponent({
        elId: 'gv-ricerca-particella',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-ricerca-particella></gv-ricerca-particella>`,
        }),
      });
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass;
    },
  },
  mounted: function () {},
};
</script>

<style>
</style>
