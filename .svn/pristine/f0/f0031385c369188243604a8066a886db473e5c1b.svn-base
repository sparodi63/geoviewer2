import Vue from 'vue';

//require('./components/gv-app.js');

import util from './util';
import * as config from './config';
import globals from './globals';

function init(options) {
    'use strict';

    // imposto configurazione applicazione
    config.set(options);

    // istanzio gv-app
    new Vue({
        el: '#gv-container',
        template: '<gv-app></gv-app>'
    });
}

export default init;
