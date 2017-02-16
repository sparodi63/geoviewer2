
import axios from 'axios'
import * as config from '../config'
import globals from '../globals'

export default function getConfig(idMap,app = 'generico') {
  if (!idMap || idMap === 'null') {
    throw new Error('Parametro idMap mancante')
  }

  let url = `${window.location.href.split(':')[0]}://${globals.RL_MAP_CONFIG_SERVICE}${idMap}?app=${app}`
  let params = {}
  if (config.geoserverUrl) {
    params.geoserverUrl = config.geoserverUrl
  }

  return axios.get(url, {
    params: params
  })
}