var id = GV.utils.getUrlParam('id');

var showAddMap = id ? false : true;
var collapsed = id ? true : false;

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'download-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          showAddMap: showAddMap,
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
          filterDownloadCatalog: true,
          showBaseLayerSwitcher: true,
          useDownloadPanel: true,
          noDeleteButton: true,
          showDownloadPanelOnLoad: true,
          downloadPanelCloseMode: 'closeWindow',
          collapsed: collapsed,
        },
      },
      tools: [{ name: 'gv-geocoder' }],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'MAPBOX_STREETS' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
