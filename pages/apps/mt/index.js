var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'marketing-territoriale-gv2',
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
                },
                tree: null,
              },
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Canali Tematici',
                options: {
                  applicazione: 'ECO3',
                  tematici: 'SI',
                },
                tree: null,
              },
            },
            activePanel: 'canali',
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
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
