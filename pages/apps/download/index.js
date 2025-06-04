var id = GV.utils.getUrlParam("id");
var formato = GV.utils.getUrlParam("formato");
if (!formato) formato = GV.utils.getUrlParam("amp;formato");

var showAddMap = id ? false : true;
var collapsed = id ? true : false;

console.log("formato", formato);
// GESTIONE PAGINE CUSTOM --------------------------------------------
const customPageUrlList = {
  1881: "/geoservices/apps/viewer/pages/apps/atlante-geochimico/",
  2219: "/geoservices/apps/viewer/pages/apps/rqa/",
};
if (id && customPageUrlList[id]) {
  window.location = customPageUrlList[id];
}

// // ORTOFOTO -> RIDIRIGI A CATALOGO MAPPE
// const noDownloadList = ["2251", "2248", "1834", "1828"];
// if (id && noDownloadList.includes(id)) {
//   window.location = "https://geoportal.regione.liguria.it/catalogo/mappe.html";
// }

// GESTIONE PAGINE CUSTOM --------------------------------------------

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: "download-gv2",
    mapOptions: {
      click: "info",
    },
    layout: {
      legend: {
        options: {
          showBaseLayerSwitcher: true,
          useDownloadPanel: true,
          noDeleteButton: true,
          showDownloadPanelOnLoad: true,
          downloadFormat: formato,
          downloadPanelCloseMode: "closeWindow",
          collapsed: true,
        },
      },
      tools: [{ name: "gv-geocoder" }],
    },
  },
  baseLayers: [
    { type: "ESRI_IMAGERY", visible: true },
    { type: "OSM" },
    { type: "RL_ORTOFOTO_2019" },
    { type: "RL_CARTE_BASE" },
    { type: "BLANK" },
  ],
  maps: [],
});
