GV.init({
    debug: true,
    application: {
        layout: {
            controls: [],
            toolbar: [
                {
                    position: "bottomright",
                    items: [
                        {name: "zoom"}
                    ]
                }
            ]
        },
        callback: function (app) {
            app.addButton({
                name: "search",
                options: {
                    layers: ["toponimi"],
                    propertyName: 'toponimo',
                    textPlaceholder: 'Ricerca...',
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
        }
    },
    baseLayers: [
        { 'type': "MAPBOX_LIGHT", visible: true }
    ],
    maps: [
        {
            id: 100001,
            name: "Toponimi",
            layers: [
                {
                    type: 'JSON',
                    dataType: 'json',
                    cluster: {
                        options: {
                            showCoverageOnHover: false,
                            maxClusterRadius: 50
                        }
                    },
                    name: 'toponimi',
                    visible: true,
                    geomSubType: 'POINT',
                    esParams: {
                        url: 'http://bv8prod1.datasiel.net:9200/repcarto_pub/toponimo/_search',
                        field: 'toponimo',
                        query: (decodeURIComponent(GV.utils.getUrlParam('q')) === "null") ? "*" : "*" + decodeURIComponent(GV.utils.getUrlParam('q')) + "*"
                    },
                    legend: {
                        label: 'Toponimi'
                    },
                    tooltip: '{toponimo}',
                    popup: '<p><b>{toponimo}</b></p><p>{comune}</p>',
                    classes: [
                        {
                            name: "toponimi",
                            style: {
                                iconUrl: 'default-small'
                            }
                        }
                    ]
                }
            ]
        }

    ]
});

