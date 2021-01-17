var id = 1568;

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'geoportale-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: true,
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
        },
        {
          name: 'gv-info-button',
          active: true,
        },
        {
          name: 'gv-measure-button',
        },
        {
          name: 'gv-layer-search-button',
        },
        {
          name: 'gv-ricerca-particella-button',
        },
        {
          name: 'gv-print-button',
        },
        // { name: 'gv-download-totale-button' },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
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
      type: 'MAPBOX_STREETS',
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2016',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
