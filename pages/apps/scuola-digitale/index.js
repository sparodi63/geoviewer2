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

const baseURL =
  'https://geoservizi.regione.liguria.it/geoserver/scuoladigitale/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=V_SCUOLE_2014_COMPL&cql_filter=';

GV.globals.SCUOLA_DIGITALE_LAYERS = [
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cfa-c',
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
    url: '/geoservices/data/scuoladigitale/cfa.json',
    // url: `${baseURL}TIPO='01'`,
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
            className: 'iss-c',
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
    url: '/geoservices/data/scuoladigitale/iss.json',
    // url: `${baseURL}TIPO='02'`,
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/iss.png',
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
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/iss.png',
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
            className: 'isc-c',
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
    url: '/geoservices/data/scuoladigitale/isc.json',
    // url: `${baseURL}TIPO='03'`,
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/isc.png',
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
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/isc.png',
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
            className: 'iso-c',
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
    url: '/geoservices/data/scuoladigitale/iso.json',
    // url: `${baseURL}TIPO='04'`,
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/iso.png',
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
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/iso.png',
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
            className: 'isp-c',
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
    url: '/geoservices/data/scuoladigitale/isp.json',
    // url: `${baseURL}TIPO='06'`,
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/isp.png',
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
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/isp.png',
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
            className: 'ifp-c',
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
    url: '/geoservices/data/scuoladigitale/ifp.json',
    // url: `${baseURL}TIPO='07'`,
    legend: {
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/ifp.png',
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
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/ifp.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        },
      },
    ],
  },
];

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
    name: 'scuola-digitale-gv2',
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
