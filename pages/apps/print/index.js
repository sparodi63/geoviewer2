GV.init({
  debug: true,
  idMap: 56,
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'geoportale-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      tools: [{ name: 'gv-scalebar', position: 'bottomleft' }],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'MAPBOX_STREETS' },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
