const id = GV.utils.getUrlParam('id');
// const comune = GV.utils.getUrlParam('comune');

const idMap = 2327;
const idLayer = 'L8699,L8698,L8700,L9122';
const layers = idLayer.split(',');
const idLayerComune = 'L6422';

loadConfig();

function loadConfig() {
  const findOptions = id
    ? {
        layers: layers,
        cqlFilter: 'ID_PROGETTO=' + id,
      }
    : null;

  // console.log('FINDOPTIONS', findOptions)

  let tools = [
    { name: 'gv-geocoder' },
    { name: 'gv-info-button', active: true },
    { name: 'gv-measure-button' },
    { name: 'gv-layer-search-topo-button' },
    { name: 'gv-ricerca-catastale-button' },
    { name: 'gv-print-button' },
    { name: 'gv-scalebar', position: 'bottomleft' },
  ];

  let conf = {
    debug: true,
    idMap: idMap,
    findOptions: findOptions,
    application: {
      name: 'via-pubblico-gv2',
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
