export default function parseXML (xmlString) {
  try {
    var xmlDoc = null
    if (window.DOMParser && window.XSLTProcessor) {
      var parser = new DOMParser()
      xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    } else {
      xmlDoc = new ActiveXObject('Msxml2.DOMDocument.3.0')
      xmlDoc.async = false
      xmlDoc.loadXML(xmlString)
    }
    return xmlDoc
  } catch (exception) {
    throw new Error('GV.util.parseXml: errore parsing xml - ' + exception.message)
  }
}
