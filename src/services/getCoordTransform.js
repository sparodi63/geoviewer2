import axios from 'axios'
import globals from '../globals'

export default function getCoordTransform(srsIn, srsOut, x, y) {
    // let url = `/geoservices/apps/proxy/proxy.jsp?url=http://dts-parodi_s/geoservices/REST/coordinate/transform_point/${srsIn}/${srsOut}/${x},${y}`
    let url = `${globals.RL_TRANSFORM_POINT_SERVICE}${srsIn}/${srsOut}/${x},${y}`
    return axios.get(url, {})
}