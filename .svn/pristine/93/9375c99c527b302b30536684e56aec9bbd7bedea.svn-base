
import axios from 'axios'
import globals from '../globals'

export default function getScheda (idMap) {
  let url = `${window.location.href.split(':')[0]}://${globals.RL_SCHEDA_SERVICE}/${idMap}`

  return axios.get(url).then(response => response.data.data)
}