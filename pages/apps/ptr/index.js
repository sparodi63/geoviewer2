var id = 1568

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'http://10.20.4.120:8081/',
  application: {
    name: 'ptr-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
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
      tools: [{
          name: 'gv-geocoder'
        },
        {
          name: 'gv-info-button',
          active: true
        },
        {
          name: 'gv-measure-button'
        },
        {
          name: 'gv-layer-search-button'
        },
        {
          name: 'gv-ricerca-particella-button'
        },
        {
          name: 'gv-print-button'
        },
        // { name: 'gv-download-totale-button' },
        {
          name: 'gv-scalebar',
          position: 'bottomleft'
        },
      ],
    },
  },
  baseLayers: [{
      type: 'ESRI_IMAGERY',
      visible: true
    },
    {
      type: 'OSM'
    },
    {
      type: 'RL_ORTOFOTO_2019'
    },
    {
      type: 'RL_CARTE_BASE'
    },
    {
      type: 'BLANK'
    },
  ],
  maps: [],
})
