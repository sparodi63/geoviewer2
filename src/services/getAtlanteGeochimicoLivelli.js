import axios from 'axios'


export default function () {
  return axios.get(`/geoservices/REST/atlante_geochimico/livelli/`).then(response => response.data.data.livelli)
}
