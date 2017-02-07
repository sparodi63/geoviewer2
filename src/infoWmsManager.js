import GV from './GV'
import * as config from './config'
import Vue from 'vue'
import mountComponent from './util/mountComponent'

import L from 'leaflet'
import parseXML from './util/parseXML'
import getParamString from './util/getParamString'
import getFeatureInfo from './services/getFeatureInfo'
import getFeatureHilite from './services/getFeatureHilite'
import getFeatureXSLT from './services/getFeatureXSLT'

var _requestCount = 0
var _numRequests = 0
var _features = []

function _request (e) {
  if (GV.app.debug) {
    console.log('start info request: ' + new Date())
  }
  _requestCount = 0
  _numRequests = 0
  _features = []

  var buildWMSOptions = function (url, layers, latlng) {
    var point = GV.map.latLngToContainerPoint(latlng, GV.map.getZoom())
    var size = GV.map.getSize()
    var bounds = GV.map.getBounds()
    var sw = GV.map.options.crs.project(bounds.getSouthWest())
    var ne = GV.map.options.crs.project(bounds.getNorthEast())
    var params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      crs: 'EPSG:3857',
      styles: '',
      version: '1.3.0',
      format: 'application/json',
      bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
      height: size.y,
      width: size.x,
      layers: layers,
      query_layers: layers,
      FEATURE_COUNT: 100,
      buffer: 10,
      info_format: 'application/json',
      i: point.x,
      j: point.y
    }

    return url + getParamString(params, url, true)
  }

  // Ciclo sulle mappe caricate
  config.maps.forEach(function (mapConfig) {
    var url = null
    var layersArray = []

    // Ciclo sui layer caricati sulla mappa leaflet
    mapConfig.layers.forEach(function (layerConfig) {
      if (layerConfig.idMap === mapConfig.id && layerConfig.type === 'WMS' && layerConfig.queryable && layerConfig.visible && GV.map.layerInRange(layerConfig)) {
        url = layerConfig.wmsParams.url
        layersArray.push(layerConfig.wmsParams.name)
      }
    })

    var layers = layersArray.join(',')

    if (url && layersArray.length > 0) {
      var wmsUrl = buildWMSOptions(url, layers, e.latlng)
      _numRequests++
      GV.map._container.style.cursor = 'progress'
      getFeatureInfo(wmsUrl).then(features => _handleResponse(features)).catch(error => console.error(error))
    }
  })
}

function _handleResponse (features) {
  _requestCount++
  features.forEach(function (feature) {
    var layerName = feature.id.split('.')[0]
    feature.layerName = layerName
    feature.layer = GV.map.getLayerByName(layerName)
    feature.label = setFeatureLabel(layerName, feature.properties)
    feature.infoOptions = feature.layer.config.infoOptions
  })
  Array.prototype.push.apply(_features, features)
  if (_requestCount === _numRequests) {
    GV.map._container.style.cursor = 'default'

    if (_features.length === 0) {
      if (GV.app.debug) {
        console.log('Nessun elemento trovato')
      }
      return
    }

    mountComponent({
      elId: 'gv-info-wms-list',
      clear: true,
      vm: new Vue({
        template: `<gv-info-wms-list :items="items"></gv-info-wms-list>`,
        data: {
          items: _features
        }
      })
    })

    if (_features.length === 1) {
      _showFeatureInfo(_features[0])
    }

    if (GV.app.debug) {
      console.log('end info request: ' + new Date())
    }
  }

  function setFeatureLabel (layerName, attributes) {
    var infoLabelAttr,
      infoIdAttr
    infoLabelAttr = getField(layerName, 'infoLabelAttr')
    infoIdAttr = getField(layerName, 'infoIdAttr')
    if (infoLabelAttr && attributes[infoLabelAttr]) {
      return attributes[infoLabelAttr]
    }
    if (infoIdAttr && attributes[infoIdAttr]) {
      return attributes[infoIdAttr]
    }
    return attributes[getFirstAttribute(attributes)]
  }

  function getField (layerName, fieldName) {
    var layerConfig = GV.map.getLayerByName(layerName).config
    return (layerConfig && layerConfig.infoOptions && layerConfig.infoOptions[fieldName]) ? layerConfig.infoOptions[fieldName] : null
  }

  function getFirstAttribute (attributes) {
    for (var i in attributes) {
      if (attributes.hasOwnProperty(i) && typeof (i) !== 'function') {
        return i
      }
    }
    return null
  }
}

function _showFeatureInfo (feature) {
  var infoOptions = feature.infoOptions
  var infoUrl = infoOptions.infoUrl

  if ((infoUrl.substr(infoUrl.length - 4) === '.xsl') || (infoUrl.substr(infoUrl.length - 5) === '.xslt')) {
    // Gestione xsl
    buildAndShowHtml(infoOptions, feature)
  } else {
    // Gestione html/asp
    if (!infoOptions.infoTarget || infoOptions.infoTarget === 'panel') {
      showPanel(infoUrl, null, infoOptions)
    } else {
      openPopup(infoUrl, null, infoOptions)
    }
  }

  function buildAndShowHtml (infoOptions, data) {
    // costruisco il gml in formato getFeatureInfo Mapserver
    let xmlDoc = buildGml(data)
    let {infoUrl, infoTarget} = infoOptions

    getFeatureXSLT(infoUrl, data).then(xslDoc => {
      // Aggiungo Nome Layer
      Array.prototype.slice.call(xslDoc.getElementsByTagName('td')).forEach(function (value, index, ar) {
        if (value.id === 'Titolo') {
          value.textContent = data.layer.legend.label
          value.text = data.layer.legend.label
        }
      })

      // applico la trasformazione xslt
      var result = xslTransform(xmlDoc, xslDoc)
      // levo i caratteri di encoding %0A e %09 dai link
      // result = result.replace(new RegExp('%0A', 'g'), '').replace(new RegExp('%09', 'g'), '').replace(new RegExp('%20', 'g'), '')
      // visualizzo il risultato
      if (!infoTarget || infoTarget === 'panel') {
        showPanel(result, null, infoOptions)
      } else {
        openPopup(result, null, infoOptions)
      }
    })

    // costruisce un documento GML in formato getFeatureInfo Mapserver
    function buildGml (feature) {
      try {
        var baseXml = '<?xml version="1.0" encoding="ISO-8859-1"?><msGMLOutput xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></msGMLOutput>'
        var xmlDoc = parseXML(baseXml)
        var layerName = `${feature.layerName}_layer`
        var layerNode = xmlDoc.createElement(layerName)
        var featureName = `${feature.layerName}_feature`
        var featureNode = xmlDoc.createElement(featureName)
        var attributes = feature.properties

        for (var key in attributes) {
          if (attributes.hasOwnProperty(key)) {
            var text = null
            if (attributes[key]) {
              text = xmlDoc.createTextNode(attributes[key])
            } else {
              text = xmlDoc.createTextNode('')
            }
            var attrNode = xmlDoc.createElement(key)
            attrNode.appendChild(text)
            featureNode.appendChild(attrNode)
          }
        }
        layerNode.appendChild(featureNode)
        xmlDoc.documentElement.appendChild(layerNode)
        return xmlDoc
      } catch (exception) {
        console.error(exception)
      }
    }

    // trasformo xml in html applicando xslt
    function xslTransform (xmlDoc, xslDoc) {
      try {
        if (window.XSLTProcessor) {
          var xsltProcessor = new XSLTProcessor()
          xsltProcessor.importStylesheet(xslDoc)
          var transformedDoc = xsltProcessor.transformToDocument(xmlDoc)
          return (new XMLSerializer()).serializeToString(transformedDoc)
        } else {
          return xmlDoc.transformNode(xslDoc)
        }
      } catch (exception) {
        console.error(exception)
      }
    }
  }

  // apre una panel div con un documento html
  function showPanel (html, url, configOptions) {
    if (html) {
      mountComponent({
        elId: 'gv-info-wms-html',
        vm: new Vue({
          template: '<gv-info-wms-html v-draggable :html="html" :height="height" :width="width" :title="title"></gv-info-wms-html>',
          data: {
            title: 'Risultato Info',
            html: html,
            width: configOptions.infoWidth || 400,
            height: configOptions.infoHeight || 300
          }
        })
      })
    } else {
      // TODO
      // 1 - faccio request dell'html
      // 2 - sostituisco variabile con valore - prerequisito: deve esistere un attributo con nome uguale alla variabile
      // es: se infoUrl e' http://pippo/pluto.asp?id=${gid} deve esistere attributo "gid" in attributes della feature
      // var infoUrl = OpenLayers.String.format(configOptions.infoUrl, data.attributes)
      // 3 - creo il pannello html
      // createHtmlPanel (html, configOptions)
    }
  }

  function openPopup (html, url, options) {
    var width = options.infoWidth || 400
    var height = options.infoHeight || 500
    var popup = window.open(url, '', `status=yes, toolbar=yes, menubar=no, width=${width}, height=${height}, resizable=yes, scrollbars=yes`)

    popup.document.open()
    popup.document.write(html)
    popup.document.close()
    popup.focus()
  }

  getFeatureHilite(feature).then(features => {
    const layer = GV.map.getLayerByName('InfoWmsHilite')
    if (features && features[0] && features[0].geometry) {
      layer.clearLayers()
      layer.addData(features[0].geometry)
      GV.map.fitBounds(layer.getBounds(), {maxZoom: 15})
      GV.map._container.style.cursor = 'default'
    }
  }).catch(error => {
    console.error(error)
  })
}

export default {
  activate: function () {
    if (GV.app.debug) {
      console.log('GV.app.infoWmsManager.activate')
    }
    // Aggiungo layer per evidenziazione
    GV.map.loadLayers([{
      name: 'InfoWmsHilite',
      type: 'JSON',
      style: {
        'color': '#ffcc00',
        'fillOpacity': 0,
        'weight': 6,
        'opacity': 0.6
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          'radius': 8,
          'color': '#ffcc00',
          'fillColor': '#ffcc00',
          'fill': true,
          'fillOpacity': 0.6,
          'weight': 6,
          'opacity': 0.6
        })
      },
      visible: true
    }])
    // Attivo evento click
    GV.map.on('click', _request)
  },

  deactivate: function () {
    GV.map.off('click')
  },

  showFeatureInfo: _showFeatureInfo
}

