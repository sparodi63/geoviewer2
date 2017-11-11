<template>
    <div v-draggable class="multi-legend" id="gv-multi-legend-panel">
        <gv-title :title="title"></gv-title>
        <gv-iframe-panel v-draggable visible="true" :src="src" :html="html" :height="height" :width="width"></gv-iframe-panel>
    </div>
</template>


<script>
    import * as config from '../config'
    import Vue from 'vue'

    import * as Title from './Title.vue'
    Vue.component('gv-title', Title)

    export default {
        name: 'gv-multi-legend-panel',
        props: ['title','html', 'src', 'visible', 'title', 'width', 'height']
    }

</script>

<style scoped>
    .multi-legend {
        position: absolute;
        right: 0;
        top: 0;
        right: 10px;
        margin-top: 100px;
        background-color: #fff;
        z-index: 800;
    }
</style>