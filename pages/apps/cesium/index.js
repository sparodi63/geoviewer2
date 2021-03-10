var id = GV.utils.getUrlParam('id');

function loadData(map) {
  // console.log(map)
  // GeoJSON
  // GV.app.map.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('https://geoservizi.regione.liguria.it/geoserver/M1630/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=M1630%3AL4415&maxFeatures=50&outputFormat=application%2Fjson&srsName=EPSG%3A4326', {
  //   stroke: Cesium.Color.RED,
  //   strokeWidth: 3,
  //   markerSymbol: '?'
  // }));
  // KML
  GV.app.map.viewer.dataSources.add(
    Cesium.KmlDataSource.load(
      'https://geoservizi.regione.liguria.it/geoserver/M1630/wms/kml?layers=M1630:L4415&mode=download',
      {
        camera: GV.app.map.viewer.scene.camera,
        canvas: GV.app.map.viewer.scene.canvas,
        clampToGround: true,
      }
    )
  );
}

GV.init({
  debug: true,
  idMap: id,
  findOptions: null,
  application: {
    name: 'test-cesium',
    mapOptions: {
      type: 'cesium',
      click: 'info',
      navigationControl: true,
      // terrainProviderURL:
      //   "https://geoservizi.regione.liguria.it/geoserver/DTM/ows",
      // terrainProviderLayerName: "DTM_dbtopo_5m_wgs84"
    },
    layout: {
      legend: {
        options: {
          // showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          useDownloadPanel: true,
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
                type: 'WMS',
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
            activePanel: 'repertorio',
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
        },
      ],
    },
    callback: loadData,
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'OSM',
    },
    {
      type: 'RL_ORTOFOTO_2016',
      // visible: true
    },
    {
      type: 'RL_CARTE_BASE',
    },
  ],
  maps: [],
});
