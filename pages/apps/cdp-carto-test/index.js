// -------------

function init() {
  const idMap = 'D66';
  const idLayer = 'L6422';

  GV.init({
    debug: true,
    idMap: idMap,
    findOptions: null,
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
              idLayer: null,
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
                refresh: true,
              },
              color: '#FF9900',
              multiGeom: true,
              epsg: '4326',
              epsgOut: '4326',
              formatOut: 'WKT',
              vertexEditor: true,
              submit: function(data, deleted, loading, refresh) {
                console.log(data);
                if (loading) loading.close();
                submit(data, loading);
              },
              cancel: function() {
                console.log('cancel');
              },
            },
          },
        ],
      },
      callback: null,
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

async function sumbit(data, loading) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// -------------

init();
