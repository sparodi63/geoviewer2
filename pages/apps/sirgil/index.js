// http://srvcarto.regione.liguria.it/geoservices/apps/viewer/pages/apps/sirgil/?chiave=0000279649

GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

var value = GV.utils.getUrlParam('chiave');

var id = value ? '1276' : '2165';

GV.init({
  debug: true,
  idMap: id,
  // findOptions: findOptions,
  application: {
    name: 'sirgil-gv2',
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
      tools: [
        { name: 'gv-geocoder' },
        { name: 'gv-info-button', active: true },
        { name: 'gv-measure-button' },
        { name: 'gv-layer-search-button' },
        { name: 'gv-ricerca-particella-button' },
        { name: 'gv-print-button' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
    },
    callback: function(app) {
      if (value) {
        const url = `/geoservices/REST/sirgil/get_id/${value}`;
        GV.utils.getGeneric(url).then(function(resp) {
          if (resp.success) {
            var findOptions = {
              map: id,
              cqlFilter: `ID IN (${resp.data})`,
            };
            GV.app.map.find(findOptions);
          } else {
            GV.utils.notification('Nessun elemento trovato');
          }
        });
      }
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
