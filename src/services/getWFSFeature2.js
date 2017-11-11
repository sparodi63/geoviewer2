import axios from 'axios'
import globals from '../globals'

function buildWFSUrl(layerName, cqlFilter) {
    const layerConfig = GV.config.getLayerConfig(layerName)
    const wsName = `M${layerConfig.idMap}`
    const baseUrl = globals.DEFAULT_PROXY + layerConfig.wfsParams.url.replace(`/${wsName}`, '') + 'service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson'
    const url = `${baseUrl}&typeName=${wsName}:${layerConfig.wfsParams.typeName}&cql_filter=${cqlFilter}`
    return url
}

export default function getWFSFeature(layerName, cqlFilter) {
    const url = buildWFSUrl(layerName, cqlFilter)
    let params = {}
    debugger

    return axios.get(url, {
        params: params
    }).then(response => response.data.features)
}