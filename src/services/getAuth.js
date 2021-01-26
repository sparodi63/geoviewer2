import axios from 'axios';

export default async function getAuth(ruolo) {
  let url = `/geoservices/REST/utils/autorizza_nam/GEOVIEWER/${ruolo}`;
  let response = await axios.get(url);
  return response.data;
}
