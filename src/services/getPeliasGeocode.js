import axios from 'axios';

export default function(query) {
  const params = {
    // 'boundary.gid': 'whosonfirst:macroregion:404227507',
    text: query,
  };

  return axios
    .get('https://srvcarto.regione.liguria.it/geoservices/REST/proxy/pelias_geocode', {
      params: params,
    })
    .then(response => {
      return response.data;
    });
}
