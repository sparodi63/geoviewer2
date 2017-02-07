
import axios from 'axios'
import globals from '../globals'

export default function getCatalog (params = {}) {
  let url = `${window.location.href.split(':')[0]}://${globals.RL_CATALOG_SERVICE}`
  if (params.idMap) {
    url += params.idMap
  }

  return axios.get(url, {
    params: params
  }).then(response => response.data.data)
}