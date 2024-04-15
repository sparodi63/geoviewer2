const codice = GV.utils.getUrlParam('codice');
const codice_comune = GV.utils.getUrlParam('codice_comune');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

console.log('env', env);
const geoserverUrl =
  env === 'TEST'
    ? '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2422 : 2426;
const idLayer = env === 'TEST' ? 'L9138' : 'L9156';
const idLayerComune = 'L6422';

if (codice) {
  fetch(`/geoservices/REST/interventi_infra/domanda/${codice}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadConfig(data.data);
      } else {
        throw data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error);
    });
} else {
  loadConfig(null);
  console.warn('CODICE PRATICA ASSENTE');
}

function loadConfig(data) {
  // console.log(data);
  const pratica = data ? data.pratica : null;

  var findOptions = null;

  if (codice_comune) {
    findOptions = {
      layers: [idLayerComune],
      cqlFilter: "CODICE_COMUNE='" + codice_comune + "'",
    };
  }
  if (pratica && pratica.countGeom > 0) {
    findOptions = {
      layers: [idLayer],
      cqlFilter: "CODICE='" + pratica.codiceDomandaGeom + "'",
    };
  }

  let tools = [{ name: 'gv-geocoder' }, { name: 'gv-scalebar', position: 'bottomleft' }];

  if (codice_comune && codice) {
    tools = [
      { name: 'gv-geocoder' },
      { name: 'gv-info-button', active: true },
      { name: 'gv-measure-button' },
      { name: 'gv-layer-search-topo-button' },
      { name: 'gv-ricerca-catastale-button' },
      { name: 'gv-print-button' },
      { name: 'gv-scalebar', position: 'bottomleft' },
    ];
  }

  // TODO: ABILITARE CONTROLLO SU PROTOCOLLO
  if (pratica && !pratica.PROTOCOLLO) {
    tools.push(getDrawTool(pratica));
  }

  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    findOptions: findOptions,
    application: {
      name: 'geoportale-tecnico-gv2',
      mapOptions: {
        type: 'openlayers',
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
            addMapConfig: {
              panels: {
                repertorio: {
                  type: 'tree',
                  name: 'repertorio',
                  label: 'Repertorio Cartografico',
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
        tools: tools,
      },
    },
    baseLayers: [
      { type: 'ESRI_IMAGERY', visible: true },
      { type: 'OSM' },
      { type: 'RL_ORTOFOTO_2019' },
      { type: 'RL_CARTE_BASE' },
      { type: 'BLANK' },
    ],
    maps: [],
  };

  GV.init(conf);
}

function getDrawTool(pratica) {
  const codiceDomandaGeom = pratica.CODICE_DOMANDA_REF || pratica.CODICE;
  const initWfsRequest = [
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${idLayer}&cql_filter=CODICE='${codiceDomandaGeom}'`,
    },
  ];

  return {
    name: 'gv-draw-button',
    active: false,
    options: {
      idLayer: idLayer,
      tools: {
        draw: {
          point: true,
          polyline: true,
          polygon: true,
        },
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
      initWfsRequests: initWfsRequest,
      submit: function(data, deleted, loading, refresh) {
        console.log('submit', data, deleted);
        fetch('/geoservices/REST/interventi_infra/insertGeomDomanda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geoJSON: data,
            deleted: deleted,
            codiceDomandaGeom: codiceDomandaGeom,
            srsIn: '3857',
            srsOut: '3003',
          }),
        })
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            if (refresh) refresh();
            if (loading) loading.close();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      cancel: function() {},
    },
  };
}
