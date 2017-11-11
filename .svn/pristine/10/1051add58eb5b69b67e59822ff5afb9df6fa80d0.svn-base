<template>
    <div id="gv-legend" class="gv-inverted-color-scheme">
        <div id="gv-legend-title">
            <div class="gv-panel-title gv-color-scheme">
                <b>LEGENDA</b>
                <button class="gv-close" type="button" @click="hideLegend">×</button>
                <button v-show="showAddMap" class="gv-legend-add ms ms-layers-add" title="Aggiungi Mappa" type="button"
                        @click="addMap"></button>
            </div>
        </div>
        <div id="gv-legend-body">
            <ul v-for="map in maps" class="gv-list-group">
                <li class="gv-list-legend-map-item gv-inverted-color-scheme">{{map.name}}<br>&nbsp;
                    <span v-show="showInfoMap" class="gv-legend-map-info fa fa-eye" title="Scheda Informativa"
                          @click="showMapInfoPanel(map)"></span>
                </li>
                <ul class="gv-list-group">
                    <li v-for="layer in map.layers" :layer="layer" :class="getClass(layer)">
                        <img class="gv-legend-layer-icon" :src="iconUrl(layer)" @click="showLegendPanel(layer)">
                        <span class="gv-layer-visibility-span"><input type="checkbox" class="gv-layer-visibility-cb"
                                                                      v-model="layer.visible"
                                                                      @click="setLayerVisible(layer, $event)"></span>
                        <span class="gv-layer-title-span">{{layer.legend.label}}</span>
                    </li>
                </ul>
            </ul>
            <div class="gv-legend-footer gv-inverted-color-scheme">
            </div>
        </div>
    </div>
</template>


<script>
    import Vue from 'vue'
    import Map from '../leaflet/Map.js'
    import GV from '../GV'
    import * as config from '../config'
    import mountComponent from '../util/mountComponent'

    import * as MapInfoPanel from './MapInfoPanel.vue'
    Vue.component('gv-map-info-panel', MapInfoPanel)

    export default {
        name: 'gv-legend',
        data: function () {
            return {
                maps: config.maps
            }
        },
        props: ['showAddMap', 'showInfoMap','showBaseLayerSwitcher'],
        mounted () {
            if (GV.config.debug) console.log('gv-legend: mounted')
        },
        methods: {
            hideLegend: function (event) {
                config.setButtonOption('legend', 'show', false)
            },
            showMapInfoPanel: function (map) {
                'use strict'
                //alert(map.id)
                mountComponent({
                    elId: 'gv-map-info-panel',
                    clear: true,
                    vm: new Vue({
                        template: `<gv-map-info-panel v-draggable visible="true" idMap="${map.id}" title="Scheda - ${map.name}"></gv-map-info-panel>`
                    })
                })
            },
            addMap: function () {
                GV.app.addRlMap(1735)
            },
            iconUrl: function (layer) {
                return layer.legend.icon
            },
            getClass: function (layer) {
                return (layer.inRange) ? 'gv-list-legend-layer-item' : 'gv-list-legend-layer-item gv-list-legend-layer-disabled-item'
            },
            setLayerVisible: function (layer, event) {
                GV.map.setLayerVisible(layer, event.currentTarget.checked)
            },
            showLegendPanel: function (layer) {
                if (layer.inRange && (layer.multiClasse || layer.legend.popUpFlag)) {
                    //if ((layer.multiClasse || layer.legend.popUpFlag)) {
                    var url = null, html = null, width, height
                    if (layer.legend.popUpUrl && layer.legend.popUpFlag) {
                        // se impostato attributo legendPopupUrl apro una finestra con il documento
                        url = layer.legend.popUpUrl
                        width = (util.SMALL_SCREEN) ? 400 : 600
                        height = (util.SMALL_SCREEN) ? 400 : 600
                    } else if (layer.multiClasse) {
                        // se livello multiclasse apro una finestra con la legenda dei livelli multiclasse
                        if (layer.flagGeoserver) {
                            url = `${layer.wmsParams.url}LAYER=${layer.name}&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&`
                            width = 400
                            height = 350
                        } else {
                            var classes = layer.classes
                            html = '<table width=100% border=0>'
                            classes.forEach(function (cls) {
                                html += '<tr>'
                                html += '<td width=30><img src="' + cls.legendIcon + '"></td>'
                                html += '<td >' + cls.legendLabel + '</td>'
                                html += '</tr>'
                            })
                            html += '</table>'
                        }
                    }

                    mountComponent({
                        elId: 'multi-legend-panel',
                        vm: new Vue({
                            template: '<gv-iframe-panel v-draggable visible="true" :src="src" :html="html" :height="height" :width="width" :cls="cls" :title="title"></gv-iframe-panel>',
                            data: {
                                title: `LEGENDA - ${layer.legend.label}`,
                                src: url,
                                html: html,
                                width: width,
                                height: height,
                                cls: 'gv-legend-multi'
                            }
                        })
                    })
                }
            }

        }
    }
</script>

<style>
</style>
