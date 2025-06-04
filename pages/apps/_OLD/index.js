var id = GV.utils.getUrlParam('id')


// GV.globals.RL_CREATE_SLD_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/create_sld/'
// GV.globals.RL_XSL_INFO_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/xsl_info_service?'
// GV.globals.RL_CATALOG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/catalogo/'
// GV.globals.RL_CANALI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/ag_app_canali_tree/'
// GV.globals.RL_SCHEDA_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/scheda/'
// GV.globals.RL_ENTI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/enti/'

//?id=56&FIND_MAP=56&FIND_FIELDS=cod_prov&FIND_VALUES=010
//var findOptions = GV.utils.buildFindOptionsFromQueryStringParams()
var findOptions = null

var toolbar = {
  activeButton: 'gv-coordinate-button',
  items: [
    { name: 'gv-info-button' },
    {
      name: 'gv-coordinate-button',
      options: {
        projection: 'EPSG:3003',
      },
    },
    { name: 'gv-add-map-button' },
    {
      name: 'gv-geocoder'
    }
  ],
  //{ name: 'gv-geocoder' },,
}

GV.init({
  debug: true,
  idMap: id,
  findOptions: findOptions,
  // geoserverUrl: 'http://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'geoportale',
    mapOptions: {
      //   click: 'info',
    },
    layout: {
      //   header: {
      //     height: '50px',
      //     html: "<div class='gv-color-scheme'>HEADER </div>",
      //   },
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
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
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
            activePanel: 'kml',
          },
        },
      },
      toolbar: toolbar,
      tools: [
        // {
        //   position: 'topleft',
        //   items: [{ name: 'geocoder' }],
        // },
        // {
        //   position: 'bottomright',
        //   items: [{ name: 'zoom' }],
        // },
        {
          position: 'bottomleft',
          items: [{ name: 'scalebar' }],
        },
      ],
    },
    callback: function(app) {
      //      console.log(app)
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'MAPBOX_STREETS' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
})
