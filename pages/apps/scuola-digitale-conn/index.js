

function onFeatureSelect(feature) {
  console.log(feature.properties)
  GV.mount({
    elId: 'gv-scuoladigitale-info-conn',
    clear: true,
    template: `<gv-scuoladigitale-info-conn :properties="properties"></gv-scuoladigitale-info-conn>`,
    data: {
      properties: feature.properties,
    },
  });
  let zoom = GV.app.map.getZoom()
  if (zoom < 15) zoom = 15
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom);
}

GV.globals.SCUOLA_DIGITALE_LAYERS = [
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_8076',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'RTG',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole_conn_L8076.json',
    legend: {
      label: 'Plesso con connessione RTG/senza copertura',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8076.png',
    },
    tooltip: '{ISTITUTO}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8076.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -20],
        },
      },
    ],
  },
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_8075',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'FWA',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole_conn_L8075.json',
    legend: {
      label: 'Plesso con connessione FWA',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8075.png',
    },
    tooltip: '{ISTITUTO}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8075.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -20],
        },
      },
    ],
  },
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_8074',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'ADSL',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole_conn_L8074.json',
    legend: {
      label: 'Plesso con connessione ADSL',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8074.png',
    },
    tooltip: '{ISTITUTO}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8074.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -20],
        },
      },
    ],
  },
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_8073',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'FTTC',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole_conn_L8073.json',
    legend: {
      label: 'Plesso con connessione FTTC',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8073.png',
    },
    tooltip: '{ISTITUTO}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8073.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -20],
        },
      },
    ],
  },
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_8086',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'FTTH',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole_conn_L8086.json',
    legend: {
      label: 'Plesso con connessione FTTH',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8086.png',
    },
    tooltip: '{ISTITUTO}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/L8086.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -20],
        },
      },
    ],
  },


];

const maps = [
  {
    id: 0,
    name: 'Connettività disponibile',
    layers: GV.globals.SCUOLA_DIGITALE_LAYERS,
  },
];

GV.init({
  debug: true,
  idMap: "2223",
  application: {
    mapOptions: {
      type: 'leaflet',
      click: 'info',
      maxZoom: 19,
      noInfoHiliteFeature: true
    },
    layout: {
      title: ' ',
      // legend: {
      //   options: {
      //     show: true,
      //     showBaseLayerSwitcher: true,
      //   },
      // },
      tools: [
        {
          name: 'gv-inner-html',
          position: 'topleft',
          options: {
            props: [
              {
                html: '<div class="gv-color-scheme" id="logo"></div>',
              },
            ],
          },
        },
        {
          name: 'gv-inner-html',
          position: 'bottomleft',
          options: {
            props: [
              {
                html: '<div id="loghi-fesr"></div>',
              },
            ],
          },
        },
        {
          name: 'gv-scuoladigitale-legend',
          position: 'topright',
          options: {
            maps: maps,
            noToggleLayers: true,
            noDeleteButton: true,
            noDownloadButton: true,
            show: true,
            version: 3,
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
