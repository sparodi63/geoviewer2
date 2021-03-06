import globals from '../globals';
import * as LayerFactory from './LayerFactory';
import L from 'leaflet';
import getWFSFeature from '../services/getWFSFeature';
import buildCqlFilter from '../util/buildCqlFilter';
import InfoWmsManager from '../controls/InfoWmsManager';
import getCoordTransform from '../services/getCoordTransform';
import getCoordTransformBbox from '../services/getCoordTransformBbox';

import notification from '../util/notification';
import { Loading } from 'element-ui';

const Map = L.Map.extend({
  layers: [],

  baseLayers: [],

  initialExtent: [],

  buttons: [],

  mapOptions: {
    zoomControl: false,
    minZoom: 7,
    maxZoom: 20,
  },

  initialize() {
    Object.assign(this.mapOptions, GV.config.application.mapOptions);

    if (!GV.config.application.mapOptions || !GV.config.application.mapOptions.disableMaxBounds) {
      this.mapOptions.maxBounds = L.latLngBounds(
        L.latLng(globals.MAX_BOUNDS.X_MIN, globals.MAX_BOUNDS.Y_MIN),
        L.latLng(globals.MAX_BOUNDS.X_MAX, globals.MAX_BOUNDS.Y_MAX)
      );
      this.mapOptions.maxBoundsViscosity = 1.0;
    }

    L.Map.prototype.initialize.call(
      this,
      'gv-map',
      L.extend(L.Map.prototype.options, this.mapOptions)
    );
    this.type = 'leaflet';

    this.setInitialExtent();

    this.setRestrictedExtent();

    this.setLoading();

    this.loadBaseLayers();

    this.loadControls();

    this.eventMngr();
  },

  eventMngr() {
    this.on('zoom', () => {
      GV.eventBus.$emit('map-zoom', this._zoom);
    });
    GV.eventBus.$on('set-layer-visible', event => {
      this.setLayerVisible(event.layer, event.checked);
      this.setHiliteLayerVisible(event);
    });
    GV.eventBus.$on('set-layer-transparency', event => {
      const layer = this.getLayerByName(event.layerName);
      if (layer && layer.setOpacity) layer.setOpacity(event.opacity);
    });
    GV.eventBus.$on('change-base-layer', event => {
      this.changeBaseLayer(event.layer);
    });
  },

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

  projToGeoBounds(extent) {
    var extArray = extent.split(',');
    var swPoint = L.point(extArray[0], extArray[1]);
    var nePoint = L.point(extArray[2], extArray[3]);
    var swLatLng = L.Projection.SphericalMercator.unproject(swPoint);
    var neLatLng = L.Projection.SphericalMercator.unproject(nePoint);
    return L.latLngBounds(swLatLng, neLatLng);
  },

  setExtent(extent) {
    this.initialExtent = this.projToGeoBounds(extent);
    this.fitBounds(this.initialExtent);
  },

  setInitialExtent() {
    var extent = this.mapOptions.initialExtent || '830036,5402959,1123018,5597635';
    this.setExtent(extent);
  },

  setRestrictedExtent() {
    if (this.options.restrictedExtent) {
      this.restrictedExtent = this.projToGeoBounds(this.options.restrictedExtent);
      this.setMaxBounds(this.restrictedExtent);
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
    var swPoint = this.getBounds().getSouthWest();
    var nePoint = this.getBounds().getNorthEast();
    var swPrj = L.Projection.SphericalMercator.project(swPoint);
    var nePrj = L.Projection.SphericalMercator.project(nePoint);
    return swPrj.x + ',' + swPrj.y + ',' + nePrj.x + ',' + nePrj.y;
  },

  setLayerVisible(layerConfig, visible) {
    'use strict';
    if (visible) {
      // Muta lo stato del layer
      layerConfig.visible = true;
      this.loadLayers([layerConfig]);
    } else {
      const layer = this.getLayerByName(layerConfig.name);
      if (layer) {
        this.removeLayer(layer);
      }
    }
  },

  layerInRange(layerConfig) {
    'use strict';
    if (!layerConfig.minScale && !layerConfig.minScale) {
      return true;
    }
    return this.getScale() < layerConfig.minScale && this.getScale() > layerConfig.maxScale;
  },

  loadControls() {
    'use strict';
    if (this.mapOptions.controls) {
      var cntrl;
      this.controls = {};
      this.mapOptions.controls.forEach(function(control) {
        switch (control.name) {
          case 'scale':
            cntrl = L.control
              .scale({
                imperial: false,
              })
              .addTo(this);
            this.controls[control] = cntrl;
            break;
        }
      }, this);
    }
  },

  loadBaseLayers() {
    'use strict';

    this.baseLayers = [];
    GV.config.baseLayers.forEach(layerConfig => {
      var layer = LayerFactory.create(layerConfig, this);
      this.baseLayers[layer.config.type] = layer;
      if (layer && layerConfig.visible) {
        layer.on(
          'loading',
          function() {
            this.loading(true, layer);
          },
          this
        );
        layer.on(
          'load',
          function() {
            this.loading(false, layer);
          },
          this
        );
        layer.addTo(this);
        this.activeBaseLayer = layer;
        GV.config.activeBaseLayer = layer.config.name;
      }
    }, this);
  },

  loadLayers(layers) {
    'use strict';
    layers.forEach(function(layerConfig) {
      if (!this.getLayerByName(layerConfig.name)) {
        var layer = LayerFactory.create(layerConfig, this);
        if (layer && layerConfig.visible) {
          layer.on(
            'loading',
            function() {
              this.loading(true, layer);
            },
            this
          );
          layer.on(
            'load',
            function() {
              this.loading(false, layer);
            },
            this
          );
          layer.addTo(this);
          layer.on('ready', () => {
            if (layerConfig.zoomToLayerExtent) {
              let bounds = new L.latLngBounds();
              layer.eachLayer(function(_layer) {
                if (_layer.getBounds) {
                  bounds.extend(_layer.getBounds());
                } else {
                  bounds.extend(new L.latLngBounds(_layer._latlng, _layer._latlng));
                }
              });
              if (bounds) this.fitBounds(bounds);
            }
          });
        }
      }
    }, this);
  },
  filterLayer(layerName, filters) {
    const layer = this.getLayerByName(layerName);
    if (!layer) return;
    if (filters) {
      layer.eachLayer(function(marker) {
        var opacity = 0;
        filters.forEach(function(filter) {
          if (marker.feature.properties[filter.key] === filter.value) {
            opacity = layer.config.opacity || 1;
          }
        });
        marker.setOpacity(opacity);
      });
    } else {
      layer.eachLayer(function(marker) {
        var opacity = layer.config.opacity || 1;
        marker.setOpacity(opacity);
      });
    }
  },
  getLayerByName(layerName) {
    var foundLayer = null;
    this.eachLayer(function(layer) {
      if (layer.config && layer.config.name && layer.config.name === layerName) {
        foundLayer = layer;
      }
    });
    return foundLayer;
  },

  changeBaseLayer(layerName) {
    // se livello è presente in mappa e visibile non faccio niente
    // altrimenti levo layer precedente e carico livello in mappa e rendo visibile
    const activeLayerName = GV.config.getActiveBaseLayer().name;
    if (activeLayerName !== layerName) {
      this.baseLayers[layerName].addTo(this);
      this.activeBaseLayer = this.baseLayers[layerName];
      this.removeLayer(this.baseLayers[activeLayerName]);
      GV.config.setActiveBaseLayer(layerName);
    }
  },

  getScale() {
    //return globals.BASE_SCALES[this._zoom]
    const scaleDenom = 591657550 / Math.pow(2, this._zoom);
    return scaleDenom;
  },

  setLoading() {
    this._spinning = 0;
    this.on(
      'layerremove',
      function(e) {
        // Clean-up
        if (e.layer.loading) {
          this.loading(false);
        }
        if (typeof e.layer.on !== 'function') {
          return;
        }
        e.layer.off('load');
        e.layer.off('loading');
      },
      this
    );
  },

  loading(state, layer) {
    if (state) {
      if (this._spinning === 0) {
        GV.log('start load: ' + layer.config.name);
        this._container.style.cursor = 'progress';
      }
      this._spinning++;
    } else {
      this._spinning--;
      if (this._spinning <= 0) {
        GV.log('end load: ' + layer.config.name);
        this._container.style.cursor = 'default';
      }
    }
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

  zoomTo(lat, lon, zoom) {
    this.setView(new L.LatLng(lat, lon), zoom);
  },

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
});

export default Map;
