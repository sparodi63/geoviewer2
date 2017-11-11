var id = GV.getUrlParam('id')

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'http://geoservizi.regione.liguria.it:8081/',
  application: {
    mapOptions: {
      controls: [{name: 'scale'}],
      click: 'info'
    },
    layout: {
      // title: '{map.title}',
      toolbar: [
        {
          position: 'topleft',
          items: [
            {
              name: 'geocoder',
              options: {
                autoClick: true
              }
            }
          ]
        },
        {
          position: 'topright',
          items: [{
            name: 'legend',
            options: {
              show: true,
              showAddMap: true,
              showInfoMap: true,
              showBaseLayerSwitcher: true,
              addMapConfig: {
                /*                panels: [
                 {
                 'type': 'tree',
                 'name': 'repertorio',
                 'label': 'Repertorio Cartografico',
                 'options': {
                 'treeServiceUrl': 'http://srvcarto.regione.liguria.it/geoservices/REST/config/catalog/'
                 },
                 'tree': null
                 },
                 {
                 'type': 'tree',
                 'name': 'canali',
                 'label': 'Canali Tematici',
                 'options': {
                 'treeServiceUrl': 'http://geoportale.regione.liguria.it/geoservices/REST/config/ag_app_canali_tree/ECO3/'
                 },
                 'tree': null
                 }
                 ]*/
                panels: {
                  'repertorio': {
                    'type': 'tree',
                    'name': 'repertorio',
                    'label': 'Repertorio Cartografico',
                    'options': {
                      'treeServiceUrl': 'http://srvcarto.regione.liguria.it/geoservices/REST/config/catalog/'
                    },
                    'tree': null
                  }
/*
                  ,
                  'canali': {
                    'type': 'tree',
                    'name': 'canali',
                    'label': 'Canali Tematici',
                    'options': {
                      'applicazione': 'ECO3',
                      'tematici': 'SI'
                    },
                    'tree': null
                  }
*/
                }
              }
            }
          }]
        },
        {
          position: 'bottomright',
          items: [
            {name: 'zoom'}
          ]
        }
      ]
    },
    callback: function (app) {
      // GV.app.addRlMap(1735)
      // GV.app.addRlMap(5)
      // GV.app.addRlMap(1646)
      // Creo una cache del catalogo mappe da ES
      GV.app.loadCatalog({})
    }
  },
  baseLayers: [
    {'type': 'ESRI_IMAGERY', visible: true},
    {'type': 'MAPBOX_STREETS'},
    {'type': 'BLANK'}
  ],
  maps: []
})

