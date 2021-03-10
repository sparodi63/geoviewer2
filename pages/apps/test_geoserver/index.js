var id = GV.utils.getUrlParam('id');

var target = GV.utils.getUrlParam('target');

var geoserverUrl = GV.utils.getUrlParam('geoserver_url');

// Parametro per disabilitare cache
var disableCache = GV.utils.getUrlParam('DISABLE_CACHE') === 'TRUE';
console.log(disableCache);

switch (target) {
  case 'P':
    geoserverUrl = 'https://geoservizi.regione.liguria.it';
    break;
  case 'PM':
    geoserverUrl = 'http://10.20.4.120:8080';
    break;
  case 'P1':
    geoserverUrl = 'http://10.20.4.120:8081';
    break;
  case 'P2':
    geoserverUrl = 'http://10.20.4.120:8082';
    break;
  case 'P3':
    geoserverUrl = 'http://10.20.4.120:8083';
    break;
  case 'P4':
    geoserverUrl = 'http://10.20.4.120:8084';
    break;
  case 'T':
    geoserverUrl = 'http://geoservizi.datasiel.net';
    break;
  case 'TM':
    geoserverUrl = 'http://geoservizi.datasiel.net:8080';
    break;
}

// console.log(disableCache)

if (geoserverUrl) {
  GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';
  GV.globals.USE_SUBDOMAINS = false;
  GV.init({
    debug: true,
    idMap: id,
    disableTMS: true,
    disableCache: disableCache,
    geoserverUrl: geoserverUrl + '/',
    flagGeoserver: true,
    application: {
      name: 'test-geoserver-gv2',
      mapOptions: {
        click: 'info',
      },
      layout: {
        legend: {
          options: {
            show: true,
            showInfoMap: true,
            showBaseLayerSwitcher: true,
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
      {
        type: 'ESRI_IMAGERY',
        visible: true,
      },
      {
        type: 'OSM',
      },
      {
        type: 'RL_ORTOFOTO_2016',
      },
      {
        type: 'RL_CARTE_BASE',
      },
      {
        type: 'BLANK',
      },
    ],
    maps: [],
  });
} else {
  alert('parametro TARGET non impostato o non corretto');
}
