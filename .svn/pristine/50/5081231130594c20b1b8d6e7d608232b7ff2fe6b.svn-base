import GV from '../GV'
import isTouch from '../util/isTouch'
import L from 'leaflet'

GV.Buttons.zoom = function (btnOptions, map) {
  'use strict'
  if (isTouch()) {
    return null
  }

  return L.control.zoom(btnOptions)
}
