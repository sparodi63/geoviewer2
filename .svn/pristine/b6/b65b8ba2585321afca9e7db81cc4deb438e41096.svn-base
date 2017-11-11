var interact = require('interact.js');
var matchMedia = require('./polyfills/matchMedia.js');
var _ = require('underscore');
import * as config from './config';
import globals from './globals';
import Vue from 'vue';

// ----

function msgBox (msg) {
  window.alert(msg);
}

function isTouch () {
  return window.matchMedia('(pointer: coarse)').matches;
}

function setDrag () {
  'use strict';
  interact('.draggable').draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: 'parent',
      endOnly: true,
      elementRect: {top: 0, left: 0, bottom: 1, right: 1}
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x      = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y      = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
}

function log (message, level) {
  var action = "log";

  if (!config.debug) {
    //    return;
  }

  switch (level) {
    case 0:
      action = "warn";
      break;
    case 1:
    case 2:
      action = "error";
      break;
    default:
      action = "info";
      break;
  }

  try {
    console[action](message + ' - ' + new Date());
  } catch (e) {
  }
}

function getScaleFromZoom (zoom) {
  return globals.BASE_SCALES[zoom]
}

function getScaleLabelsFromZoom (zoom) {
  return globals.BASE_SCALE_LABELS[zoom]
}

function getZoomFromScaleDenom (scaleDenom) {
  return _.findIndex(globals.BASE_SCALES, function (scale) {
    return scaleDenom > scale;
  });
}

function getUrlParam (paramName) {
  var results = new RegExp("[\\?&]" + paramName + "=([^&#]*)").exec(window.location.href);
  log("GV.util.getUrlParam");
  return results ? decodeURIComponent(results[1]) : null;
}

function getUrlParamFromString (url, paramName) {
  var results = new RegExp("[\\?&]" + paramName + "=([^&#]*)").exec(url);
  if (!results) {
    return null;
  }
  return results[1] || null;
}

function isBrowserIE () {
  return navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Edge") > 0;
}

function getXML (options, callback) {
  //TODO gestire metodo POST

  function done (response) {
    try {
      var xml = response.body;
      if (isBrowserIE()) {
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(response.body);
        xml = xmlDoc;
      } else {
        var parser = new DOMParser();
        xml = parser.parseFromString(response.body, "text/xml");
      }
      callback(xml);
    } catch (exception) {
      log(exception, 2);
    }
  }

  function err (error) {
    log(error, 2);
  }

  Vue.http.get(options.url, {params: options.data, headers: {'Accept': 'text/plain'}}).then(done, err);

}

function parseXML (xmlString) {
  log("GV.util.parseXML");
  try {
    var xmlDoc = null;
    if (window.DOMParser && window.XSLTProcessor) {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlString, "text/xml");
    } else {
      xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
      xmlDoc.async = false;
      xmlDoc.loadXML(xmlString);
    }
    return xmlDoc;
  } catch (exception) {
    log("GV.util.parseXml: errore parsing xml - " + exception.message, 1);
  }
}

function getParamString (obj, existingUrl, uppercase) {
  var params = [];
  for (var i in obj) {
    params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
  }
  return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
}

function template (str, data) {
  var templateRe = /\{ *([\w_\-]+) *\}/g;
  return str.replace(templateRe, function (str, key) {
    var value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for variable ' + str);

    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}

export default {
  msgBox,
  isTouch,
  setDrag,
  log,
  getScaleFromZoom,
  getScaleLabelsFromZoom,
  getZoomFromScaleDenom,
  getUrlParam,
  getUrlParamFromString,
  parseXML,
  getXML,
  isBrowserIE,
  getParamString,
  template
};
