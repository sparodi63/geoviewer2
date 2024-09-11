/*
ESEMPIO QUERY_STRING
?FIELD=COD_TPRAT,NUM_PRAT,PROG_PRAT,PROG_LOC&CODICE=BAN,24987,0,1&FIND=SI&ID_SESSION=12345

http://localhost:8081?numordineregionale=SP017&codice_comune=011015&ID_SESSION=SC12345

*/

const numordineregionale = GV.utils.getUrlParam('numordineregionale');
const codice_comune = GV.utils.getUrlParam('codice_comune');
const id_session = GV.utils.getUrlParam('id_session');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2603 : 2603;
const idLayer = env === 'TEST' ? 'L10198' : 'L10198';
const layers = idLayer.split(',');
const idLayerComune = 'L6422';

if (numordineregionale) {
  console.log('NUMORDINEREGIONALE', numordineregionale);
  fetch(`/geoservices/REST/siti_contaminati/sito/${numordineregionale}?tipo=P`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadConfig(data.data);
      } else {
        throw data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
} else {
  loadConfig(null);
  console.warn('PROGETTO ASSENTE');
}

GV.globals.flagInsert = false;

function beforeUnload() {
  if (GV.globals.flagInsert) {
    return;
  }
  insert(0, 0, 'NO');
}

function insert(x, y, esito) {
  console.log('submit', x, y);

  GV.utils.insertAgCoordinate(id_session, x.toFixed(0), y.toFixed(0), esito);
}

function loadConfig(data) {
  const countGeom = data ? data.countGeom : null;

  let findOptions = null;

  if (codice_comune) {
    findOptions = {
      map: null,
      layers: [idLayerComune],
      fields: 'CODICE_COMUNE',
      values: codice_comune,
      cqlFilter: null,
    };
  }
  if (countGeom > 0) {
    findOptions = {
      map: null,
      layers: layers,
      fields: 'NUMORDINEREGIONALE',
      values: numordineregionale,
      cqlFilter: null,
    };
  }

  console.log('FINDOPTIONS', findOptions);

  let tools = [
    { name: 'gv-geocoder' },
    { name: 'gv-info-button', active: true },
    { name: 'gv-measure-button' },
    { name: 'gv-layer-search-button' },
    { name: 'gv-print-button' },
    { name: 'gv-scalebar', position: 'bottomleft' },
  ];

  tools.push(getDrawTool());

  const auth = {
    type: 'NAM',
    options: {
      ruolo: 'VIA_GEST',
    },
  };

  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    findOptions: findOptions,
    application: {
      name: 'siti-contaminati-p-gv2',
      auth: auth,
      mapOptions: {
        type: 'openlayers',
        click: 'info',
      },
      layout: {
        legend: {
          options: {
            show: true,
            showAddMap: true,
            showInfoMap: true,
            showDownloadTotale: false,
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
        tools: tools,
      },
    },
    baseLayers: [
      { type: 'ESRI_IMAGERY', visible: true },
      { type: 'OSM' },
      { type: 'RL_ORTOFOTO_2019' },
      { type: 'RL_CARTE_BASE' },
      { type: 'BLANK' },
    ],
    maps: [],
  };

  GV.init(conf);
}

function getDrawTool() {
  const initWfsRequest = [
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${idLayer}&cql_filter=NUMORDINEREGIONALE='${numordineregionale}'`,
    },
  ];

  // '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net:8080/'
  // console.log('INITWFSREQUEST', initWfsRequest);

  return {
    name: 'gv-draw-button',
    active: false,
    options: {
      idLayer: idLayer,
      tools: {
        draw: {
          point: true,
        },
        edit: {
          edit: true,
          // remove: true,
        },
      },
      buttons: {
        submit: true,
        cancel: false,
        refresh: true,
      },
      color: '#FF9900',
      multiGeom: false,
      epsg: '3003',
      initWfsRequests: initWfsRequest,

      submit: function(data) {
        console.log('submit', data);
        insert(
          data.features[0].geometry.coordinates[0],
          data.features[0].geometry.coordinates[1],
          'SI'
        );
      },
      cancel: function() {
        insert(0, 0, 'NO');
      },
    },
  };
}
