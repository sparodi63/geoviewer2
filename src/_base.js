
// -------------------------------------------------------------------------------- //
// CSS
require('style!../node_modules/leaflet/dist/leaflet.css')
require('style!./assets/css/base.css')
require('style!./assets/css/mapskin/css/mapskin.css')
require('style!font-awesome/css/font-awesome.css')
// -------------------------------------------------------------------------------- //
// Shims/Polyfill
require('./polyfill/findIndex')
require('./polyfill/find')
require('es6-promise').polyfill();
// -------------------------------------------------------------------------------- //
// Definizione globale oggetto GV
import GV from './GV'
window.GV = GV
// -------------------------------------------------------------------------------- //
// Bottoni
require('./buttons/fullscreen')
require('./buttons/zoom')
require('./buttons/locate')
require('./buttons/legend')
require('./buttons/search')
require('./buttons/geocoder')
// -------------------------------------------------------------------------------- //
// Direttive
require('./directives/draggable')

