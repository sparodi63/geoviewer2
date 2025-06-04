let tools = [
  // {
  //   name: 'gv-insert-point-button',
  // },
  // {
  //   name: 'gv-help-button',
  //   options: {
  //     URL:
  //       'https://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/cdu/MANUALE_WEBGIS.pdf',
  //   },
  // },
  {
    name: 'libioss-specie',
  },
];

GV.init({
  debug: true,
  idMap: null, // 2213
  application: {
    name: 'libioss-specie-gv2',
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
          noDeleteButton: true,
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
      tools: tools,
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'ESRI_GRAY',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
