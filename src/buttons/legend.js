import GV from '../GV'
import * as config from '../config'
import globals from '../globals'
import L from 'leaflet'
import easyButton from '../controls/EasyButton'

GV.Buttons.legend = function (btnOptions, map) {
  'use strict'

  // Al primo avvio se schermo piccolo nascondo la legenda
  if (globals.SMALL_SCREEN) {
    config.setButtonOption('legend', 'show', false)
  }

  var options = Object.assign(btnOptions, {
    leafletClasses: true,
    states: [{
      stateName: 'legend',
      onClick: function (button, map) {
        config.setButtonOption('legend', 'show', true)
      },
      title: 'Legenda',
      icon: 'ms ms-layers'
    }]
  })

  return L.easyButton(options)
}
