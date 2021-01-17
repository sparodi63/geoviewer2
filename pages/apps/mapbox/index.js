var id = GV.utils.getUrlParam('id');

var callback = function(config) {
  var layerConfig = {
    id: 'MAPBOX',
    name: 'Test Mapbox Custom',
    layers: [
      {
        type: 'MAPBOX',
        name: 'MAPBOX_VIABILITA',
        flagBaseVectorLayer: false,
        id: 'MAPBOX',
        idMap: 'MAPBOX',
        visible: false,
        mapboxConfig: {
          style: 'cjo442ih3407m2slfdwc1hib5',
          userName: 'liguriadigitale',
          accessToken:
            'pk.eyJ1IjoibGlndXJpYWRpZ2l0YWxlIiwiYSI6ImNqbzQzajk0bDEwa3EzcWt1ZThqazFqcGIifQ.dUhSMka7mXTD2inJGmlBMw',
        },
        legend: {
          icon: '/geoviewer/img/legend/classi.gif',
          label: 'Carta della Viabilità',
        },
      },
      {
        type: 'MAPBOX',
        name: 'MAPBOX_VIABILITA_SATELLITARE',
        flagBaseVectorLayer: false,
        id: 'MAPBOX',
        idMap: 'MAPBOX',
        visible: true,
        mapboxConfig: {
          style: 'cjo43w54x00di2spieg5itsgf',
          userName: 'liguriadigitale',
          accessToken:
            'pk.eyJ1IjoibGlndXJpYWRpZ2l0YWxlIiwiYSI6ImNqbzQzajk0bDEwa3EzcWt1ZThqazFqcGIifQ.dUhSMka7mXTD2inJGmlBMw',
        },
        legend: {
          icon: '/geoviewer/img/legend/classi.gif',
          label: 'Carta satellitare della Viabilità',
        },
      },
    ],
  };
  // GV.config.addMapConfig(layerConfig)
};

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
          name: 'gv-geocoder',
          position: 'topleft',
        },
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
    callback: callback,
  },
  baseLayers: [
    {
      type: 'MAPBOX_STREETS',
      visible: true,
    },
    {
      type: 'MAPBOX_VIABILITA',
    },
    {
      type: 'MAPBOX_VIABILITA_SATELLITARE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
