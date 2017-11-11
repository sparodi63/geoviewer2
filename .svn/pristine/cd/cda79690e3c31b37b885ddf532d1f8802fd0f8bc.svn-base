import Vue from 'vue'
import * as config from './config'

function init (options) {
  'use strict'

  // imposto configurazione applicazione
  config.set(options)

  // istanzio gv-app
  var vm = new Vue({
    el: '#gv-container',
    template: '<gv-app></gv-app>'
  })
}

export default init
