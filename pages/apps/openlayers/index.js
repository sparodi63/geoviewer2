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
        { name: 'gv-info-button', active: true },
        { name: 'gv-measure-button' },
        // { name: 'gv-layer-search-topo-button' },
        // { name: 'gv-ricerca-particella-button' },
        { name: 'gv-ricerca-catastale-button' },
        {
          name: 'gv-draw-button',
          active: false,
          options: {
            tools: {
              draw: {
                point: true,
                polyline: true,
                polygon: true,
              },
              edit: {
                edit: true,
                remove: true,
              },
            },
            buttons: {
              submit: true,
              cancel: false,
              refresh: true,
            },
            color: '#FF9900',
            multiGeom: true,
            epsg: '3003',
            initWfsRequests: getInitWfsRequests(),
            submit: function(data, deleted, loading, refresh) {
              console.log('submit', data, deleted);
              fetch('/geoservices/REST/coordinate/transform_geojson', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  geoJSON: data,
                  srsIn: '3857',
                  srsOut: '3003',
                }),
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                });

              if (refresh) refresh();
              if (loading) loading.close();
            },
            cancel: function() {},
          },
        },
        { name: 'gv-print-button' },
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

function getInitWfsRequests() {
  return [
    {
      wfsURL:
        "https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=L7240&cql_filter=CODICE_PRATICA='GVI06559'",
    },
  ];
}
