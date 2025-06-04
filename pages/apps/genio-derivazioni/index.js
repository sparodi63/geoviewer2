/*
ESEMPIO QUERY_STRING
?COORD=1453873,4909770  
?COORD=8.421021,44.339565&EPSG=4326
*/

var idMap = '1947'
var coord = GV.utils.getUrlParam('COORD')
//var epsg = '4326'
var epsg = '3003'

GV.init({
  debug: true,
  idMap: idMap,
  zoomTo: {
    coord: coord,
    epsg: epsg,
  },
  application: {
    name: 'derivazioni-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
            },
          },
        },
      },
      tools: [{ name: 'gv-geocoder', position: 'topleft' }, { name: 'gv-scalebar', position: 'bottomleft' }],
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
})
