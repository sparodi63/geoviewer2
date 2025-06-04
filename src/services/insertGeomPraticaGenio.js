import axios from "axios";
import globals from "../globals";

export default function(data) {
  return axios
    .post("/geoservices/REST/genioweb/insert_geom_pratica", {
      headers: { Accept: "text/xml" },
      data: data
    })
    .then(response => response.data);
}
