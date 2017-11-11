<template>
    <div id="gv-container">
        <gv-map ref="gv-map"></gv-map>
        <div v-show="showTitle" class="gv-color-scheme" id="gv-title">{{this.getTitle()}}</div>
        <gv-legend ref="gv-legend" v-show="showLegend" :showAddMap="showAddMap" :showInfoMap="showInfoMap"></gv-legend>
    </div>
</template>

<script>
    import * as config from '../config'
    import globals from '../globals'
    import util from '../util'
    import GV from '../GV'

    import Vue from 'vue'
    import VueResource from 'vue-resource'
    Vue.use(VueResource)

    import * as gvMap from './Map'
    import * as gvLegend from './Legend'

    import infoWmsManager from '../infoWmsManager'


    export default {
        name: 'gv-app',
        components: {
            gvMap,
            gvLegend
        },
        data: function () {
            return config
        },
        computed: {
            showTitle: function () {
                return (config.application.layout.title && !globals.SMALL_SCREEN)
            },
            showLegend: function () {
                return (config.getButton('legend') && config.getButtonOption('legend', 'show'))
            },
            showAddMap: function () {
                return config.getButtonOption('legend', 'showAddMap')
            },
            showInfoMap: function () {
                return config.getButtonOption('legend', 'showInfoMap')
            }
        },
        created () {
            GV.app = this
        },
        mounted: function () {
            util.log('gv-app: mounted')

            // imposto metodo per drag panelli
            util.setDrag()

            // gestione toolbar
            this.addToolbars(config.application.layout.toolbar)

            // gestione click
            if (config.application.mapOptions && config.application.mapOptions.click) {
                if (config.application.mapOptions.click === 'info' && !util.isTouch()) {
                    infoWmsManager.activate()
                }
            }

            // Gestione caricamento mappe/livelli da configurazione
            if (config.maps.length>0) {
                config.maps.forEach( (mapConfig) => { this.addMap(mapConfig) } )
            }

            // Gestione caricamento mappe RL da servizio
            if (config.idMap) {
                this.addRlMap(config.idMap, config.application.callback)
            } else {
                if (config.application.callback) {
                    config.application.callback(this)
                }
            }
        },
        methods: {
            getTitle() {
                return config.title
            },
            getMaps: function () {
                return this.maps
            },
            addToolbars: function () {
                if (config.application.layout.toolbar) {
                    var toolbar = config.application.layout.toolbar
                    toolbar.forEach((tb) => {
                        const position = tb.position || 'topleft'
                        tb.items.forEach((item) => {
                            item.options = item.options || {}
                            item.options.position = item.options.position || position
                            this.addButton(item)
                        })
                    })
                }
            },
            addButton: function (item) {
                if (GV.Buttons[item.name]) {
                    var button = GV.Buttons[item.name](item.options, GV.map)
                    if (button) {
                        button.name = item.name
                        button.addTo(GV.map)
                    }
                } else {
                    util.log('Bottone ' + item.name + ' non esistente')
                }
            },



            addRlMap: function (idMap, callback) {
                if (!idMap || idMap === 'null') {
                    util.log('addRlMap: prametro idMap mancante', 2)
                    return
                }

                var url = `${globals.RL_MAP_CONFIG_SERVICE}${idMap}`
                if (config.geoserverUrl) {
                    url += "?geoserverUrl=" + config.geoserverUrl
                }

                this.$http.get(url, {headers: {'Accept': 'application/json'}}).then(function (response) {
                    if (!response.data.success) {
                        util.log('Errore Caricamento Configurazione Mappa: ' + response.data.message, 2)
                        return null
                    }
                    // Aggiorno array delle mappe
                    config.addMapConfig(response.data.data)
                    GV.app.addMap(response.data.data)
                    // Gestione callback
                    if (callback) {
                        callback(GV.app)
                    }
                }, function (error) {
                    util.log(error, 2)
                })
            },
            addMap: function (mapConfig) {
                // Imposto titolo
                if (config.application.layout.title === '{map.title}') {
                    config.title = mapConfig.name
                }
                // Aggiungo livelli alla mappa
                GV.map.loadLayers(mapConfig.layers)
                //gestione extent
                if (mapConfig.extent_3857) {
                    GV.map.setInitialExtent(mapConfig.extent_3857)
                }
                //TODO: gestione find
            }
        }
    }
</script>


<style>

</style>