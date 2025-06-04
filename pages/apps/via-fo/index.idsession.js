const idIstanza = GV.utils.getUrlParam('idistanza');
const idSession = GV.utils.getUrlParam('idsession');
const comune = GV.utils.getUrlParam('comune');


const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2290 : null;
const idLayer = env === 'TEST' ? 'L8479' : null;
const idLayerComune = 'L6422';

if (idIstanza || idSession) {
  const URL = (idIstanza) ? `/geoservices/REST/via/istanza/${idIstanza}` : `/geoservices/REST/via/session/${idSession}`  
  fetch(URL)
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
  const countGeom = data ? data.countGeom : 0;

  var findOptions = null;

  if (comune) {
    findOptions = {
      layers: [idLayerComune],
      cqlFilter: "CODICE_COMUNE='" + comune + "'",
    };
  }
  if (countGeom > 0) {
    findOptions = (idIstanza) ? {
      layers: [idLayer],
      cqlFilter: "IDISTANZA='" + idIstanza + "'",
    } : {
      layers: [idLayer],
      cqlFilter: "IDSESSION='" + idSession + "'",
    };
  }

  let tools = [{ name: 'gv-geocoder' }, { name: 'gv-scalebar', position: 'bottomleft' }];

  if (comune && idIstanza) {
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

  tools.push(getDrawTool());

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
      { type: 'RL_ORTOFOTO_2022' },
      { type: 'RL_CARTE_BASE' },
      { type: 'BLANK' },
    ],
    maps: [],
  };

  GV.init(conf);
}

function getDrawTool() {
  const cqlFilter = (idIstanza) ? `IDISTANZA='${idIstanza}'` : `IDSESSION='${idSession}'`
  const initWfsRequest = [
    {
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${idLayer}&cql_filter=${cqlFilter}`,
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
        fetch('/geoservices/REST/via/insertGeomFO', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geoJSON: data,
            deleted: deleted,
            idIstanza: idIstanza,
            idSession: idSession,
            srsIn: '3857',
            srsOut: '3003',
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
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
