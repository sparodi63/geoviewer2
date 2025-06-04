/*
ESEMPIO QUERY_STRING
?FIELD=COD_TPRAT,NUM_PRAT,PROG_PRAT,PROG_LOC&CODICE=BAN,24987,0,1&FIND=SI&ID_SESSION=12345

http://localhost:8081?FIELD=COD_TPRAT,NUM_PRAT,PROG_PRAT,PROG_LOC&CODICE=BAN,24987,0,1&FIND=SI&ID_SESSION=12345

*/


const idMap = '1709';
const fields = GV.utils.getUrlParam('FIELD');
const values = GV.utils.getUrlParam('CODICE');
const findFlag = GV.utils.getUrlParam('FIND');
const idSession = GV.utils.getUrlParam('ID_SESSION');
const cqlFilter = buildCQL(fields, values);

var findOptions = null;
if (findFlag === 'SI') {
  var tipoPratica = values.split(',')[0];
  console.log('tipoPratica', tipoPratica);

  const idLayer = tipoPratica === 'BAN' ? 'L10041' : 'L10026';
  if (tipoPratica === 'BAN')
    findOptions = {
      layers: [idLayer],
      cqlFilter: cqlFilter,
    };
}

// var findOptions =
//   findFlag === 'SI'
//     ? {
//         layers: [idLayer],
//         cqlFilter: cqlFilter,
//       }
//     : null;

function buildCQL(fields, values) {
  var fieldsArray = fields.split(',');
  var valuesArray = values.split(',');
  var exprArray = [];
  for (var i = 0; i < fieldsArray.length; i++) {
    var expr = fieldsArray[i] + "='" + valuesArray[i] + "'";
    exprArray.push(expr);
  }
  var cql = exprArray.join(' AND ');
  return cql;
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

function insert(x, y, esito) {
  GV.utils.insertAgCoordinate(idSession, x.toFixed(0), y.toFixed(0), esito);
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'benamb-gv2',
    mapOptions: {
      // type: 'openlayers',
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
          showLayersTransparency: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
            },
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
          position: 'topleft',
        },
        {
          name: 'gv-info-button',
          active: true,
        },
        { name: 'gv-measure-button' },
        {
          name: 'gv-coordinate-button',
          options: {
            projection: 'EPSG:3003',
            submit: function(x, y) {
              console.log('submit', x, y);
              insert(x, y, 'SI');
            },
            cancel: function() {
              insert(0, 0, 'NO');
            },
          },
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
    callback: null,
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'OSM',
    },
    { type: 'RL_ORTOFOTO_2022' },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
