<template>
    <div v-show="visible" class="gv-map-info-panel gv-inverted-color-scheme" id="gv-map-info-panel">
        <gv-title :title="title"></gv-title>
        <div class="gv-map-info-panel-body">
            <table>
                <tbody>
                    <tr v-for="item in items">
                        <th class="gv-map-info-panel-th gv-secondary-color-scheme">{{item.label}}</th><td>{{item.value}}</td>
                    </tr>
                </tbody>
            </table>
            <el-row type="flex" class="row-bg" justify="left">
                <el-col :span="8">
                    <el-button type="primary" @click="download" class="gv-button-download fa fa-download" size="mini">
                        <span> Download</span>
                    </el-button>
                </el-col>
                <el-col v-if="addToMapButton" :span="18">
                    <el-button type="primary" @click="addToMap" class="gv-button-download fa fa-eye" size="mini">
                        <span> Visualizza</span>
                    </el-button>
                </el-col>
                <el-col>
                    <el-button-group class="gv-button-group">
                        <el-button type="primary" disabled size="mini"><span>Scheda Metadati:</span></el-button>
                        <el-button type="primary" @click="openMetadataPanel('DATA')" size="mini"><span>Dataset</span></el-button>
                        <el-button type="primary" @click="openMetadataPanel('VS')" size="mini"><span>WMS</span></el-button>
                        <el-button v-show="flagDownload" type="primary" @click="openMetadataPanel('DS')" size="mini"><span>WFS</span></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
    </div>
</template>


<script>
    import * as config from '../config'
    import Vue from 'vue'
    import mountComponent from '../util/mountComponent'
    import getConfig from '../services/getConfig'

    import { Button, ButtonGroup, Row, Col } from 'element-ui'
    Vue.use(Button, ButtonGroup, Row, Col)

    import * as MapMetadataPanel from './MapMetadataPanel.vue'
    Vue.component('gv-map-metadata-panel', MapMetadataPanel)

    export default {
        name: 'gv-map-info-panel',
        props: ['idMap','visible','addToMapButton'],
        data() {
            let items = []
            var metaData = config.schedaInfoCartografia
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
                items: items,
                name: metaData.descrizione,
                flagDownload: metaData.flag_download,
                title: ("SCHEDA - " + metaData.descrizione).substr(0,83) + "...",
                linkWms: metaData.link_wms,
                linkWfs: metaData.link_wfs,
                linkDownload: metaData.link_download
            }
        },
        mounted() {
//          console.log(this.idMap)
        },
        methods: {
            closePanel() {
                this.$el.parentNode.removeChild(this.$el)
            },
            download() {
                window.open(this.linkDownload)
            },
            addToMap() {
                getConfig(this.idMap).then(response => {
                    if (!response.data.success) {
                        throw new Error('Errore Caricamento Mappa: ' + response.data.message)
                    }
                    // Aggiorno array delle mappe
                    config.addMapConfig(response.data.data)
                })
            },
            openMetadataPanel(type) {
                const xmlUrl = `http://geoportale.regione.liguria.it:8080/geoservices/REST/metadata/scheda_xml/${this.idMap}?type=${type}&`
                let url = xmlUrl
                if (type==='DATA') {
                    url += `${xmlUrl}style=dataset-gv.xsl`
                } else {
                    url += `${xmlUrl}style=service-gv.xsl`
                }

                const linkWms = this.linkWms
                const linkWfs = this.linkWfs
                const title = (type==='DATA') ? 'Scheda Metadati Dataset':
                            (type==='VS') ? 'Scheda Metadati Servizio Visualizzazione' :
                            'Scheda Metadati Servizio Scarico'

                mountComponent({
                    elId: 'gv-map-metadata-panel',
                    clear: true,
                    vm: new Vue({
                        template: `<gv-map-metadata-panel :src="src" :xmlUrl="xmlUrl" :title="title" :type="type" :linkWms="linkWms" :linkWfs="linkWfs" ></gv-map-metadata-panel>`,
                        data: {
                            title: `${title}: ${this.name}`,
                            src: url,
                            type: type,
                            xmlUrl: xmlUrl,
                            linkWms: linkWms,
                            linkWfs: linkWfs
                        }
                    })
                })
            }
        }
    }

</script>

<style scoped>

    .gv-map-metadata-panel {
      position: absolute;
      left: 0;
      top: 0;
      margin-left: 10px;
      margin-top: 100px;
      background-color: #fff;
      z-index: 800;
      width: 860px;
    }

    .gv-map-info-panel {
      position: absolute;
      left: 0;
      top: 0;
      margin-left: 30px;
      margin-top: 100px;
      background-color: #fff;
      z-index: 800;
      max-width: 600px;
    }

    .gv-map-info-panel table {
      border: 1px solid #ddd ;
      width: 100%;
      padding: 10px;
    }


    .gv-map-info-panel-th {
      white-space: nowrap;
      width: auto;
      padding: 5px 5px;
      text-align: left;
      font-weight: 400;
      font-size: 12px;
      border: 1px solid #e5e5e5;
    }

    .gv-map-info-panel table tr td {
      padding: 5px;
      font-size: 12px;
      border: 1px solid #e5e5e5;
    }

    .gv-button-download {
        font-size: 12px;
    }

    .gv-button-download span {
        font-family: "Raleway",Arial,sans-serif;
        font-weight: bold;
    }
    .gv-button-group span {
        font-size: 12px;
        font-family: "Raleway",Arial,sans-serif;
        font-weight: bold;
    }


</style>