<template>
    <div v-show="visible" class="gv-map-info-panel" id="gv-map-info-panel">
        <div class="gv-panel-title gv-color-scheme">{{title}}
            <button class="gv-close" type="button" @click="closePanel">×</button>
        </div>
        <div class="gv-map-info-panel-body">
            <table>
                <tbody>
                    <tr v-for="item in items">
                        <th>
                            {{item.label}}
                        </th>
                        <td>
                            {{item.value}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import GV from '../GV'
    import infoWmsManager from '../infoWmsManager'

    export default {
        name: 'gv-wms-info-list',
        props: ['idMap','title','visible'],
        data() {
            let items = []
            var metaData = GV.config.getMapConfig(this.idMap).metaData
            if (metaData) {
                items.push({label: 'Origine del dato', value: metaData.origine})
                items.push({label: 'Anno', value: metaData.anno})
                items.push({label: 'Scala', value: metaData.scala})
                items.push({label: 'Rappresentazione', value: metaData.rappresentazione})
                items.push({label: 'Ellissoide e Datum', value: metaData.elissoide_datum})
                items.push({label: 'Copertura', value: metaData.copertura})
                items.push({label: 'Note', value: metaData.note})
            }
            return {
                items: items
            }
        },
        mounted() {
            this.getMapMetadata();
        },
        methods: {
            closePanel() {
                this.$el.parentNode.removeChild(this.$el)
            },
            getMapMetadata () {
                //console.log(GV.config.getMapConfig(this.idMap))

            }
        }
    }

</script>

