
import axios from 'axios'
import globals from '../globals'

export default function getGoogleGeocode(query) {
  const url = `${window.location.href.split(':')[0]}://${globals.GOOGLE_GEOCODE_PROXY}&address=${query}`
  const params = {}

  return axios.get(url, {
    params: params
  }).then(response => response.data.results)
}