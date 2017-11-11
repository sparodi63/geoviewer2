/**
 * Created by parodi on 19/09/2016.
 */
GV.Buttons.legend = function(btnOptions, map) {
    "use strict";

    // Al primo avvio se schermo piccolo nascondo la legenda
    if (GV.globals.SMALL_SCREEN) {
        GV.config.setButtonOption("legend", "show", false);
    }

    var options = _.extend(btnOptions, {
        leafletClasses: true,
        states: [{
            stateName: 'print',
            onClick: function (button, map) {
                GV.config.setButtonOption("legend", "show", true);
            },
            title: 'Legenda',
            icon: 'ms ms-layers'
        }]
    });

    return L.easyButton(options);

};