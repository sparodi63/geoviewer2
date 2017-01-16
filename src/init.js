import Vue from 'vue'
import * as config from './config'
import App from 'components/App.vue'
import generateUUID from './util/generateUUID.js'

function init (options) {
  'use strict'

  // debugger

  // imposto configurazione applicazione
  config.set(options)

  // istanzio App
  const vm = new Vue({
    el: '#gv-container',
    render: h => h(App)
  })

  return vm
}

export default init
