import mountComponent from "../util/mountComponent";
import Vue from "vue";
Vue.component("gv-draw-panel", () => import("../components/Draw.vue"));

const Control = {
  id: "draw",
  active: false,
  latlng: null,
  activate() {
    GV.log("GV.controls.draw.activate");
    GV.eventBus.$emit("gv-control-draw-activate", this);
    this.active = true;
    this.openPanel();
  },
  deactivate() {
    GV.log("GV.controls.draw.deactivate");
    GV.eventBus.$emit("gv-control-draw-deactivate", this);
    this.active = false;
    this.closePanel();
  },
  openPanel() {
    mountComponent({
      elId: "gv-draw-panel",
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-draw-panel></gv-draw-panel>`
      })
    });
  },
  closePanel() {
    document.getElementById("gv-draw-panel").style.display = "none";
  }
};

export default Control;
