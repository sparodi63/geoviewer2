var idMap = null;
GV.globals.ATLANTE_GEOCHIMICO_CONFIG_URL = '/geoservices/REST/atlante_geochimico/config/';
// GV.globals.ATLANTE_GEOCHIMICO_CONFIG_URL = '/geoservices/data/atlante_geochimico/config.json';

GV.init({
  debug: true,
  idMap: idMap,
  application: {
    name: 'atlante-geochimico-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          dontShowMapCatalogPanelOnStart: true,
          showInfoMap: false,
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
          name: 'atlante-geochimico-livelli',
        },
        // { name: 'gv-geocoder', position: 'topright' },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_GRAY',
      visible: true,
    },
    {
      type: 'ESRI_IMAGERY',
    },
    {
      type: 'RL_ORTOFOTO_2016',
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
