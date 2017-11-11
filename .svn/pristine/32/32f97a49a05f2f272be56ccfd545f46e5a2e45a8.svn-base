<template>
    <div id="gv-container">
        <gv-map ref="gv-map" :maps="maps"></gv-map>
        <div v-show="showTitle" class="gv-color-scheme" id="gv-title">{{this.getTitle()}}</div>
        <gv-legend ref="gv-legend" v-show="showLegend" :show-add-map="showAddMap" :show-base-layer-switcher="showBaseLayerSwitcher" :show-info-map="showInfoMap" :base-layers="baseLayers" :maps="maps"></gv-legend>
    </div>
</template>

<script>
    import * as config from '../config'
    import globals from '../globals'
    import GV from '../GV'
    import isTouch from '../util/isTouch'
    import setDrag from '../util/setDrag'
    import getProtocol from '../util/getProtocol'
    import infoWmsManager from '../infoWmsManager'
    import getConfig from '../services/getConfig'

    import Vue from 'vue'

    // Componenti Vue
    import gvMap from './Map'
    Vue.component('gv-map', gvMap)
    import gvLegend from './Legend'
    Vue.component('gv-legend', gvLegend)
    import IFrame from './IFrame'
    Vue.component('gv-iframe-panel', IFrame)
    import InfoWmsList from './InfoWmsList.vue'
    Vue.component(InfoWmsList.name, InfoWmsList)
    import InfoWmsHtml from './InfoWmsHtml.vue'
    Vue.component(InfoWmsHtml.name, InfoWmsHtml)
    import Geocoder from './Geocoder.vue'
    Vue.component('gv-geocoder', Geocoder)


    export default {
        name: 'gv-app',
        data: function () {
            return config
        },
        computed: {
            showTitle: function () {
                return (config.application.layout.title && !globals.SMALL_SCREEN && this.maps.length > 0)
            },
            showLegend: function () {
                return (config.getButton('legend') && config.getButtonOption('legend', 'show'))
            },
            showAddMap: function () {
                return config.getButtonOption('legend', 'showAddMap')
            },
            showBaseLayerSwitcher: function () {
                return config.getButtonOption('legend', 'showBaseLayerSwitcher')
            },

            showInfoMap: function () {
                return config.getButtonOption('legend', 'showInfoMap')
            }
        },
        created () {
            // imposto GV.app in modo da averlo s disposizione appena crato il componente
            GV.app = this
        },
        mounted: function () {

            if (GV.config.debug) {
                console.log('gv-app: mounted')
            }

            // imposto metodo per drag panelli
            setDrag()

            // gestione toolbar
            this.addToolbars(config.application.layout.toolbar)

            // gestione click
            if (config.application.mapOptions && config.application.mapOptions.click) {
                if (config.application.mapOptions.click === 'info' && !isTouch()) {
                    infoWmsManager.activate()
                }
            }

            // Gestione caricamento mappe/livelli da configurazione
            config.optionsMaps.forEach((mapConfig) => {
                config.addMapConfig(mapConfig)
                this.setTitle(mapConfig)
            })

            // Gestione caricamento mappe RL da servizio
            if (config.idMap) {
                this.addRlMap(config.idMap, config.application.callback)
            } else {
                if (config.application.callback) {
                    config.application.callback(this)
                }
            }

            // Per utilizzare eventi mappa leaflet
            // ev è oggetto formato da
            // - target (mappa Leaflet)
            // - type (tipo di evento es: 'move'
            // this.$on('lmap-move', ev => {console.log(ev)})
        },
        methods: {
            getTitle() {
                return config.title
            },
            getMaps() {
                return this.maps
            },
            addToolbars() {
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
            addButton(item) {
                if (GV.Buttons[item.name]) {
                    var button = GV.Buttons[item.name](item.options, GV.map)
                    if (button) {
                        button.name = item.name
                        button.addTo(GV.map)
                        GV.map.buttons.push(button)
                        if (item.options.callBack) {
                            item.options.callBack(button)
                        }
                        if (item.options.autoClick) {
                            button.button.click()                        }
                    }
                } else {
                    throw new Error('Bottone ' + item.name + ' non esistente')
                }
            },
            addRlMap(idMap, callback) {
                if (config.getMapConfig(idMap)) {
                    return
                }

                getConfig(idMap).then(response => {
                    if (!response.data.success) {
                       throw new Error('Errore Caricamento Configurazione Mappa: ' + response.data.message)
                    }
                    // Aggiorno array delle mappe
                    config.addMapConfig(response.data.data)
                    this.setTitle(response.data.data)
                    // Gestione callback
                    if (callback) {
                        callback(this)
                    }
                }).catch(error => {
                    console.error(error)
                    // TODO gestione messaggio errore
                })
            },
            setTitle(mapConfig) {
                // Imposto titolo
                if (config.application.layout.title === '{map.title}') {
                    config.title = mapConfig.name
                }
           }
        }
    }
</script>


<style>

</style>