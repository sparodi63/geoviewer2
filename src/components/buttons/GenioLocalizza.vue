<template>
  <button
    id="gv-button-genio-localizza"
    title="Localizzazione"
    @click="onClick"
    :class="setClass()"
  />
</template>

<script>
import mountComponent from "../../util/mountComponent";
import Vue from "vue";
import { Button } from "element-ui";
Vue.use(Button);

Vue.component("gv-genio-localizza", () => import("../GenioLocalizza.vue"));

const name = "gv-genio-localizza-button";

export default {
  name: name,
  data() {
    const options = GV.config.getToolOptions(name);
    return {
      active: false,
      options: options,
      cssClass: "gv-genio-localizza-button gv-button ms ms-select-hand",
      cssActiveClass: "gv-button-selected"
    };
  },

  methods: {
    onClick() {
      mountComponent({
        elId: "gv-genio-localizza",
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-genio-localizza></gv-genio-localizza>`
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
    // mountComponent({
    //   elId: "gv-genio-localizza",
    //   containerId: GV.config.containerId,
    //   toggleEl: true,
    //   vm: new Vue({
    //     template: `<gv-genio-localizza></gv-genio-localizza>`
    //   })
    // });
  }
};
</script>

<style>
.gv-genio-localizza-button {
  font-size: 12px;
}
</style>