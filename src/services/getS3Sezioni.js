import axios from 'axios'
import globals from '../globals'

export default function(codCom) {
  let url = '/geoservices/REST/sigmater/sezioni/' + codCom
  return axios.get(url).then(response => response.data.data)
}
