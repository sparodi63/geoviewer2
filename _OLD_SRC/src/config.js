GV.config = (function () {
    "use strict";

    var _lastZIndex = 21;

    return {
        debug: false,
        idMap: null,
        application: {},
        baseLayers: [
            { 'type': 'ESRI_IMAGERY', visible: true }
        ],
        maps: [],

        set: function (options) {
            this.debug = options.debug;

            if (options.application) {
                this.application = options.application;
            }
            this.application.layout = options.application.layout || {};
            this.application.proxy = options.application.proxy || GV.globals.DEFAULT_PROXY;

            if (options.baseLayers) {
                this.baseLayers = options.baseLayers;
            }

            if (options.maps) {
                options.maps.forEach(
                    function (mapConfig) {
                        GV.config.addMapConfig(mapConfig);
                    }
                );
            }

            this.idMap = options.idMap;
        },

        getAllLayersConfig: function () {
            var layers = [];
            _.each(this.maps, function (map) {
                _.each(map.layers, function (layer) {
                    layers.push(layer);
                });
            });
            return layers;
        },
        setLayerAttribute: function (layerName, attribute, value) {
            var foundLayer = null;
            _.each(this.maps, function (map) {
                var layers = map.layers;
                _.each(layers, function (layer) {
                    if (layer.name === layerName) {
                        layer[attribute] = value;
                    }
                });
            });
        },
        addMapConfig: function (mapConfig) {
            _.each(mapConfig.layers, function (layer) {
                if (layer.minScale === 0) {
                    layer.minScale = 591657550;
                }
                layer.zIndex = _lastZIndex++;
                if (GV.map) {
                    layer.inRange = GV.map.layerInRange(layer);
                } else {
                    layer.inRange = true;
                }
            });
            mapConfig.layers.reverse();
            this.maps.unshift(mapConfig);
        },
        getLayerConfig: function (layerName) {
            "use strict";
            var foundLayer = null;
            _.each(this.maps, function (map) {
                var layers = map.layers;
                foundLayer = _.find(layers, function (layer) {
                    return layer.name === layerName;
                });
            });
            if (foundLayer) {
                return foundLayer;
            }
        },
        getButton: function (buttonName) {
            "use strict";
            var button = null;
            _.each(this.application.layout.toolbar, function (tb) {
                _.each(tb.items, function (item) {
                    if (item.name === buttonName) {
                        button = item
                    }
                }, this);
            }, this);
            return button;
        },
        getButtonOption: function (buttonName, optionName) {
            "use strict";
            var option = null;
            _.each(this.application.layout.toolbar, function (tb) {
                _.each(tb.items, function (item) {
                    if (item.name === buttonName) {
                        option = item.options[optionName]
                    }
                }, this);
            }, this);
            return option;
        },
        setButtonOption: function (buttonName, optionName, value) {
            "use strict";
            var option = null;
            _.each(this.application.layout.toolbar, function (tb) {
                _.each(tb.items, function (item) {
                    if (item.name === buttonName) {
                        item.options[optionName] = value;
                    }
                }, this);
            }, this);
            return option;
        }
    };
} ());
