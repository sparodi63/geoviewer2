//?FIND_CQL_FILTER=sigla = '9 TER GE'
//?FIND_CQL_FILTER=sigla%20=%20%279%20TER%20GE%27

var id = '1212'

var findOptions = GV.utils.buildFindOptionsFromQueryStringParams()
findOptions.map = id

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
                  treeServiceUrl: 'http://srvcarto.regione.liguria.it/geoservices/REST/config/catalog/',
                },
                tree: null,
              },
            },
          },
        },
      },
      tools: [{ name: 'gv-geocoder', position: 'topleft' }, { name: 'gv-scalebar', position: 'bottomleft' }],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'MAPBOX_STREETS' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
})
