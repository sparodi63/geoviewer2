/**
 * Created by parodi on 19/09/2016.
 */
GV.Buttons.print = function(btnOptions, map) {
    "use strict";
    if (GV.globals.SMALL_SCREEN) {
        return null;
    }

    var options = _.extend(btnOptions, {
        leafletClasses: true,
        states: [{
            stateName: 'print',
            onClick: function (button, map){
                console.log('print');
            },
            title: 'Stampa',
            icon: 'fa-print'
        }]
    });

    return L.easyButton(options);
};