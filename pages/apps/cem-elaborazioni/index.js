var idElab = GV.utils.getUrlParam('ID');

var env = GV.globals.ENV || 'TEST';

var geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
var idMap =
    env === 'TEST'
    ? 2123 
    : 2261;
var idLayer =
    env === 'TEST'
    ? 7268 
    : 8275;


GV.init({
  debug: true,
  application: {
    name: 'cem-elaborazioni-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          dontShowMapCatalogPanelOnStart: true,
          showInfoMap: true,
          noDeleteButton: true,
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
      tools: [
        {
          name: 'gv-geocoder',
        },
        {
          name: 'gv-cem-elaborazioni-button',
          options: {
            idElab: idElab,
            idMap: idMap,
            idLayer: idLayer,
            geoserverUrl: geoserverUrl
          },
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2019',
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
