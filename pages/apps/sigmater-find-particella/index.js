// http://localhost:8081/?CODCOM=D969&FOGLIO=55&SEZIONE=C&NUMERO=117
// http://localhost:8081/?CODCOM=A388&FOGLIO=22&SEZIONE=_&NUMERO=386

const idMap = '1047';

const codcom = GV.utils.getUrlParam('CODCOM');
const foglio = GV.utils.getUrlParam('FOGLIO');
const sezione = GV.utils.getUrlParam('SEZIONE');
const numero = GV.utils.getUrlParam('NUMERO');

const findOptions = setFindOptions();

GV.init({
  debug: true,
  idMap: idMap,
  findOptions: findOptions,
  application: {
    name: 'sigmater-find-particelle-gv2',
    mapOptions: {
      type: 'openlayers',
      click: null,
    },
    layout: {
      legend: {
        options: {
          show: true,
          showBaseLayerSwitcher: true,
        },
      },
      tools: [
        // { name: 'gv-print-button' },
        {
          name: 'gv-scalebar',
          position: 'bottomleft',
        },
      ],
    },
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
      type: 'RL_ORTOFOTO_2019',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});

function setFindOptions() {
  if (codcom && foglio && sezione && numero) {
    const padded = numero.padEnd(10, ' ');
    return {
      layers: ['L2624'],
      cqlFilter: `ct24_cod_com='${codcom}' AND ct24_foglio=${foglio} AND ct24_sez='${sezione}' AND ct24_numero='${padded}'`,
      maxZoom: 19,
    };
  }
}
