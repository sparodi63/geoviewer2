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
  // {
  //   name: 'gv-scalebar',
  //   position: 'bottomright',
  // },
];

const id = "2317"

GV.init({
  debug: true,
  idMap: id,
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
                  // canale: 3,
                  // pub: false,
                  // multiCanale: true,
                  // canale: '55',
                  // applicazione: 'ECO3',
                  // tematici: 'SI',
                  // pub: false,
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
