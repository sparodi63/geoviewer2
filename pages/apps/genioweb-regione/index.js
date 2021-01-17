// GV.globals.RL_MAP_CONFIG_SERVICE = "/geoservices/REST/config/map/";

var prov = 'RL';

GV.globals.GW_CONFIG = {
  RL: {
    codIstatProv: null,
    extent: '834446,5429486,1126435,5571286',
    idMap: '1843',
    idLayerPratica: 'L5938',
    idLayerPraticaDe: 'L5941',
    idLayerPuntoDe: 'L5942',
    idLayerComune: 'L5935',
    idLayerLocalita: 'L5937',
    idLayerParticella: 'L5940',
    idLayerFoglio: 'L5939',
    idLayerIdro: 'L5936',
  },
};

var action = GV.utils.getUrlParam('ACTION');
var layer = GV.utils.getUrlParam('LAYER'); // Livello di riferimento per find: PRATICA/PRATICA_DE/PUNTO_DE/COMUNE/...
var codicePratica = GV.utils.getUrlParam('CODICE_PRATICA'); // Codice della pratica nel caso di inserimento punti
var codice = GV.utils.getUrlParam('CODICE'); // Codice per find
var idPunto = GV.utils.getUrlParam('ID_PUNTO'); // Codice del punto presa
var coordX = GV.utils.getUrlParam('COORD_X');
var coordY = GV.utils.getUrlParam('COORD_Y');
var codEpsg = GV.utils.getUrlParam('COD_EPSG');
var codIstat = GV.utils.getUrlParam('COD_ISTAT');
var idLocalita = GV.utils.getUrlParam('ID_LOCALITA');
var codBelfiore = GV.utils.getUrlParam('COD_BELFIORE');
var sezione = GV.utils.getUrlParam('SEZIONE');
var foglio = GV.utils.getUrlParam('FOGLIO');
var mappale = GV.utils.getUrlParam('MAPPALE');
var codiceIdro = GV.utils.getUrlParam('CODICE_IDRO');
var conto = GV.utils.getUrlParam('CONTO');

var idMap = GV.globals.GW_CONFIG[prov].idMap;
var idMapLayerTree = GV.globals.GW_CONFIG[prov].idMapLayerTree;
var extent = GV.globals.GW_CONFIG[prov].extent;

var findOptions = setFindOptions();

var tools = setTools();

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  agAppMapList: null,
  application: {
    name: 'genioweb-rl-gv2',
    auth: {
      type: 'NAM',
      options: {
        ruolo: 'GENIO_RL',
      },
    },
    mapOptions: {
      click: 'info',
      initialExtent: extent,
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
                },
                tree: null,
              },
              canali: {
                type: 'tree',
                name: 'canali',
                label: '',
                options: {
                  multiCanale: true,
                  canale: '55',
                  applicazione: 'ECO3',
                  tematici: 'SI',
                  pub: false,
                },
                tree: null,
              },
            },
            activePanel: 'canali',
          },
        },
      },
      tools: tools,
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'MAPBOX_STREETS',
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2016',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});

function setTools() {
  var tools = [
    {
      name: 'gv-geocoder',
    },
    {
      name: 'gv-info-button',
      active: true,
    },
    {
      name: 'gv-print-button',
    },
    {
      name: 'gv-measure-button',
    },
    {
      name: 'gv-layer-search-button',
    },
    {
      name: 'gv-ricerca-catastale-button',
      options: {
        codIstatProv: null,
      },
    },
    {
      name: 'gv-scalebar',
      position: 'bottomleft',
    },
  ];

  return tools;
}

function setFindOptions() {
  var idLayer, cqlFilter;
  switch (layer) {
    case 'PRATICA':
      idLayer = GV.globals.GW_CONFIG[prov].idLayerPratica;
      cqlFilter = "CODICE_PRATICA='" + codice + "'";
      break;
    case 'PRATICA_DE':
      idLayer = GV.globals.GW_CONFIG[prov].idLayerPraticaDe;
      cqlFilter = "CODICE_PRATICA='" + codice + "'";
      break;
    case 'PUNTO_DE':
      idLayer = GV.globals.GW_CONFIG[prov].idLayerPuntoDe;
      cqlFilter = "CODICE_PRATICA='" + codice + "' AND ID_PUNTO_DE=" + idPunto;
      break;
  }
  return codice
    ? {
        layers: [idLayer],
        cqlFilter: cqlFilter,
      }
    : null;
}
