console.log('session', GV.globals.SESSION.ID);

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
        // { name: 'gv-measure-button' },
        // { name: 'gv-print-button' },
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
  // maps: [
  //   {
  //     id: 0,
  //     name: 'Difesa Suolo Foto',
  //     layers: [
  //       {
  //         type: 'JSON',
  //         dataType: 'json',
  //         name: 'foto_validate',
  //         visible: true,
  //         geomSubType: 'POINT',
  //         url:
  //           'https://geoservizi.regione.liguria.it/geoserver/M2493/ogc/features/collections/L9643/items?f=application%2Fjson&limit=5000',
  //         legend: {
  //           label: `Foto Validate`,
  //           icon: `/geoservices/apps/viewer/static/img/cultura/legend/Foto.png`,
  //         },
  //         onFeatureSelect: onFeatureSelect,
  //         filter: function(feature) {
  //           return (
  //             feature.properties['session'] !== GV.globals.SESSION.ID && feature.properties['validato']
  //           );
  //         },
  //         pointToLayer: (feature, latlng) => {
  //           let fillColor = '#00ff00';
  //           let color = '#000000';
  //           const style = {
  //             color: color,
  //             fillColor: fillColor,
  //             fillOpacity: 1,
  //             fill: true,
  //             weight: 2,
  //             radius: 5,
  //           };
  //           return L.circleMarker(latlng, style);
  //         },
  //       },
  //       {
  //         type: 'JSON',
  //         dataType: 'json',
  //         name: 'foto_non_validate',
  //         visible: true,
  //         geomSubType: 'POINT',
  //         url:
  //           'https://geoservizi.regione.liguria.it/geoserver/M2493/ogc/features/collections/L9643/items?f=application%2Fjson&limit=5000',
  //         legend: {
  //           label: `Foto Non Validate`,
  //           icon: `/geoservices/apps/viewer/static/img/cultura/legend/Foto.png`,
  //         },
  //         onFeatureSelect: onFeatureSelect,
  //         filter: function(feature) {
  //           return (
  //             feature.properties['session'] !== GV.globals.SESSION.ID &&
  //             !feature.properties['validato']
  //           );
  //         },
  //         pointToLayer: (feature, latlng) => {
  //           let fillColor = '#ff0000';
  //           let color = '#000000';
  //           const style = {
  //             color: color,
  //             fillColor: fillColor,
  //             fillOpacity: 1,
  //             fill: true,
  //             weight: 2,
  //             radius: 5,
  //           };
  //           return L.circleMarker(latlng, style);
  //         },
  //       },
  //     ],
  //   },
  // ],
});
