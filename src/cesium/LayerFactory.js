import globals from "../globals";
import interpolateString from "../util/interpolateString";
import getParamString from "../util/getParamString";
import getZoomFromScaleDenom from "../util/getZoomFromScaleDenom";
import getGeoJSON from "../services/getGeoJSON";
import getWmsError from "../services/getWmsError";
import toGeoJSON from "togeojson";
import parseXML from "../util/parseXML";

var esriLink = '<a href="https://www.esri.com/">Esri</a>';

// Funzione di costruzione geoJson
function buildGeoJson(data, esParams) {
  "use strict";
  let geoJson;
  if (esParams) {
    var geomField = esParams.geomField || "location";
    var features = data.hits.hits;
    geoJson = {
      type: "FeatureCollection",
      totalFeatures: data.hits.total,
      features: [],
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:EPSG::4326"
        }
      }
    };
    features.forEach(function(feature) {
      var coords = feature._source[geomField];
      geoJson.features.push({
        type: "Feature",
        id: feature._id,
        geometry: {
          type: "Point",
          coordinates: coords
        },
        geometry_name: "GEOMETRY",
        properties: feature._source
      });
    });
  } else {
    geoJson = typeof data === "string" ? JSON.parse(data) : data;
  }
  return geoJson;
}

var layerFactory = {
  OSM(layerConfig) {
    layerConfig.legend = {
      label: "OpenStreetMap"
    };
    var osm = new Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
      enablePickFeatures: false
    });
    return osm;
  },

  ESRI_IMAGERY(layerConfig) {
    layerConfig.legend = {
      label: "ESRI Imagery"
    };
    layerConfig.name = layerConfig.type;
    var esri = new Cesium.ArcGisMapServerImageryProvider({
      url:
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      enablePickFeatures: false
    });
    return esri;
  },

  MAPBOX_STREETS(layerConfig) {
    layerConfig.legend = {
      label: "Mapbox Streets"
    };
    const ACCESS_TOKEN =
      "pk.eyJ1IjoibGlndXJpYWRpZ2l0YWxlIiwiYSI6ImNqbzQzajk0bDEwa3EzcWt1ZThqazFqcGIifQ.dUhSMka7mXTD2inJGmlBMw";
    var mapbox = new Cesium.MapboxImageryProvider({
      mapId: "mapbox.streets",
      accessToken: ACCESS_TOKEN,
      enablePickFeatures: false
    });
    return mapbox;
  },

  RL_ORTOFOTO_2016() {
    var wms = new Cesium.WebMapServiceImageryProvider({
      url: "http://mapproxy.regione.liguria.it/mapproxy/1828/service",
      layers: "L5802",
      enablePickFeatures: false,
      parameters: {
        format: "image/jpeg"
      }
    });
    return wms;
  },

  RL_CARTE_BASE() {
    var wms = new Cesium.WebMapServiceImageryProvider({
      url: "http://mapproxy.regione.liguria.it/mapproxy/1623/service",
      layers: "C1623",
      enablePickFeatures: false,
      parameters: {
        format: "image/jpeg"
      }
    });
    return wms;
  },

  TMS(layerConfig) {
    layerConfig.wmsParams.url = layerConfig.tmsParams.url.replace(
      "tms",
      "service"
    );
    return layerFactory["WMS"](layerConfig);
  },

  WMS(layerConfig) {
    const minZoomLevel = layerConfig.minScale
      ? getZoomFromScaleDenom(layerConfig.minScale) - 2
      : 8;
    const maxZoomLevel = layerConfig.maxScale
      ? getZoomFromScaleDenom(layerConfig.maxScale) - 1
      : 20;
    var url = layerConfig.wmsParams.url.replace(
      "geoservizi.regione.liguria.it",
      "geoservizi{s}.regione.liguria.it"
    );
    layerConfig.minZoomLevel = minZoomLevel;
    layerConfig.maxZoomLevel = maxZoomLevel;
    var layerName = layerConfig.wmsParams.name;
    var enablePickFeatures = layerConfig.queryable;

    let rectangle = Cesium.Rectangle.fromDegrees(
      7.45634025169431,
      43.5948638648273,
      10.0882423374134,
      44.8480709868961
    );
    if (layerConfig.extent_3857) {
      rectangle = GV.app.map.getCesiumRectangleFromEPSG3857(
        layerConfig.extent_3857
      );
    }
    var provider = new Cesium.WebMapServiceImageryProvider({
      url: url,
      layers: layerName,
      enablePickFeatures: enablePickFeatures,
      parameters: {
        transparent: true,
        tiled: false,
        format: layerConfig.wmsParams.format
      },
      subdomains: ["1", "2"],
      rectangle: rectangle,
      maximumLevel: maxZoomLevel
    });
    var layer = new Cesium.ImageryLayer(provider, {
      minimumTerrainLevel: minZoomLevel
    });
    layer.config = layerConfig;
    layer.layerName = layerConfig.wmsParams.name;
    layer.show = layerConfig.visible;
    return layer;
  }
};

function create(layerConfig) {
  if (layerFactory[layerConfig.type]) {
    let layer = layerFactory[layerConfig.type](layerConfig);
    layer.legend = layerConfig.legend;
    layer.config = layerConfig;
    return layer;
  } else {
    throw new Error(`Layer di tipo ${layerConfig.type} non gestito`);
  }
}

export { create };
