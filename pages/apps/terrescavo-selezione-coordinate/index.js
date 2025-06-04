/*
ESEMPIO QUERY_STRING
?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE=C008027A&FIND=SI
?ID_MAP=1640&ID_LAYER=4429&FIELD=COD_IMPIANTO&CODICE=9&FIND=SI
?ID_MAP=1640&ID_LAYER=4430&FIELD=ID_SCARICO&CODICE=I011015046U&FIND=SI
?ID_MAP=1640&ID_LAYER=4431&FIELD=CODICE_CENTRO&CODICE=???&FIND=SI

http://localhost:8081/?&CODICE=010001
http://dts-parodi_s.ld.ge/geoviewer2/pages/apps/terrescavo-selezione-coordinate/?CODICE=010001

*/



var idMap = 'D66'
var idLayer = 'L6422'
// var field = 'codice_comune'
var field = 'CODICE_COMUNE'
var value = GV.utils.getUrlParam('CODICE')

var findOptions = {
  layers: [idLayer],
  cqlFilter: field + "='" + value + "'",
}

function conferma(x, y, esito) {
  window.parent.postMessage({ messaggio: 'selezione-coordinate', lon: x, lat: y, esito: esito }, '*')
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'terrescavo-selezione-coordinate-gv2',
    layout: {
      legend: {
        options: {
          show: true,
          collapsed: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
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
        // {
        //   name: 'gv-info-button',
        // },
        {
          name: 'gv-coordinate-button',
          options: {
            projection: 'EPSG:3003',
            submit: function (x, y) {
              conferma(x, y, 'OK')
            },
            cancel: function () {
              conferma(null, null, 'KO')
            },
            active: true,
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
