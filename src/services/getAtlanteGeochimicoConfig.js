import axios from "axios";

export default function() {
  const url = GV.globals.ATLANTE_GEOCHIMICO_CONFIG_URL;
  return axios.get(url).then(response => response.data.data);
}
