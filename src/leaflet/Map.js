import globals from '../globals'
import * as LayerFactory from './LayerFactory'
import L from 'leaflet'
import getWFSFeature from '../services/getWFSFeature'
import buildCqlFilter from '../util/buildCqlFilter'

const Map = L.Map.extend({
    layers: [],

    baseLayers: [],

    initialExtent: [],

    buttons: [],

    mapOptions: {
        zoomControl: false,
        maxBounds: L.latLngBounds(
            L.latLng(globals.MAX_BOUNDS.X_MIN, globals.MAX_BOUNDS.Y_MIN),
            L.latLng(globals.MAX_BOUNDS.X_MAX, globals.MAX_BOUNDS.Y_MAX)
        ),
        maxBoundsViscosity: 1.0,
        minZoom: 7,
    },

    initialize() {
        Object.assign(this.mapOptions, GV.config.application.mapOptions)

        L.Map.prototype.initialize.call(this, 'gv-map', L.extend(L.Map.prototype.options, this.mapOptions))

        this.setInitialExtent()

        this.setLoading()

        this.loadBaseLayers()

        this.loadControls()

        this.eventMngr()
    },

    eventMngr() {
        this.on('zoom', () => {
            GV.eventBus.$emit('map-zoom', this._zoom)
        })
        GV.eventBus.$on('set-layer-visible', event => {
            this.setLayerVisible(event.layer, event.checked)
            this.setHiliteLayerVisible(event)
        })
        GV.eventBus.$on('set-layer-transparency', event => {
            const layer = this.getLayerByName(event.layerName)
            layer.setOpacity(event.opacity)
        })
        GV.eventBus.$on('change-base-layer', event => {
            this.changeBaseLayer(event.layer)
        })
    },

    setHiliteLayerVisible(event) {
        if (!GV.config.hilitedLayer) {
            return
        }
        GV.config.hilitedLayer.forEach(hl => {
            if (hl === event.layer.name) {
                const layer = this.getLayerByName('InfoWmsHilite')
                layer.eachLayer(m => {
                    const opacity = event.checked ? 0.6 : 0.0
                    m.setStyle({ opacity: opacity })
                })
            }
        })
    },

    setInitialExtent() {
        'use strict'
        var extent = this.mapOptions.initialExtent || '830036,5402959,1123018,5597635'
        var extArray = extent.split(',')
        var swPoint = L.point(extArray[0], extArray[1])
        var nePoint = L.point(extArray[2], extArray[3])
        var swLatLng = L.Projection.SphericalMercator.unproject(swPoint)
        var neLatLng = L.Projection.SphericalMercator.unproject(nePoint)
        this.initialExtent = L.latLngBounds(swLatLng, neLatLng)
        this.fitBounds(this.initialExtent)
    },

    setExtent(extent) {
        'use strict'
        var extArray = extent.split(',')
        var swPoint = L.point(extArray[0], extArray[1])
        var nePoint = L.point(extArray[2], extArray[3])
        var swLatLng = L.Projection.SphericalMercator.unproject(swPoint)
        var neLatLng = L.Projection.SphericalMercator.unproject(nePoint)
        this.initialExtent = L.latLngBounds(swLatLng, neLatLng)
        this.fitBounds(this.initialExtent)
    },

    setLayerVisible(layerConfig, visible) {
        'use strict'
        if (visible) {
            // Muta lo stato del layer
            layerConfig.visible = true
            this.loadLayers([layerConfig])
        } else {
            const layer = this.getLayerByName(layerConfig.name)
            if (layer) {
                this.removeLayer(layer)
            }
        }
    },

    layerInRange(layerConfig) {
        'use strict'
        if (!layerConfig.minScale && !layerConfig.minScale) {
            return true
        }
        return this.getScale() < layerConfig.minScale && this.getScale() > layerConfig.maxScale
    },

    loadControls() {
        'use strict'
        if (this.mapOptions.controls) {
            var cntrl
            this.controls = {}
            this.mapOptions.controls.forEach(function(control) {
                switch (control.name) {
                    case 'scale':
                        cntrl = L.control.scale({ imperial: false }).addTo(this)
                        this.controls[control] = cntrl
                        break
                }
            }, this)
        }
    },

    loadBaseLayers() {
        'use strict'

        GV.config.baseLayers.forEach(function(layerConfig) {
            var layer = LayerFactory.create(layerConfig, this)
            this.baseLayers[layer.config.type] = layer
            if (layer && layerConfig.visible) {
                layer.on(
                    'loading',
                    function() {
                        this.loading(true, layer)
                    },
                    this
                )
                layer.on(
                    'load',
                    function() {
                        this.loading(false, layer)
                    },
                    this
                )
                layer.addTo(this)
            }
        }, this)
    },

    loadLayers(layers) {
        'use strict'
        layers.forEach(function(layerConfig) {
            if (!this.getLayerByName(layerConfig.name)) {
                var layer = LayerFactory.create(layerConfig, this)
                if (layer && layerConfig.visible) {
                    layer.on(
                        'loading',
                        function() {
                            this.loading(true, layer)
                        },
                        this
                    )
                    layer.on(
                        'load',
                        function() {
                            this.loading(false, layer)
                        },
                        this
                    )
                    layer.addTo(this)
                    layer.on('ready', () => {
                        if (layerConfig.zoomToLayerExtent) {
                            let bounds = new L.latLngBounds()
                            var _layers = layer._layers
                            layer.eachLayer(function(_layer) {
                                if (_layer.getBounds) {
                                    bounds.extend(_layer.getBounds())
                                } else {
                                    bounds.extend(new L.latLngBounds(_layer._latlng, _layer._latlng))
                                }
                            })
                            if (bounds) this.fitBounds(bounds)
                        }
                    })
                }
            }
        }, this)
    },

    getLayerByName(layerName) {
        var foundLayer = null
        this.eachLayer(function(layer) {
            if (layer.config && layer.config.name && layer.config.name === layerName) {
                foundLayer = layer
            }
        })
        return foundLayer
    },

    changeBaseLayer(layerName) {
        // se livello è presente in mappa e visibile non faccio niente
        // altrimenti levo layer precedente e carico livello in mappa e rendo visibile
        const activeLayerName = GV.config.getActiveBaseLayer().name
        if (activeLayerName !== layerName) {
            this.removeLayer(this.baseLayers[activeLayerName])
            this.baseLayers[layerName].addTo(this)
            GV.config.setActiveBaseLayer(layerName)
        }
    },

    getScaleLabel() {
        'use strict'
        return globals.BASE_SCALE_LABELS[this._zoom]
    },

    getScale() {
        'use strict'
        return globals.BASE_SCALES[this._zoom]
    },

    setLoading() {
        this._spinning = 0
        this.on(
            'layerremove',
            function(e) {
                // Clean-up
                if (e.layer.loading) {
                    this.loading(false)
                }
                if (typeof e.layer.on !== 'function') {
                    return
                }
                e.layer.off('load')
                e.layer.off('loading')
            },
            this
        )
    },

    loading(state, layer) {
        // if (!!state) {

        if (state) {
            if (this._spinning === 0) {
                GV.log('start load: ' + layer.config.name)
                this._container.style.cursor = 'progress'
            }
            this._spinning++
        } else {
            this._spinning--
                if (this._spinning <= 0) {
                    GV.log('end load: ' + layer.config.name)
                    this._container.style.cursor = 'default'
                }
        }
    },

    addMarker(markerConfig) {
        const icon = L.icon({
            iconUrl: 'http://srvcarto.regione.liguria.it/geoviewer2/static/img/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
        })
        const opts = {
            opacity: 0.8,
            icon: icon,
            title: markerConfig.label,
        }

        if (markerConfig.type === 'circle') {
            L.circleMarker(markerConfig.location, opts).addTo(this)
        } else {
            L.marker(markerConfig.location, opts).addTo(this)
        }
        this.setView(markerConfig.location, markerConfig.zoomLevel || 14)
    },

    find(findOptions) {
        if ((!findOptions.values || findOptions.values === 'null') && !findOptions.cqlFilter) {
            console.error('Parametri FIND non completi: manca CQL_FILTER o VALUES')
            return
        }

        const cqlFilter = findOptions.cqlFilter || buildCqlFilter(findOptions)
        const layers = findOptions.layers || GV.config.getLayersNameByMapId(findOptions.map)
        getWFSFeature(layers, cqlFilter)
            .then(features => {
                const layer = this.getLayerByName('InfoWmsHilite')
                if (features && features.length > 0) {
                    layer.clearLayers()
                    layer.addData(features)
                    this.fitBounds(layer.getBounds(), { maxZoom: 15 })
                    GV.config.hilitedLayer = layers
                }
            })
            .catch(error => {
                console.error(error)
            })
    },

    zoomTo(lat, lon, zoom) {
        this.setView(new L.LatLng(lat, lon), zoom)
    }
})

export default Map