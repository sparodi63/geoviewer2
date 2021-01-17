import axios from 'axios';

export default function(query) {
  const params = {
    'boundary.gid': 'whosonfirst:macroregion:404227507',
    text: query,
  };

  return axios
    .get('http://10.11.6.189:4000/v1/search', {
      params: params,
    })
    .then(response => {
      return response.data;
    });
}
