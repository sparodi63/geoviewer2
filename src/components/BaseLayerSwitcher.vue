<template>
    <el-select v-model="activeBaseLayer" @change="onChange" size="mini" placeholder="Sfondo">
        <el-option
                v-for="item in baseLayers"
                :label="item.label"
                :value="item.name">
            <span style="float: left">
                <img class="gv-sfondi-icon" :src="item.icon"/>
                <span class="gv-sfondi-label">{{ item.label }}</span>
            </span>
        </el-option>
    </el-select>
</template>


<script>
    import * as config from '../config'
    import GV from '../GV'

    import Vue from 'vue'
    import * as Title from './Title.vue'
    Vue.component('gv-title', Title)

    import { Select,Option } from 'element-ui'
    Vue.use(Select)
    Vue.use(Option)

    export default {
        name: 'gv-base-layer-switcher',
        props: ['baseLayers','title'],
        data() {
            return {
                activeBaseLayer: config.getActiveBaseLayer().name
            }
        },
        methods: {
            onChange(value) {
                // se livello è presente in mappa e visibile non faccio niente
                // altrimenti levo layer precedente e carico livello in mappa e rendo visibile
                const activeLayerName = config.getActiveBaseLayer().name
                if (activeLayerName !== value){
                    GV.map.removeLayer(GV.map.baseLayers[activeLayerName])
                    GV.map.baseLayers[value].addTo(GV.map)
                    config.setActiveBaseLayer(value)
                }
            }
        }
    }

</script>

<style scoped>

    .gv-sfondi-label {
        vertical-align: top;
    }

    .gv-sfondi-icon {
        width: 24px;
        height: 24px;
        border:thin solid black;
    }

</style>