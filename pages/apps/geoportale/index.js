
GV.init({
    debug: true,
    idMap: decodeURIComponent(GV.util.getUrlParam('id')),
    application: {
        mapOptions: {
            controls: [{name: 'scale'}],
            click: 'info'
        },
        layout: {
            title: '{map.title}',
            toolbar: [{
                position: "topleft",
                items: [
                    {name: "fullscreen"},
//                    {name: "geocoder"},
//                    {name: "print"}
                ]
            },
                {
                    position: "topright",
                    items: [{
                        name: "legend",
                        options: {
                            show: true,
                            showAddMap: true,
                            showInfoMap: true
                        }
                    }]
                },
                {
                    position: "bottomright",
                    items: [{
                        name: "locate",
                        options: {
                            drawCircle: false
                        }
                    },
//                        {name: "navbar"},
                        {name: "zoom"}
                    ]
                }
            ]
        },
        callback: function (app) {
            //GV.app.addRlMap(1735);
            //GV.app.addRlMap(5);
            //GV.app.addRlMap(1646);
        }
    },
    baseLayers: [
        {'type': 'ESRI_IMAGERY', visible: true},
        {'type': 'BLANK'}
    ],
    maps: []
});