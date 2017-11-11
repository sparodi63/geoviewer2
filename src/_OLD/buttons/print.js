import GV from '../GV'
import globals from '../globals'
import easyButton from '../controls/EasyButton'

GV.Buttons.print = function (btnOptions, map) {
  'use strict'
  if (globals.SMALL_SCREEN) {
    return null
  }

  var options = Object.assign(btnOptions, {
    leafletClasses: true,
    states: [{
      stateName: 'print',
      onClick: function (button, map) {
        console.log('print')
      },
      title: 'Stampa',
      icon: 'fa-print'
    }]
  })

  return L.easyButton(options)
}