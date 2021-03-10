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
  {
    name: 'gv-inner-html',
    position: 'bottomleft',
    options: {
      props: [
        {
          html:
            '<div id="logo"><img src="/geoservices/apps/viewer/static/img/sicoast/img_sicoast.gif"></div>',
        },
      ],
    },
  },
];

GV.init({
  debug: true,
  application: {
    name: 'sicoast-gv2',
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
                label: 'SICoast',
                options: {
                  canale: '43',
                  pub: false,
                },
                tree: null,
              },
              // wms: {
              //   label: 'Servizi WMS',
              // },
              // kml: {
              //   label: 'KML/GPX/JSON',
              // },
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
