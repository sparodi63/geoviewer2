<template>
    <div v-draggable class="info-wms-html" id="gv-info-wms-html">
        <gv-title :title="title"></gv-title>
        <gv-iframe-panel v-draggable :html="html" :height="height" :width="width" ></gv-iframe-panel>
    </div>
</template>


<script>
    import * as config from '../config'
    import Vue from 'vue'

    import * as Title from './Title.vue'
    Vue.component('gv-title', Title)

    export default {
        name: 'gv-info-wms-html',
        props: ['title','html', 'width', 'height']
    }

</script>

<style scoped>
    .info-wms-html {
        position: absolute;
        left: 0;
        top: 0;
        margin-left: 55px;
        margin-top: 50px;
        background-color: #fff;
        z-index: 800;
    }
</style>