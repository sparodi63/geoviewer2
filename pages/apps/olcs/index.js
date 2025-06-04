// http://ld-paordi-m.ld.ge/geoservices/apps/viewer/pages/apps/olcs/?id=5

var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'olcs-gv2',
    mapOptions: {
      type: 'openlayers',
      ol3d: true,
      enable3d: true,
      click: 'info',
      restrictedExtent: '830036,5402959,1123018,5597635',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
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
          name: 'gv-geocoder',
          position: 'topleft',
        },
        {
          name: 'gv-switch3D-button',
          position: 'topleft',
        },
        {
          name: 'gv-help3D-button',
          position: 'topleft',
          options: {
            showOnStart: true
          }
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
    },
    {
      type: 'RL_ORTOFOTO_2019',
      visible: true,
    },
    {
      type: 'RL_ORTOFOTO_2013',
    },
    {
      type: 'RL_ORTOFOTO_2010',
    },
    {
      type: 'RL_ORTOFOTO_2007',
    },
    {
      type: 'RL_ORTOFOTO_2000',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'RL_CARTE_BASE_NC25',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
