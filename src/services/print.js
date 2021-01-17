import axios from 'axios'

export default function(data) {
  return axios
    .post('/geoservices/REST/gv_print/print', {
      headers: { Accept: 'text/xml' },
      data: data,
    })
    .then(response => response.data)
}
