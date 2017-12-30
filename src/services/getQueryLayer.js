import axios from 'axios'
import globals from '../globals'

export default function (idLayer, column, dataType, value, operator, offset, limit) {
  let url = `${globals.RL_QUERY_LAYER_SERVICE}${idLayer}?column=${column}&datatype=${dataType}&offset=${offset}&limit=${limit}&value=${value}&operator=${operator}&map_projection=EPSG:3857`
  let params = {}
  return axios.get(url, {
    params: params,
  })
}
