import axios from 'axios'
import globals from '../globals'

export default function(idLayer, geoserverUrl,flagGeoserver) {
  if (!idLayer || idLayer === 'null') {
    throw new Error('Parametro idLayer mancante')
  }

  let params = {}
  if (geoserverUrl) {
    params.geoserverUrl = geoserverUrl
  }
  if (flagGeoserver) {
    params.flagGeoserver = flagGeoserver
  }

  return axios
    .get(`${globals.RL_LAYER_CONFIG_SERVICE}${idLayer}`, {
      params: params,
    })
    .then(response => response.data.data)
}
