import globals from '../globals';
import * as LayerFactory from './LayerFactory';
import getWFSFeature from '../services/getWFSFeature';
import buildCqlFilter from '../util/buildCqlFilter';
import InfoWmsManager from '../controls/InfoWmsManager';
import getCoordTransform from '../services/getCoordTransform';
import getCoordTransformBbox from '../services/getCoordTransformBbox';

import notification from '../util/notification';
import { Loading } from 'element-ui';

const olMap = {
  type: 'ol',
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
    Object.assign(this.options, GV.config.application.options);

    // Gestione restricted extent
    const viewOptions = {};
    if (this.options.restrictedExtent) {
      viewOptions.extent = this.extentToArray(this.options.restrictedExtent);
    }

    this.map = new ol.Map({
      target: 'gv-map',
      layers: [],
      controls: [],
      view: new ol.View(viewOptions),
    });

    this.setInitialExtent();

    this.zoom = this.map.getView().getZoom();

    this.loadBaseLayer();

    this.eventMngr();

    return this;
  },

  on(event) {
    console.log('openlayers/map on', event);
    return this.map.on(event);
  },
  eventMngr() {
    this.map.on('moveend', e => {
      const newZoom = this.map.getView().getZoom();
      if (this.zoom != newZoom) {
        console.log('zoom end, new zoom: ' + newZoom);
        GV.eventBus.$emit('map-zoom', this._zoom);
        this.zoom = newZoom;
      }
    });
    this.map.on('rendercomplete', e => {
      GV.log('FINE CARICAMENTO MAPPA');
      GV.eventBus.$emit('map-full-loaded', this._zoom);
    });
    GV.eventBus.$on('set-layer-visible', event => {
      this.setLayerVisible(event.layer, event.checked);
      this.setHiliteLayerVisible(event);
    });
    GV.eventBus.$on('set-layer-transparency', event => {
      this.setLayerOpacity(event.layerName, event.opacity);
    });
    GV.eventBus.$on('change-base-layer', event => {
      this.changeBaseLayer(event.layer);
    });
  },
  // TODO
  setHiliteLayerVisible(event) {
    if (!GV.config.hilitedLayer) {
      return;
    }
    GV.config.hilitedLayer.forEach(hl => {
      if (hl === event.layer.name) {
        const layer = this.getLayerByName('InfoWmsHilite');
        layer.eachLayer(m => {
          const opacity = event.checked ? 0.6 : 0.0;
          m.setStyle({
            opacity: opacity,
          });
        });
      }
    });
  },
  setLayerOpacity(layerName, opacity) {
    const layer = this.getLayerByName(layerName);
    if (layer && layer.setOpacity) layer.setOpacity(opacity);
  },
  setExtent(extent) {
    const ext = this.extentToArray(extent);
    this.map.getView().fit(ext);
  },
  extentToArray(extent) {
    const extFloat = extent.split(',').map(ex => {
      return parseFloat(ex);
    });
    return extFloat;
  },
  setInitialExtent() {
    GV.log('setInitialExtent');
    if (this.options.center && this.options.zoom) {
      GV.log('setView');
      // TODO OL
      this.setView(this.options.center, this.options.zoom);
    } else {
      var extent = this.options.initialExtent || '830036,5402959,1123018,5597635';
      this.setExtent(extent);
    }
  },
  getExtent() {
    var swPoint = this.getBounds().getSouthWest();
    var nePoint = this.getBounds().getNorthEast();
    var swPrj = L.Projection.SphericalMercator.project(swPoint);
    var nePrj = L.Projection.SphericalMercator.project(nePoint);
    return L.bounds(swPrj, nePrj);
  },
  getExtentAsString() {
    return this.map
      .getView()
      .calculateExtent()
      .join(',');
  },
  setLayerVisible(layerConfig, visible) {
    const layer = this.getLayerByName(layerConfig.name);
    layer.setVisible(visible);
    layerConfig.visible = visible;
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
    const scaleDenom = 591657550 / Math.pow(2, this.map.getView().getZoom());
    return scaleDenom;
  },
  removeLayer(layer) {
    this.map.removeLayer(layer);
  },
  loadLayers(layers) {
    layers.forEach(layerConfig => {
      if (this.getLayerByName(layerConfig.name)) {
        return;
      }
      console.log('loadLayers', layerConfig, this.getLayerByName(layerConfig.name));
      var layer = LayerFactory.create(layerConfig, this);
      if (layer) {
        this.map.addLayer(layer);
        this.setLayerVisible(layerConfig, layerConfig.visible);
        // TODO
        // layer.on('ready', () => {
        //   if (layerConfig.zoomToLayerExtent) {
        //     let bounds = new L.latLngBounds();
        //     layer.eachLayer(function(_layer) {
        //       if (_layer.getBounds) {
        //         bounds.extend(_layer.getBounds());
        //       } else {
        //         bounds.extend(new L.latLngBounds(_layer._latlng, _layer._latlng));
        //       }
        //     });
        //     if (bounds) this.fitBounds(bounds);
        //   }
        // });
      }
    });
  },
  // TODO
  // TODO
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
  // TODO
  addMarkerToMap(markerConfig) {
    const icon = L.icon({
      iconUrl: '/geoservices/apps/viewer/dist/static/img/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
    const opts = {
      opacity: 0.8,
      icon: icon,
      title: markerConfig.label,
    };
    if (markerConfig.type === 'circle') {
      L.circleMarker(markerConfig.location, opts).addTo(this);
    } else {
      L.marker(markerConfig.location, opts).addTo(this);
    }
    this.flyTo(markerConfig.location, markerConfig.zoomLevel || 14);
    // this.setView(markerConfig.location, markerConfig.zoomLevel || 14);
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
};

export default olMap;
