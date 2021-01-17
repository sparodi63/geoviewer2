// var id = 'D589';

// GV.globals.RL_MAP_CONFIG_SERVICE = 'http://srvcarto.regione.liguria.it/geoservices/REST/config/map/'
// GV.globals.RL_MAP_CONFIG_SERVICE = "/geoservices/REST/config/map/";

GV.globals.FOTOTECA_SEL_VOLO = null;
GV.globals.FOTOTECA_CARRELLO = [];

GV.init({
  debug: true,
  idMap: 'D74',
  application: {
    name: 'fototeca-gv2',
    mapOptions: {
      // click: 'info',
    },
    layout: {
      tools: [
        {
          name: 'gv-fototeca-voli',
        },
        {
          name: 'gv-fototeca-selezione-territoriale-button',
        },
        {
          name: 'gv-fototeca-scheda-volo-button',
        },
        {
          name: 'gv-fototeca-carrello-button',
        },
        {
          name: 'gv-ricerca-particella-button',
        },
        {
          name: 'gv-geocoder',
          position: 'topright',
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
  ],
  maps: [],
});
