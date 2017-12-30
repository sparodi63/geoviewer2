Ext.application({
  name: "repertorio",

  ricercaParticellaCatastale: function(
    codiceLivello,
    bounds,
    layer,
    chiave,
    valore
  ) {
    //var searchBounds = OpenLayers.Bounds.fromString(CWN2.Util.transformStrBounds("EPSG:3003", CWN2.app.map.projection, bounds));

    CWN2.Util.ajaxRequest({
      type: "JSONP",
      url: "/geoservices/REST/coordinate/transform_bbox/3003/3857/" + bounds,
      callBack: function(response) {
        var searchBounds = OpenLayers.Bounds.fromString(
          response.data[0][0] + "," + response.data[1][0]
        );
        CWN2.FeatureLoader.loadMarker({
          x: searchBounds.getCenterLonLat().lon,
          y: searchBounds.getCenterLonLat().lat,
          map: CWN2.app.map,
          label: valore.replace("_", "unica"),
          zoomLevel: 17
        });
      }
    });
  },

  launch: function() {
    var idMap = CWN2.Util.getUrlParam("id");

    var toolbar = {
      scale: "small",
      itemGroups: [
        {
          items: [
            { name: "pan" },
            { name: "zoomin" },
            { name: "zoomout" },
            { name: "zoomToInitialExtent" },
            { name: "zoomprevious" },
            { name: "zoomnext" }
          ]
        },
        {
          items: [{ name: "measureline" }, { name: "measurearea" }]
        },
        {
          items: [
            {
              name: "infowms",
              options: {
                //radius: 100
              }
            },
            { name: "transparency" },
            {
              name: "loadlayers",
              panels: [
                {
                  type: "wms",
                  name: "Livelli WMS",
                  options: {}
                },
                {
                  type: "kml",
                  name: "File KML/GPX",
                  options: {}
                }
              ]
            },
            {
              name: "find",
              panels: [
                { type: "layer", name: "Livello" },
                { type: "coordinate", name: "Coordinate" }
              ]
            },
            {
              name: "routeplanner",
              options: { flagLimitaTerritorioLigure: "true" }
            },
            {
              name: "s3ricerche",
              options: {
                id: "s3ricerche",
                url:
                  "/sigmater/script/CwRicercheS3.asp?applicazione=REPERTORIO",
                tooltip: "Ricerca Particella Catastale",
                render: "panel"
              }
            },
            { name: "print" },
            { type: "combo", name: "geocoder" }
          ]
        }
      ]
    };

    if (!idMap) {
      //toolbar.pressed = "loadlayers"
    }

    var header = {
      html:
        "<div id='titolo'><div>REGIONE LIGURIA - VISUALIZZATORE TECNICO</div></div>",
      height: 53
    };

    var config = {
      application: {
        mapOptions: {
          initialExtent: "830036,5402959,1123018,5597635",
          restrictedExtent: "600000,5300000,1300000,5700000"
        },
        layout: {
          //          header: header,
          mapTitle: "REGIONE LIGURIA - VISUALIZZATORE TECNICO",
          statusBar: true,
          legend: {
            type: "gv-legend",
            options: {
              show: true,
              showInfoMap: true,
              showBaseLayerSwitcher: true,
              showLayersTransparency: true,
              showAddMap: true,
              addMapConfig: {
                panels: {
                  repertorio: {
                    type: "tree",
                    name: "repertorio",
                    label: "Repertorio Cartografico",
                    options: {
                      treeServiceUrl:
                        "http://srvcarto.regione.liguria.it/geoservices/REST/config/catalog/"
                    },
                    tree: null
                  }
                }
              }
            }
          },
          widgets: [{ name: "ScaleCombo" }, { name: "CoordinateReadOut" }],
          toolbar: toolbar
        }
      },
      baseLayers: [
        { type: "no_base" },
        { type: "rl_ortofoto_2016" },
        { type: "rl_carte_base" },
        { type: "OSM" },
        { type: "google_terrain" },
        { type: "google_roadmap" },
        { type: "google_satellite", visible: true }
      ]
    };

    CWN2.app.load({
      appConfig: config,
      idMap: idMap,
      loadBaseLayers: true,
      debug: true,
      useGV: true,
      app: "geoportale"
    });
  } //eo launch
});
