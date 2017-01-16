import GV from '../GV'
var L = require('leaflet')
require('../controls/Locate')

GV.Buttons.locate = function (btnOptions, map) {
  'use strict'

  return new L.Control.Locate(btnOptions)
}