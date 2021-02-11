// http://localhost:8081/?urlRitorno=http://sigmater.regione.liguria.it/sigmater/index.jsp&token=a5a06824-ba51-4c07-8dd8-97ca9864d81b20200412114849&FindBbox=11485056,4917832,1585802,4947083
// http://localhost:8081/?urlRitorno=http://sigmater.regione.liguria.it/sigmater/index.jsp&LAYER=PARTICELLA&CODICE=121615890
// http://localhost:8081/?urlRitorno=http://sigmater.regione.liguria.it/sigmater/index.jsp&LAYER=COMUNE&codice=B838
// http://localhost:8081/?urlRitorno=http://sigmater.regione.liguria.it/sigmater/index.jsp&LAYER=FOGLIO&codice=344481

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

var env = GV.globals.GENIO_WEB_ENV || 'TEST';

var idMap = '1047';

var token = GV.utils.getUrlParam('token');
var findBbox = GV.utils.getUrlParam('FindBbox');
var urlRitorno = GV.utils.getUrlParam('urlRitorno');
var layer = GV.utils.getUrlParam('LAYER');
var codice = GV.utils.getUrlParam('CODICE');

var findOptions = setFindOptions();

var tools = setTools();

function getTokenBbox(app) {
  if (token) {
    GV.utils.getS3TokenBbox(token).then(function(resp) {
      if (resp.success) {
        GV.app.map.zoomToBound(resp.bbox, '3003', null);
      }
    });
  }
}

var auth = {
  type: 'S3',
  options: {
    s3Token: token,
    s3TokenType: 'genio',
    s3TokenProv: null,
  },
};

if (env === 'TEST') {
  auth = null;
}

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  agAppMapList: null,
  application: {
    name: 'sigmater-gv2',
    auth: auth,
    mapOptions: {
      click: 'info',
    },
    callback: getTokenBbox,
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          // showDownloadTotale: true,
          // showMapCatalogPanelOnStart: true,
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
                label: '',
                options: {
                  multiCanale: true,
                  canale: '46',
                  applicazione: 'ECO3',
                  tematici: 'SI',
                  pub: false,
                },
                tree: null,
              },
            },
            activePanel: 'canali',
          },
        },
      },
      tools: tools,
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'MAPBOX_STREETS',
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2016',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});

function setTools() {
  var tools = [
    {
      name: 'gv-geocoder',
    },
    {
      name: 'gv-info-button',
      active: true,
    },
    {
      name: 'gv-print-button',
    },
    {
      name: 'gv-measure-button',
    },
    {
      name: 'gv-ricerca-catastale-button',
    },
    {
      name: 'gv-back-button',
      options: {
        action: 'back',
        url: urlRitorno,
      },
    },
    {
      name: 'gv-scalebar',
      position: 'bottomleft',
    },
  ];

  return tools;
}

function setFindOptions() {
  if (layer && codice) {
    var idLayer, cqlFilter;
    switch (layer) {
      case 'COMUNE':
        idLayer = 'L2626';
        cqlFilter = "AA01_COD_COM='" + codice + "'";
        break;
      case 'FOGLIO':
        idLayer = 'L2625';
        cqlFilter = "CT31_ID='" + codice + "'";
        break;
      case 'PARTICELLA':
        idLayer = 'L2624';
        cqlFilter = 'CT24_ID=' + codice + '';
        break;
    }
    return {
      layers: [idLayer],
      cqlFilter: cqlFilter,
    };
  }
  // if (findBbox) {
  //   return {
  //     bbox: findBbox,
  //     epsg: '3003'
  //   }
  // }

  return null;
}
