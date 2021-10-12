GV.globals.RL_CATALOG = 'int';
GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';


var auth = {
  type: 'NAM',
  options: {
    ruolo: 'PSA',
  },
};

if (GV.globals.ENV === 'TEST') auth = null;

GV.init({
  debug: true,
  idMap: '2208,1916',
  application: {
    name: 'psa-gv2',
    auth: auth,
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
                cat: GV.globals.RL_CATALOG,
                options: {
                  treeServiceUrl: '/geoservices/REST/config/catalog/',
                },
                tree: null,
              },
              canali: {
                type: 'tree',
                name: 'canali',
                label: 'Canali Tematici',
                options: {
                  canale: 166,
                  applicazione: null,
                  tematici: 'SI',
                  pub: false,
                },
                tree: null,
              },
            },
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
          position: 'topleft',
        },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2019',
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
