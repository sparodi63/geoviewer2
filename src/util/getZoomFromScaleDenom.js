import globals from '../globals'

export default function getZoomFromScaleDenom (scaleDenom) {
  return globals.BASE_SCALES.findIndex(function (scale) {
    return scaleDenom > scale
  })
}

