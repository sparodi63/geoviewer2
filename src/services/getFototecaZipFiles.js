import axios from 'axios';

export default function(data) {
  return axios
    .post('/geoservices/REST/fototeca/zip_files', {
      headers: {
        Accept: 'text/xml',
      },
      data: data,
    })
    .then(response => response.data);
}
