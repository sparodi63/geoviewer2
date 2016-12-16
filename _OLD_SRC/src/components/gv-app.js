Vue.component('gv-app', {
    template:
    '<div id="gv-container">' +
        '<gv-map ref="gv-map"></gv-map>' +
        '<gv-legend ref="gv-legend" v-show="showLegend" :showAddMap="showAddMap" :showInfoMap="showInfoMap"></gv-legend>' +
        '<div v-show="showTitle" id="gv-title">{{this.getTitle()}}</div>' +
    '</div>',
    data: function () {
        return GV.config;
    },
    computed: {
        showTitle: function () {
            return (GV.config.application.layout.title && !GV.globals.SMALL_SCREEN);
        },
        showLegend: function() {
            return (GV.config.getButton("legend") && GV.config.getButtonOption("legend", "show")) ? true : false;
        },
        showAddMap: function() {
            return GV.config.getButtonOption("legend", "showAddMap");
        },
        showInfoMap: function() {
            return GV.config.getButtonOption("legend", "showInfoMap");
        }
    },
    created: function () {
        GV.app = this;
    },
    mounted: function () {
        GV.util.log('gv-app: mounted');

        // gestione toolbar
        this.addToolbars(GV.config.application.layout.toolbar);

        // gestione click
        if (GV.config.application.mapOptions && GV.config.application.mapOptions.click) {
            if (GV.config.application.mapOptions.click === 'info' && !GV.util.isTouch()) {
                GV.infoWmsManager.activate();
            }
        }

        // Gestione caricamento mappe/livelli da configurazione
        if (GV.config.maps.length > 0) {
            _.each(GV.config.maps, function (mapConfig) {
                GV.app.addMap(mapConfig);
            });
        }

        // Gestione caricamento mappe RL da servizio
        if (GV.config.idMap) {
            this.addRlMap(GV.config.idMap, GV.config.application.callback);

        } else {
            if (GV.config.application.callback) {
                GV.config.application.callback(this);
            }
        }
    },
    methods: {
        getTitle: function () {
            if (GV.config.application.layout.title === '{map.title}') {
                return this.mapTitle;
            } else {
                return GV.config.application.layout.title;
            }
        },
        getMaps: function () {
            return this.maps;
        },
        addToolbars: function () {
            if (GV.config.application.layout.toolbar) {
                var toolbar = GV.config.application.layout.toolbar;
                _.each(toolbar, function (tb) {
                    var position = tb.position || "topleft";
                    _.each(tb.items, function (item) {
                        item.options = item.options || {};
                        item.options.position = item.options.position || position;
                        this.addButton(item);
                    }, this);
                }, this);
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
                GV.util.log("Bottone " + item.name + " non esistente");
            }
        },

        addRlMap: function (idMap, callback) {
            if (!idMap || idMap === 'null') {
                GV.util.log('addRlMap: prametro idMap mancante', 2);
                return;
            }
            this.$http.get(GV.globals.RL_MAP_CONFIG_SERVICE + idMap).then(function (response) {
                if (!response.data.success) {
                    GV.util.log('Errore Caricamento Configurazione Mappa: ' + response.data.message, 2);
                    return;
                }
                // Aggiorno array delle mappe
                GV.config.addMapConfig(response.data.data);
                GV.app.addMap(response.data.data);
                // Gestione callback
                if (callback) {
                    callback(GV.app);
                }
            }, function (error) {
                GV.util.log(error,2);
            });

        },
        addMap: function (mapConfig) {
            // Imposto titolo
            this.mapTitle = mapConfig.name;
            // Aggiungo livelli alla mappa
            GV.map.loadLayers(mapConfig.layers);
            //gestione extent
            if (mapConfig.extent_3857) {
                GV.map.setInitialExtent(mapConfig.extent_3857);
            }
            //TODO: gestione find

        }
    }
});

