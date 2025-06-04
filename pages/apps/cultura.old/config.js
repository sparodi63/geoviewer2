


const configLivelli = [
  {
    clusterClassName: 'cluster_2',
    name: '2',
    url: '/geoservices/data/cultura/2.json',
    label: 

  }
] 



GV.globals.SCUOLA_DIGITALE_LAYERS = [
  {
    type: 'JSON',
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: 'cluster_2',
            iconSize: L.point(28, 28),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: '2',
    visible: true,
    geomSubType: 'POINT',
    url: '/geoservices/data/cultura/2.json',
    legend: {
      label: 'Centro Formazione Adulti',
      icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
    },
    tooltip: '{NOME}',
    onFeatureSelect: onFeatureSelect,
    classes: [
      {
        name: '11622',
        filter: {
          key: 'CATOID',
          value: 11622,
        },
        style: {
          iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/cfa.png',
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        },
      },
      {
        name: '10691',
        filter: {
          key: 'CATOID',
          value: 10691,
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
  // {
  //   type: 'JSON',
  //   dataType: 'json',
  //   cluster: {
  //     options: {
  //       iconCreateFunction: function(cluster) {
  //         return L.divIcon({
  //           html: cluster.getChildCount(),
  //           className: 'cluster_02',
  //           iconSize: L.point(28, 28),
  //         });
  //       },
  //       showCoverageOnHover: false,
  //       maxClusterRadius: 80,
  //     },
  //   },
  //   name: 'scuole_02',
  //   visible: true,
  //   geomSubType: 'POINT',
  //   url: '/geoservices/data/scuoladigitale/scuole02.json',
  //   legend: {
  //     icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school02.png',
  //     label: 'Istruzione Superiore',
  //   },
  //   tooltip: '{DENOMINAZIONE}',
  //   onFeatureSelect: onFeatureSelect,
  //   classes: [
  //     {
  //       name: 'TIPO 02',
  //       filter: {
  //         key: 'TIPO',
  //         value: '02',
  //       },
  //       style: {
  //         iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school02.png',
  //         iconSize: [32, 37],
  //         iconAnchor: [16, 37],
  //         popupAnchor: [0, -37],
  //       },
  //     },
  //   ],
  // },
  // {
  //   type: 'JSON',
  //   dataType: 'json',
  //   cluster: {
  //     options: {
  //       iconCreateFunction: function(cluster) {
  //         return L.divIcon({
  //           html: cluster.getChildCount(),
  //           className: 'cluster_03',
  //           iconSize: L.point(28, 28),
  //         });
  //       },
  //       showCoverageOnHover: false,
  //       maxClusterRadius: 80,
  //     },
  //   },
  //   name: 'scuole_03',
  //   visible: true,
  //   geomSubType: 'POINT',
  //   url: '/geoservices/data/scuoladigitale/scuole03.json',
  //   legend: {
  //     icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school01.png',
  //     label: 'IC :  infanzia, primaria, media',
  //   },
  //   tooltip: '{DENOMINAZIONE}',
  //   onFeatureSelect: onFeatureSelect,
  //   classes: [
  //     {
  //       name: 'TIPO 03',
  //       filter: {
  //         key: 'TIPO',
  //         value: '03',
  //       },
  //       style: {
  //         iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school01.png',
  //         iconSize: [32, 37],
  //         iconAnchor: [16, 37],
  //         popupAnchor: [0, -37],
  //       },
  //     },
  //   ],
  // },
  // {
  //   type: 'JSON',
  //   dataType: 'json',
  //   cluster: {
  //     options: {
  //       iconCreateFunction: function(cluster) {
  //         return L.divIcon({
  //           html: cluster.getChildCount(),
  //           className: 'cluster_04',
  //           iconSize: L.point(28, 28),
  //         });
  //       },
  //       showCoverageOnHover: false,
  //       maxClusterRadius: 80,
  //     },
  //   },
  //   name: 'scuole_04',
  //   visible: true,
  //   geomSubType: 'POINT',
  //   url: '/geoservices/data/scuoladigitale/scuole04.json',
  //   legend: {
  //     icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school03.png',
  //     label: 'Istituti Omnicomprensivi',
  //   },
  //   tooltip: '{DENOMINAZIONE}',
  //   onFeatureSelect: onFeatureSelect,
  //   classes: [
  //     {
  //       name: 'TIPO 04',
  //       filter: {
  //         key: 'TIPO',
  //         value: '04',
  //       },
  //       style: {
  //         iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school03.png',
  //         iconSize: [32, 37],
  //         iconAnchor: [16, 37],
  //         popupAnchor: [0, -37],
  //       },
  //     },
  //   ],
  // },
  // {
  //   type: 'JSON',
  //   dataType: 'json',
  //   cluster: {
  //     options: {
  //       iconCreateFunction: function(cluster) {
  //         return L.divIcon({
  //           html: cluster.getChildCount(),
  //           className: 'cluster_06',
  //           iconSize: L.point(28, 28),
  //         });
  //       },
  //       showCoverageOnHover: false,
  //       maxClusterRadius: 80,
  //     },
  //   },
  //   name: 'scuole_06',
  //   visible: true,
  //   geomSubType: 'POINT',
  //   url: '/geoservices/data/scuoladigitale/scuole06.json',
  //   legend: {
  //     icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school06.jpg',
  //     label: 'Istituti Paritari',
  //   },
  //   tooltip: '{DENOMINAZIONE}',
  //   onFeatureSelect: onFeatureSelect,
  //   classes: [
  //     {
  //       name: 'TIPO 06',
  //       filter: {
  //         key: 'TIPO',
  //         value: '06',
  //       },
  //       style: {
  //         iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school06.jpg',
  //         iconSize: [32, 37],
  //         iconAnchor: [16, 37],
  //         popupAnchor: [0, -37],
  //       },
  //     },
  //   ],
  // },
  // {
  //   type: 'JSON',
  //   dataType: 'json',
  //   cluster: {
  //     options: {
  //       iconCreateFunction: function(cluster) {
  //         return L.divIcon({
  //           html: cluster.getChildCount(),
  //           className: 'cluster_07',
  //           iconSize: L.point(28, 28),
  //         });
  //       },
  //       showCoverageOnHover: false,
  //       maxClusterRadius: 80,
  //     },
  //   },
  //   name: 'scuole_07',
  //   visible: true,
  //   geomSubType: 'POINT',
  //   url: '/geoservices/data/scuoladigitale/scuole07.json',
  //   legend: {
  //     icon: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school07.png',
  //     label: 'Istruzione e Formazione Professionale',
  //   },
  //   tooltip: '{DENOMINAZIONE}', 
  //   onFeatureSelect: onFeatureSelect,
  //   classes: [
  //     {
  //       name: 'TIPO 07',
  //       filter: {
  //         key: 'TIPO',
  //         value: '07',
  //       },
  //       style: {
  //         iconUrl: '/geoservices/apps/viewer/static/img/scuoladigitale/legend/school07.png',
  //         iconSize: [32, 37],
  //         iconAnchor: [16, 37],
  //         popupAnchor: [0, -37],
  //       },
  //     },
  //   ],
  // },
];

