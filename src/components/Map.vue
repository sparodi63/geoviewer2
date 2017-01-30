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
            if (GV.config.debug) console.log('gv-map: mounted')
            GV.map = new Map()
            this.lMap = GV.map
            // Emetto eventi Vue per ogni evento della mappa Leaflet
            events.forEach((eventName) => {
                const exposedName = 'lmap-' + eventName;
                GV.map.on(eventName, (ev) => { GV.app.$emit(exposedName, ev) })
            })
            // Ascolto evento config-add-map e aggiungo layer alla mappa
            GV.app.$on('config-add-map', (ev) => {
                const mapConfig = ev.config
                // Aggiungo livelli alla mappa
                this.lMap.loadLayers(mapConfig.layers)
                //gestione extent
                if (mapConfig.extent_3857) {
                    this.lMap.setInitialExtent(mapConfig.extent_3857)
                }
                //TODO: gestione find
            })
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
