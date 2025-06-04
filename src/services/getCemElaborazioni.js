import axios from 'axios'
import globals from '../globals'

export default function () {
  return axios.get(`/geoservices/REST/cem/elaborazioni/`).then(response => response.data.data)
}
