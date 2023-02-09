if (window.addEventListener) {
  window.addEventListener('message', onMessage, false);
} else if (window.attachEvent) {
  window.attachEvent('onmessage', onMessage, false);
}

function onMessage(event) {
  if (event.data.message == 'load') {
    GV.app.tools.draw.addLayerFeatures(null, event.data.geojson);
  }
}

function onReady() {
  window.parent.postMessage({ message: 'carto-ready' }, '*');
}

// -------------

function init() {
  const idMap = 'D66';
  const idLayer = 'L6422';
  const field = 'CODICE_COMUNE';
  const value = GV.utils.getUrlParam('comune');

  const findOptions = value
    ? {
        layers: [idLayer],
        cqlFilter: field + "='" + value + "'",
      }
    : null;

  GV.init({
    debug: true,
    idMap: idMap,
    findOptions: findOptions,
    application: {
      name: 'cdp-carto-gv2',
      mapOptions: {
        type: 'openlayers',
      },
      layout: {
        legend: {
          options: {
            show: true,
            collapsed: true,
            showAddMap: true,
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
        tools: [
          {
            name: 'gv-geocoder',
            position: 'topleft',
          },
          {
            name: 'gv-scalebar',
            position: 'bottomleft',
          },
          {
            name: 'gv-draw-button',
            active: true,
            options: {
              idLayer: idLayer,
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
                cancel: true,
                refresh: false,
              },
              color: '#FF9900',
              multiGeom: true,
              epsg: '4326',
              submit: function(data, deleted, loading, refresh) {
                submit(data, loading);
              },
              cancel: function() {
                window.parent.postMessage({ message: 'carto-response', esito: 'CANCEL' }, '*');
                if (loading) loading.close();
              },
            },
          },
        ],
      },
      callback: onReady,
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
  });
}

async function submit(data, loading) {
  let geojson = await transformGeoJSON(data);
  window.parent.postMessage({ message: 'carto-response', geojson: geojson, esito: 'OK' }, '*');
  if (loading) loading.close();
}

async function transformGeoJSON(geoJson) {
  const response = await fetch('/geoservices/REST/coordinate/transform_geojson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      geoJSON: geoJson,
      srsIn: '3857',
      srsOut: '4326',
    }),
  });
  const data = await response.json();
  return data.geoJSON;
}

// -------------

init();
