
import axios from 'axios'
import globals from '../globals'

export default function getEnti () {
  let url = globals.RL_ENTI_SERVICE
  return axios.get(url).then(response => response.data.data)
}
