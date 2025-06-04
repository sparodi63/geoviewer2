var applicazione = 'RAPPORTI-AMBIENTALI'
var repertorio = '03'
var canale = null

GV.init({
  debug: true,
  idMap: null,
  agAppMapList: null,
  application: {
    name: 'ambiente-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
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
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Canali Tematici',
                options: {
                  canale: canale,
                  applicazione: applicazione,
                  tematici: 'SI',
                  pub: repertorio == '03',
                },
                tree: null,
              },
            },
            activePanel: 'canali',
          },
        },
      },
      tools: [
        { name: 'gv-geocoder' },
        { name: 'gv-info-button', active: true },
        { name: 'gv-measure-button' },
        { name: 'gv-layer-search-button' },
        { name: 'gv-ricerca-particella-button' },
        { name: 'gv-print-button' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2022' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
})
