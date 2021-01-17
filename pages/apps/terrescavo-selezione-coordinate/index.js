/*
ESEMPIO QUERY_STRING
?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE=C008027A&FIND=SI
?ID_MAP=1640&ID_LAYER=4429&FIELD=COD_IMPIANTO&CODICE=9&FIND=SI
?ID_MAP=1640&ID_LAYER=4430&FIELD=ID_SCARICO&CODICE=I011015046U&FIND=SI
?ID_MAP=1640&ID_LAYER=4431&FIELD=CODICE_CENTRO&CODICE=???&FIND=SI

http://localhost:8081/?&CODICE=010001


*/

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/'
// GV.globals.RL_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/map/'

var idMap = 'D66';
var idLayer = 'L6422';
var field = 'codice_comune';
var value = GV.utils.getUrlParam('codice');
var lon = GV.utils.getUrlParam('lon');
var lat = GV.utils.getUrlParam('lat');

function addMarker() {
  if (!lon || !lat) {
    return;
  }
  GV.app.map.addMarker({
    location: [lat, lon],
    epsg: '3003',
  });
}

var findOptions = value
  ? {
      layers: [idLayer],
      cqlFilter: field + "='" + value + "'",
    }
  : null;

function conferma(x, y, esito) {
  window.parent.postMessage(
    { messaggio: 'selezione-coordinate', lon: x, lat: y, esito: esito },
    '*'
  );
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'terrescavo-gv2',
    layout: {
      legend: {
        options: {
          show: true,
          collapsed: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
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
        // {
        //   name: 'gv-info-button',
        // },
        {
          name: 'gv-coordinate-button',
          options: {
            projection: 'EPSG:3003',
            submit: function(x, y) {
              conferma(x, y, 'OK');
            },
            cancel: function() {
              conferma(null, null, 'KO');
            },
            active: true,
          },
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
    callback: addMarker,
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'MAPBOX_STREETS',
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
