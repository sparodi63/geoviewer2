var L = require('leaflet')
require('./polyfills/matchMedia.js')

var globals = {
  DEFAULT_PROXY: '/geoservices/proxy/proxy.jsp?url=',

  RL_MAP_CONFIG_SERVICE: 'http://geoportale.regione.liguria.it/geoservices/REST/config/map/',
  RL_CREATE_SLD_SERVICE: 'http://geoportale.regione.liguria.it/geoservices/REST/config/create_sld/',

  RL_METADATA_URL: '/geoservices/REST/metadata/scheda_xml/',

  MAX_BOUNDS: L.latLngBounds(L.latLng(43.4, 7.3), L.latLng(44.8, 10.5)),

  INFO_WMS_MAX_FEATURES: 10,

  SMALL_SCREEN: window.matchMedia('(max-width: 700px)').matches,
  // SMALL_SCREEN: false,

  BASE_SCALES: [
    591657550.500000,
    295828775.300000,
    147914387.600000,
    73957193.820000,
    36978596.910000,
    18489298.450000,
    9244649.227000,
    4622324.614000,
    2311162.307000,
    1155581.153000,
    577790.576700,
    288895.288400,
    144447.644200,
    72223.822090,
    36111.911040,
    18055.955520,
    9027.977761,
    4513.988880,
    2256.994440,
    1128.497220
  ],

  BASE_SCALE_LABELS: {
    8: '1:1.600.000',
    9: '1:800.000',
    10: '1:400.000',
    11: '1:200.000',
    12: '1:100.000',
    13: '1:50.000',
    14: '1:25.000',
    15: '1:12.500',
    16: '1:6.250',
    17: '1:3.125',
    18: '1:1.560',
    19: '1:800',
    20: '1:400'
  }

}

export default globals
