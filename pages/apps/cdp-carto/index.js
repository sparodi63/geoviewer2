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
        ],
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
  });
}

async function submit(data, loading) {
  console.log('submit');
}

// -------------

init();
