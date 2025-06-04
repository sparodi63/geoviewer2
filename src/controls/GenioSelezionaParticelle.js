import mountComponent from '../util/mountComponent'
import Vue from 'vue'
Vue.component('gv-genio-seleziona-particelle-panel', () =>
  import('../components/GenioSelezionaParticelle.vue'))

const Control = {
  id: 'genio-seleziona-particelle',
  active: false,
  latlng: null,
  activate() {
    GV.log('GV.controls.genio-seleziona-particelle.activate')
    this.openPanel()
    GV.eventBus.$emit("gv-control-genio-seleziona-particelle-activate", this);
    this.active = true
  },
  deactivate() {
    GV.log('GV.controls.genio-seleziona-particelle.deactivate')
    GV.eventBus.$emit("gv-control-genio-seleziona-particelle-deactivate", this);
    this.active = false
    this.closePanel()
  },
  openPanel() {
    mountComponent({
      elId: 'gv-genio-seleziona-particelle-panel',
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-genio-seleziona-particelle-panel></gv-genio-seleziona-particelle-panel>`,
      }),
    })
  },
  closePanel() {
    document.getElementById('gv-genio-seleziona-particelle-panel').style.display = 'none'
    //Hide del pannello
  },
}

export default Control
