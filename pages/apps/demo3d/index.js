var lon = GV.utils.getUrlParam('id')

// var id = '1630,1370,1909'
var id = '1370,1909'

const layers = [
  //  { id: 'CARTE_BASE', label: 'C.T.R.' },
  {
    id: 'ORTOFOTO',
    label: 'Ortofoto'
  },
  // {
  //   id: 'SENTIERI',
  //   label: 'Sentieri'
  // },
  {
    id: 'ACCL',
    label: 'Acclività'
  },
  {
    id: 'DTM',
    label: 'DTM'
  },
  {
    id: 'DTM_LIDAR',
    label: 'DTM LIDAR'
  },
]

var index = 0
var maxIndex = layers.length - 1

function keyPressEvent(event) {
  if (event.code === 'PageUp') {
    index--
    if (index < 0) index = maxIndex
  }
  if (event.code === 'PageDown') {
    index++
    if (index > maxIndex) index = 0
  }
  var layer = layers[index].id
  changeMap[layer]()
}

function addLayerSwitcher() {
  var switcher = document.createElement('div')
  switcher.id = 'layer-switcher'
  document.getElementById('gv-container').appendChild(switcher)

  layers.forEach(layer => {
    let link = document.createElement('a')
    link.href = '#'
    link.textContent = layer.label
    link.id = layer.id
    link.className = 'active'

    link.onclick = function (e) {
      const clicked = this.id
      e.preventDefault()
      e.stopPropagation()
      changeMap[clicked]()
    }
    document.getElementById('layer-switcher').appendChild(link)
  })
}

function hideLayers() {
  var layers = GV.config.getLayersConfig()
  layers.forEach(layer => {
    GV.app.map.setLayerVisible(layer, false)
  })
}

var changeMap = {
  DTM_LIDAR: function () {
    index = 4
    setDTM_LIDAR()
  },
  DTM: function () {
    index = 3
    setDTM()
  },
  ACCL: function () {
    index = 2
    setAcclivita()
  },
  SENTIERI: function () {
    index = 1
    setSentieri()
  },
  ORTOFOTO: function () {
    index = 0
    setOrtofoto()
  },
  // CARTE_BASE: function() {
  //   index = 0
  //   setCarteBase()
  // },
}

function setCarteBase() {
  hideLayers()
  GV.app.map.changeBaseLayer('RL_CARTE_BASE')
}

function setOrtofoto() {
  hideLayers()
  GV.app.map.changeBaseLayer('RL_ORTOFOTO_2016')
}

function setSentieri() {
  GV.app.map.changeBaseLayer('ESRI_IMAGERY')
  hideLayers()
  var layer = GV.config.getLayerConfig('L4295')
  if (layer) {
    GV.app.map.setLayerVisible(layer, true)
  }
}

function setAcclivita() {
  GV.app.map.changeBaseLayer('BLANK')
  hideLayers()
  var layer = GV.config.getLayerConfig('L3586')
  GV.app.map.setLayerVisible(layer, true)
}

function setDTM() {
  GV.app.map.changeBaseLayer('BLANK')
  hideLayers()
  var layer = GV.config.getLayerConfig('DTM_dbtopo_5m')
  GV.app.map.setLayerVisible(layer, true)
}

function setDTM_LIDAR() {
  GV.app.map.changeBaseLayer('BLANK')
  hideLayers()
  var layer = GV.config.getLayerConfig('L6265')
  GV.app.map.setLayerVisible(layer, true)
}

var dtmConfig = {
  flagGeoserver: true,
  id: 'DTM',
  layers: [{
    attribution: null,
    cacheMaxZoomLevel: 15,
    cacheMinZoomLevel: 12,
    cachePostGIS: false,
    cacheVersion: 0,
    classes: [{
      filter: null,
      legendIcon: null,
      legendLabel: 'Classe Base'
    }],
    dbSchema: {},
    flagBaseVectorLayer: false,
    flagDownload: true,
    flagGeoserver: true,
    footprint: null,
    geomSubType: 'POLYGON',
    geomType: 'VECTOR',
    id: 'DTM',
    idMap: 'DTM',
    infoOptions: {
      infoHeight: 0,
      infoIdAttr: 'ID',
      infoLabelAttr: null,
      infoTarget: 'info',
      infoUrl: null,
      infoWidth: 0,
    },
    legend: {
      icon: 'http://geoportale.regione.liguria.it/geoviewer/img/legend/classi.gif',
      label: 'DTM',
      popUpFlag: 1,
      popUpHeight: 0,
      popUpUrl: null,
      popUpWidth: 0,
    },
    mapTitle: 'DTM',
    maxScale: 0,
    minScale: 0,
    multiClasse: true,
    name: 'DTM_dbtopo_5m',
    opacity: 1,
    order: 101,
    queryable: true,
    rasterFilePath: null,
    tmsParams: {
      name: 'L5005/webmercator',
      url: 'http://mapproxy.regione.liguria.it/mapproxy/1370/tms/',
    },
    type: 'WMS',
    visible: false,
    wfsParams: {
      typeName: 'L5005',
      url: 'https://geoservizi.regione.liguria.it/geoserver/M1370/wfs?',
    },
    wmsParams: {
      format: 'image/jpeg',
      format_options: 'antialias:text',
      name: 'DTM_dbtopo_5m',
      transparent: true,
      url: 'https://geoservizi.regione.liguria.it/geoserver/DTM/wms?',
    },
  }, ],
}

var callback = function (config) {
  var hash = new L.Hash(GV.app.map)
  GV.app.map.setView(new L.LatLng(44.33072485510803, 9.179935455322267), 12.5)
  GV.config.addMapConfig(dtmConfig)
  hideLayers()
  addLayerSwitcher()
  setDTM()
}

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'http://10.20.4.120:8081/',
  application: {
    name: 'demo3d-gv2',
    mapOptions: {
      zoomSnap: 0,
      zoomDelta: 0.1,
    },
    name: 'demo3d',
    layout: {
      tools: [],
    },
    callback: callback,
  },
  baseLayers: [{
      type: 'ESRI_IMAGERY'
    },
    {
      type: 'RL_ORTOFOTO_2016'
    },
    {
      type: 'RL_CARTE_BASE'
    },
    {
      type: 'BLANK',
      visible: true
    },
  ],
  maps: [],
})