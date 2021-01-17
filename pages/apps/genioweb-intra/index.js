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

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/geoportale/map/';
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
      idCanali: '55',
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
      idCanali: '55,159',
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
      idCanali: '55,159',
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
      idCanali: '55,159',
    },
    SP: {
      codIstatProv: '011',
      extent: '1052903,5465564,1126435,5534051',
      idMap: 2167,
      idLayerPratica: 'L7761',
      idLayerPraticaDe: 'L7764',
      idLayerPuntoDe: 'L7765',
      idLayerComune: 'L7758',
      idLayerLocalita: 'L7760',
      idLayerParticella: 'L7763',
      idLayerFoglio: 'L7762',
      idLayerIdro: 'L7759',
      idLayerEttariIrrigati: 'L7766',
      idCanali: '55,160',
    },
  };
} else {
  // CONFIGURAZIONE PROD
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
      idCanali: '55',
    },
    GE: {
      codIstatProv: '010',
      extent: '949000,5498925,1076251,5571286',
      idMap: '2170',
      idLayerComune: 'L7780',
      idLayerIdro: 'L7781',
      idLayerLocalita: 'L7782',
      idLayerPratica: 'L7783',
      idLayerFoglio: 'L7784',
      idLayerParticella: 'L7785',
      idLayerPraticaDe: 'L7786',
      idLayerPuntoDe: 'L7787',
      idLayerEttariIrrigati: 'L7788',
      idCanali: '55,161',
    },
    IM: {
      codIstatProv: '008',
      extent: '834446,5429486,907520,5489412',
      idMap: '2173',
      idLayerComune: 'L7807',
      idLayerIdro: 'L7808',
      idLayerLocalita: 'L7809',
      idLayerPratica: 'L7810',
      idLayerFoglio: 'L7811',
      idLayerParticella: 'L7812',
      idLayerPraticaDe: 'L7813',
      idLayerPuntoDe: 'L7814',
      idLayerEttariIrrigati: 'L7815',
      idCanali: '55,164',
    },
    SV: {
      codIstatProv: '009',
      extent: '887493,5452722,967599,5551785',
      idMap: '2172',
      idLayerComune: 'L7798',
      idLayerIdro: 'L7799',
      idLayerLocalita: 'L7800',
      idLayerPratica: 'L7801',
      idLayerFoglio: 'L7802',
      idLayerParticella: 'L7803',
      idLayerPraticaDe: 'L7804',
      idLayerPuntoDe: 'L7805',
      idLayerEttariIrrigati: 'L7806',
      idCanali: '55,163',
    },
    SP: {
      codIstatProv: '011',
      extent: '1052903,5465564,1126435,5534051',
      idMap: '2171',
      idLayerComune: 'L7789',
      idLayerIdro: 'L7790',
      idLayerLocalita: 'L7791',
      idLayerPratica: 'L7792',
      idLayerFoglio: 'L7793',
      idLayerParticella: 'L7794',
      idLayerPraticaDe: 'L7795',
      idLayerPuntoDe: 'L7796',
      idLayerEttariIrrigati: 'L7797',
      idCanali: '55,162',
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
var idCanali = GV.globals.GW_CONFIG[prov].idCanali;
var extent = GV.globals.GW_CONFIG[prov].extent;

// IMPOSTO FIND ALL'AVVIO PER AZIONE DI INSERT
codice = codicePratica;

var findOptions = setFindOptions();

var tools = setTools();

var auth = {
  type: 'S3',
  options: {
    s3Token: token,
    s3TokenType: 'genio',
    s3TokenProv: prov,
  },
};

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  agAppMapList: null,
  application: {
    name: 'genioweb-intra-gv2',
    auth: auth,
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
          showInfoMap: true,
          showDownloadTotale: true,
          showBaseLayerSwitcher: true,
          showLayersTransparency: true,
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
                  canale: idCanali,
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
      name: 'gv-scalebar',
      position: 'bottomleft',
    },
  ];

  if (codicePratica || codBelfiore || idLocalita || coordX || codiceIdro) {
    tools.push({
      name: 'gv-genio-localizza-button',
      options: {
        title: 'PRATICA: ' + codicePratica,
        items: getLocalizzaItems(),
      },
    });
  }

  if (codicePratica) {
    tools.push({
      name: 'gv-genio-pratiche-collegate-button',
      options: {
        prov: prov,
        idLayerParticella: GV.globals.GW_CONFIG[prov].idLayerParticella,
        idLayerPratica: GV.globals.GW_CONFIG[prov].idLayerPratica,
        idLayerPraticaDe: GV.globals.GW_CONFIG[prov].idLayerPraticaDe,
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
    'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson';

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
