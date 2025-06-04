import axios from 'axios'
import globals from '../globals'

export default function(codCom, codSez, codFoglio) {
  let url = '/geoservices/REST/sigmater/particelle/' + codCom + '/' + codSez + '/' + codFoglio
  return axios.get(url).then(response => response.data.data)
}
