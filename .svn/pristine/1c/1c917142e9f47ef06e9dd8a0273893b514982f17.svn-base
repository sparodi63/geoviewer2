import globals from './globals';
import util from './util';
import GV from './GV';

var _ = require('underscore');

var _lastZIndex = 21;
var debug = false,
    idMap = null,
    title = null,
    application = {},
    baseLayers = [
        {'type': 'ESRI_IMAGERY', visible: true}
    ],
    maps = [];

function set(options) {
    if (!options) {
        debug = true;
        util.log('Opzioni di inizializzazione non impostate!', 1);
        return null;
    }

    debug = options.debug;

    if (options.application) {
        application = options.application;
    }
    if (options.application && options.application.layout) {
        application.layout = options.application.layout || {};
    }
    if (options.application) {
        application.proxy = options.application.proxy || globals.DEFAULT_PROXY;
    }

    if (options.application && options.application.layout && options.application.layout.title) {
        title = options.application.layout.title;
    }

    if (options.baseLayers) {
        baseLayers = options.baseLayers;
    }

    if (options.maps) {
        options.maps.forEach(
            (mapConfig) => {
                addMapConfig(mapConfig);
            }
        );
    }

    idMap = options.idMap;
}

function addMapConfig(mapConfig) {
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
    maps.unshift(mapConfig);
}

function getAllLayersConfig() {
    var layers = [];

    _.each(maps, function (map) {
        _.each(map.layers, function (layer) {
            layers.push(layer);
        });
    });
    return layers;
}

function setLayerAttribute(layerName, attribute, value) {
    var foundLayer = null;

    _.each(maps, function (map) {
        var layers = map.layers;

        _.each(layers, function (layer) {
            if (layer.name === layerName) {
                layer[attribute] = value;
            }
        });
    });
}

function getLayerConfig(layerName) {
    var foundLayer = null;

    _.each(maps, function (map) {
        var layers = map.layers;

        foundLayer = _.find(layers, function (layer) {
            return layer.name === layerName;
        });
    });

    if (foundLayer) {
        return foundLayer;
    }
}

function getButton(buttonName) {
    var button = null;

    if (!application.layout) return null;

    _.each(application.layout.toolbar, function (tb) {
        _.each(tb.items, function (item) {
            if (item.name === buttonName) {
                button = item;
            }
        }, this);
    }, this);

    return button;
}

function getButtonOption(buttonName, optionName) {
    var option = null;

    if (!application.layout) return null;

    _.each(application.layout.toolbar, function (tb) {
        _.each(tb.items, function (item) {
            if (item.name === buttonName) {
                option = item.options[optionName];
            }
        }, this);
    }, this);

    return option;
}

function setButtonOption(buttonName, optionName, value) {
    var option = null;

    if (!application.layout) return null;

    _.each(application.layout.toolbar, function (tb) {
        _.each(tb.items, function (item) {
            if (item.name === buttonName) {
                item.options[optionName] = value;
            }
        }, this);
    }, this);

    return option;
}

export {
    debug, idMap, application, baseLayers, maps, title,
    set, addMapConfig, getAllLayersConfig, getLayerConfig, getButton, getButtonOption, setButtonOption,
    setLayerAttribute
};

