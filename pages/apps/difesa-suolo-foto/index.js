function onFeatureSelect(feature) {
  const div = document.getElementById('gv-difesa-suolo-foto-info');
  if (div) div.remove();
  GV.mount({
    elId: 'gv-difesa-suolo-foto-info',
    toggleEl: true,
    template: `<gv-difesa-suolo-foto-info :properties="properties" ></gv-difesa-suolo-foto-info>`,
    data: {
      properties: feature.properties,
    },
  });
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 19);
}

var auth = {
  type: 'NAM',
  options: {
    ruolo: 'DIFESA_SUOLO_FOTO',
  },
};

GV.init({
  debug: true,
  idMap: null, // 2213
  application: {
    name: 'difesa-suolo-foto-gv2',
    auth: auth,
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
        {
          name: 'difesa-suolo-foto',
        },
      ],
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
