/*
ESEMPIO QUERY_STRING
?FIELD=COD_TPRAT,NUM_PRAT,PROG_PRAT,PROG_LOC&CODICE=BAN,24987,0,1&FIND=SI&ID_SESSION=12345

http://localhost:8081?numordineregionale=SP017
*/


const numordineregionale = GV.utils.getUrlParam('numordineregionale');


const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2603 : 2637;
const idLayer = env === 'TEST' ? 'L10198' : 'L10395';
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

function loadConfig(data) {
  const countGeom = data ? data.countGeom : null;

  let findOptions = null;

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

  const auth = {
    type: 'NAM',
    options: {
      ruolo: 'ACQ_VISP,ACQ_SYS,ACQ_ PFR',
    },
  };

  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    findOptions: findOptions,
    application: {
      name: 'siti-contaminati-p-gv2',
      // auth: auth,
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
      { type: 'RL_ORTOFOTO_2022' },
      { type: 'RL_CARTE_BASE' },
      { type: 'BLANK' },
    ],
    maps: [],
  };

  GV.init(conf);
}

