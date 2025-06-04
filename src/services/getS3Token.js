import axios from 'axios';

export default function(token, type, prov) {
  let url =
    type && type === 'genio' && prov
      ? '/geoservices/REST/genioweb/get_token/' + prov + '/'
      : '/geoservices/REST/sigmater/get_token/';
  url += token;
  return axios.get(url).then(response => response.data);
}
