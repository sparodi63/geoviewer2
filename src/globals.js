export default {
  DEFAULT_PROXY: '/geoservices/REST/proxy/proxy?url=',

  USE_SUBDOMAINS: true,

  RL_MAP_CONFIG_SERVICE: '/geoservices/REST/geoportale/map/',
  RL_LAYER_CONFIG_SERVICE: '/geoservices/REST/config/layer/',
  RL_QUERY_LAYER_VALUE_LIST_SERVICE: '/geoservices/REST/config/query_layer_valuelist/',
  RL_QUERY_LAYER_TOPO_VALUE_LIST_SERVICE: '/geoservices/REST/config/query_layer_topo_valuelist/',
  RL_QUERY_LAYER_SERVICE: '/geoservices/REST/config/query_layer/',
  RL_QUERY_LAYER_TOPO_SERVICE: '/geoservices/REST/config/query_layer_topo/',
  RL_DYN_MAP_CONFIG_SERVICE: '/geoservices/REST/config/map/',
  RL_CREATE_SLD_SERVICE: '/geoservices/REST/config/create_sld/',
  RL_XSL_INFO_SERVICE: '/geoservices/REST/config/info_xsl?',
  RL_CATALOG_SERVICE: '/geoservices/REST/geoportale/catalogo/',
  RL_CANALI_SERVICE: '/geoservices/REST/config/ag_app_canali_tree/',
  RL_CANALE_CARTE_SERVICE: '/geoservices/REST/config/ag_canale_tree/',
  RL_DOWNLOAD_CONFIG_SERVICE: '/geoservices/REST/download/map/',
  RL_DOWNLOAD_INSERT_SERVICE: '/geoservices/REST/download/insert_richiesta/',
  RL_DOWNLOAD_ESEGUI_RICHIESTA: '/geoservices/REST/download/elabora_richiesta_sincrona/',
  RL_ENTI_SERVICE: '/geoservices/REST/geoportale/enti/',
  RL_METADATA_URL: '/geoservices/REST/metadata/scheda_xml/',
  RL_TRANSFORM_POINT_SERVICE: '/geoservices/REST/coordinate/transform_point/',
  RL_TRANSFORM_BBOX_SERVICE: '/geoservices/REST/coordinate/transform_bbox/',
  RL_TRANSFORM_POLY_SERVICE: '/geoservices/REST/coordinate/transform_poly/',
  RL_ELEVATION: '/geoservices/REST/coordinate/elevation/',
  RL_AG_APP_LISTA_MAPPE: '/geoservices/REST/config/ag_app_lista_mappe/',

  RL_CATALOG: 'pub',

  // HERE_GEOCODE_PROXY: '/geoservices/REST/proxy/here_geocode.v2',
  HERE_GEOCODE_PROXY:
    '/geoservices/apps/proxy/proxy.jsp?url=http://10.20.4.120/geoservices/REST/proxy/here_geocode.v3?',

  //
  MAPBOX_USERNAME: 'stefanoparodi',
  MAPBOX_ACCESS_TOKEN:
    'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g',

  MAX_BOUNDS: {
    X_MIN: 43.4,
    Y_MIN: 7.3,
    X_MAX: 44.8,
    Y_MAX: 10.5,
  },

  INFO_WMS_MAX_FEATURES: 10,

  BASE_SCALES: [
    591657550.5,
    295828775.3,
    147914387.6,
    73957193.82,
    36978596.91,
    18489298.45,
    9244649.227,
    4622324.614,
    2311162.307,
    1155581.153,
    577790.5767,
    288895.2884,
    144447.6442,
    72223.82209,
    36111.91104,
    18055.95552,
    9027.977761,
    4513.98888,
    2256.99444,
    1128.49722,
    564.24861,
    282.124305,
  ],

  BASE_LAYERS: {
    BLANK: {
      label: 'Sfondo Bianco',
      icon: '/geoservices/apps/viewer/static/img/legend/bianco.gif',
      printType: 'no_base',
    },
    RL_ORTOFOTO_2013: {
      label: 'AGEA: Ortofoto 2013',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_ortofoto_2013',
    },
    RL_ORTOFOTO_2010: {
      label: 'AGEA: Ortofoto 2010',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_ortofoto_2010',
    },
    RL_ORTOFOTO_2007: {
      label: 'AGEA: Ortofoto 2007',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_ortofoto_2007',
    },
    RL_ORTOFOTO_2000: {
      label: 'Ortofoto IT 2000',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_ortofoto_2000',
    },
    RL_ORTOFOTO_2016: {
      label: 'AGEA: Ortofoto 2016',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_ortofoto_2016',
    },
    RL_CARTE_BASE: {
      label: 'Carte Regionali 2007 -2013',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    RL_CARTE_BASE_NC25: {
      label: 'Carta Regionale 1:25000 - DBT NC25',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    RL_CARTE_BASE_GS: {
      label: 'Carte Regionali 2007 -2013',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    TS_STREETS: {
      label: 'Stradario',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    TS_DARK_MATTER: {
      label: 'Dark',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    TS_POSITRON: {
      label: 'Positron',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    TS_MONOCHROME: {
      label: 'Monochrome',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    TS_TONER: {
      label: 'Toner',
      icon: '/geoservices/apps/viewer/static/img/legend/sfondi_rl.jpg',
      printType: 'rl_carte_base',
    },
    OSM: {
      label: 'OpenStreetMap',
      icon: '/geoservices/apps/viewer/static/img/legend/openstreetmap.png',
      printType: 'OSM',
    },
    ESRI_IMAGERY: {
      label: 'ESRI Imagery',
      icon: '/geoservices/apps/viewer/static/img/legend/esri.gif',
      printType: 'ESRI_IMAGERY',
    },
    ESRI_GRAY: {
      label: 'ESRI Gray',
      icon: '/geoservices/apps/viewer/static/img/legend/esri.gif',
      printType: 'ESRI_GRAY',
    },
    ESRI_DARKGRAY: {
      label: 'ESRI Dark Gray',
      icon: '/geoservices/apps/viewer/static/img/legend/esri.gif',
      printType: 'ESRI_GRAY',
    },
    ESRI_STREETS: {
      label: 'ESRI Streets',
      icon: '/geoservices/apps/viewer/static/img/legend/esri.gif',
      printType: 'ESRI_STREETS',
    },
    MAPBOX_STREETS: {
      label: 'Mapbox Streets',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
      printType: 'MAPBOX_STREETS',
    },
    MAPBOX_MONOCHROME: {
      label: 'Mapbox Monochrome',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
      printType: 'MAPBOX_MONOCHROME',
    },
    MAPBOX_VIABILITA: {
      label: 'Carta della Viabilità',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
      printType: 'MAPBOX_STREETS',
    },
    MAPBOX_VIABILITA_SATELLITARE: {
      label: 'Carta satellitare della Viabilità',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
      printType: 'MAPBOX_STREETS',
    },
    MAPBOX_OUTDOOR: {
      label: 'Mapbox Outdoor',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
    },
    MAPBOX_LIGHT: {
      label: 'Mapbox Light',
      icon: '/geoservices/apps/viewer/static/img/legend/mapbox.png',
    },
  },
};
