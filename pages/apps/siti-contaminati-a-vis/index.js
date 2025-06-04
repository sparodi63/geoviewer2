// http://localhost:8081/?numordineregionale=A1213
// http://localhost:8081/?numordineregionale=A1220

const numordineregionale = GV.utils.getUrlParam('numordineregionale');


const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2600 : 2636;
const idLayer = env === 'TEST' ? 'L10193' : 'L10392';
const layers = idLayer.split(',');

if (numordineregionale) {
  fetch(`/geoservices/REST/siti_contaminati/sito/${numordineregionale}?tipo=A`)
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
      name: 'siti-contaminati-a-vis-gv2',
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
