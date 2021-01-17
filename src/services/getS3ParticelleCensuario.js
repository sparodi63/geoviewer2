import axios from 'axios'
import globals from '../globals'

export default function (codCom, codSez, codStrada, codCivico) {
  let url = '/geoservices/REST/sigmater/particelle_censuario/' + codCom + '/' + codSez + '/' + codStrada + '/' + codCivico
  return axios.get(url).then(response => response.data.data)
}
