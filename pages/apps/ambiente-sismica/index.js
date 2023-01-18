const locate = GV.utils.getUrlParam('LOCATE');
const codice = GV.utils.getUrlParam('CODICE');
const codice_comune = GV.utils.getUrlParam('CODICE_COMUNE');
const idSession = GV.utils.getUrlParam('ID_SESSION');

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2206 : 2192;
const layer_p = env === 'TEST' ? 'L8027' : 'L7949';
const layer_l = env === 'TEST' ? 'L8028' : 'L7950';
const idLayerComune = 'L6422';

const findOptions = codice
  ? {
      map: `${idMap}`,
      layers: null,
      fields: 'CODICE_SITO',
      values: codice,
      cqlFilter: null,
    }
  : codice_comune
  ? {
      map: null,
      layers: [idLayerComune],
      fields: 'CODICE_COMUNE',
      values: codice_comune,
      cqlFilter: null,
    }
  : null;

console.log(findOptions);

let tools = [
  {
    name: 'gv-geocoder',
  },
  {
    name: 'gv-info-button',
    active: true,
  },
  {
    name: 'gv-measure-button',
  },
  {
    name: 'gv-layer-search-button',
  },
  {
    name: 'gv-print-button',
  },
  {
    name: 'gv-scalebar',
    position: 'bottomleft',
  },
];

if (locate) {
  tools.push(getDrawTool(codice));
}

function getDrawTool(codice) {
  const initWfsRequest = [
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${layer_p}&cql_filter=CODICE_SITO='${codice}'`,
    },
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${layer_l}&cql_filter=CODICE_SITO='${codice}'`,
    },
  ];

  return {
    name: 'gv-draw-button',
    active: false,
    options: {
      idLayer: [layer_p, layer_l],
      tools: {
        draw: {
          point: true,
          polyline: true,
        },
        edit: {
          edit: true,
          // remove: true,
        },
      },
      buttons: {
        submit: true,
        cancel: true,
        refresh: true,
      },
      color: '#FF9900',
      multiGeom: false,
      epsg: '3003',
      initWfsRequests: initWfsRequest,
      cancel: () => {
        insert(0, 0, 0, 0, 'NO');
      },
      submit: (data, deleted, loading, refresh) => {
        console.log('submit', data.features[0].geometry);
        const geometry =
          data && data.features[0] && data.features[0].geometry ? data.features[0].geometry : null;
        if (geometry) {
          let x, y, x2, y2;
          // CALCOLO COORDINATE
          if (geometry.type === 'LineString') {
            x = geometry.coordinates[0][0].toFixed(0);
            y = geometry.coordinates[0][1].toFixed(0);
            x2 = geometry.coordinates[geometry.coordinates.length - 1][0].toFixed(0);
            y2 = geometry.coordinates[geometry.coordinates.length - 1][1].toFixed(0);
          } else {
            x = geometry.coordinates[0].toFixed(0);
            y = geometry.coordinates[1].toFixed(0);
            x2 = null;
            y2 = null;
          }
          // TRASFORMAZIONE COORDINATE IN UTM32
          let x_t, y_t, x2_t, y2_t;
          const trUrl =
            'https://srvcarto.regione.liguria.it/geoservices/REST/coordinate/transform_point3/3857/32633/';
          fetch(`${trUrl}${x},${y}`)
            .then(response => response.json())
            .then(data => {
              // console.log(data);
              x_t = data.points[0].toFixed(0);
              y_t = data.points[1].toFixed(0);
              if (geometry.type === 'LineString') {
                fetch(`${trUrl}${x2},${y2}`)
                  .then(response => response.json())
                  .then(data => {
                    // console.log(data);
                    x2_t = data.points[0].toFixed(0);
                    y2_t = data.points[1].toFixed(0);
                    insert(x_t, y_t, x2_t, y2_t, 'SI');
                  })
                  .catch(error => {
                    console.error('Error Fetch transform_point3 1:', error);
                    alert(error);
                  });
              } else {
                insert(x_t, y_t, x2_t, y2_t, 'SI');
              }
            })
            .catch(error => {
              console.error('Error Fetch transform_point3 2:', error);
              alert(error);
            });
        }
        if (refresh) refresh();
        if (loading) loading.close();
      },
    },
  };
}

window.addEventListener('beforeunload', function() {
  beforeUnload();
});

GV.globals.flagInsert = false;

function beforeUnload() {
  if (GV.globals.flagInsert) {
    return;
  }
  insert(0, 0, 'NO');
}

function insert(x, y, x2, y2, esito) {
  // console.log(idSession);
  // console.log(x, y, x2, y2, esito);
  GV.utils.insertAgCoordinate(idSession, x, y, esito, null, x2, y2, null);
}

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/'
GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'ambiente-gv2',
    mapOptions: {
      type: 'openlayers',
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: true,
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
                  canale: null,
                  applicazione: 'ECO3',
                  tematici: 'SI',
                  pub: true,
                },
                tree: null,
              },
            },
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
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2019',
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
