var id = GV.utils.getUrlParam('id')

//GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/'
// GV.globals.RL_DYN_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/map/'
// GV.globals.RL_CREATE_SLD_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/create_sld/'
// GV.globals.RL_XSL_INFO_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/xsl_info_service?'
// GV.globals.RL_CATALOG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/catalogo/'
// GV.globals.RL_CANALI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/ag_app_canali_tree/'
// GV.globals.RL_SCHEDA_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/scheda/'
// GV.globals.RL_ENTI_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/enti/'

GV.globals.RL_TRANSFORM_POINT_SERVICE = '/geoservices/apps/proxy/proxy.jsp?url=http://srvcarto.regione.liguria.it/geoservices/REST/coordinate/transform_point/'

//?id=56&FIND_MAP=56&FIND_FIELDS=cod_prov&FIND_VALUES=010
//var findOptions = GV.utils.buildFindOptionsFromQueryStringParams()
var findOptions = null



GV.init({
    debug: true,
    idMap: id,
    findOptions: findOptions,
    // geoserverUrl: 'http://geoservizi.regione.liguria.it:8081/',
    application: {
        name: 'geoportale',
        mapOptions: {
            type: 'leaflet',
            // click: 'coordinate',
            // click: 'info',
        },
        layout: {
            // header: {
            //   height: '100px',
            //   html: "<div class='gv-color-scheme'>HEADER </div>",
            // },
            legend: {
                options: {
                    showAddMap: true,
                    showInfoMap: true,
                    showLayersTransparency: true,
                    showBaseLayerSwitcher: true,
                    useDownloadPanel: true,
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
                            },
                            wms: {
                                label: 'Servizi WMS',
                            },
                            kml: {
                                label: 'KML/GPX/JSON',
                            },
                        },
                        activePanel: 'repertorio',
                    },
                },
            },
            tools: [
                { name: 'gv-geocoder' },
                { name: 'gv-info-button', active: true },
                { name: 'gv-add-map-button' },
                {
                    name: 'gv-coordinate-button',
                    options: {
                        projection: 'EPSG:3003',
                        submit(x, y) {
                            console.log('submit')
                            console.log(x)
                            console.log(y)
                        },
                        cancel() {
                            console.log('cancel')
                        },
                    },
                },
                { name: 'gv-layer-search-button' },
                { name: 'gv-scalebar', position: 'bottomleft' },
            ],
        },
        callback: function(app) {},
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