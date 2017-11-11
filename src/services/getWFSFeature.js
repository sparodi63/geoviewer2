import axios from 'axios'
import globals from '../globals'

function buildWFSUrl(feature) {
    const layerConfig = feature.layer.config
    const wsName = `M${layerConfig.idMap}`
    const baseUrl = globals.DEFAULT_PROXY + layerConfig.wfsParams.url.replace(`/${wsName}`, '') + 'service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson'
    const idAttr = (layerConfig.cachePostGIS) ? layerConfig.infoOptions.infoIdAttr.toLowerCase() : layerConfig.infoOptions.infoIdAttr
    const cqlFilter = `${idAttr}=${feature.properties[layerConfig.infoOptions.infoIdAttr]}`

    const url = `${baseUrl}&typeName=${wsName}:${layerConfig.wfsParams.typeName}&cql_filter=${cqlFilter}`
    return url
}

export default function getWFSFeature(feature) {
    const url = buildWFSUrl(feature)
    let params = {}

    return axios.get(url, {
        params: params
    }).then(response => response.data.features)
}