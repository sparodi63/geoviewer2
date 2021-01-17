<template>
  <button
    id="gv-button-cem-elaborazioni"
    title="Lista Elaborazioni"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import mountComponent from "../../util/mountComponent";

import Vue from "vue";
import { Button } from "element-ui";
Vue.use(Button);

Vue.component("gv-cem-elaborazioni", () => import("../CemElaborazioni.vue"));

const name = "gv-cem-elaborazioni-button";

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);

    return {
      active: false,
      options: options,
      cssClass: "gv-cem-elaborazioni gv-button fa fa-magnet",
      cssActiveClass: "gv-button-selected"
    };
  },

  methods: {
    onClick() {
      mountComponent({
        elId: "gv-cem-elaborazioni",
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-cem-elaborazioni></gv-cem-elaborazioni>`
        })
      });
    },
    setClass() {
      return this.active
        ? this.cssClass + " " + this.cssActiveClass
        : this.cssClass;
    }
  },
  mounted: function() {
    mountComponent({
      elId: "gv-cem-elaborazioni",
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-cem-elaborazioni></gv-cem-elaborazioni>`
      })
    });
  }
};
</script>

<style>
.gv-add-map {
  font-size: 12px;
}
</style>