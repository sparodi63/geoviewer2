import axios from 'axios'
import isBrowserIE from '../util/isBrowserIE'

export default function(idSession, coord_x, coord_y, esito) {
  const url = `/geoservices/REST/config/ag_insert_coordinate?idSession=${idSession}&coord_x=${coord_x}&coord_y=${coord_y}&esito=${esito}`
  axios.get(url).then(response => {
    GV.globals.flagInsert = true
    if (!response.data.success) {
      alert('Attenzione: - ' + response.data.message)
    } else {
      GV.globals.flagInsert = true
      if (isBrowserIE()) {
        window.history.back(-1)
      } else {
        window.close()
      }
    }
  })
}
