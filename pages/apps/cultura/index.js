
  fetch(`/geoservices/REST/cultura/getConfig`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        GV.globals.CULTURA_CONFIG = data.config
        const maps = getMapConfig(data.config.raggruppamenti)
        console.log(maps[0].layers)
        init(maps)
      } else {
        throw data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });


function onFeatureSelect(feature) {
  GV.mount({
    elId: 'gv-cultura-info',
    clear: true,
    template: `<gv-cultura-info :properties="properties" ></gv-cultura-info>`,
    data: {
      properties: feature.properties
    },
  });
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
}

function getMapConfig(config) {
  // console.log('config',config)
  GV.globals.CULTURA_LAYERS = config.map(rg => {
    const classes = rg.categorie.map(cat => {
      return {
          name: `${cat.id}`,
          filter: {
            key: 'CATOID',
            value: cat.id,
          },
          style: {
            iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${cat.id}.png`,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
      }
    })

    return {
      type: 'JSON',
      dataType: 'json',
      cluster: {
        options: {
          iconCreateFunction: function(cluster) {
            return L.divIcon({
              html: cluster.getChildCount(),
              className: `cluster_${rg.id}`,
              iconSize: L.point(28, 28),
            });
          },
          showCoverageOnHover: false,
          maxClusterRadius: 80,
        },
      },
      name: `${rg.id}`,
      visible: true,
      geomSubType: 'POINT',
      url: `/geoservices/data/cultura/${rg.id}.json`,
      legend: {
        label: rg.raggruppamento,
        icon: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
      },
      tooltip: '{NOME}',
      onFeatureSelect: onFeatureSelect,
      classes: classes,        
    }
  })

  // GV.globals.CULTURA_LAYERS = [
  //   {
  //     type: 'JSON',
  //     dataType: 'json',
  //     cluster: {
  //       options: {
  //         iconCreateFunction: function(cluster) {
  //           return L.divIcon({
  //             html: cluster.getChildCount(),
  //             className: 'cluster_01',
  //             iconSize: L.point(28, 28),
  //           });
  //         },
  //         showCoverageOnHover: false,
  //         maxClusterRadius: 80,
  //       },
  //     },
  //     name: 'scuole_01',
  //     visible: true,
  //     geomSubType: 'POINT',
  //     url: '/geoservices/data/cultura/1.json',
  //     legend: {
  //       label: 'Centro Formazione Adulti',
  //       icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
  //     },
  //     tooltip: '{NOME}',
  //     onFeatureSelect: onFeatureSelect,
  //     classes: [
  //       {
  //         name: 'TIPO 01',
  //         filter: {
  //           key: 'CATOID',
  //           value: 10691,
  //         },
  //         style: {
  //           iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
  //           iconSize: [32, 37],
  //           iconAnchor: [16, 37],
  //           popupAnchor: [0, -37],
  //         },
  //       },
  //       {
  //         name: 'TIPO 02',
  //         filter: {
  //           key: 'CATOID',
  //           value: 10644,
  //         },
  //         style: {
  //           iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school01.png',
  //           iconSize: [32, 37],
  //           iconAnchor: [16, 37],
  //           popupAnchor: [0, -37],
  //         },
  //       },
  //     ],
  //   },    
  // ]

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
          // {
          //   name: 'gv-inner-html',
          //   position: 'topleft',
          //   options: {
          //     props: [
          //       {
          //         html: '<div class="gv-color-scheme" id="logo"></div>',
          //       },
          //     ],
          //   },
          // },
          // {
          //   name: 'gv-inner-html',
          //   position: 'bottomleft',
          //   options: {
          //     props: [
          //       {
          //         html: '<div id="loghi-fesr"></div>',
          //       },
          //     ],
          //   },
          // },
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



