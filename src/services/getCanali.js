import axios from 'axios'
import globals from '../globals'

export default function getCanali (params = { applicazione: 'ECO3', tematici: 'SI'}) {
  let url = `${window.location.href.split(':')[0]}://${globals.RL_CANALI_SERVICE}`

  url += params.applicazione
  url += '/' + params.tematici

  return axios.get(url).then(response => response.data.data)
}
