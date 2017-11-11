<template>
    <div id="gv-map">
    </div>
</template>

<script>
    import Vue from 'vue';
    import util from '../util';
    import Map from '../leaflet/Map.js';
    import GV from '../GV';

    export default {
        name: 'gv-map',
        mounted () {
            util.log('gv-map: mounted');
            GV.map = new Map();
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
