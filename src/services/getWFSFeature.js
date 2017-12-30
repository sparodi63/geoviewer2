import axios from 'axios'
import globals from '../globals'

function buildWFSUrl(layers, cqlFilter) {
    const layerBaseConfig = GV.config.getLayerConfig(layers[0])
    const wsName = `M${layerBaseConfig.idMap}`
    const baseUrl = globals.DEFAULT_PROXY + layerBaseConfig.wfsParams.url.replace(`/${wsName}`, '') + 'service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson'

    let types = []
    layers.forEach(layer => {
        const layerConfig = GV.config.getLayerConfig(layer)
        types.push(`${wsName}:${layerConfig.wfsParams.typeName}`)
    });
    const typeName = types.join(',')

    const url = `${baseUrl}&typeName=${typeName}&cql_filter=${cqlFilter}`
    return url
}

export default function getWFSFeature(layers, cqlFilter) {
    const url = buildWFSUrl(layers, cqlFilter)
    let params = {}
    return axios.get(url, {
        params: params
    }).then(response => response.data.features)
}