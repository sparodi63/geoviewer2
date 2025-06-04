var id = '2295';



// const callback = function (app) {
//   GV.config.maps[0].layers[0].infoBuffer = 0
// }

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'distretti-sociosanitari-gv2',
    mapOptions: {
      click: 'info',
      maxZoom: 19,
    },
    layout: {
      legend: null,
      tools: [
      ],
    },
    // callback: callback
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'BLANK',
    }
  ],
});
