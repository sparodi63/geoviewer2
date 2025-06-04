/*
ESEMPIO QUERY_STRING
?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE=C008027A&FIND=SI
?ID_MAP=1640&ID_LAYER=4429&FIELD=COD_IMPIANTO&CODICE=9&FIND=SI
?ID_MAP=1640&ID_LAYER=4430&FIELD=ID_SCARICO&CODICE=I011015046U&FIND=SI
?ID_MAP=1640&ID_LAYER=4431&FIELD=CODICE_CENTRO&CODICE=???&FIND=SI

http://localhost:8081/?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE=C008027A&FIND=SI
http://dts-parodi_s.ld.ge/geoviewer2/pages/apps/scaridri-selezione-coordinate/?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE=C008027A&FIND=SI


*/



var idMap = GV.utils.getUrlParam('ID_MAP')
var idLayer = 'L' + GV.utils.getUrlParam('ID_LAYER')
var field = GV.utils.getUrlParam('FIELD')
var value = GV.utils.getUrlParam('CODICE')
var findFlag = GV.utils.getUrlParam('FIND')
var idSession = GV.utils.getUrlParam('ID_SESSION')

var findOptions =
  findFlag === 'SI'
    ? {
        layers: [idLayer],
        cqlFilter: field.toLowerCase() + "='" + value + "'",
      }
    : null

window.addEventListener('beforeunload', function() {
  beforeUnload()
})

GV.globals.flagInsert = false

function beforeUnload() {
  if (GV.globals.flagInsert) {
    return
  }
  insert(0, 0, 'NO')
}

function insert(x, y, esito) {
  GV.utils.insertAgCoordinate(idSession, x.toFixed(0), y.toFixed(0), esito)
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'scaridri-selezione-coordinate-gv2',
    mapOptions: {
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
        {
          name: 'gv-coordinate-button',
          options: {
            projection: 'EPSG:3003',
            submit: function(x, y) {
              insert(x, y, 'SI')
            },
            cancel: function() {
              //richiesta conferma
              insert(0, 0, 'NO')
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
})
