GV.globals.GAS_URL = 'http://int01.datasiel.net:8080/';
GV.globals.GAS_SCHEDA = 'http://int01.datasiel.net:8080/';

GV.init({
  debug: true,
  idMap: 1648,
  flagGeoserver: true,
  geoserverUrl: 'https://geoservizi.regione.liguria.it/',
  application: {
    name: 'gas-gv2',
    mapOptions: {
      disableMaxBounds: true,
    },
    layout: {
      tools: [{ name: 'gv-geocoder' }, { name: 'gv-gas', options: { env: 'TEST' } }],
    },
  },
  baseLayers: [{ type: 'MAPBOX_STREETS', visible: true }],
  maps: [],
});
