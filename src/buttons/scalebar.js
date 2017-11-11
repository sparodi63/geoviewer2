import Vue from 'vue'

GV.Buttons.scalebar = function(btnOptions, map) {
  const containerId = 'gv-button-scalebar'
  const componentId = 'gv-scalebar'

  const Button = L.Control.extend({
    onAdd: function(map) {
      let container = document.createElement('div')
      container.id = containerId
      container.className = 'leaflet-bar leaflet-control'
      L.DomEvent.disableClickPropagation(container)
      return container
    },
  })

  Vue.component('gv-scalebar', () => import('../Components/Scalebar.vue'))
  btnOptions.vueComponent = { containerId: containerId, id: componentId }

  return new Button(btnOptions)
}
