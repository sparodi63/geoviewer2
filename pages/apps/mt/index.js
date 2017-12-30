var id = GV.utils.getUrlParam('id')

GV.init({
    debug: true,
    idMap: id,
    application: {
        name: 'geoportale',
        mapOptions: {
            click: 'info',
        },
        layout: {
            legend: {
                options: {
                    show: true,
                    showAddMap: true,
                    showInfoMap: true,
                    showLayersTransparency: true,
                    showBaseLayerSwitcher: true,
                    addMapConfig: {
                        panels: {
                            repertorio: {
                                type: 'tree',
                                name: 'repertorio',
                                label: 'Repertorio Cartografico',
                                options: {
                                    treeServiceUrl: 'http://srvcarto.regione.liguria.it/geoservices/REST/config/catalog/',
                                },
                                tree: null,
                            },
                            canali: {
                                type: 'tree',
                                name: 'canali',
                                label: 'Canali Tematici',
                                options: {
                                    applicazione: 'ECO3',
                                    tematici: 'SI',
                                },
                                tree: null,
                            }
                        },
                        activePanel: 'repertorio',
                    },
                },
            },
            tools: [{
                    position: 'topleft',
                    items: [{ name: 'geocoder' }],
                },
                {
                    position: 'bottomright',
                    items: [{ name: 'zoom' }],
                },
                {
                    position: 'bottomleft',
                    items: [{ name: 'scalebar' }],
                },
            ],
        }
    },
    baseLayers: [
        { type: 'ESRI_IMAGERY', visible: true },
        { type: 'MAPBOX_STREETS' },
        { type: 'RL_ORTOFOTO_2016' },
        { type: 'RL_CARTE_BASE' },
        { type: 'BLANK' },
    ],
    maps: [],
})