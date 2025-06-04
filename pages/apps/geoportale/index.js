var id = GV.utils.getUrlParam('id')




// GESTIONE PAGINE CUSTOM --------------------------------------------
var customPageUrlList = {
  1881: '/geoservices/apps/viewer/pages/apps/atlante-geochimico/',
  1884: '/geoservices/apps/viewer/pages/apps/geoportale/?id=2363',
  2219: '/geoservices/apps/viewer/pages/apps/rqa/',
};
if (id && customPageUrlList[id]) {
  window.location = customPageUrlList[id];
}
// GESTIONE PAGINE CUSTOM --------------------------------------------

GV.init({
  debug: true,
  idMap: id,
  // geoserverUrl: 'http://10.20.4.120:8081/',
  application: {
    name: 'geoportale-gv2',
    mapOptions: {
      click: 'info',
      maxZoom: 19,
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
        { name: 'gv-geocoder', position: 'topleft' },
        { name: 'gv-scalebar', position: 'bottomleft' },
      ],
    },
  },
  baseLayers: [
    { type: 'ESRI_IMAGERY', visible: true },
    { type: 'OSM' },
    { type: 'RL_ORTOFOTO_2022' },
    { type: 'RL_ORTOFOTO_2019' },
    { type: 'RL_ORTOFOTO_2016' },
    { type: 'RL_ORTOFOTO_2013' },
    { type: 'RL_ORTOFOTO_2010' },
    { type: 'RL_ORTOFOTO_2007' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
})
