/*
ESEMPIO QUERY_STRING
?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE_CONDOTTA=C008027A
?ID_MAP=1640&ID_LAYER=4429&FIELD=COD_IMPIANTO&CODICE_CONDOTTA=9
?ID_MAP=1640&ID_LAYER=4430&FIELD=ID_SCARICO&CODICE_CONDOTTA=I011015046U
?ID_MAP=1640&ID_LAYER=4431&FIELD=CODICE_CENTRO&CODICE_CONDOTTA=???

http://localhost:8081?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE_CONDOTTA=C008027A
http://dts-parodi_s.ld.ge/geoviewer2/pages/apps/scaridri-find?ID_MAP=1640&ID_LAYER=4355&FIELD=CODICE&CODICE_CONDOTTA=C008027A

*/

var idMap = GV.utils.getUrlParam('ID_MAP')
var idLayer = 'L' + GV.utils.getUrlParam('ID_LAYER')
var field = GV.utils.getUrlParam('FIELD')
var value = GV.utils.getUrlParam('CODICE_CONDOTTA')

var findOptions = {
  layers: [idLayer],
  cqlFilter: field.toLowerCase() + "='" + value + "'",
}

//

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'scaridri-find-gv2',
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
