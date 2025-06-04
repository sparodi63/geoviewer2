import axios from "axios";
import globals from "../globals";

export default function(denomCorpo) {
  let url = "/geoservices/REST/sigmater/reticolo/";
  if (denomCorpo) url += denomCorpo;
  return axios.get(url).then(response => response.data.data);
}
