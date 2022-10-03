var applicazione = 'RISKNAT';
var repertorio = '03';

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

GV.init({
  debug: true,
  idMap: null,
  agAppMapList: 'RISKNAT',
  application: {
    name: 'ambiente-gv2',
    mapOptions: {
      type: 'openlayers',
      ol3d: true,
      enable3d: true,
      click: 'info',
      disableMaxBounds: true,
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showMapCatalogPanelOnStart: true,
          showDownloadTotale: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
              risknat: {
                name: 'risknat',
                label: 'Interferometria',
              },
            },
            activePanel: 'risknat',
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
        },
        {
          name: 'gv-help3D-button',
          position: 'topleft',
          options: {
            showOnStart: true,
          },
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
      type: 'RL_ORTOFOTO_2019',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
