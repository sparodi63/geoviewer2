<template>
    <div id="gv-map">
    </div>
</template>

<script>
    import Vue from 'vue'
    import Map from '../leaflet/Map.js'
    import GV from '../GV'

    const events = [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseover',
        'mouseout',
        'mousemove',
        'contextmenu',
        'focus',
        'blur',
        'preclick',
        'load',
        'unload',
        'viewreset',
        'movestart',
        'move',
        'moveend',
        'dragstart',
        'drag',
        'dragend',
        'zoomstart',
        'zoomend',
        'zoomanim',
        'zoomlevelschange',
        'resize',
        'autopanstart',
        'layeradd',
        'layerremove',
        'baselayerchange',
        'overlayadd',
        'overlayremove',
        'locationfound',
        'locationerror',
        'popupopen',
        'popupclose',
    ];

    export default {
        name: 'gv-map',
        props: ['maps'],
        data() {
            return {
                lMap: null
            }
        },
        mounted () {
            if (GV.app.debug) console.log('gv-map: mounted')

            this.lMap = new Map()

            this.registerMapEvents()

            this.subscribeConfigEvents()
        },
        methods: {
            registerMapEvents() {
                // Emetto eventi Vue per ogni evento della mappa Leaflet
                // Per utilizzare eventi mappa leaflet
                // ev è oggetto formato da
                // - target (mappa Leaflet)
                // - type (tipo di evento es: 'move'
                // GV.app.$on('lmap-move', ev => {console.log(ev)})
                events.forEach((eventName) => {
                    const exposedName = 'lmap-' + eventName;
                    this.lMap.on(eventName, (ev) => { GV.app.$emit(exposedName, ev) })
                })
            },
            subscribeConfigEvents() {
                // Ascolto evento config-add-map e aggiungo layer alla mappa
                GV.app.$on('config-add-map', (ev) => {
                    const mapConfig = ev.config
                    // Aggiungo livelli alla mappa
                    this.lMap.loadLayers(mapConfig.layers)
                    //gestione extent
                    if (mapConfig.extent_3857) {
                        this.lMap.setExtent(mapConfig.extent_3857)
                    }
                    //TODO: gestione find
                })
                // Ascolto evento config-remove-map e levo layer alla mappa
                GV.app.$on('config-remove-map', (ev) => {
                    const mapConfig = ev.config
                    // Levo i livelli dalla mappa
                    mapConfig.layers.forEach(layerConfig => {
                        const layer = this.lMap.getLayerByName(layerConfig.name)
                        if (layer) {
                            this.lMap.removeLayer(layer)
                        }
                    })
                })

            }
        }
    }


</script>

<style scoped>
    #gv-map {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
</style>
