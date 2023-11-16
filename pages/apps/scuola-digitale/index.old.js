function onFeatureSelect(feature) {
  GV.mount({
    elId: 'gv-scuoladigitale-info',
    clear: true,
    template: `<gv-scuoladigitale-info :id="id" title="INFO SCUOLA"></gv-scuoladigitale-info>`,
    data: {
      id: feature.properties.COD_MECC,
    },
  });
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
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
            className: 'cluster_01',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_01',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole01.json',
    legend: {
      label: 'Centro Formazione Adulti',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
    },
    tooltip: '{DENOMINAZIONE}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 01',
        filter: {
          key: 'TIPO',
          value: '01',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
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
            className: 'cluster_02',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_02',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole02.json',
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school02.png',
      label: 'Istruzione Superiore',
    },
    tooltip: '{DENOMINAZIONE}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 02',
        filter: {
          key: 'TIPO',
          value: '02',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school02.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
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
            className: 'cluster_03',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_03',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole03.json',
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school01.png',
      label: 'IC :  infanzia, primaria, media',
    },
    tooltip: '{DENOMINAZIONE}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 03',
        filter: {
          key: 'TIPO',
          value: '03',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school01.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
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
            className: 'cluster_04',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_04',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole04.json',
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school03.png',
      label: 'Istituti Omnicomprensivi',
    },
    tooltip: '{DENOMINAZIONE}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 04',
        filter: {
          key: 'TIPO',
          value: '04',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school03.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
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
            className: 'cluster_06',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_06',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole06.json',
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school06.jpg',
      label: 'Istituti Paritari',
    },
    tooltip: '{DENOMINAZIONE}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 06',
        filter: {
          key: 'TIPO',
          value: '06',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school06.jpg',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
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
            className: 'cluster_07',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'scuole_07',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/scuoladigitale/scuole07.json',
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school07.png',
      label: 'Istruzione e Formazione Professionale',
    },
    tooltip: '{DENOMINAZIONE}', 
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: 'TIPO 07',
        filter: {
          key: 'TIPO',
          value: '07',
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school07.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        },
      },
    ],
  },
];

console.log('SONO QUI');

const maps = [
  {
    id: 0,
    name: 'Scuole',
    layers: GV.globals.SCUOLA_DIGITALE_LAYERS,
  },
];

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
