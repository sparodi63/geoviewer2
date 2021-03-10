var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'sfondi-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
        },
      },
      tools: [
        {
          name: 'gv-geocoder-pelias',
          position: 'topleft',
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'TS_STREETS',
      visible: true,
    },
    {
      type: 'TS_MONOCHROME',
    },
    {
      type: 'TS_DARK_MATTER',
    },
    {
      type: 'TS_POSITRON',
    },
    {
      type: 'TS_TONER',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
