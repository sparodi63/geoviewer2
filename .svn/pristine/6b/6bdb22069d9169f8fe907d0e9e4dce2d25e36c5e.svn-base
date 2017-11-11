import Vue from 'vue'
import gvApp from 'components/App.vue'
Vue.component('gv-app', gvApp)

export default function (options) {
  'use strict'

  return new Vue({
    el: '#gv-container',
    template: '<gv-app :options="options"></gv-app>',
    data () {
      return {options: options}
    }
  })
}
