GV.globals.RL_MAP_CONFIG_SERVICE = '/geoservices/REST/config/map/';

const cod_com = GV.utils.getUrlParam('cod_com');

const lista_com = [
  {
    cod_com: '010008',
    cod_com_belfiore: 'B538',
    nome_com: 'CAMPOLIGURE',
    id_map: '2461',
  },
  {
    cod_com: '010061',
    cod_com_belfiore: 'L167',
    nome_com: 'TIGLIETO',
    id_map: '2469',
  },
  {
    cod_com: '009058',
    cod_com_belfiore: 'I946',
    nome_com: 'STELLA',
    id_map: '2480',
  },
  {
    cod_com: '010033',
    cod_com_belfiore: 'F098',
    nome_com: 'MELE',
    id_map: '2499',
  },
  {
    cod_com: '010032',
    cod_com_belfiore: 'F020',
    nome_com: 'MASONE',
    id_map: '2508',
  },
  {
    cod_com: '010051',
    cod_com_belfiore: 'H581',
    nome_com: 'ROSSIGLIONE',
    id_map: '2509',
  },
  {
    cod_com: '009055',
    cod_com_belfiore: 'I453',
    nome_com: 'SASSELLO',
    id_map: '2510',
  },
  {
    cod_com: '009063',
    cod_com_belfiore: 'L499',
    nome_com: 'URBE',
    id_map: '2511',
  },
];

const com = lista_com.find(com => {
  return com.cod_com === cod_com;
});

if (com) {
  init(com);
}

function callback() {
  const url = `https://geoservizi.regione.liguria.it/geoserver/M1947/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=L6422&cql_filter=CODICE_COMUNE=%27${cod_com}%27`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const bbox = data.bbox;
      let bounds = L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2]));
      // console.log(bounds);
      bounds = bounds.pad(0.1);
      GV.app.map.setRestrictedExtent(
        GV.app.map.getExtentAsString(bounds),
        GV.app.map.getBoundsZoom(bounds, false)
      );
    });
}

function init(com) {
  let tools = [
    { name: 'gv-geocoder' },
    { name: 'gv-info-button', active: true },
    { name: 'gv-measure-button' },
    { name: 'gv-layer-search-button' },
    {
      name: 'gv-ricerca-particella-button',
      options: {
        codComBelfiore: com.cod_com_belfiore,
      },
    },
    {
      name: 'gv-insert-point-button',
    },
    { name: 'gv-print-button' },
    // {
    //   name: 'gv-cdu-seleziona-particelle-button',
    //   options: {
    //     codComBelfiore: com.cod_com_belfiore,
    //   },
    // },
    { name: 'gv-scalebar', position: 'bottomleft' },
  ];

  const screenWidth = document.documentElement.clientWidth;
  const maxScreenWidth = 420;
  const largeScreen = screenWidth > maxScreenWidth;

  if (largeScreen) {
    tools.push({
      name: 'gv-help-button',
      options: {
        URL:
          'https://srvcarto.regione.liguria.it/geoservices/apps/viewer/static/img/cdu/MANUALE_WEBGIS.pdf',
      },
    });
  }

  GV.init({
    debug: true,
    idMap: com.id_map,
    application: {
      name: 'cdu',
      mapOptions: {
        zoomSnap: 0.5,
        click: 'info',
      },
      callback: callback,
      layout: {
        legend: {
          options: {
            show: true,
            showAddMap: true,
            showInfoMap: true,
            showDownloadTotale: true,
            showLayersTransparency: true,
            showBaseLayerSwitcher: true,
            addMapConfig: {
              panels: {
                repertorio: {
                  type: 'tree',
                  name: 'repertorio',
                  label: 'Repertorio Cartografico',
                },
                canali: {
                  type: 'tree',
                  name: 'canali',
                  label: 'Canali Tematici',
                  options: {
                    canale: 178,
                    tematici: 'SI',
                    pub: true,
                  },
                  tree: null,
                },
              },
            },
          },
        },
        tools: tools,
      },
    },
    baseLayers: [
      { type: 'ESRI_IMAGERY', visible: true },
      { type: 'OSM' },
      { type: 'RL_ORTOFOTO_2019' },
      { type: 'RL_ORTOFOTO_2016' },
      { type: 'RL_ORTOFOTO_2013' },
      { type: 'RL_ORTOFOTO_2010' },
      { type: 'RL_ORTOFOTO_2007' },
      { type: 'RL_CARTE_BASE' },
      { type: 'BLANK' },
    ],
    maps: [],
  });
}
