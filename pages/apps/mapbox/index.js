var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'marketing-territoriale-gv2',
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
          position: 'topleft',
          items: [
            {
              name: 'geocoder',
            },
          ],
        },
        {
          position: 'bottomright',
          items: [
            {
              name: 'zoom',
            },
          ],
        },
        {
          position: 'bottomleft',
          items: [
            {
              name: 'scalebar',
            },
          ],
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'OSM',
      visible: true,
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
