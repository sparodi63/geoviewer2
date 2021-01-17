var canale = "8";
var repertorio = "03";

var baseLayers = [
  { type: "ESRI_IMAGERY", visible: true },
  { type: "MAPBOX_STREETS" },
  { type: "OSM" },
  { type: "RL_ORTOFOTO_2016" },
  { type: "RL_CARTE_BASE" },
  { type: "BLANK" }
];
var idMap = "692";

GV.init({
  debug: true,
  idMap: idMap,
  agAppMapList: null,
  application: {
    name: "ambiente-gv2",
    mapOptions: {
      click: "info"
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showDownloadTotale: true,
          // showMapCatalogPanelOnStart: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: "tree",
                name: "repertorio",
                label: "Repertorio Cartografico",
                options: {
                  treeServiceUrl: "/geoservices/REST/config/catalog/"
                },
                tree: null
              },
              canali: {
                type: "tree",
                name: "canali",
                label: "Canali Tematici",
                options: {
                  canale: canale,
                  applicazione: null,
                  tematici: "SI",
                  pub: repertorio == "03"
                },
                tree: null
              }
            },
            activePanel: "canali"
          }
        }
      },
      tools: [
        { name: "gv-geocoder" },
        { name: "gv-info-button", active: true },
        { name: "gv-measure-button" },
        { name: "gv-layer-search-topo-button" },
        { name: "gv-ricerca-particella-button" },
        { name: "gv-print-button" },
        { name: "gv-scalebar", position: "bottomleft" }
      ]
    }
  },
  baseLayers: baseLayers,
  maps: []
});
