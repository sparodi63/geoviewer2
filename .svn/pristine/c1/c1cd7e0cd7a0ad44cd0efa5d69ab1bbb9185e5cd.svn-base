import Vue from 'vue'

// require('./components/gv-app.js');

import * as config from './config'

function init(options) {
  'use strict'

  // imposto configurazione applicazione
  config.set(options)

  // istanzio gv-app
  new Vue({
    el: '#gv-container',
    template: '<gv-app></gv-app>'
  })

}


export default init