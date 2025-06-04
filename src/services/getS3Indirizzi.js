import axios from "axios";
import globals from "../globals";

export default function(codCom, query) {
  let url = "/geoservices/REST/sigmater/indirizzi/" + codCom;
  if (query) url += "?query=" + query;
  return axios.get(url).then(response => response.data.data);
}
