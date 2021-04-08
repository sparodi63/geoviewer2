var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'openlayers-gv2',
    mapOptions: {
      type: 'openlayers',
      click: 'info',
      // center: [9.228687, 44.335759],
      // zoom: 12,
      // restrictedExtent: '830036,5402959,1123018,5597635',
    },
    callback: function() {
      // GV.app.map.zoomToBound(
      //   '1039849.332791538,5465171.085361816,1139523.2176754079,5534499.470016474',
      //   '3003',
      //   null
      // );
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
          name: 'gv-geocoder',
          position: 'topleft',
        },
        // {
        //   name: 'gv-coordinate-button',
        //   options: {
        //     projection: 'EPSG:3003',
        //     submit: function(x, y) {
        //       conferma(x, y, 'OK');
        //     },
        //     cancel: function() {
        //       conferma(null, null, 'KO');
        //     },
        //     active: true,
        //   },
        // },
        // { name: 'gv-info-button', active: true },
        // { name: 'gv-measure-button' },
        { name: 'gv-layer-search-button' },
        // { name: 'gv-ricerca-particella-button' },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    // {
    //   type: 'MBS_STREETS',
    //   visible: true,
    // },
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'RL_ORTOFOTO_2016',
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

function conferma(x, y, esito) {
  console.log(x, y);
}
