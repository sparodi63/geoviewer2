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
          showInfoMap: false,
          showLayersTransparency: true,
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
          name: 'rqa-livelli',
        },
        // { name: 'gv-geocoder', position: 'bottomleft' },
      ],
    },
  },
  baseLayers: [
    {
      type: 'MAPBOX_MONOCHROME',
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
