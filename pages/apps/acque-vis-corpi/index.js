// http://localhost:8081/?CODICE=IT07RW0565LI

const codice = GV.utils.getUrlParam('CODICE');


var env = GV.globals.ENV || 'TEST';
// console.log('ENV', env);

const geoserverUrl =
  env === 'TEST'
    ? 'https://geoservizi.regione.liguria.it/' // '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 1624 : 1624;
// const idMap = env === 'TEST' ? 2568 : 1624;
const idLayer = env === 'TEST' ? 'L4269,L4432,L4581,L5114,L5115' : 'L4269,L4432,L4581,L5114,L5115';
// const idLayer = env === 'TEST' ? 'L9990,L9991,L9992,L9993,L9994' : 'L4269,L4432,L4581,L5114,L5115';

const layers = idLayer.split(',');

const findOptions = {
  layers: layers,
  cqlFilter: `COD_EU='${codice}'`,
};

// console.log('FINDOPTIONS', findOptions)

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
    name: 'acqua-vis-gv2',
    auth: auth,
    mapOptions: {
      // type: 'openlayers',
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
      tools: [
        { name: 'gv-geocoder' },
        // { name: 'gv-info-button', active: true },
        // { name: 'gv-measure-button' },
        // { name: 'gv-layer-search-topo-button' },
        // { name: 'gv-ricerca-catastale-button' },
        // { name: 'gv-print-button' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
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
