var id = GV.util.getUrlParam('id') || 56

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
      title: '{map.title}',
      toolbar: [{
        position: 'topleft',
        items: [
          {name: 'fullscreen'}
          //                    {name: 'geocoder'},
          //                    {name: 'print'}
        ]
      },
      {
        position: 'topright',
        items: [{
          name: 'legend',
          options: {
            show: true,
            showAddMap: true,
            showInfoMap: true
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
    }
  },
  baseLayers: [
    {'type': 'ESRI_IMAGERY', visible: true},
    {'type': 'BLANK'}
  ],
  maps: []
})
