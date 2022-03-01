const idIstanza = GV.utils.getUrlParam('idistanza');
const comune = GV.utils.getUrlParam('comune');

// GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2290 : 2325;
const idLayer = env === 'TEST' ? 'L8479' : 'L8693';
const idLayerComune = 'L6422';

const srvUrl =
  env === 'TEST'
    ? 'http://srvcarto2svil.regione.liguria.it/geoservices/REST/via/istanza/'
    : 'https://srvcarto.regione.liguria.it/geoservices/REST/via/istanza/';


if (idIstanza) {
  fetch(`${srvUrl}${idIstanza}`)
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
  console.warn('IDISTANZA ASSENTE');
}

function loadConfig(data) {
  // console.log(data);
  const countGeom = data ? data.countGeom : null;

  var findOptions = null;

  if (comune) {
    findOptions = {
      layers: [idLayerComune],
      cqlFilter: "CODICE_COMUNE='" + comune + "'",
    };
  }
  if (countGeom > 0) {
    findOptions = {
      layers: [idLayer],
      cqlFilter: "IDISTANZA='" + idIstanza + "'",
    };
  }

  let tools = (comune && idIstanza)? 
    [
      { name: 'gv-geocoder' },
      getDrawTool(),
      { name: 'gv-info-button', active: true },
      { name: 'gv-measure-button' },
      { name: 'gv-layer-search-topo-button' },
      { name: 'gv-ricerca-catastale-button' },
      { name: 'gv-print-button' },
      { name: 'gv-scalebar', position: 'bottomleft' },
    ] :
    [
      { name: 'gv-geocoder' },
      getDrawTool(),
      {
        name: 'gv-scalebar',
        position: 'bottomleft'
      }
    ]
  

  

  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    findOptions: findOptions,
    application: {
      name: 'via-fo-gv2',
      mapOptions: {
        type: 'openlayers',
        click: 'info',
      },
      layout: {
        legend: {
          options: {
            show: true,
            collapsed: true,
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

function getDrawTool() {
  const initWfsRequest = [
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${idLayer}&cql_filter=IDISTANZA='${idIstanza}'`,
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
        cancel: true,
        refresh: true,
      },
      color: '#FF9900',
      multiGeom: true,
      epsg: '3003',
      initWfsRequests: initWfsRequest,
      submit: function(data, deleted, loading, refresh) {
        console.log('submit', data, deleted);
        fetch('/geoservices/REST/via/insertGeomFO', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geoJSON: data,
            deleted: deleted,
            idIstanza: idIstanza,
            srsIn: '3857',
            srsOut: '3003',
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('insert ok: ', data);
              window.parent.postMessage({ messaggio: 'inserimento-geometrie', esito: 'OK' }, '*');
              if (refresh) refresh();
              if (loading) loading.close();
            } else {
              window.parent.postMessage(
                { messaggio: 'inserimento-geometrie', esito: 'ERRORE' },
                '*'
              );
            }
          })
          .catch(error => {
            console.error('Error:', error);
            window.parent.postMessage({ messaggio: 'inserimento-geometrie', esito: 'ERRORE' }, '*');
          });
      },
      cancel: function() {
        console.log('CANCEL');
        window.parent.postMessage({ messaggio: 'inserimento-geometrie', esito: 'CANCEL' }, '*');
      },
    },
  };
}
