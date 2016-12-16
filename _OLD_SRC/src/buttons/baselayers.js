
GV.Buttons.baselayers = function(btnOptions, map) {
    "use strict";

    if (GV.globals.SMALL_SCREEN) {
        return null;
    }
    return L.control.baseLayersSwitcher(map.baseLayers, [], { position: btnOptions.position}).addTo(map);
};
