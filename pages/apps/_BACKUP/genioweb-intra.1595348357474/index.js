/*
EDITING GEOMETRIE PRATICHE
http://localhost:8081/?PROV=GE&ACTION=INSERT&CODICE_PRATICA=GVI06559
http://localhost:8081/?ENV=TEST&PROV=GE&ACTION=INSERT&CODICE_PRATICA=GDE6075
EDITING GEOMETRIE PUNTI
http://localhost:8081/?ENV=TEST&PROV=GE&ACTION=INSERT&CODICE_PRATICA=GDE4645&&ID_PUNTO=12794
--
Localizzazione completa
http://localhost:8081/?ENV=TEST&PROV=GE&ACTION=INSERT&CODICE_PRATICA=GDE4645&COD_BELFIORE=D969&ID_LOCALITA=1&SEZIONE=G&FOGLIO=6&MAPPALE=2586&COORD_X=1453873&COORD_Y=4909770&COD_EPSG=3003&ID_PUNTO=12794&CODICE_IDRO=R63010201200000000&CONTO=2
--
Ingresso con ricerca
http://localhost:8081/?ENV=TEST&PROV=GE&CODICE=GVI06559&LAYER=PRATICA
http://localhost:8081/?ENV=TEST&PROV=GE&CODICE=GDE4645&LAYER=PUNTO_DE&ID_PUNTO=12794
*/

GV.globals.RL_MAP_CONFIG_SERVICE =
  'http://srvcarto.regione.liguria.it/geoservices/REST/geoportale/map/';

// GV.globals.RL_MAP_CONFIG_SERVICE = "/geoservices/REST/config/map/";

var env = GV.globals.GENIO_WEB_ENV || 'TEST';
console.log('ENV: ', env);

GV.globals.RL_CATALOG = 'int';

if (env === 'TEST') {
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
      idLayerEttariIrrigati: 'L6108',
    },
    GE: {
      codIstatProv: '010',
      extent: '949000,5498925,1076251,5571286',
      idMap: 2120,
      idLayerPratica: 'L7240',
      idLayerPraticaDe: 'L7243',
      idLayerPuntoDe: 'L7244',
      idLayerComune: 'L7237',
      idLayerLocalita: 'L7239',
      idLayerParticella: 'L7242',
      idLayerFoglio: 'L7241',
      idLayerIdro: 'L7238',
      idLayerEttariIrrigati: 'L7727',
      idMapLayerTree: 1760,
    },
    IM: {
      codIstatProv: '008',
      extent: '834446,5429486,907520,5489412',
      idMap: 2120,
      idLayerPratica: 'L7240',
      idLayerPraticaDe: 'L7243',
      idLayerPuntoDe: 'L7244',
      idLayerComune: 'L7237',
      idLayerLocalita: 'L7239',
      idLayerParticella: 'L7242',
      idLayerFoglio: 'L7241',
      idLayerIdro: 'L7238',
      idLayerEttariIrrigati: 'L7727',
      idMapLayerTree: 1760,
    },
    SV: {
      codIstatProv: '009',
      extent: '887493,5452722,967599,5551785',
      idMap: 2120,
      idLayerPratica: 'L7240',
      idLayerPraticaDe: 'L7243',
      idLayerPuntoDe: 'L7244',
      idLayerComune: 'L7237',
      idLayerLocalita: 'L7239',
      idLayerParticella: 'L7242',
      idLayerFoglio: 'L7241',
      idLayerIdro: 'L7238',
      idLayerEttariIrrigati: 'L7727',
      idMapLayerTree: 1760,
    },
    SP: {
      codIstatProv: '011',
      extent: '1052903,5465564,1126435,5534051',
      idMap: 2120,
      idLayerPratica: 'L7240',
      idLayerPraticaDe: 'L7243',
      idLayerPuntoDe: 'L7244',
      idLayerComune: 'L7237',
      idLayerLocalita: 'L7239',
      idLayerParticella: 'L7242',
      idLayerFoglio: 'L7241',
      idLayerIdro: 'L7238',
      idLayerEttariIrrigati: 'L7727',
      idMapLayerTree: 1760,
    },
  };
} else {
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
    GE: {
      codIstatProv: '010',
      extent: '949000,5498925,1076251,5571286',
      idMap: '1793',
      idLayerPratica: 'L5568',
      idLayerPraticaDe: 'L5571',
      idLayerPuntoDe: 'L5572',
      idLayerComune: 'L5565',
      idLayerLocalita: 'L5567',
      idLayerParticella: 'L5570',
      idLayerFoglio: 'L5569',
      idLayerIdro: 'L5566',
      idMapLayerTree: '1798',
    },
    IM: {
      codIstatProv: '008',
      extent: '834446,5429486,907520,5489412',
      idMap: '1797',
      idLayerPratica: 'L5607',
      idLayerPraticaDe: 'L5610',
      idLayerPuntoDe: 'L5611',
      idLayerComune: 'L5604',
      idLayerLocalita: 'L5606',
      idLayerParticella: 'L5609',
      idLayerFoglio: 'L5608',
      idLayerIdro: 'L5605',
      idMapLayerTree: '1801',
    },
    SV: {
      codIstatProv: '009',
      extent: '887493,5452722,967599,5551785',
      idMap: '1794',
      idLayerPratica: 'L5576',
      idLayerPraticaDe: 'L5579',
      idLayerPuntoDe: 'L5580',
      idLayerComune: 'L5573',
      idLayerLocalita: 'L5575',
      idLayerParticella: 'L5578',
      idLayerFoglio: 'L5577',
      idLayerIdro: 'L5574',
      idMapLayerTree: '1799',
    },
    SP: {
      codIstatProv: '011',
      extent: '1052903,5465564,1126435,5534051',
      idMap: '1795',
      idLayerPratica: 'L5584',
      idLayerPraticaDe: 'L5587',
      idLayerPuntoDe: 'L5588',
      idLayerComune: 'L5581',
      idLayerLocalita: 'L5583',
      idLayerParticella: 'L5586',
      idLayerFoglio: 'L5585',
      idLayerIdro: 'L5582',
      idMapLayerTree: '1800',
    },
  };
}

var token = GV.utils.getUrlParam('TOKEN');
var prov = GV.utils.getUrlParam('PROV');
var action = GV.utils.getUrlParam('ACTION');
// var tipoLayer = GV.utils.getUrlParam('LAYER'); // Livello di riferimento per find: PRATICA/PRATICA_DE/PUNTO_DE/COMUNE/...
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

// IMPOSTO FIND ALL'AVVIO PER AZIONE DI INSERT
codice = codicePratica;

var findOptions = setFindOptions();

var tools = setTools();

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  agAppMapList: null,
  application: {
    name: 'genioweb-intra-gv2',
    // s3Token: token,
    // s3TokenType: 'genio',
    // s3TokenProv: prov,
    mapOptions: {
      click: 'info',
      initialExtent: extent,
      restrictedExtent: extent,
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: false,
          showBaseLayerSwitcher: true,
          hideAncillaryMapLegend: true,
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
    // {
    //   name: "gv-coordinate-button"
    // },
    {
      name: 'gv-measure-button',
    },
    {
      name: 'gv-layer-search-button',
    },
    {
      name: 'gv-print-button',
    },
    {
      name: 'gv-ricerca-catastale-button',
      options: {
        codIstatProv: GV.globals.GW_CONFIG[prov].codIstatProv,
      },
    },
    {
      name: 'gv-genio-localizza-button',
      options: {
        title: 'PRATICA: ' + codicePratica,
        items: getLocalizzaItems(),
      },
    },
    {
      name: 'gv-scalebar',
      position: 'bottomleft',
    },
  ];

  if (codicePratica) {
    tools.push({
      name: 'gv-genio-pratiche-collegate-button',
      options: {
        prov: prov,
        idLayerParticella: GV.globals.GW_CONFIG[prov].idLayerParticella,
        idLayerPratica: GV.globals.GW_CONFIG[prov].idLayerPratica,
        idMap: GV.globals.GW_CONFIG[prov].idMap,
        codicePratica: codicePratica,
      },
    });
  }

  if (action === 'INSERT') {
    var drawTools = idPunto
      ? {
          point: true,
          polygon: true,
        }
      : {
          point: true,
          polyline: true,
          polygon: true,
        };
    tools.push({
      name: 'gv-draw-button',
      active: false,
      options: {
        tools: {
          draw: drawTools,
          edit: {
            edit: true,
            remove: true,
          },
        },
        buttons: {
          submit: true,
          cancel: false,
          refresh: true,
        },
        color: '#FF9900',
        multiGeom: true,
        epsg: '3003',
        initWfsRequests: getInitWfsRequests(),
        submit: function(data, deleted, loading, refresh) {
          var data = {
            prov: prov,
            codicePratica: codicePratica,
            idPunto: idPunto,
            features: data,
            deleted: deleted,
          };
          GV.utils.insertGeomPraticaGenio(data).then(function(resp) {
            var message = resp.data.msg.join('<br>');
            if (loading) loading.close();
            refreshLayer();
            if (resp.success) {
              GV.utils.notification('Dati salvati correttamente<br>' + message, 'info');
            } else {
              GV.utils.notification('Errore nella scrittura sul DB', 'error');
            }
            // chiamo callback per refresh client
            if (refresh) refresh();
            // GV.eventBus.$emit('draw-saved-data', {
            //   success: resp.success,
            // });
          });
        },
        cancel: function(data) {},
      },
    });

    tools.push({
      name: 'gv-genio-seleziona-particelle-button',
      options: {
        prov: prov,
        idLayerParticella: GV.globals.GW_CONFIG[prov].idLayerParticella,
        idLayerPratica: getLayerPratica(),
        idLayerEttariIrrigati: GV.globals.GW_CONFIG[prov].idLayerEttariIrrigati,
        idMap: GV.globals.GW_CONFIG[prov].idMap,
        codicePratica: codicePratica,
        idPunto: idPunto,
      },
    });
  }

  tools.push({
    name: 'gv-back-button',
    options: {
      confirm: true,
      action: 'close',
    },
  });

  return tools;
}

function refreshLayer() {
  var layerToRefresh = idPunto ? GV.globals.GW_CONFIG[prov].idLayerPuntoDe : getLayerPratica();
  var layerConfig = GV.config.getLayerConfig(layerToRefresh);
  GV.eventBus.$emit('set-layer-visible', {
    layer: layerConfig,
    checked: false,
  });
  GV.eventBus.$emit('set-layer-visible', {
    layer: layerConfig,
    checked: true,
  });
}

function getLayerPratica() {
  var layerPratica = GV.globals.GW_CONFIG[prov].idLayerPratica;
  if (
    codicePratica.startsWith('GDE') ||
    codicePratica.startsWith('IMD') ||
    codicePratica.startsWith('SVD') ||
    codicePratica.startsWith('SPD')
  ) {
    layerPratica = GV.globals.GW_CONFIG[prov].idLayerPraticaDe;
  }
  return layerPratica;
}

function getInitWfsRequests() {
  var baseWfsURL =
    'http://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson';

  return idPunto
    ? [
        {
          wfsURL:
            baseWfsURL +
            '&typeName=' +
            GV.globals.GW_CONFIG[prov].idLayerPuntoDe +
            '&cql_filter=' +
            "CODICE_PRATICA='" +
            codicePratica +
            "' AND ID_PUNTO_DE='" +
            idPunto +
            "' AND G_STATO='J'",
        },
        {
          wfsURL:
            baseWfsURL +
            '&typeName=' +
            GV.globals.GW_CONFIG[prov].idLayerEttariIrrigati +
            '&cql_filter=' +
            "SV06_CODICE_PRATICA='" +
            codicePratica +
            "'",
        },
      ]
    : [
        {
          wfsURL:
            baseWfsURL +
            '&typeName=' +
            getLayerPratica() +
            '&cql_filter=' +
            "CODICE_PRATICA='" +
            codicePratica +
            "' AND ID_PUNTO_DE IS NULL" +
            " AND G_STATO='M'",
        },
      ];
}

function getLocalizzaItems() {
  var items = [];

  if (codicePratica) {
    items.push({
      label: 'Pratica',
      value: codicePratica,
      findOptions: {
        layers: [getLayerPratica()],
        cqlFilter: "CODICE_PRATICA='" + codicePratica + "'",
      },
    });
  }
  if (codBelfiore) {
    items.push({
      label: 'Comune',
      value: codBelfiore,
      findOptions: {
        layers: [GV.globals.GW_CONFIG[prov].idLayerComune],
        cqlFilter: "AA01_COD_COM='" + codBelfiore + "'",
      },
    });
  }
  if (idLocalita) {
    items.push({
      label: 'Località',
      value: idLocalita,
      findOptions: {
        layers: [GV.globals.GW_CONFIG[prov].idLayerLocalita],
        cqlFilter: "ID='" + idLocalita + "'",
      },
    });
  }
  if (codBelfiore && sezione && foglio) {
    if (foglio == '0') foglio = '';
    if (mappale) {
      mappale = mappale.padEnd(10, ' ');
      items.push({
        label: 'Particella',
        value: codBelfiore + ',' + sezione + ',' + foglio + ',' + mappale,
        findOptions: {
          layers: [GV.globals.GW_CONFIG[prov].idLayerParticella],
          maxZoom: 18,
          cqlFilter:
            "CT24_COD_COM='" +
            codBelfiore +
            "' AND CT24_SEZ='" +
            sezione +
            "' AND CT24_FOGLIO='" +
            foglio +
            "' AND CT24_NUMERO='" +
            mappale +
            "'",
        },
      });
    } else {
      items.push({
        label: 'Foglio',
        value: codBelfiore + ',' + sezione + ',' + foglio,
        findOptions: {
          layers: [GV.globals.GW_CONFIG[prov].idLayerFoglio],
          cqlFilter:
            "CT31_COD_COM='" +
            codBelfiore +
            "' AND CT31_SEZ='" +
            sezione +
            "' AND CT31_FOGLIO='" +
            foglio +
            "'",
        },
      });
    }
  }
  if (coordX && coordY && codEpsg) {
    items.push({
      label: 'Coordinate',
      value: codEpsg + ':' + coordX + ',' + coordY,
      findOptions: {
        zoomTo: {
          coord: coordX + ',' + coordY,
          epsg: codEpsg,
        },
      },
    });
  }
  if (idPunto) {
    items.push({
      label: 'Punto',
      value: codicePratica + ',' + idPunto,
      findOptions: {
        layers: [GV.globals.GW_CONFIG[prov].idLayerPuntoDe],
        cqlFilter: "CODICE_PRATICA='" + codicePratica + "' AND ID_PUNTO_DE='" + idPunto + "'",
      },
    });
  }
  if (codiceIdro) {
    var count = conto || '1';
    items.push({
      label: 'Corpo Idrico',
      value: codiceIdro,
      findOptions: {
        layers: [GV.globals.GW_CONFIG[prov].idLayerIdro],
        codiceIdro: codiceIdro,
        count: count,
      },
    });
  }

  return items;
}

function setFindOptions() {
  if (!codice) return null;

  var idLayer, cqlFilter;
  var tipoLayer = getTipoLayer();
  console.log('LAYER: ' + tipoLayer);

  switch (tipoLayer) {
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

  return {
    layers: [idLayer],
    cqlFilter: cqlFilter,
  };
}

function getTipoLayer() {
  var tipoLayer = 'PRATICA';
  if (
    codicePratica.startsWith('GDE') ||
    codicePratica.startsWith('IMD') ||
    codicePratica.startsWith('SVD') ||
    codicePratica.startsWith('SPD')
  ) {
    tipoLayer = 'PRATICA_DE';
  }
  if (idPunto) tipoLayer = 'PUNTO_DE';
  return tipoLayer;
}

function getTipoPratica() {
  var tipoPratica = 'DEM';
  if (
    codicePratica.startsWith('GDE') ||
    codicePratica.startsWith('IMD') ||
    codicePratica.startsWith('SVD') ||
    codicePratica.startsWith('SPD')
  ) {
    tipoPratica = 'DER';
  }
  return tipoPratica;
}
