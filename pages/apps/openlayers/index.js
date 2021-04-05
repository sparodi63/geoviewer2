var id = GV.utils.getUrlParam('id');

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'openlayers-gv2',
    mapOptions: {
      type: 'openlayers',
      click: 'info',
      // restrictedExtent: '830036,5402959,1123018,5597635',
    },
    callback: function() {
      // console.log('CALLBACK!!!');
      // GV.config.addMapConfig(mapConfig);
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
        // { name: 'gv-info-button', active: true },
        // { name: 'gv-measure-button' },
        // { name: 'gv-layer-search-topo-button' },
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

const mapConfig = {
  id: 0,
  name: 'streets',
  layers: [
    {
      type: 'MBS',
      url: 'https://geoservizi.regione.liguria.it/tileserver-gl/styles/streets/style.json',
      visible: true,
      legend: {
        label: 'Streets',
        icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
      },
    },
  ],
};
