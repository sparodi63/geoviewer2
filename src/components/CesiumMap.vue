<template>
  <div id="gv-cesium" :style="style"></div>
</template>

<script>
import Vue from 'vue';
import Map from '../cesium/Map.js';
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
  name: 'gv-cesium',
  data() {
    const height = document.documentElement.clientHeight;
    return {
      style: `height:${height}px`,
      map: null,
    };
  },
  mounted() {
    GV.app.map = Map.initialize(GV.config.application.mapOptions);

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
    GV.eventBus.$emit('gv-map-mounted', this.map);
  },
  methods: {
    handleResize(event) {
      const height =
        document.documentElement.clientHeight -
        document.getElementById('gv-cesium').getBoundingClientRect().top;
      this.style = `height:${height}px`;
    },
    registerMapEvents() {
      // events.forEach(eventName => {
      //   const exposedName = "map-" + eventName;
      //   GV.app.map.on(eventName, ev => {
      //     GV.eventBus.$emit(exposedName, ev);
      //   });
      // });
    },
    subscribeConfigEvents() {
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
  margin-top: 0px;
  z-index: 1;
}
</style>

<style>
#distanceLegendDiv .compass {
  pointer-events: auto;
  left: 0 !important;
  top: 50px !important;
}
#distanceLegendDiv .navigation-controls {
  display: block !important;
  left: 30px !important;
  top: 160px !important;
}
</style>
