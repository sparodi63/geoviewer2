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
        mounted () {
            if (GV.config.debug) console.log('gv-map: mounted')
            GV.map = new Map()
            // Emetto eventi Vue per ogni evento della mappa Leaflet
            events.forEach((eventName) => {
                const exposedName = 'lmap-' + eventName;
                GV.map.on(eventName, (ev) => { GV.app.$emit(exposedName, ev) })
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
