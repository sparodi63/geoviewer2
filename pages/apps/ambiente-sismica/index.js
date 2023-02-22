GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const locate = GV.utils.getUrlParam('LOCATE');
const codice = GV.utils.getUrlParam('CODICE');
const codice_comune = GV.utils.getUrlParam('CODICE_COMUNE');
const id_session = GV.utils.getUrlParam('ID_SESSION');
const modo_sito = GV.utils.getUrlParam('MODOSITO');
const flag_validato = GV.utils.getUrlParam('FLAG_VALIDATO');

const env = GV.globals.GENIO_WEB_ENV || 'TEST';
// const env = 'PROD';

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

// console.log(findOptions);

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

if (locate && locate === 'true' && flag_validato === 'NO') {
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

  let draw = null;
  if (modo_sito == 'P') {
    draw = {
      point: true,
    };
  } else {
    draw = {
      polyline: true,
    };
  }

  return {
    name: 'gv-draw-button',
    active: false,
    options: {
      idLayer: [layer_p, layer_l],
      tools: {
        draw: draw,
        edit: {
          edit: true,
          // remove: true,
        },
      },
      buttons: {
        submit: true,
        cancel: true,
        refresh: false,
      },
      color: '#FF9900',
      multiGeom: false,
      coord3d: true,
      epsg: '3003',
      epsgOut: '32633',
      initWfsRequests: initWfsRequest,
      cancel: () => {
        insert(null, null, 'NO');
      },
      submit: submit,
    },
  };
}

function submit(data, deleted, loading, refresh) {
  // let geojson = await transformGeoJSON(data);
  let geojson = data;

  const geometry =
    geojson && geojson.features[0] && geojson.features[0].geometry
      ? geojson.features[0].geometry
      : null;
  let coords;
  if (geometry) {
    if (geometry.type === 'LineString') {
      coords = [
        geometry.coordinates[0][0].toFixed(0),
        geometry.coordinates[0][1].toFixed(0),
        geometry.coordinates[0][2].toFixed(0),
        geometry.coordinates[geometry.coordinates.length - 1][0].toFixed(0),
        geometry.coordinates[geometry.coordinates.length - 1][1].toFixed(0),
        geometry.coordinates[geometry.coordinates.length - 1][2].toFixed(0),
      ];
    } else {
      coords = [
        geometry.coordinates[0].toFixed(0),
        geometry.coordinates[1].toFixed(0),
        geometry.coordinates[2].toFixed(0),
        null,
        null,
        null,
      ];
    }

    insert(coords, 32633, 'SI');
  }
  if (refresh) refresh();
  if (loading) loading.close();
}

// async function transformGeoJSON(geoJson) {
//   const response = await fetch('/geoservices/REST/coordinate/transform_geojson', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       geoJSON: geoJson,
//       srsIn: '3857',
//       srsOut: '32633',
//     }),
//   });
//   const data = await response.json();
//   return data.geoJSON;
// }

function insert(coords, epsg, esito) {
  if (esito === 'NO') {
    GV.utils.insertAgCoordinate(id_session, 0, 0, esito, 0, 0, 0, 0, null);
  } else {
    let x = coords[0],
      y = coords[1],
      z = coords[2],
      x2 = coords[3],
      y2 = coords[4],
      z2 = coords[5];
    GV.utils.insertAgCoordinate(id_session, x, y, esito, z, x2, y2, z2, epsg);
  }
}

window.addEventListener('beforeunload', function() {
  beforeUnload();
});

GV.globals.flagInsert = false;

function beforeUnload() {
  if (GV.globals.flagInsert) {
    return;
  }
  // insert(0, 0, 'NO');
  insert(null, null, 'NO');
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
