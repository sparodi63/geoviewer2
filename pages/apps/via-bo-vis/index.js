const id = GV.utils.getUrlParam('id');
// const comune = GV.utils.getUrlParam('comune');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? 'http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2292 : null;
const idLayer = env === 'TEST' ? 'L8480,L8482,L8485' : null;
const layers = idLayer.split(',')
const idLayerComune = 'L6422';

if (id) {
  fetch(`/geoservices/REST/via/progetto/${id}`)
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
  console.warn('PROGETTO ASSENTE');
}

function loadConfig(data) {
  const countGeom = data ? data.countGeom : null;

  var findOptions = null;

  // if (comune) {
  //   findOptions = {
  //     layers: [idLayerComune],
  //     cqlFilter: "CODICE_COMUNE='" + comune + "'",
  //   };
  // }
  if (countGeom > 0) {
    findOptions = {
      layers: layers,
      cqlFilter: "ID_PROGETTO=" + id,
    };
  }

  // console.log('FINDOPTIONS', findOptions)
  
  let tools = [
      { name: 'gv-geocoder' },
      { name: 'gv-info-button', active: true },
      { name: 'gv-measure-button' },
      { name: 'gv-layer-search-topo-button' },
      { name: 'gv-ricerca-catastale-button' },
      { name: 'gv-print-button' },
      { name: 'gv-scalebar', position: 'bottomleft' },
  ] ;

  // if (id) tools.push(getDrawTool());

  let conf = {
    debug: true,
    idMap: idMap,
    geoserverUrl: geoserverUrl,
    findOptions: findOptions,
    application: {
      name: 'via-bo-gv2',
      mapOptions: {
        // type: 'openlayers',
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
                  options: {
                    treeServiceUrl: '/geoservices/REST/config/catalog/',
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
      wfsURL: `${geoserverUrl}geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${idLayer}&cql_filter=ID_PROGETTO=${id}`,
    },
  ];

  console.log('INITWFSREQUEST',initWfsRequest)

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
        fetch('/geoservices/REST/via/insertGeomBO', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geoJSON: data,
            deleted: deleted,
            id: id,
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
