import GV from '../GV'
import util from '../util'
var L = require('leaflet')
require('../controls/Search')

GV.Buttons.search = function (btnOptions, map) {
  'use strict'

  // ATTENZIONE!!!!
  // BOTTONE SEARCH DEVE ESSERE CARICATO DOPO IL CARICAMENTO DEI LAYER
  // NON PUO' ESSERE DEFINITO IN CONFIGURAZIONE TOOLBAR MA AGGIUNTO NELLA BOTTONIERA NEL CALLBACK
  // VEDI SCUOLADIGITALE
  // ATTENZIONE!!!!
  // RICORDARSI DI INCLUDERE STILE PER CONTROL IN CSS
  var layers = []
  btnOptions.layers.forEach(function (layerName) {
    var layer = map.getLayerByName(layerName)
    if (layer) {
      layers.push(layer)
    }
  })
  if (layers.length === 0) {
    util.log('bottone search: layer non trovato.', 2)
    return
  }
  btnOptions.layer = L.layerGroup(layers)

  return new L.Control.Search(btnOptions)
}
