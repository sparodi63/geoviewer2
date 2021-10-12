var id = GV.utils.getUrlParam('id');

var showAddMap = id ? false : true;
var collapsed = id ? true : false;

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

// GESTIONE PAGINE CUSTOM --------------------------------------------
var customPageUrlList = {
  1881: '/geoservices/apps/viewer/pages/apps/atlante-geochimico/',
};
if (id && customPageUrlList[id]) {
  window.location = customPageUrlList[id];
}
// GESTIONE PAGINE CUSTOM --------------------------------------------


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
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
