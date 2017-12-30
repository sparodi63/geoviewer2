import Vue from 'vue'
import globals from './globals'
import getConfig from './services/getConfig'
import getCatalog from './services/getCatalog'
import getEnti from './services/getEnti'
import mountComponent from './util/mountComponent'
import { Notification } from 'element-ui'
import getDownloadConfig from './services/getDownloadConfig'

export default {
    _lastZIndex: 21,
    debug: false,
    containerId: 'gv-container',
    idMap: null,
    title: null,
    findOptions: null,
    geoserverUrl: null,
    application: {},
    baseLayers: [{ type: 'ESRI_IMAGERY', visible: true }],
    maps: [],
    hilitedLayer: [],

    init(options) {
        if (!options) {
            throw new Error('Opzioni di inizializzazione non impostate!')
        }

        this.debug = options.debug
        this.idMap = options.idMap
        this.findOptions = options.findOptions

        this.geoserverUrl = options.geoserverUrl
        if (options.application) {
            this.application = options.application
        }
        if (options.containerId) {
            this.containerId = options.containerId
        }

        this.application.layout = options.application && options.application.layout ? options.application.layout : {}

        if (options.application) {
            this.application.proxy = options.application.proxy || globals.DEFAULT_PROXY
        }
        if (options.application && options.application.layout && options.application.layout.title) {
            this.title = options.application.layout.title
        }

        // Gestione BaseLayers
        this.baseLayers = options.baseLayers
        this.baseLayers.forEach(layer => {
            layer.name = layer.type
            layer.label = globals.BASE_LAYERS[layer.type].label
            layer.icon = globals.BASE_LAYERS[layer.type].icon
        })

        if (options.idMap) {
            const callback = options.application ? options.application.callback : null
            const idMaps = options.idMap.split(',')
            this.initLoadingMaps = idMaps.length
            this.initLoadedMaps = 0

            idMaps.forEach((id) => {
                this.addRlMap(id, true)
            })
            GV.eventBus.$on('gv-config-init', app => {
                if (this.application && this.application.callback) {
                    this.application.callback(app)
                }
            })

        } else {
            GV.eventBus.$on('gv-app-mounted', app => {
                options.maps.forEach(mapConfig => {
                    this.addMapConfig(mapConfig)
                })
                if (this.application && this.application.callback) {
                    this.application.callback(app)
                }
            })
        }

        GV.eventBus.$on('map-zoom', event => {
            var layers = this.getAllLayersConfig()
            layers.forEach(layer => {
                this.setLayerAttribute(layer.name, 'inRange', GV.app.map.layerInRange(layer))
            })
        })
    },

    addMapConfig(mapConfig) {
        mapConfig.layers.forEach(layer => {
            layer.minScale = layer.minScale === 0 ? 591657550 : layer.minScale
            layer.inRange = GV.app && GV.app.map ? GV.app.map.layerInRange(layer) : true
            layer.opacityBase100 = layer.opacity * 100
            layer.zIndex = this._lastZIndex++
        })
        mapConfig.layers.reverse()

        if (mapConfig.addLayerConfig && this.getMapConfig(mapConfig.id)) {
            mapConfig.layers.forEach(layer => this.getMapConfig(mapConfig.id).layers.push(layer))
        } else {
            if (this.getMapConfig(mapConfig.id)) {
                return
            }
            if (mapConfig.ancillaryMaps) {
                mapConfig.ancillaryMaps.forEach(map => this.addMapConfig(map))
            }
            mapConfig.showLayersInLegend = true
            this.maps.unshift(mapConfig)
        }

        GV.eventBus.$emit('config-add-map', { config: mapConfig })
    },

    setLayerAttribute(layerName, attribute, value) {
        this.maps.forEach(function(map) {
            let layers = map.layers
            layers.forEach(function(layer) {
                if (layer.name === layerName) {
                    layer[attribute] = value
                }
            })
        })
    },

    removeMap(idMap) {
        const mapConfig = this.getMapConfig(idMap)

        if (!mapConfig) return

        GV.eventBus.$emit('config-remove-map', {
            config: mapConfig,
        })

        const index = this.maps.findIndex(function(map) {
            return map.id === idMap
        })
        if (index > -1) {
            this.maps.splice(index, 1)
        }
    },

    removeLayer(idLayer) {
        this.maps.forEach(map => {
            let layerIndex = -1
            map.layers.forEach(function(layer, index) {
                if (layer.name === idLayer) {
                    layerIndex = index
                }
            })
            if (layerIndex > -1) {
                map.layers.splice(layerIndex, 1)
            }
            if (map.layers.length === 0) {
                this.removeMap(map.id)
            }
        })
        GV.eventBus.$emit('config-remove-layer', {
            config: idLayer,
        })
    },

    addRlMap(idMap, setBaseLayer) {
        if (this.getMapConfig(idMap)) {
            return this.getMapConfig(idMap)
        }

        getConfig(idMap)
            .then(response => {
                if (!response.data.success) {
                    throw new Error('Errore Caricamento Mappa: ' + response.data.message)
                }
                if (!response.data.data) {
                    throw new Error('Errore Caricamento Mappa: configurazione non trovata')
                }

                const mapConfig = response.data.data

                // Aggiorno array delle mappe
                this.addMapConfig(mapConfig)
                if (GV.app && GV.app.map && mapConfig.type && mapConfig.type == 'R' && setBaseLayer && this.getBaseLayerConfig('BLANK')) {
                    GV.app.map.changeBaseLayer('BLANK')
                    if (GV.baseLayerSwitcher)
                        GV.baseLayerSwitcher.activeBaseLayer = 'BLANK'
                }

                // Aggiorno layer base
                if (mapConfig.activeBaseLayer) {
                    GV.app.map.changeBaseLayer(mapConfig.activeBaseLayer)
                    if (GV.baseLayerSwitcher)
                        GV.baseLayerSwitcher.activeBaseLayer = mapConfig.activeBaseLayer
                }

                if (GV.config.findOptions) {
                    GV.app.map.find(GV.config.findOptions)
                }

                // Gestione callback
                this.initLoadedMaps = this.initLoadedMaps + 1
                if (this.initLoadingMaps === this.initLoadedMaps) {
                    GV.eventBus.$emit('gv-config-init', GV.app)
                }

                if (mapConfig.metaData.flag_download) {
                    getDownloadConfig(idMap).then(resp => {
                        this.maps.forEach(map => {
                            if (map.id.toString() === idMap) {
                                map.downloadConfig = resp
                                GV.eventBus.$emit('config-add-download', mapConfig)
                            }
                        })
                    })
                }

                return mapConfig
            })
            .catch(error => {
                console.error(error)
                Notification.error({
                    title: 'Attenzione',
                    type: 'error',
                    duration: 5000,
                    offset: 70,
                    message: error.message,
                })
            })
    },

    loadCatalog(params) {
        getCatalog().then(data => {
            this.catalog = this.catalogFull = data.children
            getEnti().then(data => {
                this.enti = data
                if (params.showMapCatalogPanel) {
                    // Mount Pannello
                    mountComponent({
                        elId: 'gv-map-catalog-panel',
                        toggleEl: false,
                        vm: new Vue({
                            template: `<gv-map-catalog-panel></gv-map-catalog-panel>`,
                        }),
                    })
                }
            })
        })
    },

    getAllLayersConfig() {
        let layers = []
        this.maps.forEach(function(map) {
            map.layers.forEach(function(layer) {
                layers.push(layer)
            })
        })
        return layers
    },

    getLayersNameByMapId(idMap) {
        if (!idMap) {
            console.error('Parametro "idMap" non definito')
            return null
        }
        let layers = []
        this.maps.forEach(function(map) {
            if (map.id.toString() === idMap) {
                map.layers.forEach(function(layer) {
                    if (layer.idMap.toString() === idMap) layers.push(layer.name)
                })
            }
        })
        return layers
    },

    getLayerConfig(layerName) {
        let foundLayer = null
        this.maps.forEach(map => {
            map.layers.forEach(layer => {
                if (layer.name === layerName) {
                    foundLayer = layer
                }
            })
        })
        return foundLayer
    },

    getBaseLayerConfig(layerName) {
        let foundLayer = this.baseLayers.find(function(layer) {
            return layer.name === layerName
        })
        return foundLayer
    },

    getMapConfig(idMap) {
        return this.maps.find(function(map) {
            return map.id == idMap
        })
    },

    getToolOptions(toolName) {
        let options = null
        if (!this.application.layout || !this.application.layout.tools) {
            return null
        }
        this.application.layout.tools.forEach(item => {
            if (item.name === toolName && item.options) {
                options = item.options
            }
        })
        return options
    },

    getButtonOptions(buttonName) {
        let options = null
        if (!this.application.layout || !this.application.layout.toolbar) {
            return null
        }
        this.application.layout.toolbar.items.forEach(item => {
            if (item.name === buttonName && item.options) {
                options = item.options
            }
        })
        return options
    },

    getActiveBaseLayer() {
        let activeLayer = null
        this.baseLayers.forEach(layer => {
            if (layer.visible) {
                activeLayer = layer
            }
        })
        return activeLayer
    },

    setActiveBaseLayer(layerName) {
        this.baseLayers.forEach(layer => {
            layer.visible = layer.name === layerName
        })
    },
}