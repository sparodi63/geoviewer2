/**
 * Created by parodi on 19/09/2016.
 */
GV.Buttons.navbar = function (btnOptions, map) {
  "use strict";

  if (GV.util.isTouch()) {
    return null;
  }
  return L.control.navbar(btnOptions);
};