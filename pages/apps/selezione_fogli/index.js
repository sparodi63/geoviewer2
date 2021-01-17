var idMap = GV.utils.getUrlParam('id')
var selFogli = GV.utils.getUrlParam('fogli')
var field = GV.utils.getUrlParam('field')

var props = [{
  idMap: idMap
}, {
  field: field
}]
if (selFogli) {
  props.push({
    selFogli: selFogli,
  })
}

GV.init({
  debug: true,
  idMap: idMap,
  application: {
    name: 'selezione-fogli-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          showBaseLayerSwitcher: true,
          noDeleteButton: true,
          noDownloadButton: true,
          collapsed: true,
        },
      },
      tools: [{
        name: 'gv-map-selezione-fogli',
        options: {
          props: props,
        },
      }, ],
    },
  },
  baseLayers: [{
      type: 'ESRI_IMAGERY',
      visible: true
    },
    {
      type: 'MAPBOX_STREETS'
    },
    {
      type: 'RL_ORTOFOTO_2016'
    },
    {
      type: 'RL_CARTE_BASE'
    },
    {
      type: 'BLANK'
    },
  ],
  maps: [],
})
