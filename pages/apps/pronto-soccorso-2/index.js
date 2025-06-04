// http://localhost:8081/?domain=https://pslive.regione.liguria.it&lat=44.40745&lng=8.97013
// http://localhost:8081/?domain=https://pslive-dev.alisa.liguria.it
// http://localhost:8081/?domain=http://localhost:3000

const ospedale = GV.utils.getUrlParam('ospedale');
const provincia = GV.utils.getUrlParam('provincia');
const affollamento = GV.utils.getUrlParam('affollamento');
const domain = GV.utils.getUrlParam('domain');
const lat = GV.utils.getUrlParam('lat');
const lng = GV.utils.getUrlParam('lng');

// console.log(lat);

const urlBase = domain.startsWith('http://')
  ? 'https://pslive-dev.alisa.liguria.it/api'
  : `${domain}/api`;

// console.log(urlBase);
const url = `${urlBase}/prontosoccorso/all`;
const urlConfig = `${urlBase}/config`;

let pollingInterval = 500000;

getConfig();

async function getConfig() {
  fetch(urlConfig)
    .then(response => response.json())
    .then(async data => {
      await getData();
      await refresh();
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
}

async function getData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      setConfig(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
}

async function refresh() {
  await refreshData();
  setTimeout(refresh, pollingInterval);
}

async function refreshData() {
  if (!GV.app) return;
  console.log('REFRESH');
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const layer = GV.app.map.getLayerByName('ps');
      layer.clearLayers();
      let geojson = getGeoJson(data);
      layer.addData(geojson);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
}

function getAffollamentoClass(ind_gda) {
  let class_gda = 'ND';
  if (ind_gda && ind_gda >= 150) class_gda = 'S';
  if (ind_gda && ind_gda >= 90 && ind_gda < 150) class_gda = 'A';
  if (ind_gda && ind_gda >= 60 && ind_gda < 90) class_gda = 'P';
  if (ind_gda && ind_gda < 60) class_gda = 'N';
  if (ind_gda === 0) class_gda = 'N';
  return class_gda;
}

function getIndGda(el) {
  // console.log(el);
  let ind_gda = null;
  const affollamento = el.prontoSoccorsoAffollamento;
  if (affollamento) {
    if (affollamento.indGdaRl) {
      ind_gda = affollamento.indGdaRl;
      // console.log('trovato indGdaRl', ind_gda);
    } else {
      ind_gda = affollamento.indGda;
      // console.log('trovato indGda', ind_gda);
    }
  } else {
    // console.log('non trovato prontoSoccorsoAffollamento');
  }
  return ind_gda;
}

function getPsClass(el) {
  const ps_class =
    el.classificazione === 'PS' || el.classificazione === 'DEA I' || el.classificazione === 'DEA II'
      ? 'PS'
      : 'PPI';

  // let ps_class = 'PPI';
  // if (
  //   el.classificazione === 'PS' ||
  //   el.classificazione === 'DEA I' ||
  //   el.classificazione === 'DEA II'
  // ) {
  //   ps_class = 'PS';
  // }

  return ps_class;
}

function getGeoJson(data) {
  // console.log('data', data);
  let filter = function(el) {
    return true;
  };

  data.forEach(el => {
    // console.log(el);
    const ind_gda = getIndGda(el);
    const ps_class = getPsClass(el);
    const class_gda = getAffollamentoClass(ind_gda);
    // console.log(el.breveOsp, el.classificazione, ind_gda, ps_class, class_gda);
  });

  let filtered = data.filter(filter);

  if (ospedale) {
    filtered = filtered.filter(el => {
      return el.codOsp === ospedale;
    });
  }

  if (provincia) {
    const listaProv = provincia.split(',');
    filtered = filtered.filter(el => {
      return listaProv.includes(el.provincia);
    });
  }

  if (affollamento) {
    const listaIndGda = affollamento.split(',');
    // console.log(affollamento);
    filtered = filtered.filter(el => {
      const ind_gda = getIndGda(el);
      const class_gda = getAffollamentoClass(ind_gda);
      const ps_class = getPsClass(el);
      // const trovato = class_gda === 'ND' || listaIndGda.includes(class_gda);
      // const trovato = listaIndGda.includes(class_gda);
      const trovato = listaIndGda.includes(class_gda) && ps_class === 'PS';
      return trovato;
    });
  }

  if (filtered.length === 0) {
    GV.utils.notification('Nessun elemento trovato', 'info');
    filtered = data;
  }

  const geojson = filtered.map(el => {
    const ind_gda = getIndGda(el);
    const ps_class = getPsClass(el);
    const class_gda = getAffollamentoClass(ind_gda);
    // const class_full = ps_class + '-' + class_gda;
    const class_full = ps_class === 'PS' ? ps_class + '-' + class_gda : ps_class;

    const feature = {
      type: 'Feature',
      id: el.codOsp,
      geometry: {
        type: 'Point',
        coordinates: [el.longitudine, el.latitudine],
      },
      geometry_name: 'GEOMETRY',
      properties: {
        cod_osp: el.codOsp,
        breve_osp: el.breveOsp,
        ind_gda: ind_gda,
        ps_class: ps_class,
        class_gda: class_gda,
        class_full: class_full,
        indirizzo: el.indirizzo,
        civico: el.civico,
        cap: el.cap,
        comune: el.comune,
        provincia: el.provincia,
        localita: el.localita,
        stato_apertura: el.nowClosed ? 'Chiuso' : 'Aperto',
        orario: el.open && el.close ? `Orario: ${el.open} - ${el.close}` : null,
        open: el.open,
        close: el.close,
        classificazione: el.classificazione,
      },
    };

    return feature;
  });

  return geojson;
}

function zoomExtentsMap() {
  // const zoomInside = !GV.globals.CULTURA_CONFIG.flagItinerario;
  var bounds = L.latLngBounds([]);
  const layer = GV.app.map.getLayerByName('ps');
  const layerBounds = layer.getBounds();
  bounds.extend(layerBounds);

  bounds = bounds.pad(0.2);
  GV.app.map.fitBounds(bounds, { maxZoom: 19 });
  const new_bounds = GV.app.map.getBounds();
  GV.app.map.setRestrictedExtent(
    GV.app.map.getExtentAsString(new_bounds),
    GV.app.map.getBoundsZoom(new_bounds, false)
  );
}

function setConfig(data) {
  // console.log(data);

  const geojson = getGeoJson(data);
  // console.log(geojson);

  const iconSizeSmall = [18, 27];
  const iconAnchorSmall = [iconSizeSmall[0] / 2, iconSizeSmall[1]];

  const iconSize = [30, 45];
  const iconAnchor = [iconSize[0] / 2, iconSize[1]];

  const popupAnchor = null; //[0, -29];

  const layers = [
    {
      type: 'JSON',
      dataType: 'json',
      name: 'ps',
      visible: true,
      geomSubType: 'POINT',
      data: geojson,
      tooltip: '{breve_osp}',
      onEachFeature: function(feature, layer) {
        let popup = getPopup(
          feature.properties.class_gda,
          feature.properties.ps_class,
          feature.properties.orario,
          feature.properties.classificazione
        );
        layer.bindPopup(interpolateString(popup, feature.properties));
      },
      // autoZoom: ospedale ? true : false,
      classes: [
        {
          style: {
            svgIconHtml: PPI_ICON,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
          },
        },
        {
          filter: {
            key: 'class_full',
            value: 'PPI',
          },
          style: {
            svgIconHtml: PPI_ICON,
            iconSize: iconSizeSmall,
            iconAnchor: iconAnchorSmall,
            popupAnchor: popupAnchor,
          },
        },
      ],
    },
  ];

  // GV.log('gv-app: created');

  GV.init({
    debug: false,
    maps: [
      {
        id: 0,
        name: 'pronto-soccorso',
        layers: layers,
      },
    ],
    application: {
      mapOptions: {
        zoomSnap: 0.1,
        initialExtent: '830036,5402959,1123018,5597635',
        restrictedExtent: '830036,5402959,1123018,5597635',
      },
      layout: {
        title: ' ',
        legend: null,
        tools: null,
      },
      callback: function() {
        new L.Control.Zoom({ position: 'topleft' }).addTo(GV.app.map.map);
        zoomExtentsMap();
        if (lat && lng) {
          const marker = GV.app.map.addMarker({
            type: 'circle',
            location: [lat, lng],
          });
          marker.setStyle({
            radius: 8,
            color: 'white',
            fillColor: '#009ee3',
            opacity: 1,
            fillOpacity: 1,
          });
          GV.app.map.map.setView({ lat: lat, lng: lng }, 12);
        }
      },
    },
    baseLayers: [
      {
        type: 'OSM',
        visible: true,
      },
    ],
  });
}

// --------------------------------------------------------------------------

const S_ICON = `
<svg id="Livello_2" data-name="Livello 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.47 50.5">
  <defs>
    <style>
      .cls-s {
        fill: #a30000;
        stroke: #2b4281;
        stroke-width: .81px;
      }
    </style>
  </defs>
  <g id="Livello_1-2" data-name="Livello 1">
    <g id="Raggruppa_1281" data-name="Raggruppa 1281">
      <path id="Tracciato_3201" data-name="Tracciato 3201" class="cls-s" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.29C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
    </g>
  </g>
</svg>
`;

const A_ICON = `
<svg id="Livello_2" data-name="Livello 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.47 50.5">
  <defs>
    <style>
      .cls-a {
        fill: #e75c2a;
      }

      .cls-a2 {
        fill: none;
        stroke: #2b4281;
        stroke-width: .81px;
      }

      .cls-a3 {
        fill: #fff;
        stroke: #ce000f;
        stroke-miterlimit: 10;
        stroke-width: .17px;
      }
    </style>
  </defs>
  <g id="Livello_1-2" data-name="Livello 1">
    <g id="Raggruppa_1284" data-name="Raggruppa 1284">
      <path id="Tracciato_3201-3" data-name="Tracciato 3201-3" class="cls-a3" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.3C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
      <path id="Tracciato_3222" data-name="Tracciato 3222" class="cls-a" d="m1.3,21.65h33.1c-2.49,7.72-7.14,15.17-14.59,26.34-.18.28-.66,1.68-1.08,2.08-.48.46-1.24.44-1.71-.04-.26-.27-.57-1.56-.94-2.04-2.9-3.84-8.27-11.62-10.24-14.9-.93-2.79-6.14-8.8-4.55-11.44Z"/>
      <path id="Tracciato_3201-3-2" data-name="Tracciato 3201-3" class="cls-a2" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.3C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
    </g>
  </g>
</svg>`;

const P_ICON = `
<svg id="Livello_2" data-name="Livello 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.47 50.5">
  <defs>
    <style>
      .cls-p {
        fill: #f5ce3e;
      }

      .cls-p2 {
        fill: none;
        stroke: #2b4281;
        stroke-width: .81px;
      }

      .cls-p3 {
        fill: #fff;
        stroke: #ce000f;
        stroke-miterlimit: 10;
        stroke-width: .17px;
      }
    </style>
  </defs>
  <g id="Livello_1-2" data-name="Livello 1">
    <g>
      <path id="Tracciato_3201-2" data-name="Tracciato 3201-2" class="cls-p3" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.29C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
      <g id="Raggruppa_1283" data-name="Raggruppa 1283">
        <path class="cls-p" d="m5.66,32.36c2.79,5.17,7.45,11.69,10.24,16.35.33,1.23,1.74,1.75,2.41,1.13.26-.25,1.19-.63,1.32-1.13,4.66-7.45,9.31-14.9,10.19-16.35H5.66Z"/>
      </g>
      <path id="Tracciato_3201-2-2" data-name="Tracciato 3201-2" class="cls-p2" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.29C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
    </g>
  </g>
</svg>
`;

const N_ICON = `
<svg id="Livello_2" data-name="Livello 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.47 50.5">
  <defs>
    <style>
      .cls-n {
        fill: none;
        stroke: #2b4281;
        stroke-width: .81px;
      }

      .cls-n2 {
        fill: #93ec9c;
      }

      .cls-n3 {
        fill: #fff;
        stroke: #ce000f;
        stroke-miterlimit: 10;
        stroke-width: .17px;
      }
    </style>
  </defs>
  <g id="Livello_1-2" data-name="Livello 1">
    <g>
      <path id="Tracciato_3201-2" data-name="Tracciato 3201-2" class="cls-n3" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.29C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
      <g id="Raggruppa_1283" data-name="Raggruppa 1283">
        <path class="cls-n2" d="m10.85,40.55c1.87,2.95,3.76,5.88,5.66,8.81.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22.52-.86,1.04-1.72,1.57-2.57h-13.63Z"/>
      </g>
      <path id="Tracciato_3201-2-2" data-name="Tracciato 3201-2" class="cls-n" d="m34.72,14.7C33.09,5.31,24.16-.97,14.78.66c-2.15.37-4.21,1.15-6.07,2.29C3.21,6.39.56,11.49.41,18.32c.07.7.14,1.76.29,2.81.49,2.64,1.48,5.17,2.91,7.44,4.03,7.1,8.47,13.95,12.9,20.79.33.66,1.14.93,1.81.6.26-.13.48-.35.61-.61,1.34-2.07,2.72-4.11,4-6.22,3.35-5.5,6.72-10.99,9.94-16.57,2.02-3.6,2.68-7.81,1.86-11.85"/>
    </g>
  </g>
</svg>
`;

const ND_ICON = `<svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>.nd-stroke-icon{fill:#686868}</style>
    </defs>
    <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
        <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
            <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                class="nd-stroke-icon"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;

const PPI_ICON = `<svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>.ppi-stroke-icon{fill:#009ee3;stroke:#2b4281}</style>
    </defs>
    <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
        <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
            <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                class="ppi-stroke-icon"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;

const popup_icon_s = `
    <div class="popup-icon">
      ${S_ICON}
      <span class="popup-icon-legend">Molto Affollato</span>
    </div>
`;

const popup_icon_a = `
    <div class="popup-icon">
      ${A_ICON}
      <span class="popup-icon-legend">Affollato</span>
    </div>
`;

const popup_icon_p = `
    <div class="popup-icon">
      ${P_ICON}
      <span class="popup-icon-legend">Lievemente Affollato</span>
    </div>
`;

const popup_icon_n = `
    <div class="popup-icon">
      ${N_ICON}
      <span class="popup-icon-legend">Normale</span>
    </div>
`;

const popup_icon_nd = `
    <div class="popup-icon">
      ${ND_ICON}
      <span class="popup-icon-legend">Dati non rilevati</span>
    </div>
`;

// const popup_s = `
//   <div class="popup-container">
//     ${popup_icon_s}
//     ${popup_link}
//   </div>
// `;

// const popup_a = `
//   <div class="popup-container">
//     ${popup_icon_a}
//     ${popup_link}
//   </div>
// `;

// const popup_p = `
//   <div class="popup-container">
//     ${popup_icon_p}
//     ${popup_link}
//   </div>
// `;

// const popup_n = `
//   <div class="popup-container">
//     ${popup_icon_n}
//     ${popup_link}
//   </div>
// `;

// const popup_nd = `
//   <div class="popup-container">
//     ${popup_icon_nd}
//     ${popup_link}
//   </div>
// `;

function getPopup(class_gda, ps_class, orario) {
  const popup_icon = getPopupIcon(class_gda, ps_class, orario);
  const popup_link = getPopupLink(class_gda, ps_class, orario);
  const popup = `
    <div class="popup-container">
      ${popup_icon}
      ${popup_link}
    </div>
  `;
  return popup;
}

function getPopupLink(class_gda, ps_class, orario) {
  let popup_link;

  if (ps_class === 'PS') {
    popup_link = `
    <div class="popup-ospedale" >
      <a href="javascript:GV.psDettaglio('{cod_osp}')">
        <span class="popup-nome">{breve_osp}</span><br><br>
      </a>
      <span class="popup-classificazione">{classificazione}</span><br><br>
      <span class="popup-localita">{localita}</span><br><br>
      <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
    </div>
    `;
  } else {
    if (orario) {
      popup_link = `
      <div class="popup-ospedale" >
        <a href="javascript:GV.psDettaglio('{cod_osp}')">
          <span class="popup-nome">{breve_osp}</span><br><br>
        </a>
        <span class="popup-classificazione">{classificazione}</span><br><br>
        <span class="popup-localita">{localita}</span><br><br>
        <span class="popup-orario">{orario}</span><br><br>
        <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
      </div>
      `;
    } else {
      popup_link = `
      <div class="popup-ospedale" >
        <a href="javascript:GV.psDettaglio('{cod_osp}')">
          <span class="popup-nome">{breve_osp}</span><br><br>
        </a>
        <span class="popup-classificazione">{classificazione}</span><br><br>
        <span class="popup-localita">{localita}</span><br><br>
        <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
      </div>
      `;
    }
  }

  return popup_link;
}

function getPopupIcon(class_gda, ps_class) {
  let popup_icon_class = ps_class === 'PS' ? 'popup-icon' : 'popup-icon-small';

  let popup_icon;

  switch (class_gda) {
    case 'S':
      popup_icon = `
          <div class="${popup_icon_class}">
            ${S_ICON}
            <span class="popup-icon-legend">Molto Affollato</span>
          </div>
      `;
      break;
    case 'A':
      popup_icon = `
          <div class="${popup_icon_class}">
            ${A_ICON}
            <span class="popup-icon-legend">Affollato</span>
          </div>
      `;
      break;
    case 'P':
      popup_icon = `
          <div class="${popup_icon_class}">
            ${P_ICON}
            <span class="popup-icon-legend">Lievemente Affollato</span>
          </div>
      `;
      break;
    case 'N':
      popup_icon = `
          <div class="${popup_icon_class}">
            ${N_ICON}
            <span class="popup-icon-legend">Normale</span>
          </div>
      `;
      break;
    default:
      popup_icon = `
          <div class="${popup_icon_class}">
            ${ND_ICON}
            <span class="popup-icon-legend">Dati non rilevati</span>
          </div>
      `;
  }

  if (ps_class != 'PS') {
    popup_icon = `
          <div class="popup-icon-ppi">
            <div class="${popup_icon_class}">
              ${PPI_ICON}
            </div>
            <span class="popup-icon-legend">{stato_apertura}</span>
          </div>
         
      `;
  } else {
    popup_icon = `
          <div class="popup-icon-ppi">
            <div class="${popup_icon_class}">
              ${PPI_ICON}
            </div>
          </div>
      `;
  }



  return popup_icon;
}

GV.psDettaglio = function(id) {
  const msg = { messaggio: 'scheda-ospedale', ospedale: id };
  // console.log(msg);
  window.parent.postMessage(msg, '*');
};

const interpolateString = (str, data) => {
  var templateRe = /\{ *([\w_\-]+) *\}/g;
  return str.replace(templateRe, function(str, key) {
    var value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for variable ' + str);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
};
