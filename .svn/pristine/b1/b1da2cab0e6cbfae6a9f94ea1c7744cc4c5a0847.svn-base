var infoUrl = 'http://www.cartografiarl.regione.liguria.it/ScuolaDigitale/Info/Info_progetti.asp?codice_scuola={COD_MECC}';
var popupTemplate = '';
popupTemplate += '<p><b>{DENOMINAZIONE}</b></p><p>{INDIRIZZO}  - {CAP} {COMUNE}</p>';
popupTemplate += '<p> <a href=' + infoUrl + ' target="_blank">Elenco progetti innovazione</a> - ';
popupTemplate += '<a href="{SITOWEB}" target="_blank">Sito Scuola</a>  </p>';

GV.init({
    debug: true,
    application: {
        callback: function() {
            GV.app.addButton({
                name: "search",
                options: {
                    layers: ["scuole_01", "scuole_02", "scuole_03", "scuole_04"],
                    propertyName: 'DENOMINAZIONE',
                    textPlaceholder: 'Ricerca scuola...',
                    position: 'topleft',
                    circleLocation: false,
                    collapsed: false,
                    autoCollapse: false,
                    autoResize: false,
                    moveToLocation: function(latlng, title, map) {
                        map.setView(latlng, 16);
                    }
                }
            });
        },
        layout: {
            title: ' ',
            toolbar: [{
                    position: "bottomright",
                    items: [
                        { name: "zoom" }
                    ]
                },
                {
                    position: "topright",
                    items: [{
                        name: "legend",
                        options: {
                            show: true
                        }
                    }]
                }
            ]
        }
    },
    baseLayers: [
        { 'type': "MAPBOX_STREETS", visible: true }
    ],
    maps: [
        {
            id: 100001,
            name: "Scuole",
            layers: [{
                    type: 'JSON',
                    dataType: 'json',
                    cluster: {
                        options: {
                            iconCreateFunction: function(cluster) {
                                return L.divIcon({ html: cluster.getChildCount(), className: 'cluster_01', iconSize: L.point(28, 28) });
                            },
                            showCoverageOnHover: false,
                            maxClusterRadius: 80
                        }
                    },
                    name: 'scuole_01',
                    visible: true,
                    geomSubType: 'POINT',
                    url: '/geoviewer2/data/scuoladigitale/01.json',
                    legend: {
                        label: 'Centro Formazione Adulti',
                        icon: "/geoviewer2/static/img/scuoladigitale/legend/cfa.png"
                    },
                    tooltip: '{DENOMINAZIONE}',
                    popup: popupTemplate,
                    classes: [{
                        name: "TIPO 01",
                        filter: {
                            key: 'TIPO',
                            value: '01'
                        },
                        style: {
                            iconUrl: "/geoviewer2/static/img/scuoladigitale/legend/cfa.png",
                            iconSize: [32, 37],
                            iconAnchor: [16, 37],
                            popupAnchor: [0, -37]
                        }
                    }]
                },
                {
                    type: 'JSON',
                    dataType: 'json',
                    cluster: {
                        options: {
                            iconCreateFunction: function(cluster) {
                                return L.divIcon({ html: cluster.getChildCount(), className: 'cluster_02', iconSize: L.point(28, 28) });
                            },
                            showCoverageOnHover: false,
                            maxClusterRadius: 80
                        }
                    },
                    name: 'scuole_02',
                    visible: true,
                    geomSubType: 'POINT',
                    url: '/geoviewer2/data/scuoladigitale/02.json',
                    legend: {
                        icon: "/geoviewer2/static/img/scuoladigitale/legend/school02.png",
                        label: 'Istruzione Superiore'
                    },
                    tooltip: '{DENOMINAZIONE}',
                    popup: popupTemplate,
                    classes: [{
                        name: "TIPO 02",
                        filter: {
                            key: 'TIPO',
                            value: '02'
                        },
                        style: {
                            iconUrl: "/geoviewer2/static/img/scuoladigitale/legend/school02.png",
                            iconSize: [32, 37],
                            iconAnchor: [16, 37],
                            popupAnchor: [0, -37]
                        }
                    }]
                },
                {
                    type: 'JSON',
                    dataType: 'json',
                    cluster: {
                        options: {
                            iconCreateFunction: function(cluster) {
                                return L.divIcon({ html: cluster.getChildCount(), className: 'cluster_03', iconSize: L.point(28, 28) });
                            },
                            showCoverageOnHover: false,
                            maxClusterRadius: 80
                        }
                    },
                    name: 'scuole_03',
                    visible: true,
                    geomSubType: 'POINT',
                    url: '/geoviewer2/data/scuoladigitale/03.json',
                    legend: {
                        icon: "/geoviewer2/static/img/scuoladigitale/legend/school01.png",
                        label: 'IC :  infanzia, primaria, media'
                    },
                    tooltip: '{DENOMINAZIONE}',
                    popup: popupTemplate,
                    classes: [{
                        name: "TIPO 03",
                        filter: {
                            key: 'TIPO',
                            value: '03'
                        },
                        style: {
                            iconUrl: "/geoviewer2/static/img/scuoladigitale/legend/school01.png",
                            iconSize: [32, 37],
                            iconAnchor: [16, 37],
                            popupAnchor: [0, -37]
                        }
                    }]
                },
                {
                    type: 'JSON',
                    dataType: 'json',
                    cluster: {
                        options: {
                            iconCreateFunction: function(cluster) {
                                return L.divIcon({ html: cluster.getChildCount(), className: 'cluster_04', iconSize: L.point(28, 28) });
                            },
                            showCoverageOnHover: false,
                            maxClusterRadius: 80
                        }
                    },
                    name: 'scuole_04',
                    visible: true,
                    geomSubType: 'POINT',
                    url: '/geoviewer2/data/scuoladigitale/04.json',
                    legend: {
                        icon: "/geoviewer2/static/img/scuoladigitale/legend/school03.png",
                        label: 'Istituti Omnicomprensivi'
                    },
                    tooltip: '{DENOMINAZIONE}',
                    popup: popupTemplate,
                    classes: [{
                        name: "TIPO 04",
                        filter: {
                            key: 'TIPO',
                            value: '04'
                        },
                        style: {
                            iconUrl: "/geoviewer2/static/img/scuoladigitale/legend/school03.png",
                            iconSize: [32, 37],
                            iconAnchor: [16, 37],
                            popupAnchor: [0, -37]
                        }
                    }]
                }
            ]
        }
    ]
});