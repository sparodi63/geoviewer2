import axios from 'axios';

export default async function getAuth(app, ruolo, test) {
  let url = `/geoservices/REST/utils/autorizza_nam/${app}/${ruolo}`;
  let response = await axios.get(url);
  return response.data;
}
