
// http://localhost:8081/?FIND_LAYERS=L4382&FIND_CQL_FILTER=cod_i=%2707/00208369%27

var id = '1646'
var findOptions = GV.utils.buildFindOptionsFromQueryStringParams()
var download = GV.utils.getUrlParam('DOWNLOAD')

var showDownloadPanelOnLoad = false
var collapsed = false
var tools = [
  { name: 'gv-geocoder' },
  { name: 'gv-info-button', active: true },
  { name: 'gv-measure-button' },
  { name: 'gv-layer-search-button' },
  { name: 'gv-ricerca-particella-button' },
  { name: 'gv-print-button' },
  { name: 'gv-scalebar', position: 'bottomright' },
  {
    name: 'gv-inner-html', position: 'bottomleft', options: {
      props: [{ html: '<div id="titolo"> <div id="loghi_sx"><a href="http://www.liguriavincoli.it/home.asp"><img src="/geoviewer2/static/img/vincoli/vincoli_logo_sx_1.jpg"></a></div> <div id="loghi_dx"><a href="http://www.beniculturali.it" onclick="window.open(this.href);return false;"><img src="/geoviewer2/static/img/vincoli/vincoli_logo_dx_1.jpg"></a><a href="http://www.regione.liguria.it" onclick="window.open(this.href);return false;"><img src="/geoviewer2/static/img/vincoli//vincoli_logo_dx_2.jpg"></a></div> </div>' }]
    }
  },
]

if (download === "TRUE") {
  showDownloadPanelOnLoad = true
  collapsed = true
  tools = [ 
    { name: 'gv-geocoder' },
    { name: 'gv-scalebar', position: 'bottomright' },
    {
      name: 'gv-inner-html', position: 'bottomleft', options: {
        props: [{ html: '<div id="titolo"> <div id="loghi_sx"><a href="http://www.liguriavincoli.it/home.asp"><img src="/geoviewer2/static/img/vincoli/vincoli_logo_sx_1.jpg"></a></div> <div id="loghi_dx"><a href="http://www.beniculturali.it" onclick="window.open(this.href);return false;"><img src="/geoviewer2/static/img/vincoli/vincoli_logo_dx_1.jpg"></a><a href="http://www.regione.liguria.it" onclick="window.open(this.href);return false;"><img src="/geoviewer2/static/img/vincoli//vincoli_logo_dx_2.jpg"></a></div> </div>' }]
      }
    }
  ]
}

GV.init({
  debug: true,
  idMap: id,
  findOptions: findOptions,
  application: {
    name: 'vincoli-gv2',
    mapOptions: {
      click: 'info',
    },
    layout: {
      legend: {
        options: {
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showDownloadTotale: false,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          collapsed: collapsed,
          showDownloadPanelOnLoad: showDownloadPanelOnLoad,
          downloadPanelCloseMode: 'closeWindow',
          addMapConfig: {
            panels: {
              repertorio: {
                type: 'tree',
                name: 'repertorio',
                label: 'Repertorio Cartografico',
              },
              wms: {
                label: 'Servizi WMS',
              },
              kml: {
                label: 'KML/GPX/JSON',
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
    { type: 'RL_ORTOFOTO_2022' },
    { type: 'RL_CARTE_BASE' },
    { type: 'BLANK' },
  ],
  maps: [],
})

