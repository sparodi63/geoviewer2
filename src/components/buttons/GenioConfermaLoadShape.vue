<template>
  <button
    id="gv-button-genio-conferma-load-shape"
    title="Conferma"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import Vue from 'vue';
const name = 'gv-button-genio-conferma-load-shape';
import mountComponent from '../../util/mountComponent';

Vue.component('gv-genio-conferma-load-shape', () => import('../GenioConfermaLoadShape.vue'));

export default {
  data() {
    const options = GV.config.getToolOptions(name);

    return {
      name: name,
      active: false,
      options: options,
      action: options.action,
      url: options.url,
      confirm: options.confirm,
      cssClass: 'gv-back gv-button fa fa-save',
      cssActiveClass: 'gv-button-selected',
    };
  },
  methods: {
    onClick() {
      mountComponent({
        elId: 'gv-genio-conferma-load-shape',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-genio-conferma-load-shape></gv-genio-conferma-load-shape>`,
        }),
      });
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass;
    },
  },
  mounted() {
    // this.onClick();
  },
};
</script>

<style>
</style>
