// ?url=http://localhost:8099/geoserver/M1237/ogc/features/collections/L3147/items/L3147.195121_1?f=application/json

// GV.globals.RL_MAP_CONFIG_SERVICE =
// 'https://srvcarto.regione.liguria.it/geoservices/REST/config/map/';

const theme = GV.utils.getUrlParam('theme');
const id = GV.utils.getUrlParam('id');

// var url = `/geoservices/data/inspire/map_config/${theme}.json`;
// url = `/geoservices/data/inspire/map_config/2554.json`;

var url = id
  ? `https://srvcarto.regione.liguria.it/geoservices/REST/config/map/${id}`
  : `/geoservices/data/inspire/map_config/${theme}.json`;

function callback() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const mapConfig = data.data;
      console.log(mapConfig);
      mapConfig.layers.forEach(layer => {
        layer.infoOptions.featureCount = 1;
      });
      GV.config.loadConfig(mapConfig);
    });
}

GV.init({
  debug: true,
  idMap: null,
  // idMap: 2554,
  application: {
    name: 'api-feature-gv2',
    mapOptions: {
      type: 'openlayers',
      click: 'info',
      maxZoom: 19,
    },
    callback: callback,
    layout: {
      legend: {
        options: {
          show: true,
          // showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
              wms: {
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
          position: 'topleft',
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    {
      type: 'OSM',
    },
    {
      type: 'TS_STREETS',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
