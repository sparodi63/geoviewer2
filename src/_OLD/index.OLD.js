// -------------------------------------------------------------------------------- //
// CSS
require("style!../node_modules/leaflet/dist/leaflet.css");
require("style!./assets/css/base.css");
require("style!./assets/css/mapskin/css/mapskin.css");
require("style!font-awesome/css/font-awesome.css");
require("style!./assets/css/leaflet.draw.css");
require("style!./assets/css/cesium-navigation.css");

// -------------------------------------------------------------------------------- //
// Shims/Polyfill
require("./polyfill/findIndex");
require("./polyfill/find");
require("./polyfill/startsWith");
require("es6-promise").polyfill();
// -------------------------------------------------------------------------------- //
// Imports
import draggable from "./directives/draggable";
import globals from "./globals";
import getUrlParam from "./util/getUrlParam";
import insertAgCoordinate from "./services/insertAgCoordinate";
import insertGeomPraticaGenio from "./services/insertGeomPraticaGenio";
import log from "./util/log";
import dragbox from "./util/dragbox";
import mountComponent from "./util/mountComponent";
import notification from "./util/notification";
import buildFindOptionsFromQueryStringParams from "./util/buildFindOptionsFromQueryStringParams";
import config from "./config";
import Vue from "vue";
import App from "./components/App.vue";

// -------------------------------------------------------------------------------- //
// Tools
let tools = [];
tools.push({
  name: "gv-geocoder"
});
import Geocoder from "./components/Geocoder.vue";
Vue.component("gv-geocoder", Geocoder);

tools.push({
  name: "gv-search"
});
import Search from "./components/Search.vue";
Vue.component("gv-search", Search);

tools.push({
  name: "gv-scalebar"
});
import Scalebar from "./components/Scalebar.vue";
Vue.component("gv-scalebar", Scalebar);

tools.push({
  name: "gv-inner-html"
});
import InnerHtml from "./components/InnerHtml.vue";
Vue.component("gv-inner-html", InnerHtml);

tools.push({
  name: "gv-add-map-button"
});
import AddMap from "./components/buttons/AddMap.vue";
Vue.component("gv-add-map-button", AddMap);

tools.push({
  name: "gv-info-button"
});
import Info from "./components/buttons/Info.vue";
Vue.component("gv-info-button", Info);

tools.push({
  name: "gv-coordinate-button"
});
import Coordinate from "./components/buttons/Coordinate.vue";
Vue.component("gv-coordinate-button", Coordinate);

tools.push({
  name: "gv-measure-button"
});
import Measure from "./components/buttons/Measure.vue";
Vue.component("gv-measure-button", Measure);

tools.push({
  name: "gv-draw-button"
});
import Draw from "./components/buttons/Draw.vue";
Vue.component("gv-draw-button", Draw);

tools.push({
  name: "gv-download-totale-button"
});
import DownloadTotale from "./components/buttons/DownloadTotale.vue";
Vue.component("gv-download-totale-button", DownloadTotale);

tools.push({
  name: "gv-layer-search-button"
});
import LayerSearch from "./components/buttons/LayerSearch.vue";
Vue.component("gv-layer-search-button", LayerSearch);

tools.push({
  name: "gv-layer-search-topo-button"
});
import LayerSearchTopo from "./components/buttons/LayerSearchTopo.vue";
Vue.component("gv-layer-search-topo-button", LayerSearchTopo);

tools.push({
  name: "atlante-geochimico-livelli"
});
import AtlanteGeochimicoLivelli from "./components/AtlanteGeochimicoLivelli.vue";
Vue.component("atlante-geochimico-livelli", AtlanteGeochimicoLivelli);

tools.push({
  name: "gv-map-selezione-fogli"
});
import SelezioneFogli from "./components/SelezioneFogli.vue";
Vue.component("gv-map-selezione-fogli", SelezioneFogli);

tools.push({
  name: "gv-gas"
});
import Gas from "./components/Gas.vue";
Vue.component("gv-gas", Gas);

tools.push({
  name: "gv-ricerca-particella-button"
});
import RicercaParticella from "./components/buttons/RicercaParticellaCatastale.vue";
Vue.component("gv-ricerca-particella-button", RicercaParticella);

tools.push({
  name: "gv-ricerca-catastale-button"
});
import RicercaCatastale from "./components/buttons/S3RicercaCatastale.vue";
Vue.component("gv-ricerca-catastale-button", RicercaCatastale);

tools.push({
  name: "gv-print-button"
});
import Print from "./components/buttons/Print.vue";
Vue.component("gv-print-button", Print);

tools.push({
  name: "gv-scuoladigitale-legend"
});
import ScuolaDigitaleLegend from "./components/ScuolaDigitaleLegend.vue";
Vue.component("gv-scuoladigitale-legend", ScuolaDigitaleLegend);

tools.push({
  name: "gv-genio-localizza-button"
});
import GenioLocalizza from "./components/buttons/GenioLocalizza.vue";
Vue.component("gv-genio-localizza-button", GenioLocalizza);

tools.push({
  name: "gv-genio-seleziona-particelle-button"
});
import GenioSelezionaParticelle from "./components/buttons/GenioSelezionaParticelle.vue";
Vue.component("gv-genio-seleziona-particelle-button", GenioSelezionaParticelle);

tools.push({
  name: "gv-cem-elaborazioni-button"
});
import CemElaborazioni from "./components/buttons/CemElaborazioni.vue";
Vue.component("gv-cem-elaborazioni-button", CemElaborazioni);

// -------------------------------------------------------------------------------- //

// -- CONFIGURAZIONE SENTRY
// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'
// Raven.config('https://9851ab4f0d814bf38ca41fd968c5264d@sentry.io/305915')
//   .addPlugin(RavenVue, Vue)
//   .install()

/* // SESSION-STACK 
function handleRouteError(err) {
  Raven.captureException(err)
  Raven.showReportDialog()
}
!(function(a, b) {
  var c = window
  ;(c.SessionStack = a),
    (c[a] =
      c[a] ||
      function() {
        ;(c[a].q = c[a].q || []), c[a].q.push(arguments)
      }),
    (c[a].t = b)
  var d = document.createElement('script')
  ;(d.async = 1), (d.src = 'https://cdn.sessionstack.com/sessionstack.js')
  var e = document.getElementsByTagName('script')[0]
  e.parentNode.insertBefore(d, e)
})('sessionstack', '8e98440cc80c44af95b66c1cc984a8cf')
sessionstack('getSessionId', function(s) {
  s &&
    Raven.setDataCallback(function(t) {
      return (
        (t.contexts = t.contexts || {}),
        (t.contexts.sessionstack = {
          session_id: s,
          timestamp: new Date().getTime(),
        }),
        t
      )
    })
}) */

// -- DEFINIZIONE GV
window.GV = {
  init(options) {
    this.initConfig(options);
    Vue.component("gv-app", App);
    const vm = new Vue({
      el: "#gv-container",
      template: "<gv-app></gv-app>"
    });
    return vm;
  },
  initConfig(options) {
    GV.config = config;
    config.init(options);
  },
  mountLegend() {
    mountComponent({
      elId: "gv-legend",
      clear: true,
      containerId: GV.config.containerId,
      vm: new Vue({
        template: `<gv-legend ref="gv-legend"></gv-legend>`
      })
    });
  },
  dragbox,
  globals,
  log,
  eventBus: new Vue(),
  utils: {
    getUrlParam: getUrlParam,
    buildFindOptionsFromQueryStringParams: buildFindOptionsFromQueryStringParams,
    insertAgCoordinate: insertAgCoordinate,
    notification: notification,
    insertGeomPraticaGenio: insertGeomPraticaGenio
  },
  tools
};
