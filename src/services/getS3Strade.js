import axios from "axios";
import globals from "../globals";

export default function(codCom) {
  let url = "/geoservices/REST/sigmater/strade/" + codCom;
  return axios.get(url).then(response => response.data.data);
}
