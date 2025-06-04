import axios from 'axios';
import isBrowserIE from '../util/isBrowserIE';

export default function(
  idSession,
  coord_x,
  coord_y,
  esito,
  coord_z,
  coord_2_x,
  coord_2_y,
  coord_2_z,
  epsg
) {
  let url = `/geoservices/REST/config/ag_insert_coordinate?idSession=${idSession}&coord_x=${coord_x}&coord_y=${coord_y}&esito=${esito}`;
  if (coord_z) {
    url += '&coord_z=' + coord_z;
  }
  if (coord_2_x) {
    url += '&coord_2_x=' + coord_2_x;
  }
  if (coord_2_y) {
    url += '&coord_2_y=' + coord_2_y;
  }
  if (coord_2_z) {
    url += '&coord_2_z=' + coord_2_z;
  }
  if (epsg) {
    url += '&epsg=' + epsg;
  }
  axios.get(url).then(response => {
    GV.globals.flagInsert = true;
    if (!response.data.success) {
      alert('Attenzione: - ' + response.data.message);
    } else {
      GV.globals.flagInsert = true;
      if (isBrowserIE()) {
        window.history.back(-1);
      } else {
        window.close();
      }
    }
  });
}
