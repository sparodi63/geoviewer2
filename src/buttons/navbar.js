import isTouch from '../util/isTouch'
import GV from '../GV'
import L from 'leaflet'

GV.Buttons.navbar = function (btnOptions, map) {
  'use strict'

  if (isTouch()) {
    return null
  }
  return L.control.navbar(btnOptions)
}