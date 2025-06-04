var applicazione = 'PIAN_TERR_CARTO';

var id = "1947";
GV.globals.RL_CATALOG = 'int';

const env = GV.globals.ENV || 'TEST';
const auth = (env === 'PROD') ? {
  type: 'NAM',
  options: {
        ruolo: 'PTCARTO',
  },
} : null;

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'https://geoservizi.regione.liguria.it:8081/',
  application: {
    name: 'pianificazione-vdt-gv2',
    auth: auth,
    mapOptions: {
      click: 'info',
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
          showMapCatalogPanelOnStart: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
                  cat: GV.globals.RL_CATALOG,
                },
                tree: null,
              },
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Canali Tematici',
                options: {
                  canale: null, // CODICE CANALE
                  applicazione: applicazione,
                  tematici: 'SI',
                  pub: false,
                },
                tree: null,
              },
              wms: {
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
          },
        },
      },
      tools: [
        { name: 'gv-geocoder' },
        { name: 'gv-info-button', active: true },
        { name: 'gv-measure-button' },
        { name: 'gv-layer-search-button' },
        { name: 'gv-ricerca-particella-button' },
        { name: 'gv-print-button' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2022' },
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_ORTOFOTO_2013' },
    { type: 'RL_ORTOFOTO_2010' },
    { type: 'RL_ORTOFOTO_2007' },
    { type: 'RL_ORTOFOTO_COSTIERA_2003' },
    { type: 'RL_ORTOFOTO_2000' },
    { type: 'RL_ORTOFOTO_1986' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
});
