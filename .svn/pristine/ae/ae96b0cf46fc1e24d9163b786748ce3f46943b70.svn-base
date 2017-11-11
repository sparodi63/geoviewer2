<template>
    <div id="gv-container">
        <gv-map ref="gv-map"></gv-map>
        <div v-show="showTitle" id="gv-title">{{this.getTitle()}}</div>
        <gv-legend ref="gv-legend" v-show="showLegend" :showAddMap="showAddMap" :showInfoMap="showInfoMap"></gv-legend>
    </div>
</template>

<script>
    var L = require('leaflet'),
        _ = require('underscore');

    import * as config from '../config';
    import globals from '../globals';
    import util from '../util';
    import GV from '../GV';

    import Vue from 'vue';
    import VueResource from 'vue-resource'
    Vue.use(VueResource);

    import * as gvMap from './Map';
    import * as gvLegend from './Legend';

    import infoWmsManager from '../infoWmsManager';

export default {
    name: 'gv-app',
    components: {
        gvMap,
        gvLegend
    },
    data: function () {
        return config;
    },
    computed: {
        showTitle: function () {
            return (config.application.layout.title && !globals.SMALL_SCREEN);
        },
        showLegend: function () {
            return (config.getButton('legend') && config.getButtonOption('legend', 'show'));
        },
        showAddMap: function () {
            return config.getButtonOption('legend', 'showAddMap');
        },
        showInfoMap: function () {
            return config.getButtonOption('legend', 'showInfoMap');
        }
    },
    created () {
        GV.app = this;
    },
    mounted: function () {
        util.log('gv-app: mounted');

        // imposto metodo per drag panelli
        util.setDrag();

        // gestione toolbar
        this.addToolbars(config.application.layout.toolbar);

        // gestione click
        if (config.application.mapOptions && config.application.mapOptions.click) {
            if (config.application.mapOptions.click === 'info' && !util.isTouch()) {
                // TODO
                infoWmsManager.activate();
            }
        }

        // Gestione caricamento mappe/livelli da configurazione
        if (config.maps.length > 0) {
            _.each(config.maps, (mapConfig) => {
                this.addMap(mapConfig);
            });

        }

        // Gestione caricamento mappe RL da servizio
        if (config.idMap) {
            this.addRlMap(config.idMap, config.application.callback);

        } else {
            if (config.application.callback) {
                config.application.callback(this);
            }
        }
    },
    methods: {
        getTitle() {
            return config.title;
        },
        getMaps: function () {
            return this.maps;
        },
        addToolbars: function () {
            if (config.application.layout.toolbar) {
                var toolbar = config.application.layout.toolbar;

                _.each(toolbar, (tb) => {
                    var position = tb.position || 'topleft';

                    _.each(tb.items, (item) => {
                        item.options = item.options || {};
                        item.options.position = item.options.position || position;
                        this.addButton(item);
                    });
                });
            }
        },
        addButton: function (item) {
            if (GV.Buttons[item.name]) {
                var button = GV.Buttons[item.name](item.options, GV.map);
                if (button) {
                    button.name = item.name;
                    button.addTo(GV.map);
                }
            } else {
                util.log('Bottone ' + item.name + ' non esistente');
            }
        },
        addRlMap: function (idMap, callback) {
            if (!idMap || idMap === 'null') {
                util.log('addRlMap: prametro idMap mancante', 2);
                return;
            }
            const url = `${globals.RL_MAP_CONFIG_SERVICE}${idMap}`;
            this.$http.get(url).then(function (response) {
                if (!response.data.success) {
                    util.log('Errore Caricamento Configurazione Mappa: ' + response.data.message, 2);
                    return;
                }
                // Aggiorno array delle mappe
                config.addMapConfig(response.data.data);
                GV.app.addMap(response.data.data);
                // Gestione callback
                if (callback) {
                    callback(GV.app);
                }
            }, function (error) {
                util.log(error, 2);
            });
        },
        addMap: function (mapConfig) {
            // Imposto titolo
            config.title = mapConfig.name;

            // Aggiungo livelli alla mappa
            GV.map.loadLayers(mapConfig.layers);
            //gestione extent
            if (mapConfig.extent_3857) {
                GV.map.setInitialExtent(mapConfig.extent_3857);
            }
            //TODO: gestione find
        }
    }
}
</script>


<style scoped>

    #gv-container {
        position: absolute;
        width: 100%;
        height: 100%;
    }


    #gv-title {
        position: absolute;
        left: 56px;
        top: 10px;
        height: 26px;
        color: #ccc;
        z-index: 799;
        font-size: 16px;
        font-weight: bold;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background-color: #31708f;
        overflow-y: hidden;
        opacity: 0.6;
        filter: alpha(opacity=60);
        line-height: 28px;
        max-width: 800px;
    }

</style>