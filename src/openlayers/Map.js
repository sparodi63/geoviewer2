import globals from '../globals';
import * as LayerFactory from './LayerFactory';
import getWFSFeature from '../services/getWFSFeature';
import buildCqlFilter from '../util/buildCqlFilter';
import InfoWmsManager from '../controls/InfoWmsManager';
import getCoordTransform from '../services/getCoordTransform';
import getCoordTransformBbox from '../services/getCoordTransformBbox';
import createElement from '../util/createElement';

import notification from '../util/notification';
import { Loading } from 'element-ui';

const olMap = {
  type: 'openlayers',
  layers: [],
  baseLayers: [],
  initialExtent: [],
  map: null,
  zoom: null,
  buttons: [],
  options: {
    type: 'openlayers',
    zoomControl: false,
    minZoom: 7,
    maxZoom: 20,
  },
  initialize() {
    Object.assign(this.options, GV.config.application.mapOptions);
    // console.log('MAP OPTIONS', this.options);

    // Gestione restricted extent
    const viewOptions = {};
    if (this.options.restrictedExtent) {
      console.log('SET RESCTRICTED EXTENT');
      viewOptions.extent = this.extentToArray(this.options.restrictedExtent);
    }

    this.map = new ol.Map({
      target: 'gv-map',
      layers: [],
      controls: [],
      view: new ol.View(viewOptions),
    });

    this.createPopupDiv();

    this.setInitialExtent();

    this.zoom = this.getView().getZoom();

    this.loadBaseLayer();

    this.eventMngr();

    if (this.options.ol3d) {
      const GeoserverTerrainProvider = require('../cesium/GeoserverTerrainProvider');

      const ol3d = new olcs.OLCesium({ map: this.map });
      this.scene = ol3d.getCesiumScene();
      var terrainProvider = new Cesium.GeoserverTerrainProvider({
        url: 'https://geoservizi.regione.liguria.it/geoserver/DTM/ows',
        layerName: 'DTM_dbtopo_5m_wgs84',
      });
      this.scene.terrainProvider = terrainProvider;

      if (this.options.enable3d) {
        ol3d.setEnabled(true);
      }
      this.ol3d = ol3d;
    }

    return this;
  },

  eventMngr() {
    this.map.on('moveend', e => {
      const newZoom = this.getView().getZoom();
      if (this.zoom != newZoom) {
        // console.log('zoom end, new zoom: ' + newZoom);
        GV.eventBus.$emit('map-zoom', newZoom);
        this.zoom = newZoom;
      }
    });
    this.map.on('rendercomplete', e => {
      GV.log('FINE CARICAMENTO MAPPA');
      GV.eventBus.$emit('map-full-loaded', this._zoom);
    });
    GV.eventBus.$on('set-layer-visible', event => {
      this.setLayerVisible(event.layer, event.checked);
      this.setHiliteLayerVisible(event.layer, event.checked);
    });
    GV.eventBus.$on('set-layer-transparency', event => {
      this.setLayerOpacity(event.layerName, event.opacity);
    });
    GV.eventBus.$on('change-base-layer', event => {
      this.changeBaseLayer(event.layer);
    });
  },
  addInteraction(intercation) {
    this.map.addInteraction(intercation);
  },
  removeInteraction(interaction) {
    this.map.removeInteraction(interaction);
  },
  getView() {
    return this.map.getView();
  },
  setLayerOpacity(layerName, opacity) {
    const layer = this.getLayerByName(layerName);
    if (layer && layer.setOpacity) layer.setOpacity(opacity);
  },
  setExtent(extent) {
    const ext = this.extentToArray(extent);
    this.getView().fit(ext);
  },
  extentToArray(extent) {
    const extFloat = extent.split(',').map(ex => {
      return parseFloat(ex);
    });
    return extFloat;
  },
  setInitialExtent() {
    GV.log('setInitialExtent');
    // TODO OL
    // if (this.options.center && this.options.zoom) {
    //   GV.log('setView');
    //   this.setView(this.options.center, this.options.zoom);
    // } else {
    //   var extent = this.options.initialExtent || '830036,5402959,1123018,5597635';
    //   this.setExtent(extent);
    // }
    var extent = this.options.initialExtent || '830036,5402959,1123018,5597635';
    this.setExtent(extent);
  },
  setView(center, zoom) {
    this.getView().setCenter(center);
    this.getView().setZoom(zoom);
  },
  getExtent() {
    var swPoint = this.getBounds().getSouthWest();
    var nePoint = this.getBounds().getNorthEast();
    var swPrj = L.Projection.SphericalMercator.project(swPoint);
    var nePrj = L.Projection.SphericalMercator.project(nePoint);
    return L.bounds(swPrj, nePrj);
  },
  getExtentAsString() {
    return this.getView()
      .calculateExtent()
      .join(',');
  },
  setLayerVisible(layerConfig, visible) {
    const layer = this.getLayerByName(layerConfig.name);
    console.log('setLayerVisible', layer.getOpacity());
    layer.setVisible(visible);
    layerConfig.visible = visible;
  },
  setHiliteLayerVisible(layerConfig, visible) {
    if (!GV.config.hilitedLayer) {
      return;
    }
    for (const hl of GV.config.hilitedLayer) {
      if (hl[0] === layerConfig.name) {
        const layer = this.getLayerByName('InfoWmsHilite');
        layer.setVisible(visible);
      }
    }
  },
  layerInRange(layerConfig) {
    if (!layerConfig.minScale && !layerConfig.minScale) {
      return true;
    }
    return this.getScale() < layerConfig.minScale && this.getScale() > layerConfig.maxScale;
  },
  loadBaseLayer() {
    GV.config.baseLayers.forEach(layerConfig => {
      if (layerConfig.visible) {
        this.setBaseLayer(layerConfig);
      }
    });
  },
  setBaseLayer(layerConfig) {
    if (layerConfig.name === 'BLANK') {
      GV.config.activeBaseLayer = 'BLANK';
      return;
    }
    var layer = LayerFactory.create(layerConfig, this);
    if (layer) {
      layer.config.baseLayer = true;
      console.log('Creato baseLayer', layer);
      this.map.getLayers().insertAt(0, layer);
      this.activeBaseLayer = layer;
      GV.config.activeBaseLayer = layer.config.name;
    }
  },
  changeBaseLayer(layerName) {
    if (GV.config.activeBaseLayer !== layerName) {
      const layer = this.getLayerByName(GV.config.activeBaseLayer);
      console.log(layer);
      this.removeLayer(layer);
      const layerConfig = GV.config.getBaseLayerConfig(layerName);
      this.setBaseLayer(layerConfig);
    }
  },
  getLayerByName(layerName) {
    var foundLayer = null;
    this.map.getLayers().forEach(layer => {
      if (layer.name && layer.name === layerName) {
        foundLayer = layer;
      }
    });
    return foundLayer;
  },
  getScale() {
    const scaleDenom = 591657550 / Math.pow(2, this.getView().getZoom());
    return scaleDenom;
  },
  setZoom(zoom) {
    this.getView().setZoom(zoom);
  },
  removeLayer(layer) {
    this.map.removeLayer(layer);
  },
  addOverlay(overlay) {
    this.map.addOverlay(overlay);
  },
  getTarget() {
    return this.map.getTarget();
  },
  getEventPixel(pixel) {
    return this.map.getEventPixel(pixel);
  },
  createPopupDiv() {
    createElement({ elId: 'ol-popup', containerId: 'body' });
    createElement({ elId: 'ol-popup-closer', containerId: 'ol-popup' });
    createElement({ elId: 'ol-popup-content', containerId: 'ol-popup' });
  },
  loadLayers(layers) {
    layers.forEach(layerConfig => {
      if (this.getLayerByName(layerConfig.name)) {
        return;
      }
      var layer = LayerFactory.create(layerConfig, this);
      if (layer) {
        this.map.addLayer(layer);
        this.setLayerVisible(layerConfig, layerConfig.visible);
        if (layerConfig.zoomToLayerExtent) {
          const vectorSource = layer.getSource();
          vectorSource.once('change', () => {
            if (vectorSource.getState() === 'ready') {
              if (layer.getSource().getFeatures().length > 0) {
                this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
              }
            }
          });
        }
      }
    });
  },
  clearLayer() {
    const layer = this.getLayerByName('InfoWmsHilite');
    const source = layer.getSource();
    source.clear(true);
  },
  addMarker(markerConfig) {
    if (markerConfig.epsg && markerConfig.epsg != '4326') {
      getCoordTransform(
        markerConfig.epsg,
        '4326',
        markerConfig.location[1],
        markerConfig.location[0]
      ).then(response => {
        if (response.data.points) {
          const lon = response.data.points[0].split(',')[0];
          const lat = response.data.points[0].split(',')[1];
          markerConfig.location = [lat, lon];
          this.addMarkerToMap(markerConfig);
        }
      });
    } else {
      this.addMarkerToMap(markerConfig);
    }
  },
  addMarkerToMap(markerConfig) {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([markerConfig.location.lng, markerConfig.location.lat])
      ),
      name: markerConfig.label,
    });

    feature.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: '/geoservices/apps/viewer/dist/static/img/marker-icon.png',
        }),
      })
    );

    const vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [feature],
      }),
      zIndex: 1000,
    });
    this.map.addLayer(vectorLayer);

    GV.app.map.getView().fit(feature.getGeometry().getExtent(), {
      maxZoom: markerConfig.zoomLevel || 14,
    });
  },
  // TODO
  find(findOptions) {
    if (findOptions.bbox) {
      this.zoomToBound(findOptions.bbox, findOptions.epsg, findOptions.maxZoom);
      return;
    }
    if ((!findOptions.values || findOptions.values === 'null') && !findOptions.cqlFilter) {
      console.error('Parametri FIND non completi: manca CQL_FILTER o VALUES');
      return;
    }
    const cqlFilter = findOptions.cqlFilter || buildCqlFilter(findOptions);
    const layers = findOptions.layers || GV.config.getLayersNameByMapId(findOptions.map);

    const typeNames = layers.join(',');
    const layerConfig = GV.config.getLayerConfig(layers[0]);
    let wfsParams = layerConfig.wfsParams;
    wfsParams.typeName = typeNames;

    let loading = Loading.service({
      text: 'Ricerca...',
      background: 'rgba(0, 0, 0, 0.8)',
    });

    getWFSFeature(wfsParams, cqlFilter)
      .then(features => {
        InfoWmsManager.addHiliteLayer(GV.app.map);
        const layer = this.getLayerByName('InfoWmsHilite');
        if (features && features.length > 0) {
          layer.clearLayers();
          layer.addData(features);
          const maxZoom = findOptions.maxZoom || 15;
          this.flyToBounds(layer.getBounds(), {
            maxZoom: maxZoom,
          });
          GV.config.hilitedLayer = layers;
        } else {
          if (findOptions.notFoundAlert) {
            notification('Nessuna Elemento Trovato');
          }
          console.warn('Nessuna Elemento Trovato');
        }
        loading.close();
      })
      .catch(error => {
        console.error(error);
        loading.close();
      });
  },
  // TODO
  zoomTo(lat, lon, zoom) {
    this.setView(new L.LatLng(lat, lon), zoom);
  },
  // TODO
  zoomToBound(strBounds, epsg, maxZoom) {
    // let bounds = new L.latLngBounds();

    if (epsg != '4326') {
      const srsIn = epsg;
      const srsOut = '4326';
      getCoordTransformBbox(srsIn, srsOut, strBounds).then(response => {
        if (response.data.data) {
          const sw = response.data.data[0][0].split(',').reverse();
          const ne = response.data.data[1][0].split(',').reverse();
          this.fitBounds([sw, ne]);
          // this.flyToBounds([sw, ne]);
        }
      });
    } else {
      const coord = strBounds.split(',');
      const sw = [coord[0], coord[1]];
      const ne = [coord[2], coord[3]];
      this.fitBounds([sw, ne]);
    }
  },
  on(event, fn) {
    this.map.on(event, fn);
  },
  off(event) {
    // this.map.un(event, null);
    this.map.removeEventListener(event);
  },
  forEachFeatureAtPixel(pixel, callback, options) {
    this.map.forEachFeatureAtPixel(pixel, callback, options);
  },
};

export default olMap;
