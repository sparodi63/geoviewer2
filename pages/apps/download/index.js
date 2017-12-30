var id = GV.utils.getUrlParam('id')

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'download',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          showBaseLayerSwitcher: true,
          useDownloadPanel: true,
          noDeleteButton: true,
          showDownloadPanelOnLoad: true,
          downloadPanelCloseMode: 'closeWindow',
          collapsed: true
        },
      },
      tools: [
        { name: 'gv-geocoder' },
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
