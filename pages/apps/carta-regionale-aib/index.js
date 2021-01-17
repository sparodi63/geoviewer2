// http://localhost:8081/?FIND_LAYERS=L4382&FIND_CQL_FILTER=cod_i=%2707/00208369%27

var tools = [
  {
    name: 'gv-geocoder',
  },
  {
    name: 'gv-info-button',
    active: true,
  },
  {
    name: 'gv-measure-button',
  },
  {
    name: 'gv-layer-search-button',
  },
  {
    name: 'gv-ricerca-particella-button',
  },
  {
    name: 'gv-print-button',
  },
  {
    name: 'gv-scalebar',
    position: 'bottomright',
  },
];

GV.init({
  debug: true,
  application: {
    name: 'carta-regionale-aib-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          // showDownloadTotale: true,
          showMapCatalogPanelOnStart: true,
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
                label: 'Cartografia regionale A.I.B.',
                options: {
                  canale: '165',
                  pub: false,
                },
                tree: null,
              },
            },
            activePanel: 'canali',
          },
        },
      },
      tools: tools,
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'MAPBOX_STREETS',
    },
    {
      type: 'OSM',
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
