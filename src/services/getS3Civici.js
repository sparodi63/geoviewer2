import axios from 'axios'
import globals from '../globals'

export default function (codCom, codSez, codStrada) {
  let url = '/geoservices/REST/sigmater/civici/' + codCom + '/' + codSez + '/' + codStrada
  return axios.get(url).then(response => response.data.data)
}
