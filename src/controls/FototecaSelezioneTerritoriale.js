import mountComponent from '../util/mountComponent'
import Vue from 'vue'
Vue.component('gv-fototeca-selezione-territoriale-panel', () =>
  import('../components/FototecaSelezioneTerritoriale.vue'))

const Control = {
  id: 'fototeca-selezione-territoriale',
  active: false,
  latlng: null,
  activate() {
    GV.log('GV.controls.fototeca-selezione-territoriale.activate')
    this.openPanel()
    GV.eventBus.$emit("gv-control-fototeca-selezione-territoriale-activate", this);
    this.active = true
  },
  deactivate() {
    GV.log('GV.controls.fototeca-selezione-territoriale.deactivate')
    GV.eventBus.$emit("gv-control-fototeca-selezione-territoriale-deactivate", this);
    this.active = false
    this.closePanel()
  },
  openPanel() {
    mountComponent({
      elId: 'gv-fototeca-selezione-territoriale-panel',
      containerId: GV.config.containerId,
      toggleEl: true,
      vm: new Vue({
        template: `<gv-fototeca-selezione-territoriale-panel></gv-fototeca-selezione-territoriale-panel>`,
      }),
    })
  },
  closePanel() {
    document.getElementById('gv-fototeca-selezione-territoriale-panel').style.display = 'none'
    //Hide del pannello
  },
}

export default Control

