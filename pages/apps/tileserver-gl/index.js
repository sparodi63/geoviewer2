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
          showAddMap: true,
          dontShowMapCatalogPanelOnStart: true,
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
      type: 'TS_BASIC',
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
