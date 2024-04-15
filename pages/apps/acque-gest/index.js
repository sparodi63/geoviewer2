// http://localhost:8081/?codice_comune=010025&coordinate=1541032.5,4898378.7

// https://srvcarto2svil.regione.liguria.it/geoservices/apps/viewer/pages/apps/acque-gest/test.html
// https://srvcarto2svil.regione.liguria.it/geoservices/apps/viewer/pages/apps/acque-gest/?codice_comune=010025&coordinate=1541032.5,4898378.7

const codice_comune = GV.utils.getUrlParam('codice_comune');
const coordinate = GV.utils.getUrlParam('coordinate');

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const geoserverUrl =
  env === 'TEST'
    ? '/geoservices/REST/proxy/proxy?url=http://geoservizi.datasiel.net:8080/'
    : 'https://geoservizi.regione.liguria.it/';
const idMap = env === 'TEST' ? 2560 : 918;
const idLayer =
  env === 'TEST'
    ? 'L9962,L9963,L9964,L9966,L9967,L9968,L9969,L9970'
    : 'L2083,L2084,L2883,L2884,L2885,L2886,L2887,L4583';
const layers = idLayer.split(',');
const idLayerComune = 'L6422';

const findOptions = set_find_options();

const auth = {
  type: 'NAM',
  options: {
    ruolo: 'VIA_VIS,VIA_GEST',
  },
};

function set_find_options() {
  if (codice_comune && !coordinate)
    return {
      layers: [idLayerComune],
      cqlFilter: `CODICE_COMUNE='${codice_comune}'`,
    };
  else return null;
}

async function add_feature() {
  if (!coordinate) return;

  const coords = coordinate.split(',');
  const x = parseFloat(coords[0]);
  const y = parseFloat(coords[1]);

  const response = await fetch(`${GV.globals.RL_TRANSFORM_POINT_SERVICE}3003/4327/${x},${y}`);
  const data = await response.json();

  const lonlat = data.points[0].split(',');
  const feature = {
    features: [
      {
        geometry: { coordinates: [lonlat[0], lonlat[1]], type: 'Point' },
        properties: null,
        type: 'Feature',
      },
    ],
  };
  GV.app.tools.draw.addLayerFeatures(feature, 'geojson');
}

let conf = {
  debug: true,
  idMap: idMap,
  geoserverUrl: geoserverUrl,
  findOptions: findOptions,
  application: {
    name: 'acque-gest-gv2',
    auth: auth,
    mapOptions: {
      type: 'openlayers',
      click: 'info',
    },
    callback: add_feature,
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: false,
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
      tools: [
        { name: 'gv-geocoder' },
        // { name: 'gv-info-button', active: true },
        // { name: 'gv-measure-button' },
        // { name: 'gv-layer-search-topo-button' },
        // { name: 'gv-ricerca-catastale-button' },
        // { name: 'gv-print-button' },
        {
          name: 'gv-draw-button',
          active: true,
          options: {
            idLayer: null,
            tools: {
              draw: {
                point: true,
              },
              edit: {
                edit: true,
                // remove: true,
              },
            },
            buttons: {
              submit: true,
              cancel: true,
            },
            color: '#FF9900',
            epsg: '3003',
            epsgOut: '3003',
            noConfirm: true,
            submit: (data, deleted, loading, refresh) => {
              if (loading) loading.close();
              if (data.features.length > 0) {
                // console.log('insert/update', data, deleted);
                const geom = data.features[0].geometry.coordinates;
                let x = parseInt(geom[0]);
                let y = parseInt(geom[1]);
                window.parent.postMessage(
                  { message: `carto-response`, esito: 'OK', x: x, y: y },
                  '*'
                );
              } else if (deleted && deleted.features.length > 0) {
                // console.log('delete', data, deleted);
                window.parent.postMessage(
                  { message: `carto-response`, esito: 'OK', x: null, y: null },
                  '*'
                );
              }
            },
            cancel: () => {
              window.parent.postMessage({ message: `carto-response`, esito: 'KO' }, '*');
            },
          },
        },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
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
