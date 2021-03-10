var coord = GV.utils.getUrlParam('coord');

if (window.addEventListener) {
  window.addEventListener('message', onMessage, false);
} else if (window.attachEvent) {
  window.attachEvent('onmessage', onMessage, false);
}

function onMessage(event) {
  if (!event.data.coord) return;

  const zoomConfig = {
    epsg: event.data.epsg || 4326,
    coord: event.data.coord,
    zoom: 17,
  };
  // console.log(zoomConfig);
  GV.config.zoomToCoord(zoomConfig);
}

var callback = function(config) {
  if (!coord) return;
  const zoomConfig = {
    epsg: 4326,
    coord: coord,
  };
  GV.config.zoomToCoord(zoomConfig);
};

GV.init({
  debug: true,
  idMap: null,
  application: {
    name: 'marketing-territoriale-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      tools: [],
    },
    // callback: callback,
    callback: null,
  },
  baseLayers: [
    {
      type: 'OSM',
      visible: true,
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
