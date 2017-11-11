<template>
    <div id="gv-container">
        <!--
        <div id="gv-header"></div>
        <div>
        -->
            <gv-map ref="gv-map" :maps="config.maps"></gv-map>
            <div v-show="showTitle" class="gv-color-scheme" id="gv-title">{{this.getTitle()}}</div>
            <gv-legend ref="gv-legend"
                       v-show="showLegend"
                       :show-add-map="showAddMap"
                       :show-base-layer-switcher="showBaseLayerSwitcher"
                       :show-info-map="showInfoMap"
                       :base-layers="config.baseLayers"
                       :maps="config.maps"
            ></gv-legend>
    <!--
        </div>
    -->
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
    import getCatalog from '../services/getCatalog'
    import getEnti from '../services/getEnti'

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
    //
    import { Notification  } from 'element-ui';
    //Vue.use(Message)

    export default {
        name: 'gv-app',
        props: ['options'],
        data: function () {
            return {
                debug: config.debug,
                globals: globals,
                config: config
            }
        },
        computed: {
            lMap() {
               return this.$refs['gv-map'].lMap
            },
            showTitle() {
                return (config.application.layout.title && !globals.SMALL_SCREEN && this.config.maps.length > 0)
            },
            showLegend() {
                return (config.getButton('legend') && config.getButtonOption('legend', 'show'))
            },
            showAddMap() {
                return config.getButtonOption('legend', 'showAddMap')
            },
            showBaseLayerSwitcher() {
                return config.getButtonOption('legend', 'showBaseLayerSwitcher')
            },
            showInfoMap() {
                return config.getButtonOption('legend', 'showInfoMap')
            }
        },
        created () {
            // imposto GV.app in modo da averlo s disposizione appena creato il componente
            GV.app = this
            // imposto configurazione applicazione
            config.set(this.options)
        },
        mounted: function () {
            if (GV.app.debug) {
                console.log('gv-app: mounted')
            }

            // imposto metodo per drag panelli
            setDrag()

            // gestione toolbar
            this.addToolbars(config.application.layout.toolbar)

            // gestione click su mappa
            if (config.application.mapOptions && config.application.mapOptions.click) {
                if (config.application.mapOptions.click === 'info' && !isTouch()) {
                    infoWmsManager.activate()
                }
            }

            // Gestione caricamento mappe/livelli da opzioni di configurazione
            this.options.maps.forEach((mapConfig) => {
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


        },
        methods: {
            getTitle() {
                return config.title
            },
            getMaps() {
                return this.config.maps
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
                    var button = GV.Buttons[item.name](item.options, GV.app.lMap)
                    if (button) {
                        button.name = item.name
                        button.addTo(GV.app.lMap)
                        GV.app.lMap.buttons.push(button)
                        if (item.options.callBack) {
                            item.options.callBack(button)
                        }
                        if (item.options.autoClick) {
                            setTimeout(function () {
                                button.button.click()
                            }, 1);

                        }
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
                       throw new Error('Errore Caricamento Mappa: ' + response.data.message)
                    }
                    if (!response.data.data) {
                        throw new Error('Errore Caricamento Mappa: configurazione mappa nulla')
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
                    Notification.error({
                        title: 'Attenzione',
                        type: 'error',
                        duration: 5000,
                        offset: 70,
                        message: error.message
                    });
                })
            },
            setTitle(mapConfig) {
                // Imposto titolo
                if (config.application.layout.title === '{map.title}') {
                    config.title = mapConfig.name
                }
           },
            loadCatalog(params) {
                getCatalog().then(data => {
                    config.catalog = config.catalogFull = data.children
                })
                getEnti().then(data => {
                    config.enti = data
                })

            }
        }
    }
</script>


<style>

</style>