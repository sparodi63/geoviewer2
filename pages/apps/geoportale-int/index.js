var id = GV.utils.getUrlParam('id');
GV.globals.RL_CATALOG = 'int';

// GV.globals.RL_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/map/'

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
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'geoportale-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
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
                  cat: GV.globals.RL_CATALOG,
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
      tools: [
        { name: 'gv-geocoder', position: 'topleft' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_ORTOFOTO_2013' },
    { type: 'RL_ORTOFOTO_2010' },
    { type: 'RL_ORTOFOTO_2007' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
