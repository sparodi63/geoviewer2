import axios from 'axios';

export default async function(codProv, codicePratica) {
  const url = `/geoservices/REST/genioweb/pratiche_collegate/${codProv}/${codicePratica}`;
  const response = await axios.get(url);
  return response.data.data;
}
