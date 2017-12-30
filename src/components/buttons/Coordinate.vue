<template>
            <button title="Acquisizione Coordinate" @click="onClick" :class="setClass()" />
</template>

<script>
import SwitchActiveButton from '../../mixins/SwitchActiveButton'
import Control from '../../controls/Coordinate'

const name = 'gv-coordinate-button'

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name)
    return {
      name: name,
      active: false,
      control: Control,
      options: options,
      cssClass: 'gv-button fa fa-hand-o-down',
      cssActiveClass: 'gv-button-selected',
    }
  },
  mixins: [SwitchActiveButton],
  methods: {
    onClick() {
      this.switchActiveButton()
      // console.log(this.options)
    },
    setClass() {
      return this.active ? this.cssClass + ' ' + this.cssActiveClass : this.cssClass
    },
  },
  mounted: function() {
  },
}
</script>

<style>

</style>