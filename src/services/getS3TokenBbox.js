import axios from "axios";

export default function (token) {
  let url = "/geoservices/REST/sigmater/get_token_bbox/" + token;
  return axios.get(url).then(response => response.data);
}
