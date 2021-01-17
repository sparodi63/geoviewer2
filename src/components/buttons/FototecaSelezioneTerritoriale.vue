<template>
  <button
    id="gv-button-fototeca-selezione-territoriale"
    title="Selezione Territoriale"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import SwitchActiveButton from '../../mixins/SwitchActiveButton';
import Control from '../../controls/FototecaSelezioneTerritoriale';

const name = 'gv-fototeca-selezione-territoriale-button';

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);
    return {
      name: name,
      active: false,
      control: Control,
      options: options,
      cssClass: 'gv-button fa fa-pencil-square-o',
      cssActiveClass: 'gv-button-selected',
    };
  },
  mixins: [SwitchActiveButton],
  methods: {
    onClick() {
      this.switchActiveButton();
      // console.log(this.options)
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass;
    },
  },
  mounted: function() {
    GV.eventBus.$on('gv-fototeca-selezione-territoriale-switch', event => {
      this.switchActiveButton();
    });
  },
};
</script>

<style></style>
