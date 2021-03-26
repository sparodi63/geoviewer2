<template>
  <div id="gv-map"></div>
</template>

<script>
import Vue from 'vue';
import Map from '../leaflet/Map.js';
import InfoWmsManager from '../controls/InfoWmsManager';
import Coordinate from '../controls/Coordinate';

const events = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'contextmenu',
  'focus',
  'blur',
  'preclick',
  'load',
  'unload',
  'viewreset',
  'movestart',
  'move',
  'moveend',
  'dragstart',
  'drag',
  'dragend',
  'zoomstart',
  'zoomend',
  'zoomanim',
  'zoomlevelschange',
  'resize',
  'autopanstart',
  'layeradd',
  'layerremove',
  'baselayerchange',
  'overlayadd',
  'overlayremove',
  'locationfound',
  'locationerror',
  'popupopen',
  'popupclose',
];

export default {
  name: 'gv-ll-map',
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    // if (GV.config.application.mapOptions.type === 'leaflet') {}
    GV.app.map = new Map();
    this.map = GV.app.map;

    this.registerMapEvents();

    this.subscribeConfigEvents();

    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    if (GV.config.application.mapOptions && GV.config.application.mapOptions.click) {
      switch (GV.config.application.mapOptions.click) {
        case 'info':
          InfoWmsManager.activate();
          break;
        case 'coordinate':
          Coordinate.activate();
          break;
      }
    }

    GV.log('gv-map: mounted');
    GV.eventBus.$emit('gv-map-mounted', GV.app.map);
  },
  methods: {
    handleResize(event) {
      const height =
        document.documentElement.clientHeight -
        document.getElementById('gv-map').getBoundingClientRect().top;
      this.style = `height:${height}px`;
    },
    registerMapEvents() {
      events.forEach(eventName => {
        const exposedName = 'map-' + eventName;
        GV.app.map.on(eventName, ev => {
          ev.mapType = 'leaflet';
          GV.eventBus.$emit(exposedName, ev);
        });
      });
    },
    subscribeConfigEvents() {
      console.log('OPENLAYERSMAP: subscribeConfigEvents');

      // Ascolto evento config-add-map e aggiungo layer alla mappa
      GV.eventBus.$on('config-add-map', ev => {
        const mapConfig = ev.config;
        // Aggiungo livelli alla mappa
        GV.app.map.loadLayers(mapConfig.layers);
        //gestione extent
        if (mapConfig.extent_3857) {
          GV.app.map.setExtent(mapConfig.extent_3857);
        }
      });
      // Ascolto evento config-add-layer e aggiungo layer alla mappa
      GV.eventBus.$on('config-add-layer', ev => {
        const layerConfig = ev.config;
        // Aggiungo livello alla mappa
        GV.app.map.loadLayers([layerConfig]);
        //gestione extent
        if (layerConfig.extent_3857) {
          GV.app.map.setExtent(layerConfig.extent_3857);
        }
      });
      // Ascolto evento config-add-layer e aggiungo layer alla mappa
      GV.eventBus.$on('config-remove-layer', ev => {
        const idLayer = ev.config;
        const layer = GV.app.map.getLayerByName(idLayer);
        if (layer) GV.app.map.removeLayer(layer);
      });

      // Ascolto evento config-remove-map e levo layer alla mappa
      GV.eventBus.$on('config-remove-map', ev => {
        const mapConfig = ev.config;
        // Levo i livelli dalla mappa
        mapConfig.layers.forEach(layerConfig => {
          const layer = GV.app.map.getLayerByName(layerConfig.name);
          if (layer) {
            GV.app.map.removeLayer(layer);
          }
        });
      });
    },
  },
};
</script>

<style scoped>
#gv-map {
  position: absolute;
  width: 100%;
  height: 100vh;
  margin-top: 0px;
  z-index: 1;
}
</style>
