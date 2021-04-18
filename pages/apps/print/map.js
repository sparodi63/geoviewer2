// htto://localhost:8081/?print_config_url=/geoservices/temp/_print_test.json

const printConfigUrl = GV.utils.getUrlParam('print_config_url');

GV.eventBus.$on('map-full-loaded', e => {
  console.log('MAPPA CARICATA: inserisco elemento gv-map-loaded');
  const mapLoaded = document.createElement('div');
  mapLoaded.id = 'gv-map-loaded';
  document.getElementById('gv-container').appendChild(mapLoaded);
});

fetch(printConfigUrl)
  .then(response => response.json())
  .then(data => {
    if (data.mapOptions.flagSameScale) {
      data.mapOptions.initialExtent = null;
    } else {
      data.mapOptions.center = null;
      data.mapOptions.zoom = null;
    }
    loadConfig(data);
  });

function loadConfig(data) {
  console.log('PRINT CONFIG', data);
  let config = {
    debug: true,
    application: {
      name: 'print-gv2',
      mapOptions: data.mapOptions,
      callback: app => {
        if (app.map.type !== 'openlayers') {
          L.control.scale({ imperial: false, maxWidth: 100 }).addTo(app.map);
        }
      },
    },
    baseLayers: [
      {
        type: data.baseLayers[0].type,
        visible: true,
      },
    ],
    maps: [
      {
        id: 0,
        name: 'print',
        layers: data.layers,
      },
    ],
  };
  console.log('MAP CONFIG', config);
  GV.init(config);
}
