'use strict'

import globals from './globals'
import GV from './GV'

let _lastZIndex = 21
let debug = false
let idMap = null
let title = null
let geoserverUrl
let application = {}
let baseLayers = [
  { 'type': 'ESRI_IMAGERY', visible: true }
]
let maps = []
let optionsMaps = []

function set (options) {
  if (!options) {
    throw new Error('Opzioni di inizializzazione non impostate!')
  }

  debug = options.debug
  idMap = options.idMap
  geoserverUrl = options.geoserverUrl
  if (options.application) {
    application = options.application
  }

  application.layout = (options.application && options.application.layout) ? options.application.layout : {}

  if (options.application) {
    application.proxy = options.application.proxy || globals.DEFAULT_PROXY
  }
  if (options.application && options.application.layout && options.application.layout.title) {
    title = options.application.layout.title
  }

  // Gestione BaseLayers
  if (options.baseLayers) {
    baseLayers = options.baseLayers
  }
  baseLayers.forEach( layer => {
    layer.name = layer.type
    layer.label = globals.BASE_LAYERS[layer.type].label
    layer.icon = globals.BASE_LAYERS[layer.type].icon
  })

// TODO CANCELLARE
// Gestione mappe in configurazione iniziale
//  this.optionsMaps = options.maps
/*
  if (options.maps) {
    options.maps.forEach(
      (mapConfig) => {
        addMapConfig(mapConfig)
      }
    )
  }
*/

}

function addMapConfig (mapConfig) {
  if (getMapConfig(mapConfig.id)) {
    return
  }
  mapConfig.layers.forEach(function (layer) {
    layer.minScale = (layer.minScale === 0) ? 591657550 : layer.minScale
    layer.inRange = (GV.map) ? GV.map.layerInRange(layer) : true
    layer.zIndex = _lastZIndex++
  })
  mapConfig.layers.reverse()
  maps.unshift(mapConfig)
  GV.app.$emit('config-add-map', {
    config: mapConfig
  })
}

function getAllLayersConfig () {
  let layers = []
  maps.forEach(function (map) {
    map.layers.forEach(function (layer) {
      layers.push(layer)
    })
  })
  return layers
}

function setLayerAttribute (layerName, attribute, value) {
  maps.forEach(function (map) {
    let layers = map.layers
    layers.forEach(function (layer) {
      if (layer.name === layerName) {
        layer[attribute] = value
      }
    })
  })
}

function getLayerConfig (layerName) {
  let foundLayer = null
  maps.forEach(function (map) {
    let layers = map.layers
    foundLayer = layers.find(function (layer) {
      return layer.name === layerName
    })
  })
  if (foundLayer) {
    return foundLayer
  }
}

function getMapConfig (idMap) {
  return maps.find(function (map) {
    return map.id == idMap
  })
}

function getButton (buttonName) {
  let button = null
  if (!application.layout || !application.layout.toolbar) {
    return null
  }
  application.layout.toolbar.forEach(function (tb) {
    tb.items.forEach(function (item) {
      if (item.name === buttonName) {
        button = item
      }
    }, this)
  }, this)
  return button
}

function getButtonOption (buttonName, optionName) {
  let option = null
  if (!application.layout || !application.layout.toolbar) {
    return null
  }
  application.layout.toolbar.forEach(function (tb) {
    tb.items.forEach(function (item) {
      if (item.name === buttonName) {
        option = item.options[optionName]
      }
    }, this)
  }, this)
  return option
}

function setButtonOption (buttonName, optionName, value) {
  let option = null
  if (!application.layout) {
    return null
  }
  application.layout.toolbar.forEach(function (tb) {
    tb.items.forEach(function (item) {
      if (item.name === buttonName) {
        item.options[optionName] = value
      }
    }, this)
  }, this)
  return option
}

function getActiveBaseLayer() {
  let activeLayer = null
  baseLayers.forEach(layer => {
    if (layer.visible) activeLayer = layer
  })
  return activeLayer
}

function setActiveBaseLayer(layerName) {
  baseLayers.forEach(layer => {
    layer.visible = (layer.name === layerName)
  })
}

function removeMap (idMap) {
  const mapConfig = getMapConfig(idMap)
  GV.app.$emit('config-remove-map', {
    config: mapConfig
  })

  const index = maps.findIndex(function (map) {
    return map.id === idMap
  })
  if (index > -1) {
    maps.splice(index, 1)
  }
}

export {
  debug,
  idMap,
  application,
  baseLayers,
  maps,
  optionsMaps,
  title,
  geoserverUrl,
  set,
  addMapConfig,
  getAllLayersConfig,
  getLayerConfig,
  getActiveBaseLayer,
  getMapConfig,
  removeMap,
  getButton,
  getButtonOption,
  setButtonOption,
  setLayerAttribute,
  setActiveBaseLayer
}
