// -------------

const id = GV.utils.getUrlParam('id');

let baseUrl = '/geoservices/REST/cdp-carto/istanza/';
if (id) {
  const url = `${baseUrl}${id}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      setConfig(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
} else {
  console.warn('ID ISTANZA NON PRESENTE');
}

function setConfig(data) {
  console.log(data);
  const lista_geom = data.data.lista_geom;
  console.log(lista_geom);

  init(lista_geom);
}

async function submit(data, loading) {
  const url = `${baseUrl}${id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nel servizio di BE');
      }
      console.log('Dati salvati correttamente');
    })
    .catch(error => {
      console.error(error);
      if (loading) loading.close();
    });
  if (loading) loading.close();
}

function init(lista_geom) {
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
              wkt: lista_geom,
              formatOut: 'WKT',
              submit: function(data, deleted, loading, refresh) {
                // console.log('submit', data);
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

// -------------
