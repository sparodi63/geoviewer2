import globals from '../globals';
import Vue from 'vue';
import mountComponent from '../util/mountComponent';
import parseXML from '../util/parseXML';
import stringFormat from '../util/stringFormat';
import getParamString from '../util/getParamString';
import getFeatureInfo from '../services/getFeatureInfo';
import getFeatureInfoXML from '../services/getFeatureInfoXML';
import getFeatureInfoGeojson from '../services/getFeatureInfoGeojson';
import getFeatureInfoText from '../services/getFeatureInfoText';
import getWFSFeature from '../services/getWFSFeature';
import getFeatureXSLT from '../services/getFeatureXSLT';
import notification from '../util/notification';
// import startLoadingService from './util/startLoadingService'
// import stopLoadingService from './util/stopLoadingService'

var _requestCount = 0;
var _numRequests = 0;
var _features = [];

function _request(event) {
  GV.log('start info request: ' + new Date());

  _requestCount = 0;
  _numRequests = 0;
  _features = [];

  // startLoadingService('Interrogazione livello...')

  function queryLayer(layerConfig, infoFormat) {
    let url =
      layerConfig.infoOptions.infoQueryUrl || globals.DEFAULT_PROXY + layerConfig.wmsParams.url;
    const layers = layerConfig.infoOptions.infoQueryLayers || layerConfig.wmsParams.name;
    const cqlFilter = layerConfig.wmsParams.cql_filter;
    if (layerConfig.wmsParams.infoFormat) {
      infoFormat = layerConfig.wmsParams.infoFormat;
    }

    var wmsUrl = buildWMSOptions(
      url,
      layers,
      event.latlng,
      infoFormat,
      layerConfig.infoBuffer,
      cqlFilter
    );
    _numRequests++;
    GV.app.map._container.style.cursor = 'progress';
    if (infoFormat === 'application/json') {
      getFeatureInfo(wmsUrl)
        .then(features => _handleResponse(features, layerConfig.name))
        .catch(error => console.error(error));
    } else if (infoFormat === 'application/geojson') {
      getFeatureInfoGeojson(wmsUrl, layerConfig.wmsParams.name)
        .then(features => _handleResponse(features, layerConfig.name))
        .catch(error => console.error(error));
    } else if (infoFormat === 'text/plain') {
      getFeatureInfoText(wmsUrl, layerConfig.wmsParams.name)
        .then(data => _handleResponse(data, layerConfig.name))
        .catch(error => console.error(error));
    } else {
      getFeatureInfoXML(wmsUrl, layerConfig.wmsParams.name)
        .then(features => _handleResponse(features, layerConfig.name))
        .catch(error => console.error(error));
    }
  }

  // Ciclo sulle mappe caricate
  GV.config.maps.forEach(function(mapConfig) {
    var infoFormat = mapConfig.flagGeoserver ? 'application/json' : 'application/vnd.ogc.gml';
    // Ciclo sui layer caricati sulla mappa
    mapConfig.layers.forEach(function(layerConfig) {
      if (
        // layerConfig.idMap === mapConfig.id &&
        layerConfig.type === 'WMS' &&
        layerConfig.queryable &&
        layerConfig.visible &&
        GV.app.map.layerInRange(layerConfig)
      ) {
        queryLayer(layerConfig, infoFormat);
      }
    });
  });
}

function buildWMSOptions(url, layers, latlng, infoFormat, infoBuffer, cqlFilter) {
  if (event.mapType === 'cesium') {
    console.log('cesium getFeatureInfo');
  }

  const point = GV.app.map.latLngToContainerPoint(latlng, GV.app.map.getZoom());
  const size = GV.app.map.getSize();
  const bounds = GV.app.map.getBounds();
  const sw = GV.app.map.options.crs.project(bounds.getSouthWest());
  const ne = GV.app.map.options.crs.project(bounds.getNorthEast());
  const buffer = infoBuffer === null || infoBuffer === undefined ? 10 : infoBuffer;
  const params = {
    request: 'GetFeatureInfo',
    service: 'WMS',
    crs: 'EPSG:3857',
    styles: '',
    version: '1.3.0',
    bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
    height: size.y,
    width: size.x,
    layers: layers,
    query_layers: layers,
    FEATURE_COUNT: 100,
    buffer: buffer,
    info_format: infoFormat,
    i: parseInt(point.x),
    j: parseInt(point.y),
  };
  if (cqlFilter) {
    params.cql_filter = cqlFilter;
  }

  return url + getParamString(params, url, true);
}

function _handleResponse(features, layerName) {
  if (!features) return;
  _requestCount++;
  features.forEach(function(feature) {
    if (feature.text) {
      feature.layer = GV.app.map.getLayerByName(feature.layerName);
      feature.infoOptions = feature.layer.config.infoOptions;
    } else {
      // var layerName = feature.id.substring(0, feature.id.lastIndexOf("."));
      feature.layerName = layerName;
      feature.layer = GV.app.map.getLayerByName(layerName);
      // TODO gestione attributi per livelli PostGIS
      feature.properties = setFeatureProperties(layerName, feature.properties);
      feature.label = setFeatureLabel(layerName, feature.properties);
      feature.infoOptions = feature.layer.config.infoOptions;
    }
  });
  Array.prototype.push.apply(_features, features);

  if (_requestCount === _numRequests) {
    if (GV.app.map._container) GV.app.map._container.style.cursor = 'default';

    if (_features.length === 0) {
      GV.log('Nessun elemento trovato');
      return;
    }

    if (_features.length === 1) {
      var listDiv = document.getElementById('gv-info-wms-list');
      if (listDiv) {
        listDiv.parentNode.removeChild(listDiv);
      }
      _showFeatureInfo(_features[0]);
    } else {
      mountComponent({
        elId: 'gv-info-wms-list',
        clear: true,
        vm: new Vue({
          template: `<gv-info-wms-list :items="items"></gv-info-wms-list>`,
          data: {
            items: _features,
          },
        }),
      });
    }

    GV.log('end info request: ' + new Date());
    // stopLoadingService()
  }

  function setFeatureProperties(layerName, properties) {
    const layerConfig = GV.app.map.getLayerByName(layerName).config;
    const newProperties = setProperties(properties, layerConfig.cachePostGIS);
    return newProperties;
  }

  function setProperties(props, postGis) {
    var newProps = {};
    for (var key in props) {
      if (key !== 'bbox' && props.hasOwnProperty(key)) {
        if (postGis) {
          newProps[key.toUpperCase()] = props[key];
        } else {
          newProps[key] = props[key];
        }
      }
    }
    return newProps;
  }

  function upperProperties(props) {
    var newProps = {};
    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        newProps[key.toUpperCase()] = props[key];
      }
    }
    return newProps;
  }

  function setFeatureLabel(layerName, attributes) {
    var infoLabelAttr, infoIdAttr;
    infoLabelAttr = getField(layerName, 'infoLabelAttr');
    infoIdAttr = getField(layerName, 'infoIdAttr');
    if (infoLabelAttr && attributes[infoLabelAttr]) {
      return attributes[infoLabelAttr];
    }
    if (infoIdAttr && attributes[infoIdAttr]) {
      return attributes[infoIdAttr];
    }
    return attributes[getFirstAttribute(attributes)];
  }

  function getField(layerName, fieldName) {
    var layerConfig = GV.app.map.getLayerByName(layerName).config;
    return layerConfig && layerConfig.infoOptions && layerConfig.infoOptions[fieldName]
      ? layerConfig.infoOptions[fieldName]
      : null;
  }

  function getFirstAttribute(attributes) {
    for (var i in attributes) {
      if (attributes.hasOwnProperty(i) && typeof i !== 'function') {
        return i;
      }
    }
    return null;
  }
}

function _showFeatureInfo(feature) {
  // TEST HTML CON ATLANTE_GEOCHIMICO
  // if (feature.layer.name == 'L6718') {
  //   feature.infoOptions.infoUrl =
  //     '/geoservices/apps/info/atlante_geochimico/info_dominio/?ID=${nom_mb}';
  // }
  // invece di http://srvcarto.regione.liguria.it/info/repertoriocartografico/siraAtlanteGeochimico2020_MacroBacini.xsl
  var type = getType(feature);
  switch (type) {
    case 'text':
      showText(feature);
      break;
    case 'generico':
      showGenerico(feature);
      break;
    case 'xsl':
      showXml(feature);
      break;
    case 'gv_info':
      showGvInfo(feature);
      break;
    default:
      showHtml(feature);
      break;
  }

  hiliteFeature(feature);
}

function showGvInfo(feature) {
  const featureId = feature.id;
  const layerId = feature.layer.config.id;
  GV.gvInfoFeatures[featureId] = feature;
  const panelId = `gvi-info-${featureId}`;
  const url = `/geoservices/apps/gvi/info/${layerId}/?feature_id=${featureId}`;
  if (!feature.infoOptions.infoTarget || feature.infoOptions.infoTarget === 'panel') {
    showPanel(url, feature.infoOptions, panelId);
  } else {
    openPopup(url, feature.infoOptions);
  }
}

function showHtml(feature) {
  const url = stringFormat(feature.infoOptions.infoUrl, feature.properties);
  if (!feature.infoOptions.infoTarget || feature.infoOptions.infoTarget === 'panel') {
    showPanel(url, feature.infoOptions);
  } else {
    openPopup(url, feature.infoOptions);
  }
}

function showGenerico(feature) {
  const title = feature.layer.legend.label;
  mountComponent({
    elId: 'gv-info-generico',
    vm: new Vue({
      template:
        '<gv-info-generico :properties="properties" :height="height" :width="width" :title="title"></gv-info-generico>',
      data: {
        title: title,
        properties: feature.properties,
        width: feature.infoOptions.infoWidth || 400,
        height: feature.infoOptions.infoHeight || 600,
      },
    }),
  });
}

function showText(feature) {
  const infoOptions = feature.infoOptions;
  const infoUrl = infoOptions.infoUrl;
  const data = {
    text: feature.text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
  };
  getFeatureXSLT(infoUrl, data).then(resp => {
    const url = resp.infoUrl;
    showPanel(url, infoOptions);
  });
}

function showXml(data) {
  const infoOptions = data.infoOptions;
  // costruisco il gml in formato getFeatureInfo Mapserver
  let xmlDoc = buildGml(data);
  data.gml = new XMLSerializer().serializeToString(xmlDoc);
  let { infoUrl, infoTarget } = infoOptions;

  getFeatureXSLT(infoUrl, data).then(resp => {
    // // applico la trasformazione xslt
    // var result = xslTransform(xmlDoc, xslDoc);
    const url = resp.infoUrl;
    // visualizzo il risultato
    if (!infoTarget || infoTarget === 'panel') {
      showPanel(url, infoOptions);
    } else {
      openPopup(url, infoOptions);
    }
  });

  // costruisce un documento GML in formato getFeatureInfo Mapserver
  function buildGml(feature) {
    try {
      var baseXml =
        '<?xml version="1.0" encoding="ISO-8859-1"?><msGMLOutput xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></msGMLOutput>';
      var xmlDoc = parseXML(baseXml);
      const name = /^\d/.test(feature.layerName)
        ? 'L' + feature.layerName.replace(/\s+/g, '_')
        : feature.layerName.replace(/\s+/g, '_');
      var layerName = `${name}_layer`;
      var layerNode = xmlDoc.createElement(layerName);
      var featureName = `${name}_feature`;
      var featureNode = xmlDoc.createElement(featureName);
      var attributes = feature.properties;

      for (var key in attributes) {
        if (attributes.hasOwnProperty(key) && key !== 'boundedBy') {
          var text = null;
          if (attributes[key] === 0 || attributes[key]) {
            text = xmlDoc.createTextNode(attributes[key]);
          } else {
            text = xmlDoc.createTextNode('');
          }
          const nodeName = key.match(/^\d/) ? `_${key}` : key;
          // console.log(nodeName) //24001001_N
          const attrNode = xmlDoc.createElement(nodeName);
          attrNode.appendChild(text);
          featureNode.appendChild(attrNode);
        }
      }
      layerNode.appendChild(featureNode);
      xmlDoc.documentElement.appendChild(layerNode);
      return xmlDoc;
    } catch (exception) {
      console.error(exception);
    }
  }

  // trasformo xml in html applicando xslt
  function xslTransform(xmlDoc, xslDoc) {
    try {
      if (window.XSLTProcessor) {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        var transformedDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(transformedDoc);
      } else {
        return xmlDoc.transformNode(xslDoc);
      }
    } catch (exception) {
      console.error(exception);
    }
  }
}

function getType(feature) {
  const infoUrl = feature.infoOptions.infoUrl;
  if (feature.text) return 'text';
  if (infoUrl === 'gv_info') return 'gv_info';
  if (infoUrl.substr(infoUrl.length - 12) === 'generico.xsl') return 'generico';
  if (infoUrl.substr(infoUrl.length - 4) === '.xsl') return 'xsl';
}

function hiliteFeature(feature) {
  if (feature.layer.config.flagGeoserver && feature.layer.config.geomType === 'VECTOR') {
    const layerName = [feature.layerName];
    const layerConfig = feature.layer.config;
    let idAttr = layerConfig.infoOptions.infoIdAttr;
    if (idAttr && layerConfig.cachePostGIS) {
      idAttr = idAttr.toLowerCase();
    }
    let cqlFilter = `${idAttr}='${feature.properties[layerConfig.infoOptions.infoIdAttr]}'`;
    if (feature.layer.config.wmsParams.cql_filter) {
      cqlFilter += ` AND ${feature.layer.config.wmsParams.cql_filter}`;
    }
    getWFSFeature(layerConfig.wfsParams, cqlFilter, null)
      .then(features => {
        const layer = GV.app.map.getLayerByName('InfoWmsHilite');
        const feature = layer && features ? features[0] : null;
        if (feature && feature.geometry) {
          if (GV.app.map.type === 'cesium') {
            if (feature.geometry.type === 'MultiPolygon' || feature.geometry.type === 'Polygon') {
              layer.load(feature, {
                stroke: new Cesium.Color(1, 0.55, 0, 0),
                fill: new Cesium.Color(1, 0.55, 0, 0.2),
                clampToGround: true,
              });
              GV.app.map.viewer.zoomTo(layer, new Cesium.HeadingPitchRange(null, -90, null));
            }
            if (
              feature.geometry.type === 'MultiLineString' ||
              feature.geometry.type === 'LineString'
            ) {
              layer.load(feature, {
                stroke: new Cesium.Color(1, 0.55, 0, 0.0),
              });
              GV.app.map.viewer.zoomTo(layer, new Cesium.HeadingPitchRange(null, -90, null));
            }
            if (feature.geometry.type === 'MultiPoint' || feature.geometry.type === 'Point') {
              // layer.load(feature, {
              // })
              layer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1]
                ),
                point: {
                  pixelSize: 20,
                  color: new Cesium.Color(1, 0.55, 0, 0.6),
                },
                label: null,
              });
              GV.app.map.viewer.zoomTo(layer, new Cesium.HeadingPitchRange(0, -90, 3000));
            }
          } else {
            layer.clearLayers();
            layer.addData(feature.geometry);
            // console.log(layerConfig.maxZoom)
            // const layerConfig = GV.config.getLayerConfig(layerName)
            const maxZoom = layerConfig.maxZoom < 17 ? layerConfig.maxZoom : 17;
            GV.app.map.flyToBounds(layer.getBounds(), {
              maxZoom: maxZoom,
            });
            GV.app.map._container.style.cursor = 'default';
            GV.config.hilitedLayer.push(layerName);
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
// apre una panel div con un documento html
function showPanel(url, configOptions, panelId) {
  mountComponent({
    elId: panelId || 'gv-info-wms-html',
    vm: new Vue({
      template:
        '<gv-info-wms-html :src="src" :height="height" :width="width" :title="title"></gv-info-wms-html>',
      data: {
        title: 'Risultato Info',
        src: url,
        width: configOptions.infoWidth || 400,
        height: configOptions.infoHeight || 400,
      },
    }),
  });
}

function openPopup(url, options) {
  var width = options.infoWidth || 400;
  var height = options.infoHeight || 500;
  var target = options.infoTarget;
  // var target = '';
  var popup = window.open(
    url,
    target,
    `status=yes, toolbar=yes, menubar=no, width=${width}, height=${height}, resizable=yes, scrollbars=yes`
  );
  if (!popup) {
    notification(
      'Popup bloccata sul browser<br>Per visualizzare info è necessario abilitare popup',
      'info'
    );
    return;
  }
  return popup;
}

function addHiliteLayer(map) {
  if (map.options.type === 'cesium') {
    map.viewer.dataSources.add(new Cesium.GeoJsonDataSource('InfoWmsHilite'));
  } else {
    map.loadLayers([
      {
        name: 'InfoWmsHilite',
        type: 'JSON',
        style: {
          color: '#ffcc00',
          fillOpacity: 0,
          weight: 6,
          opacity: 0.6,
        },
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 8,
            color: '#ffcc00',
            fillColor: '#ffcc00',
            fill: true,
            fillOpacity: 0.6,
            weight: 6,
            opacity: 0.6,
          });
        },
        visible: true,
      },
    ]);
  }
}

function handleResponseCesium(event) {
  _features = [];
  if (Cesium.defined(event.featuresPromise)) {
    Cesium.when(event.featuresPromise, features => {
      _requestCount = 0;
      _numRequests = 1;
      if (features.length > 0) {
        const wmsFeatures = features.map(feature => {
          return feature.data;
        });
        _handleResponse(wmsFeatures);
      }
    });
  }
}

export default {
  id: 'info-wms-manager',
  active: false,
  firstActivation: true,
  addHiliteLayer: addHiliteLayer,
  buildWMSOptions: buildWMSOptions,
  features: _features,
  activate: function() {
    GV.log('GV.app.infoWmsManager.activate');

    this.active = true;

    // Aggiungo layer per evidenziazione
    if (GV.app.map) {
      addHiliteLayer(GV.app.map);
    } else {
      GV.eventBus.$on('gv-map-mounted', map => {
        addHiliteLayer(map);
      });
    }

    GV.app.map.on('click', event => {
      if (this.active) {
        if (event.mapType === 'cesium') {
          handleResponseCesium(event);
        } else {
          _request(event);
        }
      }
    });

    GV.app.infoWmsManager = this;
    GV.config.activeControl = this;
  },

  deactivate: function() {
    GV.log('GV.app.infoWmsManager.deactivate');
    GV.app.map.off('click');
    this.active = false;
  },

  showFeatureInfo: _showFeatureInfo,
};
