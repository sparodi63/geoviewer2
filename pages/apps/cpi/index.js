const id = GV.utils.getUrlParam('id');

const templateOLD = `
  <div class="div-popup">
  <img src="/geoservices/apps/viewer/static/img/centri-impiego/popup_logo.png" />
  <div class="popup-nome" >{DENOMINAZIONE}</div>
  <div class="popup-indirizzo" >{INDIRIZZO} {PROVINCIA} ({PROV_SIGLA}) - {CAP}<br>
  <span class="popup-bold">Tel.</span> {TELEFONO}<br>
  <span class="popup-bold">Email</span> <a href="mailto:{EMAIL}">{EMAIL}</a><br>
  <span class="popup-bold">Orario di apertura al pubblico</span> {ORARIO}</div>
  <div class="popup-prenota"><a href="javascript:GV.prenota({ID})"><button type="button" class="prenota-btn"><span>Prenota appuntamento </span></button></a></div>
  </div>
`
const template = `
  <div class="div-popup">
  <img src="/geoservices/apps/viewer/static/img/centri-impiego/svg/{SVG}" />
  <div class="popup-indirizzo" >{INDIRIZZO} {PROVINCIA} ({PROV_SIGLA}) - {CAP}<br>
  <span class="popup-bold">Tel.</span> {TELEFONO}<br>
  <span class="popup-bold">Email</span> <a href="mailto:{EMAIL}">{EMAIL}</a><br>
  <span class="popup-bold">Orario di apertura al pubblico</span> {ORARIO}</div>
  <div class="popup-prenota"><a href="javascript:GV.prenota({ID})"><button type="button" class="prenota-btn"><span>Prenota appuntamento </span></button></a></div>
  </div>
`

const popup = (id) ? null : template

const filter = (id) ? {
        key: 'ID',
        value: 1,
      }: null

const layers = [{
    type: 'JSON', 
    dataType: 'json',
    cluster: {
      options: {
        iconCreateFunction: function(cluster) {
          return L.divIcon({
            html: cluster.getChildCount(),
            className: `cluster cluster_cpi`,
            iconSize: L.point(31, 31),
          });
        },
        showCoverageOnHover: false,
        maxClusterRadius: 80,
      },
    },
    name: 'cpi',
    visible: true,
    geomSubType: 'POINT',
    url: `/geoservices/data/centri-impiego/cpi2.json`,
    tooltip: '{DENOMINAZIONE}',
    onEachFeature: (id) ? null : function(feature, layer) {
      layer.bindPopup(interpolateString(popup, feature.properties));
      layer.on('click', (ev) => {
        // HACK per non far uscire popup da finestra 
        // let latlng = ev.latlng
        let latlng = { ...ev.latlng }
        latlng.lat += 0.01
        //
        GV.app.map.setView(latlng,14)
      })
    },
    autoZoom: (id)? true: false,
    classes: [
      {
        filter: filter,
        style: {
          iconUrl: `/geoservices/apps/viewer/static/img/centri-impiego/legend/cpi2.png`,
          iconSize: [20, 29],
          iconAnchor: [14, 29],
          popupAnchor: [0, -29],
        },
      },
    ],
  }
];

GV.prenota = function (id) {
  console.log(id)
  window.parent.postMessage(
    { messaggio: 'prenota-cpi', id: id },
    '*'
  );
}

GV.init({
  debug: true,
  maps: [{
    id: 0,
    name: 'centri-impiego',
    layers: layers,
  }],
  application: {
    mapOptions: {
      static: (id)? true: false,
      zoomSnap: 0.1,
      initialExtent: '830036,5402959,1123018,5597635',
      restrictedExtent: '830036,5402959,1123018,5597635',
    },
    layout: {
      title: ' ',
      legend: null,
      tools: null,
    },
  },
  baseLayers: [
    {
      type: 'OSM',
      visible: true,
    },
  ],
});

const interpolateString = (str, data) => {
  var templateRe = /\{ *([\w_\-]+) *\}/g
  return str.replace(templateRe, function (str, key) {
    var value = data[key]

    if (value === undefined) {
      throw new Error('No value provided for variable ' + str)
    } else if (typeof value === 'function') {
      value = value(data)
    }
    return value
  })
}
