import mountComponent from '../util/mountComponent'
import Vue from 'vue'
Vue.component('gv-cdu-seleziona-particelle-panel', () =>
  import('../components/CduSelezionaParticelle.vue'))

const Control = {
  id: 'cdu-seleziona-particelle',
  active: false,
  latlng: null,
  activate() {
    GV.log('GV.controls.cdu-seleziona-particelle.activate')
    this.openPanel()
    GV.eventBus.$emit("gv-control-cdu-seleziona-particelle-activate", this);
    this.active = true
  },
  deactivate() {
    GV.log('GV.controls.cdu-seleziona-particelle.deactivate')
    GV.eventBus.$emit("gv-control-cdu-seleziona-particelle-deactivate", this);
    this.active = false
    this.closePanel()
  },
  openPanel() {
    mountComponent({
      elId: 'gv-cdu-seleziona-particelle-panel',
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-cdu-seleziona-particelle-panel></gv-cdu-seleziona-particelle-panel>`,
      }),
    })
  },
  closePanel() {
    document.getElementById('gv-cdu-seleziona-particelle-panel').style.display = 'none'
    //Hide del pannello
  },
}

export default Control

