(function () {
  'use strict';
  L.Control.Geocoder = L.Control.extend({
    options: {
      showResultIcons: false,
      collapsed: true,
      expand: 'click',
      position: 'topright',
      placeholder: 'Ricerca Indirizzo...',
      errorMessage: 'Non trovato.'
    },

    _callbackId: 0,

    initialize: function (options) {
      L.Util.setOptions(this, options);
      if (!this.options.geocoder) {
        this.options.geocoder = new L.Control.Geocoder.Nominatim();
      }
    },

    onAdd: function (map) {
      var className = 'leaflet-control-geocoder',
          container = L.DomUtil.create('div', className + ' leaflet-bar'),
          icon      = L.DomUtil.create('a', 'ms ms-zoom', container),
          form      = this._form = L.DomUtil.create('form', className + '-form', container),
          input;

      icon.innerHTML = '';
      icon.href = 'javascript:void(0);';
      this._map = map;
      this._container = container;
      input = this._input = L.DomUtil.create('input');
      input.type = 'text';
      input.placeholder = this.options.placeholder;

      L.DomEvent.addListener(input, 'keydown', this._keydown, this);
      //L.DomEvent.addListener(input, 'onpaste', this._clearResults, this);
      //L.DomEvent.addListener(input, 'oninput', this._clearResults, this);

      this._errorElement = document.createElement('div');
      this._errorElement.className = className + '-form-no-error';
      this._errorElement.innerHTML = this.options.errorMessage;

      this._alts = L.DomUtil.create('ul', className + '-alternatives leaflet-control-geocoder-alternatives-minimized');

      form.appendChild(input);
      this._container.appendChild(this._errorElement);
      container.appendChild(this._alts);

      L.DomEvent.addListener(form, 'submit', this._geocode, this);

      if (this.options.collapsed) {
        if (this.options.expand === 'click') {
          L.DomEvent.addListener(icon, 'click', function (e) {
            // TODO: touch
            if (e.button === 0 && e.detail !== 2) {
              this._toggle();
            }
          }, this);
        } else {
          L.DomEvent.addListener(icon, 'mouseover', this._expand, this);
          L.DomEvent.addListener(icon, 'mouseout', this._collapse, this);
          this._map.on('movestart', this._collapse, this);
        }
      } else {
        L.DomEvent.addListener(icon, 'click', function (e) {
          this._geocode(e);
        }, this);
        this._expand();
      }

      L.DomEvent.disableClickPropagation(container);

      return container;
    },

    _geocodeResult: function (results) {
      L.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-throbber');
      if (results.length === 1) {
        this._geocodeResultSelected(results[0]);
      } else if (results.length > 0) {
        this._alts.innerHTML = '';
        this._results = results;
        L.DomUtil.removeClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
        for (var i = 0; i < results.length; i++) {
          this._alts.appendChild(this._createAlt(results[i], i));
        }
      } else {
        L.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error');
      }
    },

    markGeocode: function (result) {
      this._map.fitBounds(result.bbox);
      this._map.setZoom(16);

      if (this._geocodeMarker) {
        this._map.removeLayer(this._geocodeMarker);
      }

      this._geocodeMarker = new L.Marker(result.center)
      .bindPopup(result.html || result.name)
      .addTo(this._map)
      .openPopup();

      return this;
    },

    _geocode: function (event) {
      L.DomEvent.preventDefault(event);

      L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-throbber');
      this._clearResults();
      this.options.geocoder.geocode(this._input.value, this._geocodeResult, this);

      return false;
    },

    _geocodeResultSelected: function (result) {
      if (this.options.collapsed) {
        this._collapse();
      } else {
        this._clearResults();
      }
      this.markGeocode(result);
    },

    _toggle: function () {
      if (this._container.className.indexOf('leaflet-control-geocoder-expanded') >= 0) {
        this._collapse();
      } else {
        this._expand();
      }
    },

    _expand: function () {
      L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
      this._input.select();
    },

    _collapse: function () {
      this._container.className = this._container.className.replace(' leaflet-control-geocoder-expanded', '');
      L.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
    },

    _clearResults: function () {
      L.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      this._selection = null;
      L.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
    },

    _createAlt: function (result, index) {
      var li           = L.DomUtil.create('li', ''),
          a            = L.DomUtil.create('a', '', li),
          icon         = this.options.showResultIcons && result.icon ? L.DomUtil.create('img', '', a) : null,
          text         = result.html ? undefined : document.createTextNode(result.name),
          clickHandler = function clickHandler (e) {
            L.DomEvent.preventDefault(e);
            this._geocodeResultSelected(result);
          };

      if (icon) {
        icon.src = result.icon;
      }

      li.setAttribute('data-result-index', index);

      if (result.html) {
        a.innerHTML = result.html;
      } else {
        a.appendChild(text);
      }

      L.DomEvent.addListener(li, 'click', clickHandler, this);

      return li;
    },

    _keydown: function (e) {
      var _this  = this,
          select = function select (dir) {
            if (_this._selection) {
              L.DomUtil.removeClass(_this._selection, 'leaflet-control-geocoder-selected');
              _this._selection = _this._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
            }
            if (!_this._selection) {
              _this._selection = _this._alts[dir > 0 ? 'firstChild' : 'lastChild'];
            }

            if (_this._selection) {
              L.DomUtil.addClass(_this._selection, 'leaflet-control-geocoder-selected');
            }
          };

      switch (e.keyCode) {
          // Escape
        case 27:
          if (this.options.collapsed) {
            this._collapse();
          }
          break;
          // Up
        case 38:
          select(-1);
          L.DomEvent.preventDefault(e);
          break;
          // Up
        case 40:
          select(1);
          L.DomEvent.preventDefault(e);
          break;
          // Enter
        case 13:
          if (this._selection) {
            var index = parseInt(this._selection.getAttribute('data-result-index'), 10);
            this._geocodeResultSelected(this._results[index]);
            this._clearResults();
            L.DomEvent.preventDefault(e);
          }
      }
      return true;
    }
  });

  L.Control.geocoder = function (options) {
    return new L.Control.Geocoder(options);
  };

  L.Control.Geocoder.callbackId = 0;

  L.Control.Geocoder.jsonp = function (url, params, callback, context, jsonpParam) {
    var callbackId = '_l_geocoder_' + (L.Control.Geocoder.callbackId++);
    params[jsonpParam || 'callback'] = callbackId;
    window[callbackId] = L.Util.bind(callback, context);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + L.Util.getParamString(params);
    script.id = callbackId;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  L.Control.Geocoder.getJSON = function (url, params, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState != 4) {
        return;
      }
      if (xmlHttp.status != 200 && xmlHttp.status != 304) {
        callback('');
        return;
      }
      callback(JSON.parse(xmlHttp.response));
    };
    xmlHttp.open("GET", url + L.Util.getParamString(params), true);
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.send(null);
  };

  L.Control.Geocoder.template = function (str, data, htmlEscape) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
      var value = data[key];
      if (value === undefined) {
        value = '';
      } else if (typeof value === 'function') {
        value = value(data);
      }
      return L.Control.Geocoder.htmlEscape(value);
    });
  };

  // Adapted from handlebars.js
  // https://github.com/wycats/handlebars.js/
  L.Control.Geocoder.htmlEscape = (function () {
    var badChars = /[&<>"'`]/g;
    var possible = /[&<>"'`]/;
    var escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '`': '&#x60;'
    };

    function escapeChar (chr) {
      return escape[chr];
    }

    return function (string) {
      if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;

      if (!possible.test(string)) {
        return string;
      }
      return string.replace(badChars, escapeChar);
    };
  })();

  L.Control.Geocoder.Nominatim = L.Class.extend({
    options: {
      serviceUrl: '//nominatim.openstreetmap.org/',
      geocodingQueryParams: {
        countrycodes: 'it',
        viewbox: '7.49958,44.791951,10.06312,43.730645',
        bounded: 1
      },
      reverseQueryParams: {},
      htmlTemplate: function (r) {

        var display = r.display_name.replace('Genoa,', '').replace('Italia', '').replace('Liguria,', '');
        return L.Control.Geocoder.template(display.split(',').join('<br/>'), r.address, true);

        //return L.Control.Geocoder.template(parts.join('<br/>'), a, true);

      }
    },

    initialize: function (options) {
      L.Util.setOptions(this, options);
    },

    geocode: function (query, cb, context) {
      L.Control.Geocoder.jsonp(this.options.serviceUrl + 'search/', L.extend({
            q: query + ' Liguria',
            limit: 10,
            format: 'json',
            addressdetails: 1
          }, this.options.geocodingQueryParams),
          function (data) {
            var results = [];
            for (var i = data.length - 1; i >= 0; i--) {
              var bbox = data[i].boundingbox;
              for (var j = 0; j < 4; j++) bbox[j] = parseFloat(bbox[j]);
              results[i] = {
                icon: data[i].icon,
                name: data[i].display_name,
                html: this.options.htmlTemplate ?
                    this.options.htmlTemplate(data[i])
                    : undefined,
                bbox: L.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
                center: L.latLng(data[i].lat, data[i].lon),
                properties: data[i]
              };
            }
            cb.call(context, results);
          }, this, 'json_callback');
    },

    reverse: function (location, scale, cb, context) {
      L.Control.Geocoder.jsonp(this.options.serviceUrl + 'reverse/', L.extend({
        lat: location.lat,
        lon: location.lng,
        zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
        addressdetails: 1,
        format: 'json'
      }, this.options.reverseQueryParams), function (data) {
        var result = [],
            loc;

        if (data && data.lat && data.lon) {
          loc = L.latLng(data.lat, data.lon);
          result.push({
            name: data.display_name,
            html: this.options.htmlTemplate ?
                this.options.htmlTemplate(data)
                : undefined,
            center: loc,
            bounds: L.latLngBounds(loc, loc),
            properties: data
          });
        }

        cb.call(context, result);
      }, this, 'json_callback');
    }
  });

  L.Control.Geocoder.Google = L.Class.extend({
    options: {
      service_url: 'https://maps.googleapis.com/maps/api/geocode/json'
    },

    initialize: function (key) {
      this._key = key;
    },

    geocode: function (query, cb, context) {
      var params = {
        address: query
      };
      if (this._key && this._key.length) {
        params['key'] = this._key
      }

      L.Control.Geocoder.getJSON(this.options.service_url, params, function (data) {
        var results = [],
            loc,
            latLng,
            latLngBounds;
        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            loc = data.results[i];
            latLng = L.latLng(loc.geometry.location);
            latLngBounds = L.latLngBounds(L.latLng(loc.geometry.viewport.northeast), L.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: latLngBounds,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    },

    reverse: function (location, scale, cb, context) {
      var params = {
        latlng: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng)
      };
      if (this._key && this._key.length) {
        params['key'] = this._key
      }
      L.Control.Geocoder.getJSON(this.options.service_url, params, function (data) {
        var results = [],
            loc,
            latLng,
            latLngBounds;
        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            loc = data.results[i];
            latLng = L.latLng(loc.geometry.location);
            latLngBounds = L.latLngBounds(L.latLng(loc.geometry.viewport.northeast), L.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: latLngBounds,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    }
  });

  return L.Control.Geocoder;
})();

