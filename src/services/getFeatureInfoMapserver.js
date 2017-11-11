import axios from 'axios'
var X2JS = require('../util/X2JS')

function parseGml(gml) {
  const data = new X2JS().xml_str2json(gml)
  let features = []
  Object.keys(data.msGMLOutput).forEach((key, index) => {
    if (key.indexOf('_layer') >= 0) {
      const layerName = key.replace('_layer', '')
      const layer = data.msGMLOutput[key]
      Object.keys(layer).forEach((key2, index2) => {
        const feature = layer[key2]
        if (Array.isArray(feature)) {
          feature.forEach(value => {
            const properties = value
            features.push({ type: 'Feature', id: `${layerName}.${index2}`, geometry: null, properties: properties })
          })
        } else {
          const value = feature
            const properties = value
            features.push({ type: 'Feature', id: `${layerName}.${index2}`, geometry: null, properties: properties })
        }
      })
    }
  })
  return features
}

export default function getFeatureInfo(url) {
  let params = {}

/*   
const gml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<msGMLOutput 
	 xmlns:gml="http://www.opengis.net/gml"
	 xmlns:xlink="http://www.w3.org/1999/xlink"
	 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<L2585_layer>
		<L2585_feature>
			<gml:boundedBy>
				<gml:Box srsName="EPSG:3857">
					<gml:coordinates>1007787.923553,5531364.804766 1012213.517105,5534298.913668</gml:coordinates>
				</gml:Box>
			</gml:boundedBy>
			<NUM_PROGR>2</NUM_PROGR>
			<COD_ZONA>Eb</COD_ZONA>
			<DESCR_ZONA>zone boschive</DESCR_ZONA>
    </L2585_feature>
		<L2585_feature>
			<gml:boundedBy>
				<gml:Box srsName="EPSG:3857">
					<gml:coordinates>1007787.923553,5531364.804766 1012213.517105,5534298.913668</gml:coordinates>
				</gml:Box>
			</gml:boundedBy>
			<NUM_PROGR>4</NUM_PROGR>
			<COD_ZONA>Eb</COD_ZONA>
			<DESCR_ZONA>zone boschive</DESCR_ZONA>
		</L2585_feature>    
	</L2585_layer>
</msGMLOutput>
`
const features = parseGml(gml)
return features
*/

  return axios
    .get(url, {
      params: params,
    })
    .then(response => {
      const gml = response.data
      const features = parseGml(gml)
      return features
    })
}
