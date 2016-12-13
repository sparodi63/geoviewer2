<template>
    <div id="gv-legend">
        <div id="gv-legend-title">
        <div class="gv-panel-title gv-bgcolor">
            <b>LEGENDA</b>
            <button class="gv-close" type="button" @click="hideLegend">×</button>
            <button v-show="showAddMap" class="gv-legend-add ms ms-layers-add" title="Aggiungi Mappa" type="button" @click="addMap"></button>
            </div>
        </div>
        <div id="gv-legend-body">
        <ul v-for="map in maps" class="gv-list-group">
            <li class="gv-list-legend-map-item">{{map.name}}
                <span v-show="showInfoMap" class="gv-legend-map-info ms ms-information" title="Scheda metadati" @click="showMapInfoPanel(map)"></span>
                </li>
            <ul class="gv-list-group">
                <li v-for="layer in map.layers" :layer="layer" :class="getClass(layer)">
                    <img class="gv-legend-layer-icon" :src="iconUrl(layer)" width="24px" height="24px" @click="showLegendPanel(layer)">
                    <span class="gv-layer-visibility-span"><input type="checkbox" class="gv-layer-visibility-cb" v-model="layer.visible" @click="setLayerVisible(layer, $event)"></span>
                    <span class="gv-layer-title-span">{{layer.legend.label}}</span>
                    </li>
                </ul>
            </ul>
        </div>
    </div>
</template>



<script>
    import Vue from 'vue';
    import util from '../util';
    import Map from '../leaflet/Map.js';
    import GV from '../GV';
    import * as config from '../config';
    import dynamicAddedComp from '../mixins/dynamicAddedComp';

    var _ = require('underscore');

    export default {
        name: 'gv-legend',
        data: function () {
            return {
                maps: config.maps
            };
        },
        props: ['showAddMap', 'showInfoMap'],
        mounted () {
            util.log('gv-legend: mounted');
        },
        methods: {
            hideLegend: function(event) {
                config.setButtonOption("legend", "show", false);
            },
            showMapInfoPanel: function (map) {
                "use strict";
                alert(map.id);
            },
            addMap: function() {
                alert('add map');
            },
            iconUrl: function(layer) {
                return layer.legend.icon;
            },
            getClass: function(layer) {
                return (layer.inRange) ? "gv-list-legend-layer-item" : "gv-list-legend-layer-item gv-list-legend-layer-disabled-item";
            },
            setLayerVisible: function(layer,event) {
                GV.map.setLayerVisible(layer, event.currentTarget.checked);
            },
            showLegendPanel: function(layer) {
                if (layer.inRange && (layer.multiClasse || layer.legend.popUpFlag)) {
                //if ((layer.multiClasse || layer.legend.popUpFlag)) {
                    var url = null, html = null, width, height;
                    if (layer.legend.popUpUrl && layer.legend.popUpFlag) {
                        // se impostato attributo legendPopupUrl apro una finestra con il documento
                        url = layer.legend.popUpUrl;
                        width = (util.SMALL_SCREEN) ? 400 : 600;
                        height = (util.SMALL_SCREEN) ? 400 : 600;
                    } else if (layer.multiClasse) {
                        // se livello multiclasse apro una finestra con la legenda dei livelli multiclasse
                        if (layer.flagGeoserver) {
                            url = layer.wmsParams.url + "LAYER=" + layer.name + "&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&";
                            width = 400;
                            height = 350;
                        } else {
                            var classes = layer.classes;
                            html = '<table width=100% border=0>';
                            _.each(classes, function (cls) {
                                html += '<tr>';
                                html += '<td width=30><img src="' + cls.legendIcon + '"></td>';
                                html += '<td >' + cls.legendLabel + '</td>';
                                html += '</tr>';
                            });
                            html += '</table>';
                        }
                    }

                    var vm = new Vue({
                        template:
                                '<gv-iframe-panel v-draggable visible="true" :src="src" :html="html" :height="height" :width="width" :cls="cls" :title="title"></gv-iframe-panel>' ,
                        data: {
                            title: 'LEGENDA - ' + layer.legend.label,
                            src: url,
                            html: html,
                            width: width,
                            height: height,
                            cls: "gv-legend-multi"
                        },
                        mixins: [dynamicAddedComp]
                    });
                }
            }

        }
    }
</script>

<style>

    #gv-legend {
        position: absolute;
        right: 0;
        top: 0;
        margin-right: 10px;
        margin-top: 10px;
        width: 260px;
        color: #31708f;
        background-color: #fff;
        z-index: 800;
        max-height: 430px;
    }

    #gv-legend-title {
        height: 30px;
    }

    .gv-panel-title {
        position: relative;
        display: block;
        padding: 0.3rem 0.5rem;
        margin-bottom: -1px;
        color: #ccc;
        cursor: default;
    }

    #gv-legend-body {
        position: absolute;
        width: 260px;
        max-height: 400px;
        cursor: default;
        overflow: hidden;
    }
    #gv-legend-body:hover {
        overflow-y: scroll;
    }

    @media (pointer: coarse) {
        #gv-legend-body {
            overflow-y: scroll;
            max-height: 200px;
        }
    }

    .gv-list-group {
        padding-left: 0;
        margin-top: 0;
        margin-bottom: 0;
        background-color: #fff;
    }

    .gv-list-legend-layer-item {
        position: relative;
        display: block;
        padding: 0.1rem 0.5rem;
        margin-bottom: -2px;
        margin-top: -2px;
        background-color: #fff;
        border: 1px solid #ddd;
    }

    .gv-list-legend-layer-disabled-item {
        opacity: 0.3;
        filter: alpha(opacity=30);
    }

    .gv-list-legend-map-item {
        position: relative;
        display: block;
        padding: 0.25rem 0.5rem;
        margin-bottom: -1px;
        border: 1px solid #ddd;
        color: #31708f;
        background-color: #ccc;
        font-size: 14px;
    }

    .gv-legend-layer-icon {
        padding: 2px 2px 2px 2px;
    }

    .gv-legend-multi {
        position: absolute;
        right: 0;
        top: 0;
        margin-right: 10px;
        margin-top: 85px;
        background-color: #fff;
        z-index: 800;
    }

    /*
    .gv-legend-map-info {
        position: absolute;
        top: 0;
        right: 0;
        margin-top: 5px;
        margin-right: 3px;
    }
    */

    .gv-legend-add {
        padding: 0;
        height: 19px;
        cursor: pointer;
        margin-right: 10px;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        float: right;
        line-height: 1;
        color: #ffffff;
        opacity: .5;
    }

    .gv-layer-visibility-span {
        position: absolute;
        top: 50%;
        left: 35px;
        margin-top: -6px;
    }

    .gv-layer-title-span {
        position: absolute;
        top: 50%;
        left: 55px;
        margin-top: -7px;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        max-width: 180px;
    }

</style>
