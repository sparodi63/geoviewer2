GV.Buttons.div = function(btnOptions, map) {

  const containerId = 'gv-button-div'

  const Button = L.Control.extend({
    onAdd: function(map) {
      let container = document.createElement('div')
      container.id = containerId
      container.className = 'leaflet-bar leaflet-control'
      container.innerHTML = btnOptions.html
      return container
    },
  })

  return new Button(btnOptions)
}
