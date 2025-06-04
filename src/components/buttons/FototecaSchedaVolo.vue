<template>
  <button
    id="gv-button-fototeca-scheda-volo"
    title="Scheda Volo"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import mountComponent from '../../util/mountComponent';
import Vue from 'vue';

Vue.component('gv-fototeca-scheda-volo-panel', () => import('../FototecaSchedaVolo.vue'));

const name = 'gv-fototeca-scheda-volo-button';

export default {
  name: name,

  data() {
    const options = GV.config.getToolOptions(name);
    return {
      name: name,
      active: false,
      options: options,
      cssClass: 'gv-button fa fa-info-circle',
      cssActiveClass: 'gv-button-selected',
    };
  },
  methods: {
    onClick() {
      if (!GV.globals.FOTOTECA_SEL_VOLO) return;
      mountComponent({
        elId: 'gv-fototeca-scheda-volo-panel',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-fototeca-scheda-volo-panel></gv-fototeca-scheda-volo-panel>`,
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
