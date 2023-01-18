GV.init({
  debug: true,
  idMap: null, // 2213
  application: {
    name: 'rete-qualita-aria-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          dontShowMapCatalogPanelOnStart: true,
          showInfoMap: true,
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
        // { name: 'gv-measure-button' },
        // { name: 'gv-print-button' },
        {
          name: 'rqa-livelli',
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_GRAY',
      visible: true,
    },
    {
      type: 'ESRI_IMAGERY',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
