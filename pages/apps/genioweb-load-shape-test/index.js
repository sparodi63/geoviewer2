// http://localhost:8081/?PROV=GE&codice_pratica=GCI05508&TOKEN=fkdsgfalkjgad

const env = GV.globals.GENIO_WEB_ENV || "TEST";
// const env = "TEST";
// console.log("ENV", env);

const codice_pratica = GV.utils.getUrlParam("CODICE_PRATICA");
const token = GV.utils.getUrlParam("TOKEN");
const prov = GV.utils.getUrlParam("PROV");

// const auth =
//   env === "TEST"
//     ? null
//     : {
//         type: "S3",
//         options: {
//           s3Token: token,
//           s3TokenType: "genio",
//           s3TokenProv: prov,
//         },
//       };

const auth = null;
    
if (env === "TEST") {
  GV.globals.GW_CONFIG = {
    GE: {
      id_map_tmp: "M2545",
      id_layer_tmp: "L9973",
      codIstatProv: "010",
      extent: "949000,5498925,1076251,5571286",
      id_map_pratica: "2120",
      id_layer_pratica: "L7240",
      id_canali: "55,159",
    },
    IM: {
      id_map_tmp: "M2545",
      id_layer_tmp: "L9973",
      codIstatProv: "008",
      extent: "834446,5429486,907520,5489412",
      id_map_pratica: "2120",
      id_layer_pratica: "L7240",
      id_canali: "55,159",
    },
    SV: {
      id_map_tmp: "M2545",
      id_layer_tmp: "L9973",
      codIstatProv: "009",
      extent: "887493,5452722,967599,5551785",
      id_map_pratica: "2120",
      id_layer_pratica: "L7240",
      id_canali: "55,159",
    },
    SP: {
      id_map_tmp: "M2545",
      id_layer_tmp: "L9973",
      codIstatProv: "011",
      extent: "1052903,5465564,1126435,5534051",
      id_map_pratica: "2167",
      id_layer_pratica: "L7761",
      id_canali: "55,160",
    },
  };
} else {
  // CONFIGURAZIONE PROD
  GV.globals.GW_CONFIG = {
    GE: {
      id_map_tmp: "M2579",
      id_layer_tmp: "L10088",
      codIstatProv: "010",
      extent: "949000,5498925,1076251,5571286",
      id_map_pratica: "2170",
      id_layer_pratica: "L7783",
      id_canali: "55,161",
    },
    IM: {
      id_map_tmp: "M2581",
      id_layer_tmp: "L10091",
      codIstatProv: "008",
      extent: "834446,5429486,907520,5489412",
      id_map_pratica: "2173",
      id_layer_pratica: "L7810",
      id_canali: "55,164",
    },
    SV: {
      id_map_tmp: "M2580",
      id_layer_tmp: "L10090",
      codIstatProv: "009",
      extent: "887493,5452722,967599,5551785",
      id_map_pratica: "2172",
      id_layer_pratica: "L7801",
      id_canali: "55,163",
    },
    SP: {
      id_map_tmp: "M2582",
      id_layer_tmp: "L10089",
      codIstatProv: "011",
      extent: "1052903,5465564,1126435,5534051",
      id_map_pratica: "2171",
      id_layer_pratica: "L7792",
      id_canali: "55,162",
    },
  };
}

GV.globals.GW_CONFIG.codice_pratica = codice_pratica;
GV.globals.GW_CONFIG.prov = prov;

const id_canali = GV.globals.GW_CONFIG[prov].id_canali;
const extent = GV.globals.GW_CONFIG[prov].extent;
const id_layer_tmp = GV.globals.GW_CONFIG[prov].id_layer_tmp;
const id_layer_pratica = GV.globals.GW_CONFIG[prov].id_layer_pratica;

init();

async function load_map() {
  let layer_tmp, layer_pratica, layer_altre_pratiche;

  // CARICAMENTO LIVELLO STAGING
  layer_tmp = await get_layer_config(id_layer_tmp);
  layer_tmp.wmsParams.cql_filter = `CODICE_PRATICA='${codice_pratica}'`;

  // CARICAMENTO LIVELLO GEOMETRUE GIA' PRESENTI
  layer_pratica = await get_layer_config(id_layer_pratica);
  layer_pratica.name = `L${id_layer_pratica}_FILTERED`;
  layer_pratica.wmsParams.cql_filter = `CODICE_PRATICA='${codice_pratica}'`;
  layer_pratica.wmsParams.styles = `gw_load_shape_hilite`;
  layer_pratica.legend.label = "Geometrie già presenti per la pratica";
  layer_pratica.legend.icon =
    layer_pratica.legend.icon + `&style=${layer_pratica.wmsParams.styles}`;

  // CARICAMENTO LIVELLO GEOMETRIE ALTRE PRATICHE
  layer_altre_pratiche = await get_layer_config(id_layer_pratica);
  layer_altre_pratiche.wmsParams.cql_filter = `CODICE_PRATICA <> '${codice_pratica}'`;
  layer_altre_pratiche.legend.label = "Altre Pratiche Demaniali";

  // CARICO LA CONFIGURAZIONE DELLA MAPPA
  GV.config.addMapConfig({
    id: "GENIOWEB-LOAD-SHAPE",
    name: "GenioWeb Caricamento Shape",
    flagGeoserver: true,
    layers: [layer_altre_pratiche, layer_pratica, layer_tmp],
  });

  // Faccio il fit delle geometrie trovate
  const bbox = await get_bbox(codice_pratica);
  if (bbox) {
    GV.app.map.setExtent(bbox);
    if (GV.app.map.getZoom() > 18) GV.app.map.setZoom(18);
  } else {
    GV.utils.notification(
      "Geometrie di staging non trovate per la pratica",
      "error"
    );
  }
}

async function get_bbox(codice_pratica) {
  const url = `https://geoservizi.regione.liguria.it/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${GV.globals.GW_CONFIG[prov].id_map_tmp}:${id_layer_tmp}&outputFormat=application/json&srsName=epsg:3857&cql_filter=CODICE_PRATICA=%27${codice_pratica}%27`;
  let response = await fetch(url);
  let data = await response.json();
  if (data.features && data.features.length > 0) {
    const bbox = data.bbox.join(",");
    return bbox;
  } else {
    return null;
  }
}

async function get_layer_config(id) {
  const id_layer = id.replace("L", "");
  let response = await fetch(
    `${GV.globals.RL_LAYER_CONFIG_SERVICE}/${id_layer}`
  );
  let data = await response.json();
  if (data.success) {
    return data.data[0];
  } else {
    throw data.message;
  }
}

function init() {
  if (!codice_pratica) {
    alert("Parametro CODICE_PRATICA non presente");
    return;
  }
  if (!prov) {
    alert("Parametro PROV non presente");
    return;
  }
  if (!token) {
    alert("Parametro TOKEN non presente");
    return;
  }

  GV.init({
    debug: true,
    application: {
      name: "genioweb-load-shape-gv2",
      auth: auth,
      mapOptions: {
        click: "info",
        initialExtent: extent,
        restrictedExtent: extent,
      },
      callback: load_map,
      layout: {
        legend: {
          options: {
            show: true,
            showAddMap: true,
            dontShowMapCatalogPanelOnStart: true,
            showInfoMap: true,
            noDeleteButton: true,
            showLayersTransparency: true,
            showBaseLayerSwitcher: true,
            addMapConfig: {
              panels: {
                repertorio: {
                  type: "tree",
                  name: "repertorio",
                  label: "Repertorio Cartografico",
                },
                canali: {
                  type: "tree",
                  name: "canali",
                  label: "",
                  options: {
                    multiCanale: true,
                    canale: id_canali,
                    applicazione: "ECO3",
                    tematici: "SI",
                    pub: false,
                  },
                  tree: null,
                },
              },
              activePanel: "canali",
            },
          },
        },
        tools: [
          {
            name: "gv-geocoder",
          },
          {
            name: "gv-button-genio-conferma-load-shape",
          },
          // {
          //   name: 'gv-back-button',
          //   options: {
          //     confirm: true,
          //     action: 'close',
          //   },
          // },
          {
            name: "gv-scalebar",
            position: "bottomleft",
          },
        ],
      },
    },
    baseLayers: [
      {
        type: "ESRI_IMAGERY",
        visible: true,
      },
      {
        type: "OSM",
      },
      {
        type: "RL_ORTOFOTO_2019",
      },
      {
        type: "RL_CARTE_BASE",
      },
      {
        type: "BLANK",
      },
    ],
    maps: [],
  });
}

// CHIAMATA GET ID LIST
// const id_list = await get_id_list(codice_pratica);
// if (!id_list) {
//   alert('Nessuna geometria trovata per il codice pratica specificato');
//   return;
// }
// const bbox = id_list.bbox;
// const ids = id_list.ids;
// layer_tmp.wmsParams.cql_filter = `ID in (${ids})`;

// async function get_id_list(codice_pratica) {
//   const url = `https://geoservizi.regione.liguria.it/geoserver/M2545/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=M2545:L9973&maxFeatures=50&outputFormat=application/json&srsName=epsg:3857&cql_filter=CODICE_PRATICA=%27${codice_pratica}%27`;
//   let response = await fetch(url);
//   let data = await response.json();
//   if (data.features && data.features.length > 0) {
//     const bbox = data.bbox.join(',');
//     const ids = data.features.map(f => f.properties.ID);
//     return { ids: ids.join(','), bbox: bbox };
//   } else {
//     return null;
//   }
// }
