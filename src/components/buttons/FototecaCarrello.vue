<template>
  <button id="gv-button-fototeca-carrello" title="Carrello" @click="onClick" :class="setClass()" />
</template>

<script>
import mountComponent from '../../util/mountComponent';
import Vue from 'vue';

Vue.component('gv-fototeca-carrello-panel', () => import('../FototecaCarrello.vue'));

const name = 'gv-fototeca-carrello-button';

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);
    return {
      name: name,
      active: false,
      options: options,
      cssClass: 'gv-button fa fa-shopping-cart',
      cssActiveClass: 'gv-button-selected',
    };
  },
  methods: {
    onClick() {
      mountComponent({
        elId: 'gv-fototeca-carrello-panel',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-fototeca-carrello-panel></gv-fototeca-carrello-panel>`,
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

<style></style>
