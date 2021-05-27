// http://localhost:8081/?FIND_LAYERS=L4382&FIND_CQL_FILTER=cod_i=%2707/00208369%27

var id = '1701';

// GV.globals.RL_MAP_CONFIG_SERVICE = "/geoservices/REST/config/map/";

var tools = [
  { name: 'gv-geocoder' },
  { name: 'gv-info-button', active: true },
  { name: 'gv-measure-button' },
  { name: 'gv-layer-search-button' },
  { name: 'gv-ricerca-particella-button' },
  { name: 'gv-print-button' },
  { name: 'gv-scalebar', position: 'bottomright' },
];

GV.init({
  debug: true,
  idMap: id,
  findOptions: null,
  application: {
    name: 'vincoli-gv2',
    mapOptions: {
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
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
                },
                tree: null,
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
});
