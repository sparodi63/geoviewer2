import * as LayerFactory from './LayerFactory';
import L from 'leaflet';
// import getZoomFromScaleDenom from "../util/getZoomFromScaleDenom";
// import InfoWmsManager from "../controls/InfoWmsManager";

const Map = {
  type: 'cesium',
  options: {},
  layers: [],
  baseLayers: [],
  initialExtent: [],
  buttons: [],
  viewerOptions: {
    baseLayerPicker: false,
    animation: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
  },
  viewer: null,
  terrainProviderURL: 'https://geoservizi.regione.liguria.it/geoserver/DTM/ows',
  terrainProviderLayerName: 'DTM_dbtopo_5m_wgs84',
  cesiumAccessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MjlkNDBmNS1jMjU0LTQ0MzYtODllNy0wZTA1N2FmN2JkYjgiLCJpZCI6MjMxNTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODI4MTEyMTh9.9i2qC1VoiACGU_PDGlOkvgi1cQL2DTDZbJdE9wCf8fo',
  initialize(options) {
    this.options = options;
    if (this.options.type === 'cesium') {
      Cesium.Ion.defaultAccessToken = this.cesiumAccessToken;
      const GeoserverTerrainProvider = require('../cesium/GeoserverTerrainProvider');

      this.viewerOptions.terrainProvider = new Cesium.GeoserverTerrainProvider({
        url: options.terrainProviderURL || this.terrainProviderURL,
        layerName: options.terrainProviderLayerName || this.terrainProviderLayerName,
      });

      this.viewer = new Cesium.Viewer('gv-cesium', this.viewerOptions);

      this.imageryLayers = this.viewer.scene.globe.imageryLayers;
      this.layers = this.imageryLayers._layers;

      this.setInitialExtent();

      this.eventMngr();

      this.loadBaseLayers();

      if (this.options.navigationControl) {
        this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {
          enableCompass: true,
          enableZoomControls: true,
          enableDistanceLegend: false,
          enableCompassOuterRing: true,
        });
      }
    }

    return this;
  },

  layerInRange(layerConfig) {
    'use strict';
    if (!layerConfig.minScale && !layerConfig.minScale) {
      return true;
    }
    if (!this._zoom) {
      return true;
    }

    const inRange =
      layerConfig.minZoomLevel <= this._zoom && layerConfig.maxZoomLevel >= this._zoom;
    // if (layerConfig.visible) {
    //   console.log(
    //     layerConfig.wmsParams.name,
    //     layerConfig.minZoomLevel,
    //     layerConfig.maxZoomLevel
    //   );
    //   console.log(inRange);
    //   console.log(this._zoom);
    // }
    return inRange;
  },

  eventMngr() {
    //   this.on("zoom", () => {
    //     GV.eventBus.$emit("map-zoom", this._zoom);
    //   });
    this.viewer.camera.moveEnd.addEventListener(() => {
      const tilesToRender = this.viewer.scene.globe._surface._tilesToRender;
      const level = tilesToRender && tilesToRender[0] ? tilesToRender[0]._level : null;
      this._zoom = level;
      // console.log(level);
      GV.eventBus.$emit('map-zoom', this._zoom);
    });

    let drag = false;
    this.viewer.screenSpaceEventHandler.setInputAction(event => {
      // console.log("LEFT_DOWN");
      drag = false;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.viewer.screenSpaceEventHandler.setInputAction(event => {
      drag = true;
      // console.log("MOUSE_MOVE ");
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.viewer.screenSpaceEventHandler.setInputAction(event => {
      // console.log("LEFT_UP", event);
      if (!drag) {
        // evento "click"
        // console.log("CLICK", !drag);
        var ellipsoid = this.viewer.scene.globe.ellipsoid;
        var cartesian = this.viewer.camera.pickEllipsoid(
          new Cesium.Cartesian3(event.position.x, event.position.y),
          ellipsoid
        );
        if (cartesian) {
          var pickRay = this.viewer.camera.getPickRay(
            new Cesium.Cartesian2(event.position.x, event.position.y)
          );
          var featuresPromise = this.viewer.imageryLayers.pickImageryLayerFeatures(
            pickRay,
            this.viewer.scene
          );
          var cartographic = ellipsoid.cartesianToCartographic(cartesian);
          GV.eventBus.$emit('map-click', {
            mapType: 'cesium',
            featuresPromise,
            latlng: L.latLng(cartographic.latitude, cartographic.longitude, cartographic.height),
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    GV.eventBus.$on('set-layer-visible', event => {
      this.setLayerVisible(event.layer, event.checked);
      // this.setHiliteLayerVisible(event);
    });
    //   GV.eventBus.$on("set-layer-transparency", event => {
    //     const layer = this.getLayerByName(event.layerName);
    //     if (layer) layer.setOpacity(event.opacity);
    //   });
    GV.eventBus.$on('change-base-layer', event => {
      this.changeBaseLayer(event.layer);
    });
  },

  getCesiumRectangleFromEPSG3857(extent) {
    var extArray = extent.split(',');
    var swPoint = L.point(extArray[0], extArray[1]);
    var nePoint = L.point(extArray[2], extArray[3]);
    var swLatLng = L.Projection.SphericalMercator.unproject(swPoint);
    var neLatLng = L.Projection.SphericalMercator.unproject(nePoint);
    return Cesium.Rectangle.fromDegrees(swLatLng.lng, swLatLng.lat, neLatLng.lng, neLatLng.lat);
  },

  setInitialExtent() {
    'use strict';
    var extent = this.options.initialExtent || '830036,5402959,1123018,5597635';
    const rectangle = this.getCesiumRectangleFromEPSG3857(extent);
    this.initialExtent = rectangle;
    this.viewer.camera.setView({
      destination: rectangle, // west, south, east, north
    });
  },

  setExtent(extent) {
    'use strict';
    const rectangle = this.getCesiumRectangleFromEPSG3857(extent);
    this.viewer.camera.setView({
      destination: rectangle, // west, south, east, north
    });
  },

  setLayerVisible(layerConfig, visible) {
    'use strict';
    const layer = this.getLayerByName(layerConfig.name);
    layerConfig.visible = visible;
    layer.show = visible;
  },

  loadBaseLayers() {
    'use strict';
    this.baseLayers = [];
    GV.config.baseLayers.forEach(layerConfig => {
      var layer = LayerFactory.create(layerConfig);
      this.baseLayers[layerConfig.type] = layer;
      if (layer && layerConfig.visible) {
        this.imageryLayers.remove(this.imageryLayers.get(0));
        this.imageryLayers.addImageryProvider(layer, 0);
        this.activeBaseLayer = layer;
        GV.config.activeBaseLayer = layerConfig.name;
      }
    }, this);
  },

  removeLayer(layer) {
    this.imageryLayers.remove(layer);
  },

  changeBaseLayer(layerName) {
    const activeLayerName = GV.config.getActiveBaseLayer().name;
    if (activeLayerName !== layerName) {
      this.imageryLayers.remove(this.imageryLayers.get(0));
      this.imageryLayers.addImageryProvider(this.baseLayers[layerName], 0);
      this.activeBaseLayer = this.baseLayers[layerName];
      GV.config.setActiveBaseLayer(layerName);
    }
  },

  loadLayers(layers) {
    const revLayers = layers.map(layer => layer);
    revLayers.reverse().forEach(layerConfig => {
      var layer = LayerFactory.create(layerConfig);
      this.viewer.imageryLayers.add(layer);
    });
  },

  getLayerByName(layerName) {
    if (layerName === 'InfoWmsHilite') {
      return this.viewer.dataSources.getByName('InfoWmsHilite')[0];
    }
    var foundLayer = null;
    this.layers.forEach(layer => {
      if (layer.config && layer.config.name && layer.config.name === layerName) {
        foundLayer = layer;
      }
    });
    return foundLayer;
  },

  // getScale() {
  //   //return globals.BASE_SCALES[this._zoom]
  //   const scaleDenom = 591657550 / Math.pow(2, this._zoom);
  //   return scaleDenom;
  // },

  // setLoading() {
  //   this._spinning = 0;
  //   this.on(
  //     "layerremove",
  //     function (e) {
  //       // Clean-up
  //       if (e.layer.loading) {
  //         this.loading(false);
  //       }
  //       if (typeof e.layer.on !== "function") {
  //         return;
  //       }
  //       e.layer.off("load");
  //       e.layer.off("loading");
  //     },
  //     this
  //   );
  // },

  // loading(state, layer) {
  //   if (state) {
  //     if (this._spinning === 0) {
  //       GV.log("start load: " + layer.config.name);
  //       this._container.style.cursor = "progress";
  //     }
  //     this._spinning++;
  //   } else {
  //     this._spinning--;
  //     if (this._spinning <= 0) {
  //       GV.log("end load: " + layer.config.name);
  //       this._container.style.cursor = "default";
  //     }
  //   }
  // },

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
    this.viewer.entities.remove(this.viewer.entities.getById('geocoder'));
    this.viewer.entities.add({
      id: 'geocoder',
      position: Cesium.Cartesian3.fromDegrees(markerConfig.location.lng, markerConfig.location.lat),
      point: {
        pixelSize: 7,
        color: new Cesium.Color(1, 0.55, 0, 0.6),
      },
      label: {
        text: markerConfig.label || '',
        font: '8pt monospace',
        style: Cesium.LabelStyle.FILL,
        backgroundColor: Cesium.Color.BLUE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
      },
    });
    this.viewer.zoomTo(this.viewer.entities, new Cesium.HeadingPitchRange(0, -90, 3000));
  },

  // find(findOptions) {
  //   if (
  //     (!findOptions.values || findOptions.values === "null") &&
  //     !findOptions.cqlFilter
  //   ) {
  //     console.error("Parametri FIND non completi: manca CQL_FILTER o VALUES");
  //     return;
  //   }
  //   const cqlFilter = findOptions.cqlFilter || buildCqlFilter(findOptions);
  //   const layers =
  //     findOptions.layers || GV.config.getLayersNameByMapId(findOptions.map);
  //   let loading = Loading.service({
  //     // target: "#gv-layer-search-topo-body",
  //     text: "Ricerca...",
  //     background: "rgba(0, 0, 0, 0.8)"
  //   });

  //   getWFSFeature(layers, cqlFilter)
  //     .then(features => {
  //       InfoWmsManager.addHiliteLayer(GV.app.map);
  //       const layer = this.getLayerByName("InfoWmsHilite");
  //       if (features && features.length > 0) {
  //         layer.clearLayers();
  //         layer.addData(features);
  //         this.flyToBounds(layer.getBounds(), {
  //           maxZoom: 15
  //         });
  //         GV.config.hilitedLayer = layers;
  //       } else {
  //         if (findOptions.notFoundAlert) {
  //           notification('Nessuna Elemento Trovato')
  //         }
  //         console.warn('Nessuna Elemento Trovato')
  //       }
  //       loading.close();
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       loading.close();
  //     });
  // },

  // zoomTo(lat, lon, zoom) {
  //   this.setView(new L.LatLng(lat, lon), zoom);
  // }

  // loadControls() {
  //   "use strict";
  //   if (this.mapOptions.controls) {
  //     var cntrl;
  //     this.controls = {};
  //     this.mapOptions.controls.forEach(function (control) {
  //       switch (control.name) {
  //         case "scale":
  //           cntrl = L.control.scale({
  //             imperial: false
  //           }).addTo(this);
  //           this.controls[control] = cntrl;
  //           break;
  //       }
  //     }, this);
  //   }
  // },

  // getExtent() {
  //   "use strict";
  //   var swPoint = this.getBounds().getSouthWest();
  //   var nePoint = this.getBounds().getNorthEast();
  //   var swPrj = L.Projection.SphericalMercator.project(swPoint);
  //   var nePrj = L.Projection.SphericalMercator.project(nePoint);
  //   return L.bounds(swPrj, nePrj);
  // },

  // getExtentAsString() {
  //   "use strict";
  //   var swPoint = this.getBounds().getSouthWest();
  //   var nePoint = this.getBounds().getNorthEast();
  //   var swPrj = L.Projection.SphericalMercator.project(swPoint);
  //   var nePrj = L.Projection.SphericalMercator.project(nePoint);
  //   return swPrj.x + "," + swPrj.y + "," + nePrj.x + "," + nePrj.y;
  // },

  // setHiliteLayerVisible(event) {
  //   if (!GV.config.hilitedLayer) {
  //     return;
  //   }
  //   GV.config.hilitedLayer.forEach(hl => {
  //     if (hl === event.layer.name) {
  //       const layer = this.getLayerByName("InfoWmsHilite");
  //       layer.eachLayer(m => {
  //         const opacity = event.checked ? 0.6 : 0.0;
  //         m.setStyle({
  //           opacity: opacity
  //         });
  //       });
  //     }
  //   });
  // },
};

export default Map;
