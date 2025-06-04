var id = GV.utils.getUrlParam('id');

var target = GV.utils.getUrlParam('target');

var geoserverUrl = GV.utils.getUrlParam('geoserver_url');

// Parametro per disabilitare cache
var disableCache = GV.utils.getUrlParam('DISABLE_CACHE') === 'TRUE';
if (!geoserverUrl) geoserverUrl = getGeoserverUrl(target);
console.log(`TARGET: ${target}`);
// console.log(`DISABLE_CACHE: ${disableCache}`);
console.log(`GEOSERVER_URL: ${geoserverUrl}`);

if (geoserverUrl) {
  
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
        type: 'RL_ORTOFOTO_2019',
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
  console.error('parametro TARGET non impostato o non corretto');
}

function getGeoserverUrl(target) {
  let url = null;

  switch (target) {
    // PROD
    case 'GP':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi-gest.regione.liguria.it:8081';
      break;
    case 'GPP':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi-gest.regione.liguria.it:8091';
      break;
    case 'EP':
      url = 'https://geoservizi.regione.liguria.it';
      break;
    case 'EPP':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi.regione.liguria.it:8091';
      break;
    // TEST
    case 'GT':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi-gest-test.regione.liguria.it:8081';
      break;
    case 'GTP':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi-gest-test.regione.liguria.it:8091';
      break;
    case 'ET':
      url = 'https://geoservizi-test.regione.liguria.it';
      break;
    case 'ETP':
      url = '/geoservices/REST/proxy/proxy?url=http://geoservizi-test.regione.liguria.it:8091';
      break;
  }
  return url;
}
