import axios from 'axios';
import globals from '../globals';

export default function(bbox) {
  let url = '/geoservices/REST/fototeca/voli/';
  if (bbox) url += '?bbox=' + bbox;
  return axios.get(url).then(response => response.data.data);
}
