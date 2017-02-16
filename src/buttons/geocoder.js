import GV from '../GV'
import * as config from '../config'
import L from 'leaflet'
import mountComponent from '../util/mountComponent'
import Vue from 'vue'

require('../controls/EasyButton')

GV.Buttons.geocoder = function (btnOptions, map) {
  'use strict'

  const options = Object.assign(btnOptions, {
    leafletClasses: true,
    id: 'gv-btn-geocoder',
    states: [{
      stateName: 'geocoder',
      onClick: function (button, map) {
        mountComponent({
          elId: 'gv-geocoder',
          vm: new Vue({
            template: '<gv-geocoder></gv-geocoder>'
          }),
          toggleEl: true
        })
        // Allineo div Geocoder al bottone
        const rect = document.getElementById('gv-btn-geocoder').getBoundingClientRect()
        document.getElementById('gv-geocoder').style.top = `${rect.top}px`
        document.getElementById('gv-geocoder').style.marginLeft = `${rect.right}px`
      },
      title: 'Ricerca Indirizzo...',
      icon: 'ms ms-search-zoom'
    }]

  })

  return L.easyButton(options)
}
