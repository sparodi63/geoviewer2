import axios from 'axios'
import globals from '../globals'

export default function getCoordTransformBbox(srsIn, srsOut, bbox) {
  let url = `${globals.RL_TRANSFORM_BBOX_SERVICE}${srsIn}/${srsOut}/${bbox}`
  return axios.get(url, {})
}
