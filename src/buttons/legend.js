import GV from '../GV';
import util from '../util';
import * as config from '../config';
var L = require('leaflet');
require('../controls/EasyButton');

GV.Buttons.legend = function (btnOptions, map) {
  "use strict";

  // Al primo avvio se schermo piccolo nascondo la legenda
  if (GV.globals.SMALL_SCREEN) {
    config.setButtonOption("legend", "show", false);
  }

  var options = Object.assign(btnOptions, {
    leafletClasses: true,
    states: [{
      stateName: 'legend',
      onClick: function (button, map) {
        config.setButtonOption("legend", "show", true);
      },
      title: 'Legenda',
      icon: 'ms ms-layers'
    }]
  });

  return L.easyButton(options);

};