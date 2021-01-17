var infoUrl = 'http://www.cartografiarl.regione.liguria.it/ScuolaDigitale_Info/Info_progetti.asp?codice_scuola={COD_MECC}'
var popupTemplate = ''
// popupTemplate += '<p><b>{DENOMINAZIONE}</b></p><p>{INDIRIZZO}  - {CAP} {COMUNE}</p>'
// popupTemplate += '<p> <a href=' + infoUrl + ' target="_blank">Elenco progetti innovazione</a> - '
// popupTemplate += '<a href="{SITOWEB}" target="_blank">Sito Scuola</a>  </p>'
popupTemplate += '<div class="popup">'
popupTemplate +=
  '<img src="http://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/scuoladigitale/ico-scuola.png" width="27" height="24" > <span><b>{DENOMINAZIONE}</b></span>'
popupTemplate += '<br>{INDIRIZZO}  - {CAP} {COMUNE}'
popupTemplate +=
  '<br><img src="http://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/scuoladigitale/ico-web.png" width="18" height="18" ><span><a href="{SITOWEB}" target="_blank">sito scuola</a> </span>'
popupTemplate += '</div>'
popupTemplate += '<br><br><div id="popup-header" ><b><a href=' + infoUrl
// popupTemplate += ' target="_blank">VAI AI PROGETTI DELLA SCUOLA > </a></b></div>'
popupTemplate += ' target="_blank">VAI AI PROGETTI DELLA SCUOLA <span class="fa fa-angle-right"></span></a></b></div>'

var maps = [{
    id: 0,
    name: 'Scuole',
    layers: [{
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_01',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/cfa.png',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 01',
          filter: {
            key: 'TIPO',
            value: '01',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/cfa.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_02',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/school02.png',
          label: 'Istruzione Superiore',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 02',
          filter: {
            key: 'TIPO',
            value: '02',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/school02.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_03',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/school01.png',
          label: 'IC :  infanzia, primaria, media',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 03',
          filter: {
            key: 'TIPO',
            value: '03',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/school01.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_04',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/school03.png',
          label: 'Istituti Omnicomprensivi',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 04',
          filter: {
            key: 'TIPO',
            value: '04',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/school03.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_06',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/school06.jpg',
          label: 'Istituti Paritari',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 06',
          filter: {
            key: 'TIPO',
            value: '06',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/school06.jpg',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_07',
                iconSize: L.point(28, 28),
              })
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
          icon: '../../../static/img/scuoladigitale/legend/school07.png',
          label: 'Istruzione e Formazione Professionale',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 07',
          filter: {
            key: 'TIPO',
            value: '07',
          },
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/school07.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
    ],
  },
  {
    id: 1,
    name: 'Didattica',
    layers: [{
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_temi_01',
                iconSize: L.point(28, 28),
              })
            },
            showCoverageOnHover: false,
            maxClusterRadius: 80,
          },
        },
        name: 'temi_01',
        visible: true,
        geomSubType: 'POINT',
        url: '/geoservices/data/scuoladigitale/temi01.json',
        legend: {
          label: 'Coding e Robotica educativa',
          icon: '../../../static/img/scuoladigitale/legend/temi01.png',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 01',
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/temi01.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_temi_02',
                iconSize: L.point(28, 28),
              })
            },
            showCoverageOnHover: false,
            maxClusterRadius: 80,
          },
        },
        name: 'temi_02',
        visible: true,
        geomSubType: 'POINT',
        url: '/geoservices/data/scuoladigitale/temi02.json',
        legend: {
          label: 'Comunicazione digitale (Blog Siti web - Giornalismo digitale)',
          icon: '../../../static/img/scuoladigitale/legend/temi02.png',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 02',
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/temi02.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_temi_03',
                iconSize: L.point(28, 28),
              })
            },
            showCoverageOnHover: false,
            maxClusterRadius: 80,
          },
        },
        name: 'temi_03',
        visible: true,
        geomSubType: 'POINT',
        url: '/geoservices/data/scuoladigitale/temi03.json',
        legend: {
          label: 'Contenuti digitali (Ebook, Multimedia, Video e Realtà aumentata)',
          icon: '../../../static/img/scuoladigitale/legend/temi03.png',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 03',
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/temi03.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
      {
        type: 'JSON',
        dataType: 'json',
        cluster: {
          options: {
            iconCreateFunction: function (cluster) {
              return L.divIcon({
                html: cluster.getChildCount(),
                className: 'cluster_temi_04',
                iconSize: L.point(28, 28),
              })
            },
            showCoverageOnHover: false,
            maxClusterRadius: 80,
          },
        },
        name: 'temi_04',
        visible: true,
        geomSubType: 'POINT',
        url: '/geoservices/data/scuoladigitale/temi04.json',
        legend: {
          label: 'Smart users (Inclusione, Byod e E-learning, Sicurezza, ambiente progetti internazionali)',
          icon: '../../../static/img/scuoladigitale/legend/temi04.png',
        },
        tooltip: '{DENOMINAZIONE}',
        popup: popupTemplate,
        classes: [{
          name: 'TIPO 04',
          style: {
            iconUrl: '../../../static/img/scuoladigitale/legend/temi04.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
          },
        }, ],
      },
    ],
  },
]

GV.init({
  debug: true,
  application: {
    layout: {
      title: ' ',
      tools: [{
          name: 'gv-inner-html',
          position: 'topleft',
          options: {
            props: [{
              html: '<div class="gv-color-scheme" id="logo"></div>'
            }]
          }
        },
        {
          name: 'gv-search',
          position: 'topleft',
          options: {
            layers: ['scuole_01', 'scuole_02', 'scuole_03', 'scuole_04', 'scuole_06', 'scuole_07', 'temi_01', 'temi_02', 'temi_03', 'temi_04'],
            propertyName: 'DENOMINAZIONE',
          },
        },
        {
          name: 'gv-inner-html',
          position: 'bottomleft',
          options: {
            props: [{
              html: '<div id="loghi-fesr"></div>'
            }]
          }
        },
        {
          name: 'gv-scuoladigitale-legend',
          position: 'topright',
          options: {
            maps: maps,
          },
        },
      ],
    },
  },
  baseLayers: [{
    type: 'MAPBOX_STREETS',
    visible: true
  }],
  maps: [],
})
