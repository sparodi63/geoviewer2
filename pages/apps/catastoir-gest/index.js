/*

http://localhost:8081?ID_SESSION=12345&CODICE_COMUNE=010058&ID_PUNTO=2631

*/

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

var geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
var idMap = env === 'TEST' ? 2258 : null;
var idLayer = env === 'TEST' ? 'L8272' : null;
var idLayerComune = 'L6422';

var idSession = GV.utils.getUrlParam('ID_SESSION');
var codiceComune = GV.utils.getUrlParam('CODICE_COMUNE');
var idPunto = GV.utils.getUrlParam('ID_PUNTO');
var coord = GV.utils.getUrlParam('COORD');

var findOptions = setFindOptions();
var zoomTo = setZoomTo();

function setFindOptions() {
  if (idPunto) {
    return {
      layers: [idLayer],
      cqlFilter: "ID_PUNTO='" + idPunto + "'",
    };
  }
  if (codiceComune) {
    return {
      layers: [idLayerComune],
      cqlFilter: "CODICE_COMUNE='" + codiceComune + "'",
    };
  }
  return null;
}

function setZoomTo() {
  if (idPunto) {
    return null;
  }
  if (coord) {
    return {
      coord: coord,
      epsg: '3003',
    };
  }
  return null;
}

window.addEventListener('beforeunload', function() {
  beforeUnload();
});

GV.globals.flagInsert = false;

function beforeUnload() {
  if (GV.globals.flagInsert) {
    return;
  }
  insert(0, 0, 0, 'NO');
}

function insert(x, y, z, esito) {
  // console.log(z);
  GV.utils.insertAgCoordinate(idSession, x.toFixed(0), y.toFixed(0), esito, z);
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  zoomTo: zoomTo,
  geoserverUrl: geoserverUrl,
  application: {
    name: 'catastoir-gv2',
    mapOptions: {
      // type: 'openlayers',
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
          showLayersTransparency: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
                },
                tree: null,
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
          name: 'gv-info-button',
          active: true,
        },
        {
          name: 'gv-coordinate-button',
          options: {
            projection: 'EPSG:3003',
            quota: true,
            submit: function(x, y, z) {
              console.log('submit', x, y, z);
              insert(x, y, z, 'SI');
            },
            cancel: function() {
              insert(0, 0, 0, 'NO');
            },
          },
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
    callback: null,
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
