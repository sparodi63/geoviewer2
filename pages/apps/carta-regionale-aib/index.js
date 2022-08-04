// http://localhost:8081/?FIND_LAYERS=L4382&FIND_CQL_FILTER=cod_i=%2707/00208369%27

var tools = [
  {
    name: 'gv-geocoder-btn-button',
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
    name: 'gv-insert-point-button',
  },
  {
    name: 'gv-scalebar',
    position: 'bottomleft',
  },
];

const screenWidth = document.documentElement.clientWidth;
const maxScreenWidth = 420;
const largeScreen = screenWidth > maxScreenWidth;

if (largeScreen) {
  tools.push({
    name: 'gv-help-aib-button',
  });
}

GV.init({
  debug: true,
  idMap: '2317',
  application: {
    name: 'carta-regionale-aib-gv2',
    auth: null,
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          // showMapCatalogPanelOnStart: true,
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
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Cartografia regionale A.I.B.',
                options: {
                  canale: '165',
                  // pub: true,
                },
                tree: null,
              },
              kml: {
                label: 'KML / GPX / JSON',
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
