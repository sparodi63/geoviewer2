var id = GV.utils.getUrlParam('id')

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'http://geoservizi.regione.liguria.it:8081/',
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
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
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
            },
            activePanel: 'repertorio',
          },
        },
      },
      toolbar: [
        {
          position: 'topleft',
          items: [
            {
              name: 'geocoder',
              options: {
                // autoClick: false,
                type: 'control',
                vueComponent: {
                  id: 'gv-geocoder',
                  toggleEl: false
                },
              },
            },
          ],
        },
        {
          position: 'bottomright',
          items: [{ name: 'zoom' }],
        },
        {
          position: 'bottomleft',
          items: [
            {
              name: 'scalebar',
              options: {
                type: 'control',
                vueComponent: {
                  id: 'gv-scalebar',
                  toggleEl: false
                },
              },
            },
          ],
        },
      ],
    },
    callback: function(app) {
//      console.log(app)
    },
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
