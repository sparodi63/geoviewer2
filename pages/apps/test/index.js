var id = GV.utils.getUrlParam('id');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';
// GV.globals.RL_DYN_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/map/'
// GV.globals.RL_CREATE_SLD_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/create_sld/'
// GV.globals.RL_XSL_INFO_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/xsl_info_service?'
// GV.globals.RL_CATALOG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/catalogo/'
// GV.globals.RL_CANALI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/ag_app_canali_tree/'
// GV.globals.RL_SCHEDA_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/scheda/'
// GV.globals.RL_ENTI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/enti/'

//?id=56&FIND_MAP=56&FIND_FIELDS=cod_prov&FIND_VALUES=010
// var findOptions = GV.utils.buildFindOptionsFromQueryStringParams()
var findOptions = null;

GV.init({
  debug: true,
  idMap: id,
  findOptions: findOptions,
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'test-gv2',
    mapOptions: {
      type: 'leaflet',
      // click: 'coordinate',
      // click: 'info',
    },
    layout: {
      // header: {
      //   height: '100px',
      //   html: "<div class='gv-color-scheme'>HEADER </div>",
      // },
      legend: {
        options: {
          showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          useDownloadPanel: true,
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
                label: 'Canali Tematici',
                options: {
                  applicazione: 'ECO3',
                  tematici: 'SI',
                },
                tree: null,
              },
              wms: {
                type: 'WMS',
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
              risknat: {
                name: 'risknat',
                label: 'Interferometria',
              },
            },
            activePanel: 'repertorio',
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
        },
        // {
        //   name: 'gv-info-button',
        //   active: true,
        // },
        // {
        //   name: 'gv-download-totale-button',
        // },
        // {
        //   name: 'gv-print-button',
        // },
        // {
        //   name: 'gv-measure-button',
        // },
        // {
        //   name: 'gv-coordinate-button',
        //   options: {
        //     projection: 'EPSG:3003',
        //     submit(x, y) {
        //       console.log('submit');
        //       GV.TEST_COORDINATE_X = x;
        //       GV.TEST_COORDINATE_Y = y;
        //       console.log(x);
        //       console.log(y);
        //     },
        //     cancel() {
        //       console.log('cancel');
        //     },
        //   },
        // },
        // {
        //   // name: "gv-layer-search-topo-button"
        //   name: 'gv-layer-search-button',
        // },
        // {
        //   name: 'gv-download-totale-button',
        // },
        // {
        //   name: 'gv-draw-button',
        //   active: false,
        //   options: {
        //     tools: {
        //       point: true,
        //       line: true,
        //       polygon: true,
        //     },
        //     multiGeom: true,
        //     epsg: '3003',
        //     submit: function(data, type) {
        //       console.log(data);
        //       console.log(type);
        //     },
        //     cancel: function(data, type) {
        //       console.log(data);
        //       console.log(type);
        //     },
        //   },
        // },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
    callback: function(app) {},
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
      type: 'RL_ORTOFOTO_2010',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'ESRI_STREETS',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
