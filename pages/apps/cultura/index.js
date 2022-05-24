
fetch(`/geoservices/data/cultura/config.json`)
  .then(response => response.json())
  .then(data => {
    GV.globals.CULTURA_CONFIG = data
    GV.globals.CULTURA_CONFIG.filter = getFilter()
    init(getMapConfig(data.raggruppamenti))
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error);
  });

function getFilter() {
  return {
    raggruppamento: (GV.utils.getUrlParam('RAGGRUPPAMENTO')) ? parseInt(GV.utils.getUrlParam('RAGGRUPPAMENTO')): 0,
    categoria: (GV.utils.getUrlParam('CATEGORIA')) ? parseInt(GV.utils.getUrlParam('CATEGORIA')): 0,
    provincia: (GV.utils.getUrlParam('PROVINCIA')) ? parseInt(GV.utils.getUrlParam('PROVINCIA')): 0,
    comune: (GV.utils.getUrlParam('COMUNE')) ? parseInt(GV.utils.getUrlParam('COMUNE')): 0,
    itinerario: (GV.utils.getUrlParam('ITINERARIO')) ? parseInt(GV.utils.getUrlParam('ITINERARIO')): 0,
  }
}

function onFeatureSelect(feature) {
  const div = document.getElementById('gv-cultura-info')
  if (div) div.remove()
  GV.mount({
    elId: 'gv-cultura-info',
    toggleEl: true,
    template: `<gv-cultura-info :properties="properties" ></gv-cultura-info>`,
    data: {
      properties: feature.properties
    },
  });
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
}

// function getClassesCat(rg) {
//   return rg.categorie.map(cat => {
//     return {
//       name: `${cat.id}`,
//       filter: {
//         key: 'CATOID',
//         value: cat.id,
//       },
//       style: {
//         // TODO: ripristinare icone di dettaglio
//         iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
//         // iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${cat.id}.png`,
//         iconSize: [32, 37],
//         iconAnchor: [16, 37],
//         popupAnchor: [0, -37],
//       },
//     }
//   })
// }

// function getClasses(rg) {
//   return [
//     {
//       name: rg.id,
//       filter: {
//         key: "RAGGRUPPAMENTO",
//         value: rg.id,
//       },
//       style: {
//         iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
//         iconSize: [32, 37],
//         iconAnchor: [16, 37],
//         popupAnchor: [0, -37],
//       },
//     },
//   ]
// } 

function getMapConfig(config) {
  // console.log('config',config)
  GV.globals.CULTURA_LAYERS = config.map(rg => {
    // const classes = getClasses(rg)
    // const classes = getClassesCat(rg)
    return {
      type: 'JSON',
      dataType: 'json',
      cluster: {
        options: {
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              html: '<div><span>' + cluster.getChildCount() + '</span></div>',
              className: 'marker-cluster marker-cluster-1',
              iconSize: new L.Point(40, 40),
            });
          },
          maxClusterRadius: 80,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true
        },
      },
      name: `${rg.id}`,
      visible: true,
      geomSubType: 'POINT',
      // url: `/geoservices/data/cultura/${rg.id}.json`,
      data: rg.data,
      legend: {
        label: rg.raggruppamento,
        icon: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
      },
      tooltip: '{NOME}',
      onFeatureSelect: onFeatureSelect,
      // classes: classes,
      pointToLayer: function(feature, latlng) {
        const icon = L.icon({
          // iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${feature.properties.CATOID}.png`,
          iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
        return L.marker(latlng, {
          icon: icon,
        });
      }
    }
  })

  const maps = [
    {
      id: 0,
      name: 'Cultura',
      layers: GV.globals.CULTURA_LAYERS,
    },
  ];
  return maps
}

function init(maps) {
  GV.init({
    debug: true,
    application: {
      mapOptions: {
        type: 'leaflet',
        maxZoom: 19,
      },
      layout: {
        title: ' ',
        tools: [
          {
            name: 'gv-cultura-legend',
            position: 'topright',
            options: {
              maps: maps,
              version: 2,
            },
          },
        ],
      },
    },
    baseLayers: [
      {
        type: 'OSM',
        visible: true,
      },
    ],
    maps: [],
  });
}



