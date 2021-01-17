import axios from 'axios'
import globals from '../globals'

export default function getCatalog(params = {}) {
  let url = globals.RL_CATALOG_SERVICE
  if (params.idMap) {
    url += params.idMap
  }
  params.cat = GV.globals.RL_CATALOG
  return axios.get(url, { params: params }).then(response => response.data.data)
}
