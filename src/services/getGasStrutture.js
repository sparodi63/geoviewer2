import axios from 'axios'

export default function(url) {
  return axios.get(url).then(response => response.data.features)
}
