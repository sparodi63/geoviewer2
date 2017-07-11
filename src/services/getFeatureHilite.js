
import axios from 'axios'

function buildWFSUrl (feature) {
  const config = feature.layer.config
  const wsName = `M${config.idMap}`
  const baseUrl = '/geoservices/proxy/proxy.jsp?url=' + config.wfsParams.url.replace(`/${wsName}`, '') + 'service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson'
  const idAttr = (config.cachePostGIS)? config.infoOptions.infoIdAttr.toLowerCase() : config.infoOptions.infoIdAttr

  // var url = globals.DEFAULT_PROXY
  return `${baseUrl}&typeName=${wsName}:${config.wfsParams.typeName}&cql_filter=${idAttr}=${feature.properties[config.infoOptions.infoIdAttr]}`
}

export default function getFeatureHilite (feature) {
  const url = buildWFSUrl(feature)
  let params = {}

  return axios.get(url, {
    params: params
  }).then(response => response.data.features)
}