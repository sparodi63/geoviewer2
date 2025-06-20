const idMap = GV.utils.getUrlParam('id_map');
// const idLayer = GV.utils.getUrlParam('id_layer');
// const env = GV.utils.getUrlParam('env') || 'test';



// http://localhost:8081/?id_map=2&id_layer=499&env=test

// const geoserverUrl = '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net:8080/';
const geoserverUrl =
  '/geoservices/REST/proxy/proxy?url=http://geoservizi-gest-test.regione.liguria.it:8081/';

if (idMap) {
  // loadConfig();
  fetch(`/geoservices/REST/config/map/${idMap}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const layers = data.data.layers.filter(
          layer => layer.idMap == idMap && layer.geomType === 'RASTER'
        );
        if (layers[0]) {
          const idLayer = layers[0].id;
          loadConfig(idLayer);
        } else {
          throw 'Layer Raster non trovato';
        }
      } else {
        throw data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
} else {
  console.error('PARAMETRO id_map ASSENTE');
}

function loadConfig(idLayer) {
  const initWfsRequest = [
    {
      wfsURL: `https://srvcarto2svil.regione.liguria.it/geoservices/REST/geoserver/raster_footprint2/?id_layer=${idLayer}`,
    },
  ];
  let tools = [
    {
      name: 'gv-geocoder',
    },
    {
      name: 'gv-scalebar',
      position: 'bottomleft',
    },
    {
      name: 'gv-draw-button',
      active: false,
      options: {
        idLayer: idLayer,
        tools: {
          draw: {
            polygon: true,
          },
          edit: {
            edit: true,
            remove: true,
          },
        },
        buttons: {
          submit: true,
          refresh: true,
        },
        color: '#FF9900',
        multiGeom: true,
        epsg: '3003',
        initWfsRequests: initWfsRequest,
        submit: function(data, deleted, loading, refresh) {
          console.log('submit', data, deleted);

          fetch('/geoservices/REST/geoserver/raster_footprint2', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              geoJSON: data,
              deleted: deleted,
              idLayer: idLayer,
              // env: env,
              srsIn: '3857',
              srsOut: '3003',
            }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert(data.message);
                if (refresh) refresh();
                if (loading) loading.close();
              } else {
              }
            })
            .catch(error => {
              alert(error);
              if (refresh) refresh();
              if (loading) loading.close();
            });
        },
        cancel: function() {
          if (refresh) refresh();
          if (loading) loading.close();
        },
      },
    },
  ];

  // tools.push(getDrawTool());
  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    application: {
      name: 'geoserver-set-layer-footprint',
      mapOptions: {
        type: 'openlayers',
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
        type: 'OSM',
      },
      {
        type: 'RL_ORTOFOTO_2019',
      },
      {
        type: 'RL_CARTE_BASE',
      },
      {
        type: 'BLANK',
      },
    ],
    maps: [],
  };

  GV.init(conf);
}
