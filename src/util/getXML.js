import Vue from 'vue'
import isBrowserIE from './isBrowserIE'

export default function getXML (options, callback) {
  // TODO gestire metodo POST
  let {url, data} = options

  Vue.http.get(url, {params: data, headers: {'Accept': 'text/plain'}}).then(done).catch(error => console.error(error))

  function done (response) {
    try {
      let xml = null
      if (isBrowserIE()) {
        let xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
        xmlDoc.async = 'false'
        xmlDoc.loadXML(response.body)
        xml = xmlDoc
      } else {
        var parser = new DOMParser()
        xml = parser.parseFromString(response.body, 'text/xml')
      }
      callback(xml)
    } catch (exception) {
      console.error(exception)
    }
  }
}
