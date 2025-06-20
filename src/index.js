// -------------------------------------------------------------------------------- //
// CSS
require('style!./assets/css/base.css');
require('style!./assets/css/mapskin/css/mapskin.css');
require('style!./assets/css/mapskin/css/mapskin.css');
import '@fortawesome/fontawesome-free/css/all.css';
import 'font-gis/css/font-gis.css';
// -------------------------------------------------------------------------------- //
// leaflet
// require('style!../node_modules/leaflet/dist/leaflet.css');
// require('style!./assets/css/leaflet.draw.css');
// require('style!./assets/css/leaflet-control-credits.css');
// import L from 'leaflet';
// require('leaflet-draw');
// require('./leaflet/leaflet.drawlocal.js');
// require('./leaflet/leaflet.edit.poly.js');
// require('./leaflet/MarkerCluster.js');
// require('./leaflet/NonTiledLayer.js');
// require('./leaflet/leaflet-control-credits.js');
// -------------------------------------------------------------------------------- //
// Shims/Polyfill
require('./polyfill/findIndex');
require('./polyfill/find');
require('./polyfill/startsWith');
require('es6-promise').polyfill();
// -------------------------------------------------------------------------------- //
// Imports
import fetchInject from 'fetch-inject';
import draggable from './directives/draggable';
import globals from './globals';
import getUrlParam from './util/getUrlParam';
import log from './util/log';
import dragbox from './util/dragbox';
import mountComponent from './util/mountComponent';
import notification from './util/notification';
import buildFindOptionsFromQueryStringParams from './util/buildFindOptionsFromQueryStringParams';
//
import insertAgCoordinate from './services/insertAgCoordinate';
import insertGeomPraticaGenio from './services/insertGeomPraticaGenio';
import getS3TokenBbox from './services/getS3TokenBbox';
import getS3Token from './services/getS3Token';
import getAuth from './services/getAuth';
import getGeneric from './services/getGeneric';

//
import config from './config';
import Vue from 'vue';
import App from './components/App.vue';
//
import tools from './tools';
import { get } from 'jquery';
import { v4 as uuidv4 } from 'uuid';

// -- DEFINIZIONE GV
window.GV = {
  async init(options) {
    console.log('INIT', options);

    let response = await fetch('/geoservices/apps/viewer/pages/env.json');
    GV.globals.env = await response.json();

    // let session = await fetch('/geoservices/REST/utils/get_session');
    // GV.globals.session = await session.json();

    if (GV.globals.env.SYS_MANUTENZIONE) {
      window.location.replace("https://srvcarto.regione.liguria.it/geoapps/viewer/pages/sospensione.html");
      // notification('SISTEMA IN MANUTENZIONE: SERVIZIO TEMPORANEAMENTE SOSPESO');
      // return;
    }

    // CARICAMENTO LIBRERIE
    if (options.application.mapOptions && options.application.mapOptions.type === 'openlayers') {
      console.log('Caricamento libreria OpenLayers');
      const olScripts = [
        '/geoservices/apps/viewer/dist/openlayers/ol.js',
        '/geoservices/apps/viewer/dist/openlayers/ol.css',
        '/geoservices/apps/viewer/dist/proj4js/proj4.js',
      ];
      const projDefs = ['/geoservices/apps/viewer/dist/proj4js/3003.js'];
      if (options.application.mapOptions.ol3d) {
        window.CESIUM_BASE_URL = '/geoservices/apps/viewer/dist/cesium/Build/Cesium';
        const cesiumScripts = ['/geoservices/apps/viewer/dist/cesium/Build/Cesium/Cesium.js'];
        const olcsScripts = [
          '/geoservices/apps/viewer/dist/olcs/olcesium.js',
          '/geoservices/apps/viewer/dist/olcs/olcs.css',
        ];
        await fetchInject(
          projDefs,
          fetchInject(olcsScripts, fetchInject(olScripts, fetchInject(cesiumScripts)))
        );
      } else {
        await fetchInject(projDefs, fetchInject(olScripts));
        // await fetchInject(olScripts);
      }
      // console.log('Dopo fetchInject - openlayers', ol);
    } else {
      // console.log('Caricamento libreria LeafLet');
      const llScripts = [
        '/geoservices/apps/viewer/dist/leaflet/leaflet-min.js',
        '/geoservices/apps/viewer/dist/leaflet/leaflet-min.css',
      ];
      await fetchInject(llScripts);
    }

    this.messageEventListener();

    GV.globals.SESSION.ID = uuidv4();

    if (options.application.auth) {
      const authOptions = options.application.auth.options;
      switch (options.application.auth.type) {
        case 'NAM':
          const auth = await getAuth(options.application.name, authOptions.ruolo);
          if (auth.success) {
            console.log(auth.data);
            GV.globals.SESSION.AUTH.RUOLO = auth.data.ruolo;
            GV.globals.SESSION.AUTH.COD_FISCALE = auth.data.cod_fiscale;
            GV.globals.SESSION.AUTH.LOGIN = auth.data.login;
            GV.globals.SESSION.AUTH.NOME = auth.data.nome;
            GV.globals.SESSION.AUTH.COGNOME = auth.data.cognome;
            GV.globals.SESSION.AUTH.RUOLI_UTENTE = auth.data.ruoli_utente;
            // console.log(GV.globals.SESSION);
            this.initConfig(options);
          } else {
            notification('ACCESSO ALLA APPLICAZIONE NON AUTORIZZATO');
          }
          break;
        case 'S3':
          const s3Token = await getS3Token(
            authOptions.s3Token,
            authOptions.s3TokenType,
            authOptions.s3TokenProv
          );
          if (s3Token.success && s3Token.found) this.initConfig(options);
          else notification('ACCESSO ALLA APPLICAZIONE NON AUTORIZZATO');
          break;
      }
    } else {
      this.initConfig(options);
    }
  },
  messageEventListener() {
    window.addEventListener(
      'message',
      event => {
        const data = event.data;
        if (!data.type) return;
      },
      false
    );
  },
  initConfig(options) {
    GV.config = config;
    config.init(options);
    Vue.component('gv-app', App);
    const vm = new Vue({
      el: '#gv-container',
      template: '<gv-app></gv-app>',
    });
    return vm;
  },
  mountLegend() {
    mountComponent({
      elId: 'gv-legend',
      clear: true,
      containerId: GV.config.containerId,
      vm: new Vue({
        template: `<gv-legend ref="gv-legend"></gv-legend>`,
      }),
    });
  },
  mount(options) {
    mountComponent({
      elId: options.eldId,
      clear: options.clear,
      toggleEl: options.toggleEl,
      containerId: GV.config.containerId,
      vm: new Vue({
        template: options.template,
        data: options.data,
      }),
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
    insertGeomPraticaGenio: insertGeomPraticaGenio,
    getS3TokenBbox: getS3TokenBbox,
    getS3Token: getS3Token,
    getGeneric: getGeneric,
  },
  tools: tools,
  gvInfoFeatures: [],
};
