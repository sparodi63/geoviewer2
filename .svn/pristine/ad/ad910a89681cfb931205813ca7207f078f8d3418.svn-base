<template>
    <div v-show="visible" :class="cls">
        <div class="gv-panel-title gv-color-scheme">Risultato Info
            <button class="gv-close" type="button" @click="closePanel">×</button>
        </div>
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
        name: 'gv-wms-info-list',
        props: ['cls', 'items', 'visible'],
        methods: {
            closePanel: function () {
                this.$el.parentNode.removeChild(this.$el)
                GV.map.getLayerByName('InfoWmsHilite').clearLayers()
            },
            featureInfo: function (item) {
                infoWmsManager.showFeatureInfo(item)
            }

        }
    }

</script>

