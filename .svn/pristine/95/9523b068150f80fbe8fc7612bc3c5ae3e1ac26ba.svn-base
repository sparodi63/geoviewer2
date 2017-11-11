<template>
    <div v-draggable class="gv-info-wms gv-inverted-color-scheme" id="gv-info-wms-list">
        <gv-title title="Risultato Info"></gv-title>
        <div class="gv-html-panel-body">
            <ul class="gv-list-group">
                <li v-for="item in items" class="gv-info-wms-list-item">
                    <span class="gv-info-wms-list-item-span" @click="featureInfo(item)">{{item.label}} ( {{item.layer.legend.label}} )</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import GV from '../GV'
    import infoWmsManager from '../infoWmsManager'

    export default {
        name: 'gv-info-wms-list',
        props: ['items', 'visible'],
        methods: {
            closePanel: function () {
                this.$el.parentNode.removeChild(this.$el)
                GV.app.lMap.getLayerByName('InfoWmsHilite').clearLayers()
            },
            featureInfo: function (item) {
                infoWmsManager.showFeatureInfo(item)
            }

        }
    }

</script>

<style scoped>
    .gv-info-wms {
        position: absolute;
        left: 0px;
        top: 0px;
        margin-left: 55px;
        margin-top: 50px;
        width: 260px;
        z-index: 800;
        max-height: 430px;
    }

    #gv-info-wms-body {
        position: absolute;
        overflow-y: auto;
        width: 260px;
        height: 400px;
        max-height: 500px;
    }

    .gv-info-wms-list-item {
        position: relative;
        padding: 0.1rem 0.5rem;
        margin-bottom: -1px;
        background-color: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
    }

    .gv-info-wms-list-item-span {
        position: absolute;
        top: 50%;
        margin-top: -7px;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        max-width: 180px;
        text-decoration: underline;
    }


    .gv-list-group {
        padding-left: 0;
        margin-top: 0;
        margin-bottom: 0;
        background-color: #fff;
    }

</style>