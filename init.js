import Vue from 'vue'
import gvApp from 'components/App.vue'
Vue.component('gv-app', gvApp)
import initConfig from './initConfig'

export default function (options) {
  'use strict'

  initConfig(options)

  return new Vue({
    el: '#gv-container',
    template: '<gv-app :options="options"></gv-app>',
    data () {
      return {options: options}
    }
  })
}
