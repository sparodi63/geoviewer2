import globals from '../globals';
import getZoomFromScaleDenom from '../util/getZoomFromScaleDenom';
import getWmsError from '../services/getWmsError';

const esriLink = '<a href="https://www.esri.com/">Esri</a>';

function layerLoadEventMngrTile(layer) {
  let loading = 0,
    loaded = 0;
  layer.getSource().on('tileloadstart', event => {
    ++loading;
    if (loading === 1) GV.eventBus.$emit('layer-load', layer);
  });
  layer.getSource().on('tileloadend', event => {
    ++loaded;
    if (loading === loaded) {
      loading = 0;
      loaded = 0;
      GV.eventBus.$emit('layer-loaded', layer);
    }
  });
  layer.getSource().on('tileloaderror', event => {
    ++loaded;
    if (loading === loaded) {
      loading = 0;
      loaded = 0;
      GV.eventBus.$emit('layer-loaded', layer);
    }
  });
}

function layerLoadEventMngrWMS(layer) {
  layer.getSource().on('imageloadstart', function() {
    GV.eventBus.$emit('layer-load', layer);
  });
  layer.getSource().on('imageloadend', function() {
    GV.eventBus.$emit('layer-loaded', layer);
  });
  layer.getSource().on('imageloaderror', function() {
    GV.eventBus.$emit('layer-loaded', layer);
  });
}

function layerLoadEventMngrVector(layer) {
  const sourceEventListener = layer.getSource().on('change', function(e) {
    if (layer.getSource().getState() == 'loading') {
      GV.eventBus.$emit('layer-load', layer);
    }
    if (layer.getSource().getState() == 'ready') {
      GV.eventBus.$emit('layer-loaded', layer);
      layer.getSource().un('change', sourceEventListener);
    }
  });
}

const layerFactory = {
  BLANK() {
    return null;
  },
  OSM(layerConfig) {
    layerConfig.legend = {
      label: 'OpenStreetMap',
    };
    const layer = new ol.layer.Tile({
      source: new ol.source.OSM(),
    });
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  TILESERVER_GL(style) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `https://geoservizi.regione.liguria.it/styles/${style}/{z}/{x}/{y}.png`,
      }),
    });
    return layer;
  },
  TS_STREETS(layerConfig) {
    const layer = this.TILESERVER_GL('streets');
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  TS_DARK_MATTER(layerConfig) {
    const layer = this.TILESERVER_GL('dark-matter');
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  TS_POSITRON(layerConfig) {
    const layer = this.TILESERVER_GL('positron');
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  TS_MONOCHROME(layerConfig) {
    const layer = this.TILESERVER_GL('monochrome');
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  TS_TONER(layerConfig) {
    const layer = this.TILESERVER_GL('toner');
    layer.config = layerConfig;
    layer.name = layerConfig.name;
    return layer;
  },
  ESRI_IMAGERY(layerConfig) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions:
          'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    layerConfig.name = layerConfig.type;
    layer.name = layerConfig.type;
    // layerLoadEventMngrTile(layer);
    return layer;
  },
  ESRI_STREETS(layerConfig) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: `&copy; ${esriLink}, 'USGS, NOAA`,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    layerConfig.name = layerConfig.type;
    layer.name = layerConfig.type;
    return layer;
  },
  ESRI_TOPOGRAPHIC(layerConfig) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: `&copy; ${esriLink},USGS, NOAA`,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    layerConfig.name = layerConfig.type;
    layer.name = layerConfig.type;
    return layer;
  },
  ESRI_GRAY(layerConfig) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: `&copy; ${esriLink}, HERE, DeLorme, MapmyIndia, OpenStreetMap contributors`,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    layerConfig.name = layerConfig.type;
    layer.name = layerConfig.type;
    return layer;
  },
  ESRI_DARKGRAY(layerConfig) {
    const layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: `&copy; ${esriLink}, HERE, DeLorme, MapmyIndia, OpenStreetMap contributors`,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    layerConfig.name = layerConfig.type;
    layer.name = layerConfig.type;
    return layer;
  },
  // NON SI VEDE NEANCHE SU LEAFLET
  RL_CARTE_BASE_NC25() {
    const idMap = 2125;
    const idLayer = 'L7273';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_CARTE_BASE_NC25',
      cacheMinZoomLevel: 12,
      maxScale: 10000,
      minScale: 200000,
      wmsParams: {
        name: idLayer,
        format: 'image/jpeg',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Regione Liguria',
    });
  },
  RL_CARTE_BASE() {
    return this.WMS({
      visible: false,
      name: 'RL_CARTE_BASE',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: 'CARTE_DI_BASE',
        format: 'image/jpeg',
        url: 'https://geoservizi.regione.liguria.it/geoserver/gwc/service/wms?',
      },
      zIndex: 1,
      attributions: 'Regione Liguria',
    });
  },
  RL_ORTOFOTO_2019() {
    const idMap = 2248;
    const idLayer = 'L8256';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2019',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/png',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Ortofoto 20cm/ ©2019 CONSORZIO TeA - TUTTI I DIRITTI RISERVATI',
    });
  },
  RL_ORTOFOTO_2016() {
    const idMap = 1828;
    const idLayer = 'L5802';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2016',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/png',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Ortofoto 20cm/ ©2016 CONSORZIO TeA - TUTTI I DIRITTI RISERVATI',
    });
  },
  RL_ORTOFOTO_2013() {
    const idMap = 1661;
    const idLayer = 'L4419';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2013',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/jpeg',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Immagine di proprietà AGEA',
    });
  },
  RL_ORTOFOTO_2010() {
    const idMap = 1505;
    const idLayer = 'L3861';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2010',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/jpeg',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Immagine di proprietà AGEA',
    });
  },
  RL_ORTOFOTO_2007() {
    const idMap = 1361;
    const idLayer = 'L3463';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2007',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/png',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
      attributions: 'Immagine di proprietà AGEA',
    });
  },
  RL_ORTOFOTO_2000() {
    const idMap = 48;
    const idLayer = 'L48';
    return this.WMS({
      idMap: idMap,
      visible: false,
      name: 'RL_ORTOFOTO_2000',
      cacheMinZoomLevel: 8,
      wmsParams: {
        name: idLayer,
        format: 'image/jpeg',
        url: `https://geoservizi.regione.liguria.it/geoserver/M${idMap}/wms?`,
      },
      zIndex: 0,
    });
  },
  WMS(layerConfig) {
    let {
      name,
      cacheMinZoomLevel,
      minScale,
      maxScale,
      wmsParams,
      zIndex,
      idMap,
      attributions,
    } = layerConfig;
    GV.log('layerFactory - Creazione Layer WMS: ' + name);
    let layer = null;

    const isCached = cacheMinZoomLevel ? true : false;
    const opacity = layerConfig.opacity || 1;
    layerConfig.minZoom = minScale ? getZoomFromScaleDenom(minScale) : 8;
    layerConfig.maxZoom = maxScale ? getZoomFromScaleDenom(maxScale) - 1 : 20;

    let params = {
      transparent: true,
      format: wmsParams.format,
      styles: wmsParams.styles || '',
      client: 'GV2',
    };
    if (wmsParams.cql_filter) {
      params.cql_filter = wmsParams.cql_filter;
    }
    if (wmsParams.sld) {
      params.sld = wmsParams.sld;
    }

    let url = wmsParams.url;
    console.log('URL', url);
    // if (GV.app.map.options.ol3d) {
    //   url = `${globals.DEFAULT_PROXY}${url}`;
    // }
    if (isCached) {
      if (idMap) {
        url = url.replace(`M${idMap}`, 'gwc/service');
        params.layers = `M${idMap}:${wmsParams.name}`;
      } else {
        params.layers = wmsParams.name;
      }
      let urls =
        globals.USE_SUBDOMAINS && url.indexOf('geoservizi.regione.liguria.it') > 0
          ? [url.replace('geoservizi', 'geoservizi1'), url.replace('geoservizi', 'geoservizi2')]
          : null;
      const cacheVersion =
        url.indexOf('geoservizi.datasiel.net') > 0
          ? layerConfig.cacheVersionTest
          : layerConfig.cacheVersion;
      Object.assign(params, {
        SRS: 'EPSG:3857',
        TILESORIGIN: '-20037508,-20037508',
        width: 256,
        height: 256,
        CACHE_VERSION: cacheVersion,
      });
      let sourceOptions = {
        params: params,
      };
      if (urls) {
        sourceOptions.urls = urls;
      } else {
        sourceOptions.url = url;
      }
      if (attributions) {
        sourceOptions.attributions = attributions;
      }
      layer = new ol.layer.Tile({
        source: new ol.source.TileWMS(sourceOptions),
      });
      layerLoadEventMngrTile(layer);
    } else {
      Object.assign(params, {
        layers: wmsParams.name,
        ratio: 1,
      });
      const sourceOptions = {
        url: url,
        params: params,
      };
      layer = new ol.layer.Image({
        url: url,
        source: new ol.source.ImageWMS(sourceOptions),
      });
      layerLoadEventMngrWMS(layer);
    }

    layer.setOpacity(opacity);
    layer.setZIndex(zIndex);
    layer.type = 'WMS';
    layer.config = layerConfig;
    layer.name = name;

    return layer;
  },
  JSON(layerConfig) {
    return this.Vector(layerConfig);
  },
  Vector(layerConfig) {
    let {
      name,
      data,
      url,
      style,
      cluster,
      zIndex,
      onFeatureSelect,
      onHover,
      subType,
      basePopup,
      legend,
      filter,
      tooltip,
    } = layerConfig;

    let format;
    switch (subType) {
      case 'KML':
        format = new ol.format.KML({});
        break;
      case 'GPX':
        format = new ol.format.GPX({});
        break;
      default:
        format = new ol.format.GeoJSON({});
        break;
    }

    let vectorSource = new ol.source.Vector({ format: format, url: url });

    let layer = new ol.layer.Vector({
      source: vectorSource,
      style: style,
    });

    if (data) {
      const source = layer.getSource();
      source.clear(true);
      for (const feature of data.features) {
        const olFeature = new ol.format.GeoJSON().readFeature(feature, {
          featureProjection: 'EPSG:3857',
        });
        source.addFeature(olFeature);
      }
    }

    if (onFeatureSelect) {
      GV.app.map.on('click', evt => {
        GV.app.map.forEachFeatureAtPixel(evt.pixel, onFeatureSelect, {
          layerFilter: fLayer => {
            return fLayer === layer;
          },
        });
      });
    }

    if (onHover) {
      GV.app.map.on('pointermove', evt => {
        GV.app.map.forEachFeatureAtPixel(evt.pixel, onHover, {
          layerFilter: fLayer => {
            return fLayer === layer;
          },
        });
      });
    }

    // TODO METTERE IN FUNZIONE DEDICATA
    if (basePopup) {
      const overlay = new ol.Overlay({
        element: document.getElementById('ol-popup'),
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      GV.app.map.addOverlay(overlay);

      GV.app.map.on('pointermove', evt => {
        const hit = GV.app.map.map.hasFeatureAtPixel(GV.app.map.getEventPixel(evt.originalEvent));
        document.getElementById('gv-map').style.cursor = hit ? 'pointer' : '';
      });
      GV.app.map.on('click', evt => {
        const pixel = evt.pixel;
        GV.app.map.forEachFeatureAtPixel(pixel, feature => {
          const properties = feature.getProperties();
          const closer = document.getElementById('ol-popup-closer');
          closer.onclick = () => {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
          };
          const content = document.getElementById('ol-popup-content');
          content.innerHTML = `<p><b>LIVELLO</b> ${legend.label}</p><br>`;
          Object.keys(properties).forEach(key => {
            const value = properties[key];
            if (typeof value === 'string' || value instanceof String || typeof value === 'number') {
              content.innerHTML += `<b>${key}:</b> ${value} <br>`;
            }
          });
          overlay.setPosition(evt.coordinate);
        });
      });
    }

    layerLoadEventMngrVector(layer);

    //TODO OL
    if (cluster) {
    }
    // return cluster ? clusterLayer : layer;
    if (zIndex) layer.setZIndex(zIndex);

    // Gestione altitudeMode per ol3d
    layer.set('altitudeMode', 'clampToGround');

    layer.name = name;
    return layer;
  },
  // MBS(layerConfig, map) {
  //   console.log(map);
  //   console.log(layerConfig);
  //   olms(map, layerConfig.url).then(map => {
  //     let layers = map.getLayers();
  //     layers.getArray().forEach(layer => {
  //       if (layer.get('mapbox-source')) {
  //         console.log('TileServerGL', layer);
  //         layer.config = layerConfig;
  //         layer.name = layerConfig.name;
  //       }
  //     });
  //   });
  // },
  // MBS_STREETS(layerConfig, map) {
  //   const style = 'streets';
  //   const url = `https://geoservizi.regione.liguria.it/tileserver-gl/styles/${style}/style.json`;
  //   this.MBS(url, map.map);
  //   return null;
  // },
};

function create(layerConfig, map) {
  if (layerFactory[layerConfig.type]) {
    let layer = layerFactory[layerConfig.type](layerConfig, map);
    // console.log(layer);
    layer.legend = layerConfig.legend;
    layer.config = layerConfig;
    return layer;
  } else {
    throw new Error(`Layer di tipo ${layerConfig.type} non gestito`);
  }
}

//# sourceMappingURL=olms.js.map
export { create };
