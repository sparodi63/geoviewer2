GV.infoWmsManager = (function () {
    'use strict';
    var _requestCount = 0,
        _numRequests = 0,
        _features = [];

    function _request(e) {
        GV.util.log('start info request: ' + new Date());

        _requestCount = 0;
        _numRequests = 0;
        _features = [];

        var buildWMSOptions = function (url, layers, latlng) {
            var point = GV.map.latLngToContainerPoint(latlng, GV.map.getZoom()),
                size = GV.map.getSize(),
                bounds = GV.map.getBounds(),
                sw = GV.map.options.crs.project(bounds.getSouthWest()),
                ne = GV.map.options.crs.project(bounds.getNorthEast());

            var params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                crs: 'EPSG:3857',
                styles: '',
                version: '1.1.0',
                format: 'application/json',
                bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
                height: size.y,
                width: size.x,
                layers: layers,
                query_layers: layers,
                FEATURE_COUNT: 100,
                buffer: 10,
                info_format: 'application/json'
            };

            _.extend(params, {});
            params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
            params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

            return GV.config.application.proxy + url + GV.util.getParamString(params, url, true);
        };

        // Ciclo sulle mappe caricate
        _.each(GV.config.maps, function (mapConfig) {
            var url = null,
                layersArray = [];

            // Ciclo sui layer caricati sulla mappa leaflet
            _.each(mapConfig.layers, function (layerConfig) {
                if (layerConfig.idMap === mapConfig.id && layerConfig.type === 'WMS' && layerConfig.queryable && layerConfig.visible && GV.map.layerInRange(layerConfig)) {
                    url = layerConfig.wmsParams.url;
                    layersArray.push(layerConfig.wmsParams.name);
                }
            });

            var layers = layersArray.join(',');

            if (url && layersArray.length > 0) {
                var wmsUrl = buildWMSOptions(url, layers, e.latlng);
                _numRequests++;
                GV.map._container.style.cursor = "progress";
                Vue.http.get(wmsUrl).then(function (response) {
                    _handleResponse(response.data.features);
                }, function (error) {
                    GV.util.log(error,2);
                });

            }
        });
    }

    function _handleResponse(features) {
        _requestCount++;
        _.each(features, function (feature) {
            var layerName = feature.id.split('.')[0];
            feature.layerName = layerName;
            feature.layer = GV.map.getLayerByName(layerName);
            feature.label = setFeatureLabel(layerName, feature.properties);
            feature.infoOptions = feature.layer.config.infoOptions;

        });
        Array.prototype.push.apply(_features, features);
        if (_requestCount === _numRequests) {
            GV.map._container.style.cursor = "default";

            if (_features.length === 0) {
                GV.util.log('Nessun elemento trovata');
                return;
            }

            var vm = new Vue({
                template: '<gv-wms-info-list v-draggable :cls="cls" visible="true" :items="items"></gv-wms-info-list>',
                data: {
                    items: _features,
                    cls: 'gv-info-wms',
                    divId: 'gv-info-wms-list'
                },
                mixins: [GV.dynamicAddedComp]
            });

            if (_features.length === 1) {
                _showFeatureInfo(_features[0]);
            }

            GV.util.log('end info request: ' + new Date());
        }

        function setFeatureLabel(layerName, attributes) {
            var infoLabelAttr,
                infoIdAttr;
            infoLabelAttr = getField(layerName, "infoLabelAttr");
            infoIdAttr = getField(layerName, "infoIdAttr");
            if (infoLabelAttr && attributes[infoLabelAttr]) {
                return attributes[infoLabelAttr];
            }
            if (infoIdAttr && attributes[infoIdAttr]) {
                return attributes[infoIdAttr];
            }
            return attributes[getFirstAttribute(attributes)];
        }

        function getField(layerName, fieldName) {
            try {
                var layerConfig = GV.map.getLayerByName(layerName).config;
                if (layerConfig && layerConfig.infoOptions && layerConfig.infoOptions[fieldName]) {
                    return layerConfig.infoOptions[fieldName];
                } else {
                    return null;
                }
            } catch (exception) {
                GV.util.log(exception, 2);
                return null;
            }
        }

        function getFirstAttribute(attributes) {

            for (var i in attributes) {
                if (attributes.hasOwnProperty(i) && typeof(i) !== "function") {
                    return i;
                }
            }
            return null;
        }
    }

    function _showFeatureInfo(feature) {

        var infoOptions = feature.infoOptions,
            infoUrl = infoOptions.infoUrl;

        if ((infoUrl.substr(infoUrl.length - 4) === ".xsl") || (infoUrl.substr(infoUrl.length - 5) === ".xslt")) {
            // Gestione xsl
            buildAndShowHtml(infoOptions, feature);
        } else {
            // Gestione html/asp
            if (!infoOptions.infoTarget || infoOptions.infoTarget === "panel") {
                showPanel(infoUrl, null, infoOptions);
            } else {
                openPopup(infoUrl, null, infoOptions);
            }
        }

        function buildAndShowHtml(infoOptions, data) {
            // costruisco il gml in formato getFeatureInfo Mapserver
            var xmlDoc = buildGml(data);

            var options = {
                url: "/geoservices/REST/config/xsl_info_service?",
                data: {
                    xslUrl: infoOptions.infoUrl,
                    ambiente: null,
                    idLayer: data.layerName.replace("L", ""),
                    featureAttributes: data.properties
                }
            };

            GV.util.getXML(options, function (xslDoc) {
                // Aggiungo Nome Layer
                Array.prototype.slice.call(xslDoc.getElementsByTagName('td')).forEach(function (value, index, ar) {
                    if (value.id === "Titolo") {
                        value.textContent = data.layer.legend.label;
                        value.text = data.layer.legend.label;
                    }
                });

                // applico la trasformazione xslt
                var result = xslTransform(xmlDoc, xslDoc);
                // levo i caratteri di encoding %0A e %09 dai link
                result = result.replace(new RegExp('%0A', 'g'), '').replace(new RegExp('%09', 'g'), '').replace(new RegExp('%20', 'g'), '');
                // visualizzo il risultato
                if (!infoOptions.infoTarget || infoOptions.infoTarget === "panel") {
                    showPanel(result, null, infoOptions);
                } else {
                    openPopup(result, null, infoOptions);
                }
            });

            // costruisce un documento GML in formato getFeatureInfo Mapserver
            function buildGml(feature) {
                try {
                    var baseXml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><msGMLOutput xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"></msGMLOutput>",
                        xmlDoc = GV.util.parseXML(baseXml),
                        layerName = feature.layerName + "_layer",
                        layerNode = xmlDoc.createElement(layerName),
                        featureName = feature.layerName + "_feature",
                        featureNode = xmlDoc.createElement(featureName),
                        attributes = feature.properties;

                    for (var key in attributes) {
                        if (attributes.hasOwnProperty(key)) {
                            var text = null;
                            if (attributes[key]) {
                                text = xmlDoc.createTextNode(attributes[key]);
                            } else {
                                text = xmlDoc.createTextNode("");
                            }
                            var attrNode = xmlDoc.createElement(key);
                            attrNode.appendChild(text);
                            featureNode.appendChild(attrNode);
                        }
                    }
                    layerNode.appendChild(featureNode);
                    xmlDoc.documentElement.appendChild(layerNode);
                    return xmlDoc;
                } catch (exception) {
                    GV.util.log(exception, 2);
                }
            }

            // trasformo xml in html applicando xslt
            function xslTransform(xmlDoc, xslDoc) {
                try {
                    if (window.XSLTProcessor) {
                        var xsltProcessor = new XSLTProcessor();
                        xsltProcessor.importStylesheet(xslDoc);
                        var transformedDoc = xsltProcessor.transformToDocument(xmlDoc);
                        return (new XMLSerializer()).serializeToString(transformedDoc);
                    } else {
                        return xmlDoc.transformNode(xslDoc);
                    }
                } catch (exception) {
                    GV.util.log(exception, 2);
                }
            }
        }

        function createHtmlPanel(html, configOptions) {
            var width = configOptions.infoWidth || 400,
                height = configOptions.infoHeight || 300;


            var vm = new Vue({
                template: '<gv-iframe-panel v-draggable visible="true" :src="src" :html="html" :height="height" :width="width" :cls="cls" :title="title"></gv-iframe-panel>',
                data: {
                    title: 'Risultato Info',
                    src: null,
                    html: html,
                    width: width,
                    height: height,
                    cls: "gv-info-wms-html"
                },
                mixins: [GV.dynamicAddedComp]
            });

        }

        // apre una panel div con un documento html
        function showPanel(html, url, configOptions) {
            if (html) {
                createHtmlPanel(html, configOptions)
            } else {
                //TODO
                // 1 - faccio request dell'html
                // 2 - sostituisco variabile con valore - prerequisito: deve esistere un attributo con nome uguale alla variabile
                // es: se infoUrl e' http://pippo/pluto.asp?id=${gid} deve esistere attributo "gid" in attributes della feature
                // var infoUrl = OpenLayers.String.format(configOptions.infoUrl, data.attributes);
                // 3 - creo il pannello html
                //createHtmlPanel (html, configOptions)
            }
        }

        function openPopup(html, url, options) {
            var width = options.infoWidth || 400,
                height = options.infoHeight || 500,
                popup = window.open(url, null, "status=yes, toolbar=yes, menubar=no, width=" + width + ", height=" + height + ", resizable=yes, scrollbars=yes");

            popup.document.open();
            popup.document.write(html);
            popup.document.close();
            popup.focus();
        }

        var url = _buildWFSUrl(feature);

        Vue.http.get(url).then(function (response) {
            var layer = GV.map.getLayerByName('InfoWmsHilite');
            if (response.data.features && response.data.features[0] && response.data.features[0].geometry) {
                layer.clearLayers();
                layer.addData(response.data.features[0].geometry);
                GV.map.fitBounds(layer.getBounds(), {maxZoom: 15});
                GV.map._container.style.cursor = "default";
            }
        }, function (error) {
            GV.util.log(error,2);
        });
    }


    function _buildWFSUrl(attr) {
        var wsName = "M" + attr.layer.config.idMap;
        var baseUrl = attr.layer.config.wfsParams.url.replace("/" + wsName, "");
        var idAttr = attr.layer.config.infoOptions.infoIdAttr;
        var url = GV.globals.DEFAULT_PROXY;
        url += baseUrl + "service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson";
        url += "&typeName=" + wsName + ":" + attr.layer.config.wfsParams.typeName + "&cql_filter=" + idAttr + "=" + attr.properties[idAttr] + "";
        return url;
    }

    return {
        activate: function () {
            GV.util.log('GV.app.infoWmsManager.activate');
            // Aggiungo layer per evidenziazione
            GV.map.loadLayers([{
                name: 'InfoWmsHilite',
                type: 'JSON',
                style: {
                    "color": "#ffcc00",
                    "fillOpacity": 0,
                    "weight": 6,
                    "opacity": 0.6
                },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        "radius": 8,
                        "color": "#ffcc00",
                        "fillColor": "#ffcc00",
                        "fill": true,
                        "fillOpacity": 0.6,
                        "weight": 6,
                        "opacity": 0.6
                    });
                },
                visible: true
            }]);
            // Attivo evento click
            GV.map.on('click', _request);
        },

        deactivate: function () {
            GV.map.off('click');
        },

        showFeatureInfo: _showFeatureInfo
    };
}());
