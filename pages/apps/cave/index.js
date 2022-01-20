/*
  ESEMPIO QUERY_STRING
  ?FIND_MAP=1212&FIND_CQL_FILTER=sigla='9 TER GE'
  ?FIND_MAP=2156&FIND_CQL_FILTER=SCHEDA_PTR='2 GE'
  ?FIND_MAP=1212&FIND_LAYERS=L6422&FIND_CQL_FILTER=codice_comune='010001'
  ?FIND_MAP=2156&FIND_LAYERS=L6422&FIND_CQL_FILTER=codice_comune='010001'
*/

var getUrlParam = GV.utils.getUrlParam;

var id = getUrlParam('FIND_MAP');
var findOptions = buildFindOptions();

GV.init({
  debug: true,
  idMap: id,
  findOptions: findOptions,
  application: {
    name: 'cave-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
            },
          },
        },
      },
      tools: [
        { name: 'gv-geocoder', position: 'topleft' },
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
});

function buildFindOptions() {
  var map = getUrlParam('FIND_LAYERS') ? null : getUrlParam('FIND_MAP');
  var layers = getUrlParam('FIND_LAYERS') ? getUrlParam('FIND_LAYERS').split(',') : null;
  var cqlFilter = getUrlParam('FIND_CQL_FILTER');

  return {
    map: map,
    layers: layers,
    fields: null,
    values: null,
    cqlFilter: cqlFilter,
  };
}
