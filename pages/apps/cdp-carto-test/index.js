const id = GV.utils.getUrlParam('id');

// console.log(id);

if (window.addEventListener) {
  window.addEventListener('message', onMessage, false);
} else if (window.attachEvent) {
  window.attachEvent('onmessage', onMessage, false);
}

function onMessage(event) {
  if (event.data.message === `load-${id}`) {
    console.log(event.data.message);
    GV.app.tools.draw.addLayerFeatures(event.data.geom, 'geojson');
  }
}

function onReady() {
  window.parent.postMessage({ message: `carto-ready-${id}` }, '*');
}

// INZIALIZZAZIONE CARTOGRAFIA
GV.init({
  debug: true,
  idMap: 'D66',
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
              refresh: false,
            },
            color: '#FF9900',
            multiGeom: true,
            epsg: '4326',
            epsgOut: '4326',
            noConfirm: true,
            submit: (data, deleted, loading, refresh) => {
              console.log('submit');
              if (loading) loading.close();
              const geom = {
                features: data.features,
              };
              window.parent.postMessage(
                { message: `carto-response-${id}`, esito: 'OK', geom: geom },
                '*'
              );
            },
            cancel: () => {
              console.log('cancel');
              window.parent.postMessage({ message: `carto-response-${id}`, esito: 'KO' }, '*');
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
