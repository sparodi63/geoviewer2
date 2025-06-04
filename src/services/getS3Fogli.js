import axios from 'axios'
import globals from '../globals'

export default function(codCom, codSez) {
  let url = '/geoservices/REST/sigmater/fogli/' + codCom + '/' + codSez
  return axios.get(url).then(response => response.data.data)
}
