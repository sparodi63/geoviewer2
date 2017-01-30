
import axios from 'axios'
import parseXML from '../util/parseXML'

export default function getFeatureXSLT (infoUrl, data) {
  return axios.get('/geoservices/REST/config/xsl_info_service?', {
    headers: {
      'Accept': 'text/xml'
    },

    params: {
      xslUrl: infoUrl,
      ambiente: null,
      idLayer: data.layerName.replace('L', ''),
      featureAttributes: data.properties
    }
  }).then(response => response.data).then(data => parseXML(data))
}
