import axios from 'axios'
import globals from '../globals'

export default function (prov) {
  let url = '/geoservices/REST/sigmater/comuni/'
  if (prov) url += prov
  return axios.get(url).then(response => response.data.data)
}
