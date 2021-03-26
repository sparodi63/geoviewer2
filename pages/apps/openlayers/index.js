var id = GV.utils.getUrlParam('id');

// GV.globals.RL_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/map/'
// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

var customPageUrlList = {
  1881: '/geoservices/apps/viewer/pages/apps/atlante-geochimico/',
};

if (id && customPageUrlList[id]) {
  window.location = customPageUrlList[id];
}

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'openlayers-gv2',
    mapOptions: {
      type: 'ol',
      click: 'info',
      // restrictedExtent: '830036,5402959,1123018,5597635',
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
          position: 'topleft',
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
      type: 'ESRI_STREETS',
      visible: true,
    },
    {
      type: 'TS_MONOCHROME',
    },
    {
      type: 'RL_ORTOFOTO_2016',
    },
    {
      type: 'RL_ORTOFOTO_2013',
    },
    {
      type: 'RL_ORTOFOTO_2010',
    },
    {
      type: 'RL_ORTOFOTO_2007',
    },
    {
      type: 'RL_ORTOFOTO_2000',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'RL_CARTE_BASE_NC25',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
