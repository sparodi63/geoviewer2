import axios from 'axios'
import globals from '../globals'
import {
  Loading
} from "element-ui";

function buildWFSUrl(layers, cqlFilter) {
  const layerBaseConfig = GV.config.getLayerConfig(layers[0])
  if (!layerBaseConfig) return null
  const wsName = `M${layerBaseConfig.idMap}`
  const baseUrl = globals.DEFAULT_PROXY + layerBaseConfig.wfsParams.url.replace(`/${wsName}`, '') + 'service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson'

  let types = []
  layers.forEach(layer => {
    const layerConfig = GV.config.getLayerConfig(layer)
    types.push(`${wsName}:${layerConfig.wfsParams.typeName}`)
  })
  const typeName = types.join(',')

  const url = `${baseUrl}&typeName=${typeName}&cql_filter=${cqlFilter}`
  return url
}

export default function getWFSFeature(layers, cqlFilter, wfsUrl) {
  const url = layers ? buildWFSUrl(layers, cqlFilter) : wfsUrl
  if (!url) return
  let loading = Loading.service({
    text: "Attendere...",
    background: "rgba(0, 0, 0, 0.8)"
  });
  return axios.get(url).then(response => {
    loading.close();
    return response.data.features
  })
}
