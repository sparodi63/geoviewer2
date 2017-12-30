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
              wms: {
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
          },
        },
      },
      // tools: [
      //   {
      //     position: 'topleft',
      //     items: [{ name: 'geocoder' }],
      //   },
      //   {
      //     position: 'bottomright',
      //     items: [{ name: 'zoom' }],
      //   },
      //   {
      //     position: 'bottomleft',
      //     items: [{ name: 'scalebar' }],
      //   },
      // ],
      tools: [
        { name: 'gv-geocoder' , position: 'topleft'},
        { name: 'gv-scalebar', position: 'bottomleft'}
      ],
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
