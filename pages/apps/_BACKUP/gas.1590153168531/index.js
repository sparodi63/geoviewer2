GV.globals.GAS_URL = 'http://gas101.regione.liguria.it:8080/'
GV.globals.GAS_SCHEDA = 'http://gas.regione.liguria.it/'

GV.init({
  debug: true,
  idMap: 1648,
  flagGeoserver: true,
  geoserverUrl: 'http://geoservizi.regione.liguria.it/',
  application: {
    name: 'gas-gv2',
    layout: {
      tools: [
        { name: 'gv-geocoder', position: 'topleft' },
        { name: 'gv-gas', options: { env: 'PROD' } },
      ],
    },
  },
  baseLayers: [{ type: 'MAPBOX_STREETS', visible: true }],
  maps: [],
})
