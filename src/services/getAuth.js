import axios from 'axios';

export default function getAuth(ruolo) {
  let url = '/geoservices/REST/utils/autorizza_nam/GEOVIEWER/' + ruolo;
  return axios.get(url).then(response => response.data);
}
