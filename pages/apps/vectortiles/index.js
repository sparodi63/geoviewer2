var id = GV.utils.getUrlParam('id');

var callback = function(config) {
  var vectorTileStyling = {
    water: {
      fill: true,
      weight: 1,
      fillColor: '#06cccc',
      color: '#06cccc',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    waterway: {
      weight: 1,
      fillColor: '#2375e0',
      color: '#2375e0',
      fillOpacity: 0.0,
      opacity: 0.0,
    },
    landcover: {
      fill: true,
      weight: 1,
      fillColor: '#53e033',
      color: '#53e033',
      fillOpacity: 0.0,
      opacity: 0.0,
    },
    landuse: {
      fill: true,
      weight: 1,
      fillColor: '#e5b404',
      color: '#e5b404',
      fillOpacity: 0.0,
      opacity: 0.0,
    },
    park: {
      fill: true,
      weight: 1,
      fillColor: '#84ea5b',
      color: '#84ea5b',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    admin: {
      weight: 1,
      fillColor: '#c545d3',
      color: '#c545d3',
      fillOpacity: 0.0,
      opacity: 0.4,
    },
    aeroway: {
      weight: 1,
      fillColor: '#51aeb5',
      color: '#51aeb5',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    road: {
      weight: 1,
      fillColor: '#ff0000',
      color: '#ff0000',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    tunnel: {
      weight: 0.5,
      fillColor: '#ff0000',
      color: '#f2b648',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    bridge: {
      weight: 0.5,
      fillColor: '#ff0000',
      color: '#f2b648',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    building: {
      fill: true,
      weight: 1,
      fillColor: '#2b2b2b',
      color: '#2b2b2b',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    water_name: {
      weight: 1,
      fillColor: '#022c5b',
      color: '#022c5b',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    transportation_name: {
      weight: 1,
      fillColor: '#bc6b38',
      color: '#bc6b38',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    place: {
      weight: 1,
      fillColor: '#f20e93',
      color: '#f20e93',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    housenumber: {
      weight: 1,
      fillColor: '#ef4c8b',
      color: '#ef4c8b',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
    poi: {
      weight: 1,
      fillColor: '#3bb50a',
      color: '#3bb50a',
      fillOpacity: 0.2,
      opacity: 0.4,
    },
  };

  var pbfConfig = {
    id: 'PBF',
    name: 'Test Vector Tiles',
    layers: [
      {
        type: 'PBF',
        name: 'PBF',
        flagBaseVectorLayer: false,
        id: 'PBF',
        idMap: 'PBF',
        legend: {
          icon: '/geoviewer/img/legend/classi.gif',
          label: 'Test Vector Tiles',
        },
        visible: true,
        pbfParams: {
          url:
            'https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token={token}',
          token:
            'pk.eyJ1Ijoic3RlZmFub3Bhcm9kaSIsImEiOiJjaXRma2VzeWgwMGVmMnh0bzJzMmVjcGVtIn0.2lTBdEwBI6_2QBzboizE5g',
          style: vectorTileStyling,
        },
      },
    ],
  };
  GV.config.addMapConfig(pbfConfig);
};

GV.init({
  debug: true,
  idMap: id,
  application: {
    name: 'marketing-territoriale-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
        },
      },
      tools: [
        {
          position: 'topleft',
          items: [
            {
              name: 'geocoder',
            },
          ],
        },
        {
          position: 'bottomright',
          items: [
            {
              name: 'zoom',
            },
          ],
        },
        {
          position: 'bottomleft',
          items: [
            {
              name: 'scalebar',
            },
          ],
        },
      ],
    },
    callback: callback,
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
    },
    {
      type: 'MAPBOX_STREETS',
    },
    {
      type: 'RL_ORTOFOTO_2016',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
      visible: true,
    },
  ],
  maps: [],
});
