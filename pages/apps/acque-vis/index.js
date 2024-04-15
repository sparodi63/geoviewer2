// http://localhost:8081/?CODICE=G550002

const codice = GV.utils.getUrlParam('CODICE');
// const cod_com = GV.utils.getUrlParam('COD_COM');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.ENV || 'TEST';
// console.log('ENV', env);

const geoserverUrl =
  env === 'TEST'
    ? '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net:8080/' // 'https://geoservizi.regione.liguria.it/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2560 : 918;
// const idLayer = env === 'TEST' ? 'L9965' : 'L4582';
const idLayer =
  env === 'TEST'
    ? 'L9962,L9963,L9964,L9966,L9967,L9968,L9969,L9970'
    : 'L2083,L2084,L2883,L2884,L2885,L2886,L2887,L4583';
const layers = idLayer.split(',');
// const idLayerComune = 'L6422';

const findOptions = {
  layers: layers,
  cqlFilter: `CODICE_PUNTO_DI_MISURA='${codice}'`,
};

const auth = {
  type: 'NAM',
  options: {
    ruolo: 'VIA_VIS,VIA_GEST',
  },
};

let conf = {
  debug: true,
  idMap: idMap,
  geoserverUrl: geoserverUrl,
  findOptions: findOptions,
  application: {
    name: 'acque-vis-gv2',
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
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
};

GV.init(conf);
