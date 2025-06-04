// ?url=http://localhost:8099/geoserver/M1237/ogc/features/collections/L3147/items/L3147.195121_1?f=application/json
var url = GV.utils.getUrlParam('url');

function callback() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const feature = data.features[0];
      GV.app.map.loadLayers([
        {
          name: 'hilite',
          type: 'JSON',
          style: {
            color: "#ff3300",
            radius: 4,
            weight: 10,
            opacity: 0.7,
            fillOpacity: 0.5,
          },
          visible: true,
          pointToLayer: function(feature, latlng) {
            const icon = L.icon({
              iconUrl: `/geoservices/apps/viewer/static/img/marker-icon.png`,
              iconSize: [25, 41],
            });
            const alt = feature.properties.fid;
            return L.marker(latlng, {
              icon: icon,
              alt: alt,
            });
          },
        },
      ]);
      const layer = GV.app.map.getLayerByName('hilite');
      layer.addData(feature);
      const bbox = data.bbox;
      let bounds = L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2]));
      bounds = bounds.pad(1);
      GV.app.map.fitBounds(bounds);
    });
}

function getStyle(type) {
  let color = '#ffcc00';
  let style;
  switch (type) {
    case 'Point':
    case 'MultiPoint':
      style = {
        color: color,
        radius: 4,
        weight: 4,
        opacity: 0.5,
        fillOpacity: 0.5,
      };
      break;
    case 'LineString':
    case 'MultiLineString':
      style = {
        color: color,
        weight: 5,
      };
      break;
    case 'Polygon':
    case 'MultiPolygon':
      style = {
        color: color,
        fillOpacity: 0.0,
        weight: 5,
        opacity: 0.6,
      };
      break;
  }
  return style;
}

GV.init({
  debug: true,
  idMap: null,
  application: {
    name: 'api-feature-gv2',
    mapOptions: {
      click: 'info',
      maxZoom: 19,
    },
    callback: callback,
    layout: {
      tools: [],
    },
  },
  baseLayers: [
    {
      type: 'OSM',
      visible: true,
    },
    {
      type: 'TS_STREETS',
    },
  ],
  maps: [],
});
