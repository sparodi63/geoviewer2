var applicazione = GV.utils.getUrlParam('applicazione') || ''; // CODICE APPLICAZIONE ALFA_GIS. Es: PRESSIONI,RAPPORTI-AMBIENTALI
var canale = GV.utils.getUrlParam('canale'); // CODICE CANALE ALFA_GIS (ALTERNATIVO AD APPLICAZIONE)
var id = GV.utils.getUrlParam('id');
var repertorio = GV.utils.getUrlParam('cod_repertorio') || '03';

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/'

GV.init({
  debug: true,
  idMap: id,
  agAppMapList: applicazione,
  application: {
    name: 'ambiente-gv2',
    mapOptions: {
      click: 'info',
    },
    callback: function() {
      console.log('CALLBACK!!!');
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
        // { name: 'gv-download-totale-button' },
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
