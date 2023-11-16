// IMPOSTAZIONI
const idMap = '2512';
const sw = { lat: 44.284953, lng: 9.098669 };
const ne = { lat: 44.370935, lng: 9.281964 };
const extent = '1012859,5509645,1033263,5523025';
const idCanale = '165';

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

let tools = [
  { name: 'gv-geocoder' },
  { name: 'gv-info-button', active: true },
  { name: 'gv-measure-button' },
  // { name: 'gv-layer-search-button' },
  { name: 'gv-layer-search-topo-button' },
  // { name: 'gv-ricerca-catastale-button' },
  { name: 'gv-print-button' },
  {
    name: 'gv-insert-point-button',
  },
  { name: 'gv-scalebar', position: 'bottomleft' },
];

const screenWidth = document.documentElement.clientWidth;
const maxScreenWidth = 420;
const largeScreen = screenWidth > maxScreenWidth;

if (largeScreen) {
  tools.push({
    name: 'gv-help-button',
    options: {
      URL:
        'https://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/parcoportofino/MANUALE_WEBGISPORTOFINO.pdf',
    },
  });
}

GV.init({
  debug: true,
  idMap: idMap,
  application: {
    name: 'gv2-parco-portofino',
    mapOptions: {
      zoomSnap: 0.5,
      initialExtent: extent,
      restrictedExtent: extent,
      click: 'info',
    },
    callback: function() {
      zoomExtentsMap();
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Canali Tematici',
                options: {
                  canale: 180,
                  tematici: 'SI',
                  pub: true,
                },
                tree: null,
              },
            },
          },
        },
      },
      tools: tools,
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_ORTOFOTO_2013' },
    { type: 'RL_ORTOFOTO_2010' },
    { type: 'RL_ORTOFOTO_2007' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});

function zoomExtentsMap() {
  const bounds = L.latLngBounds(L.latLng(sw), L.latLng(ne));

  GV.app.map.fitBounds(bounds);
  GV.app.map.setRestrictedExtent(
    GV.app.map.getExtentAsString(GV.app.map.getBounds()),
    GV.app.map.getBoundsZoom(bounds, false)
  );
}
