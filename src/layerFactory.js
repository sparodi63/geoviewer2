var L = require('leaflet')
require('./leaflet/MarkerCluster.js')
require('./leaflet/NonTiledLayer.js')

import Vue from 'vue'
import globals from './globals'
import * as config from './config'
import GV from './GV'
import interpolateString from './util/interpolateString'
import getParamString from './util/getParamString'
import getZoomFromScaleDenom from './util/getZoomFromScaleDenom'

var esriLink = '<a href="http://www.esri.com/">Esri</a>'


// Funzione di costruzione geoJson
function buildGeoJson (data, esParams) {
  'use strict'
  let geoJson
  if (esParams) {
    var geomField = esParams.geomField || 'location'
    var features = data.hits.hits
    geoJson = {
      'type': 'FeatureCollection',
      'totalFeatures': data.hits.total,
      'features': [],
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'urn:ogc:def:crs:EPSG::4326'
        }
      }
    }
    features.forEach(function (feature) {
      var coords = feature._source[geomField]
      geoJson.features.push({
        'type': 'Feature',
        'id': feature._id,
        'geometry': {'type': 'Point', 'coordinates': coords},
        'geometry_name': 'GEOMETRY',
        'properties': feature._source
      })
    })
  } else {
    geoJson = (typeof data === 'string') ? JSON.parse(data): data
  }
  return geoJson
}

var layerFactory = {

  BLANK (layerConfig) {
    layerConfig.legend = {
      label: 'Sfondo Bianco'
    }
    return L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {opacity: 0.0})
  },

  OSM (layerConfig) {
    layerConfig.legend = {
      label: 'OpenStreetMap'
    }
    return L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    })
  },

  STAMEN_TERRAIN (layerConfig) {
    layerConfig.legend = {
      label: 'Stamen Terrain'
    }
    return L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    })
  },

  STAMEN_TONER_LIGHT (layerConfig) {
    layerConfig.legend = {
      label: 'Stamen Toner Light'
    }
    return L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    })
  },

  CARTODB_POSITRON (layerConfig) {
    layerConfig.legend = {
      label: 'CartoDb Positron'
    }
    return L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    })
  },

  CARTODB_DARKMATTER (layerConfig) {
    layerConfig.legend = {
      label: 'CartoDb DarkMatter'
    }
    return L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    })
  },

  OPENMAPSURFER_ROADS (layerConfig) {
    layerConfig.legend = {
      label: 'OpenMapSurfer Roads'
    }
    return L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
  },

  MAPBOX_STREETS (layerConfig) {
    layerConfig.legend = {
      label: 'Mapbox Streets'
    }
    return L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g'
    })
  },

  MAPBOX_SATELLITE (layerConfig) {
    layerConfig.legend = {
      label: 'Mapbox Satellite'
    }
    return L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      id: 'mapbox.satellite',
      accessToken: 'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g'
    })
  },

  MAPBOX_OUTDOOR (layerConfig) {
    layerConfig.legend = {
      label: 'Mapox Outdoor'
    }
    return L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      id: 'mapbox.outdoors',
      accessToken: 'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g'
    })
  },

  MAPBOX_LIGHT (layerConfig) {
    layerConfig.legend = {
      label: 'Mapox Light'
    }
    return L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      id: 'mapbox.light',
      accessToken: 'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g'
    })
  },

  HYDDA (layerConfig) {
    layerConfig.legend = {
      label: 'Hydda'
    }
    return L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
      attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
  },

  ESRI_IMAGERY (layerConfig) {
    layerConfig.legend = {label: 'ESRI Imagery'}
    layerConfig.name = layerConfig.type
    var attr = 'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
    return L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: `&copy; ${esriLink}, ${attr}`,
        maxZoom: 19 //, pane: layerConfig.name
      }
    )
  },

  ESRI_STREETS (layerConfig) {
    layerConfig.legend = {label: 'ESRI Streets'}
    layerConfig.name = layerConfig.type
    var attr = 'USGS, NOAA'
    return L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: `&copy; ${esriLink}, ${attr}`,
        maxZoom: 19 //, pane: layerConfig.name
      }
    )
  },

  ESRI_TOPOGRAPHIC (layerConfig) {
    layerConfig.legend = {label: 'ESRI Topographic'}
    layerConfig.name = layerConfig.type
    var attr = 'USGS, NOAA'
    return L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: `&copy; ${esriLink}, ${attr}`,
        maxZoom: 19 //, pane: layerConfig.name
      }
    )
  },

  ESRI_GRAY (layerConfig) {
    layerConfig.legend = {label: 'ESRI Gray'}
    layerConfig.name = layerConfig.type
    var attr = 'HERE, DeLorme, MapmyIndia, OpenStreetMap contributors'
    return L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: `&copy; ${esriLink}, ${attr}`,
        maxZoom: 16 //, pane: layerConfig.name
      }
    )
  },

  ESRI_DARKGRAY (layerConfig) {
    layerConfig.legend = {label: 'ESRI Dark Gray'}
    layerConfig.name = layerConfig.type
    var attr = 'HERE, DeLorme, MapmyIndia, OpenStreetMap contributors'
    return L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: `&copy; ${esriLink}, ${attr}`,
        maxZoom: 16 //, pane: layerConfig.name
      }
    )
  },

  WMS (layerConfig) {
    let {name, geomType, cacheMinZoomLevel, minScale, maxScale, wmsParams, flagGeoserver, zIndex} = layerConfig
    if (GV.config.debug) console.log('layerFactory - Creazione Layer WMS: ' + name)

    let isCached = (cacheMinZoomLevel) ? true : false
    let format = (geomType === 'VECTOR') ? 'image/png8' : (cacheMinZoomLevel) ? 'image/jpeg' : 'image/png'
    let minZoom = (minScale) ? getZoomFromScaleDenom(minScale) : 8
    let maxZoom = (maxScale) ? getZoomFromScaleDenom(maxScale) : 20
    let url = wmsParams.url
    let opacity = layerConfig.opacity || 1

    if (!flagGeoserver) {
      cacheMinZoomLevel = null
      format = (geomType === 'VECTOR') ? 'image/png' : 'image/jpeg'
    }

    let options = {
      'transparent': true,
      'FORMAT_OPTIONS': 'antialias:text',
      'layers': name,
      'format': format,
      'opacity': opacity,
      'minZoom': minZoom,
      'maxZoom': maxZoom,
      'bounds': globals.MAX_BOUNDS
      //, 'pane': name
    }

    let layer = null
    if (isCached) {
      Object.assign(options, {
        'tiled': true,
        'TILESORIGIN': '-20037508,-20037508',
        'tileSize': 256
      })
      layer = L.tileLayer.wms(url, options)
    } else {
      Object.assign(options, {
        'tiled': false,
        'pane': 'tilePane'
      })
      layer = L.nonTiledLayer.wms(url, options)
    }

    layer.setZIndex(zIndex)
    layer.type = 'WMS'
    layer.name = name

    return layer
  },

  JSON (layerConfig) {
    let {data, url, name, wfsParams, esParams, classes, style, pointToLayer, tooltip, popup, cluster} = layerConfig
    let clusterLayer = null
    let options = {}

    if (classes && classes.length > 0) {
      if (layerConfig.geomSubType === 'POINT') {
        options.pointToLayer = function (feature, latlng) {
          var style
          classes.forEach(function (cls) {
            if (cls.filter && cls.filter.key && cls.filter.value) {
              if (feature.properties[cls.filter.key] === cls.filter.value) {
                style = cls.style
              }
            } else {
              style = cls.style
            }
          })
          if (style.iconUrl) {
            var icon
            switch (style.iconUrl) {
            case 'default':
              icon = L.icon({
                iconUrl: 'http://geoportale.regione.liguria.it/geoviewer2/images/legend/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
              })
              break
            case 'default-small':
              icon = L.icon({
                iconUrl: 'http://geoportale.regione.liguria.it/geoviewer2/images/legend/marker-icon.png',
                iconSize: [12, 20],
                iconAnchor: [6, 10],
                popupAnchor: [0, -20]
              })
              break
            default:
              icon = L.icon({
                iconUrl: style.iconUrl,
                iconSize: style.iconSize,
                iconAnchor: style.iconAnchor,
                popupAnchor: style.popupAnchor
              })
            }
            return L.marker(latlng, {icon: icon})
          } else {
            return L.circleMarker(latlng, style)
          }
        }
      } else {
        options.style = function (feature) {
          var style
          classes.forEach(function (cls) {
            if (cls.filter && cls.filter.key && cls.filter.value) {
              if (feature.properties[cls.filter.key] === cls.filter.value) {
                style = cls.style
              }
            } else {
              style = cls.style
            }
          })
          return style
        }
      }
      options.filter = function (feature) {
        var visible = false
        classes.forEach(function (cls) {
          if (!cls.filter) {
            visible = true
          } else {
            if (cls.filter.key && cls.filter.value) {
              if (feature.properties[cls.filter.key] === cls.filter.value) {
                visible = true
              }
            }
          }
        })
        return visible
      }
    }

    if (style) {
      options.style = style
    }
    if (pointToLayer) {
      options.pointToLayer = pointToLayer
    }

    if (tooltip || popup) {
      options.onEachFeature = function (feature, layer) {
        if (tooltip) {
          layer.options.title = interpolateString(tooltip, feature.properties)
        }
        if (popup) {
          layer.bindPopup(interpolateString(popup, feature.properties))
        }
      }
    }

    var layer = L.geoJson(data, options)
    layer.name = name

    layer.setFilter = function (filters) {
      layer.filter = filters
      if (filters) {
        layer.eachLayer(function (marker) {
          var opacity = 0
          filters.forEach(function (filter) {
            if (marker.feature.properties[filter.key] === filter.value) {
              opacity = layer.config.opacity || 1
            }
          })
          marker.setOpacity(opacity)
        })
      } else {
        layer.eachLayer(function (marker) {
          var opacity = layer.config.opacity || 1
          marker.setOpacity(opacity)
        })
      }
    }

    var parameters

    if (wfsParams && wfsParams.typeName && wfsParams.url) {
      parameters = {
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        srsName: 'EPSG:4326',
        outputFormat: 'text/javascript',
        format_options: 'callback: getJson',
        typeName: wfsParams.typeName
      }
      url = wfsParams.url + getParamString(parameters)
    }

    // Gestione livelli puntuali su ElasticSearch
    if (esParams) {
      parameters = {}
      if (esParams.field) {
        parameters.q = esParams.field + ':'
        if (esParams.query) {
          parameters.q += esParams.query
        } else {
          parameters.q += '*'
        }
      } else {
        if (esParams.query) {
          parameters.q = esParams.query
        }
      }
      parameters.pretty = 'true'
      parameters.size = 100000
      // TODO parametro bbox. https://www.elastic.co/guide/en/elasticsearch/reference/1.4/query-dsl-geo-bounding-box-filter.html

      url = config.application.proxy + esParams.url + getParamString(parameters)
    }

    if (cluster) {
      var clusterOptions = {showCoverageOnHover: false}
      if (cluster.options) {
        Object.assign(clusterOptions, cluster.options)
      }
      clusterLayer = L.markerClusterGroup(clusterOptions)
    }

    if (url) {
      Vue.http.get(url, {headers: {'Accept': 'application/json'}}).then(response => {
        var geoJson = buildGeoJson(response.data, esParams)
        layer.addData(geoJson)
        if (cluster) {
          clusterLayer.addLayer(layer)
        }
      }).catch(error => console.error(error))
    }

    if (data) {
      if (cluster) {
        clusterLayer.addLayer(layer)
      }
    }

    return (cluster) ? clusterLayer : layer

  }
}

function create (layerConfig, map) {
  if (layerFactory[layerConfig.type]) {
    let layer = layerFactory[layerConfig.type](layerConfig, map)
    layer.legend = layerConfig.legend
    layer.config = layerConfig
    return layer
  } else {
    throw new Error(`Layer di tipo ${layerConfig.type} non gestito`)
  }
}

export {create}
