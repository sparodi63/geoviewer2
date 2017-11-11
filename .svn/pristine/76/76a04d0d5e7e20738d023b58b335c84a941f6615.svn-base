var L = require('leaflet')

var globals = {
  DEFAULT_PROXY: '/geoservices/proxy/proxy.jsp?url=',

  RL_MAP_CONFIG_SERVICE: 'srvcarto.regione.liguria.it/geoservices/REST/config/map/',
  RL_CREATE_SLD_SERVICE: 'srvcarto.regione.liguria.it/geoservices/REST/config/create_sld/',
  RL_CATALOG_SERVICE: 'srvcarto.regione.liguria.it/geoservices/REST/config/catalogo',

  RL_METADATA_URL: '/geoservices/REST/metadata/scheda_xml/',

  GOOGLE_GEOCODE_PROXY: 'geoportale.regione.liguria.it/geoservices/REST/proxy/google_geocode?region=it&language=it&sensor=false&bounds=7.43,43.75|10.00,44.70',

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
  },

  BASE_LAYERS: {
    'BLANK': {
      label: 'Sfondo Bianco',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/bianco.gif'
    },
    'OSM': {
      label: 'OpenStreetMap',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/openstreetmap.png'
    },
    'ESRI_IMAGERY': {
      label: 'ESRI Imagery',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/esri.gif'
    },
    'ESRI_TOPOGRAPHIC': {
      label: 'ESRI Topographic',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/esri.gif'
    },
    'ESRI_GRAY': {
      label: 'ESRI Gray',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/esri.gif'
    },
    'ESRI_DARKGRAY': {
      label: 'ESRI Dark Gray',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/esri.gif'
    },
    'MAPBOX_STREETS': {
      label: 'Mapbox Streets',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'MAPBOX_SATELLITE': {
      label: 'Mapbox Satellite',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'MAPBOX_OUTDOOR': {
      label: 'Mapbox Outdoor',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'MAPBOX_LIGHT': {
      label: 'Mapbox Light',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'STAMEN_TERRAIN': {
      label: 'Stamen Terrain',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'STAMEN_TONER_LIGHT': {
      label: 'Stamen Toner Light',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/mapbox.png'
    },
    'google_roadmap': {
      label: 'Google Stradario',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/google.png'
    },
    'google_hybrid': {
      label: 'Google Ibrido',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/google.png'
    },
    'google_terrain': {
      label: 'Google Terreno',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/google.png'
    },
    'google_satellite': {
      label: 'Google Satellite',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/google.png'
    },
    'rl_ortofoto_2013': {
      label: 'AGEA: Ortofoto 2013',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/sfondi_rl.jpg'
    },
    'rl_carte_base': {
      label: 'Carte di base regionali',
      icon: 'http://srvcarto.regione.liguria.it/geoviewer/img/legend/sfondi_rl.jpg'
    }

  }

}

export default globals
