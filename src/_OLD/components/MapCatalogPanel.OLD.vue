<template>
  <div class="gv-map-catalog-panel gv-inverted-color-scheme" id="gv-map-catalog-panel">
    <gv-title v-draggable :title="title" :hide="true" :divId="'gv-map-catalog-panel'"></gv-title>
    <div class="gv-map-catalog-panel-body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane v-if="panels.repertorio" :label="panels.repertorio.label" name="repertorio">
          <div>
            <form @submit.prevent.stop @keyup.enter="submitRepertorio">
              <el-row class="gv-map-catalog-panel-form" type="flex" justify="left">
                <el-col :span="11">
                  <el-input
                    id="gv-map-catalog-panel-repertorio-search"
                    placeholder="Ricerca..."
                    v-model="formData.query"
                    size="mini"
                  >
                    <i
                      style="cursor:default;"
                      slot="suffix"
                      class="el-input__icon el-icon-circle-close"
                      @click="handleRepertorioIconClick"
                    ></i>
                  </el-input>
                </el-col>
                <el-col v-if="showEnti" :span="20">
                  <span class="gv-map-catalog-label">nelle cartografie di</span>
                  <el-select
                    v-model="formData.ente"
                    size="mini"
                    filterable
                    clearable
                    placeholder="tutti gli enti"
                    @change="onChangeEnte"
                  >
                    <el-option
                      v-for="item in enti"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </form>
            <div>
              <div class="gv-map-catalog-tree">
                <el-tree
                  id="gv-map-catalog-repertorio-tree"
                  :data="panels.repertorio.tree"
                  show-checkbox
                  @check-change="handleSelectionChange"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  node-key="id"
                  accordion
                  :render-content="renderContent"
                  :default-expanded-keys="expanded_nodes"
                ></el-tree>
              </div>
              <el-button
                type="primary"
                @click="submitMultiSel"
                class="gv-map-catalog-button"
                size="mini"
              >
                <span>Carica</span>
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="panels.canali" :label="panels.canali.label" name="canali">
          <div>
            <div class="gv-map-catalog-tree">
              <el-tree
                :data="panels.canali.tree"
                show-checkbox
                @check-change="handleSelectionChange"
                :props="defaultProps"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
            <el-button
              type="primary"
              @click="submitMultiSel"
              class="gv-map-catalog-button"
              size="mini"
            >
              <span>Carica</span>
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="panels.wms" :label="panels.wms.label" name="wms">
          <div @submit.prevent.stop @keyup.enter="submitWms">
            <el-form :inline="true" :model="wmsForm" ref="wms-form">
              <div>
                <el-form-item>
                  <el-input
                    style="width: 450px;"
                    size="mini"
                    placeholder="URL Servizio (http://example.org/?&service=WMS&request=GetCapabilities) "
                    v-model="wmsForm.URL"
                    ref="wmsUrl"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="wmsForm.showLayerList"
                  :label="wmsForm.serviceTitle"
                ></el-form-item>
              </div>
              <div>
                <el-form-item>
                  <el-button
                    type="primary"
                    class="gv-map-catalog-button"
                    size="mini"
                    @click="submitWms"
                    >Lista Livelli</el-button
                  >
                </el-form-item>
                <el-form-item v-if="wmsForm.showLayerList" label="Livelli">
                  <el-select
                    v-model="wmsForm.layerList.name"
                    style="width: 350px;"
                    size="mini"
                    placeholder="Seleziona Livello per caricarlo in mappa"
                    @change="onChangeWmsLayerList"
                  >
                    <el-option
                      v-for="layer in wmsForm.layerList"
                      :key="layer.name"
                      :label="layer.title"
                      :value="layer.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="panels.kml" :label="panels.kml.label" name="kml">
          <div @submit.prevent.stop @keyup.enter="submitKml">
            <el-form :model="kmlForm" ref="kml-form">
              <el-form-item>
                <el-input
                  style="width: 450px;"
                  size="mini"
                  placeholder="Inserisci la URL di un file KML/GPX/JSON - Es.: http://example.org/file.kml "
                  v-model="kmlForm.URL"
                >
                  <i
                    style="cursor:default;"
                    slot="suffix"
                    class="el-input__icon el-icon-circle-close"
                    @click="handleKmlIconClick"
                  ></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-upload
                  action="/geoservices/REST/utils/file_upload"
                  :limit="1"
                  :file-list="kmlForm.fileList"
                  :auto-upload="false"
                  :on-success="onKmlUploadSuccess"
                  ref="kmlUpload"
                >
                  <el-button
                    slot="trigger"
                    class="gv-map-catalog-button"
                    size="small"
                    type="primary"
                    >Seleziona un file locale di tipo KML/GPX/JSON</el-button
                  >
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="gv-map-catalog-button"
                  size="mini"
                  @click="submitKml"
                  >Carica Livello</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="panels.risknat" :label="panels.risknat.label" name="risknat">
          <div v-show="risknatForm.showForm">
            <el-form :inline="true" :model="risknatForm" ref="risknat-form">
              <div>
                <el-select
                  v-model="risknatForm.selectedType"
                  size="mini"
                  placeholder="Seleziona Tipo "
                  @change="onChangeRisknatType"
                >
                  <el-option
                    v-for="item in risknatForm.typeList"
                    :key="item.codice"
                    :label="item.label"
                    :value="item.codice"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="risknatForm.selectedTarget"
                  v-show="risknatForm.showTargetCombo"
                  size="mini"
                  filterable
                  placeholder="Seleziona Dataset"
                  @change="onChangeRisknatCombo"
                >
                  <el-option
                    v-for="item in risknatForm.targetList"
                    :key="item.codice"
                    :label="item.label"
                    :value="item.codice"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="risknatForm.selectedArea"
                  v-show="risknatForm.showAreaCombo"
                  size="mini"
                  filterable
                  placeholder="Seleziona Dataset"
                  @change="onChangeRisknatCombo"
                >
                  <el-option
                    v-for="item in risknatForm.areaList"
                    :key="item.codice"
                    :label="item.label"
                    :value="item.codice"
                  ></el-option>
                </el-select>
              </div>
              <div>
                <el-checkbox v-model="risknatForm.zoom">Zoom sul Dataset</el-checkbox>
              </div>
              <div>
                <el-button
                  type="primary"
                  @click="infoDatasetRisknat"
                  class="gv-map-catalog-button"
                  size="mini"
                >
                  <span>Info sul Datset</span>
                </el-button>
                <el-button
                  type="primary"
                  @click="submitRisknat"
                  class="gv-map-catalog-button"
                  size="mini"
                >
                  <span>Carica</span>
                </el-button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import mountComponent from '../util/mountComponent';
import uri from 'url';
import getCatalog from '../services/getCatalog';
import getScheda from '../services/getScheda';
import getCanali from '../services/getCanali';
import getWmsCapabilities from '../services/getWmsCapabilities';
import getKmlUrl from '../services/getKmlUrl';
import notification from '../util/notification';
import getRiskNatConfig from '../services/getRiskNatConfig';
import getConfig from '../services/getConfig';
import getGeoJSON from '../services/getGeoJSON';

Vue.component('gv-map-info-panel', () => import('./MapInfoPanel.vue'));

import {
  Button,
  ButtonGroup,
  Row,
  Col,
  Tabs,
  TabPane,
  Tree,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Upload,
} from 'element-ui';
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Upload);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-map-catalog-panel',
  data() {
    if (!GV.config.enti) {
      GV.config.enti = ['Regione Liguria'];
    }
    const enti = GV.config.enti
      .filter(ente => ente !== 'REGIONE LIGURIA')
      .map(ente => {
        return {
          value: ente
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace('Di', 'di'),
        };
      });
    enti.unshift({
      value: 'Regione Liguria',
    });

    const config = GV.config.application.layout.legend.options.addMapConfig;

    let panels = config.panels;
    let activeTab = config.activePanel || Object.keys(config.panels)[0];

    const width = window.matchMedia('(min-width: 620px)').matches ? 600 : 400;

    return {
      title: 'CATALOGHI CARTOGRAFIE',
      panels: panels,
      showEnti: window.matchMedia('(min-width: 620px)').matches,
      defaultProps: {
        children: 'children',
        label: 'text',
      },
      catalogoCompleto: true,
      formData: {
        query: '',
        ente: '',
        download: false,
      },
      enti: enti,
      activeTab: activeTab,
      expanded_nodes: [],
      width: width,
      wmsForm: {
        URL: '',
        serviceTitle: '',
        showLayerList: false,
        layerList: [],
      },
      risknatForm: {
        idMap: '2039',
        typeList: [
          { codice: 'target', label: 'Target' },
          { codice: 'area', label: 'Aree Anomale' },
        ],
        targetList: [],
        areaList: [],
        selectedType: 'target',
        selectedTarget: null,
        selectedArea: null,
        showTargetCombo: true,
        showAreaCombo: false,
        showForm: false,
        zoom: true,
        layerDataset: null,
        livelli: [],
      },
      kmlForm: {
        URL: '',
        fileList: [],
      },
      multipleSelection: [],
    };
  },
  mounted() {
    // Carico i tree per i pannelli di tipo tree
    Object.keys(this.panels).forEach(panelName => {
      const panel = this.panels[panelName];
      if (panel.type === 'tree') {
        this.loadTree(panel);
      }
      if (panel.name === 'risknat') {
        this.loadRisknatConfig();
      }
    });
  },
  methods: {
    // RISKNAT
    submitRisknat() {
      // TODO Caricamento livello (vedi atlante)
      const selectedDataset = this.getSelectedDatasetRisknat();
      if (!selectedDataset) return;
      const layersConfig = this.risknatForm.livelli.filter(livello => {
        return livello.id == selectedDataset.livello;
      });
      this.loadLayerRisknat(layersConfig[0]);
    },
    loadLayerRisknat(layerConfig) {
      layerConfig.visible = true;
      const idMap = layerConfig.idMap;
      GV.config.addMapConfig({
        id: idMap,
        addLayerConfig: true,
        name: 'RISKNAT',
        flagGeoserver: true,
        downloadConfig: this.downloadConfig,
        metaData: this.metaData,
        layers: [layerConfig],
      });
    },
    getSelectedDatasetRisknat() {
      if (!this.risknatForm.selectedTarget && !this.risknatForm.selectedArea) return null;
      const selectedDatasetId = this.risknatForm.selectedTarget || this.risknatForm.selectedArea;
      const selectedDataset = this.risknatForm.selectedTarget
        ? this.risknatForm.targetList.filter(item => item.codice == selectedDatasetId)
        : this.risknatForm.areaList.filter(item => item.codice == selectedDatasetId);
      return selectedDataset[0];
    },
    infoDatasetRisknat() {
      const selectedDataset = this.getSelectedDatasetRisknat();
      if (!selectedDataset) return;
      const label = selectedDataset.label;
      const pdfUrl = `https://srvcarto.regione.liguria.it/RiskNat/pdf/${label}.pdf`;
      window.open(pdfUrl);
    },
    onChangeRisknatType(value) {
      if (value === 'target') {
        this.risknatForm.showTargetCombo = true;
        this.risknatForm.showAreaCombo = false;
        this.risknatForm.selectedArea = null;
      } else {
        this.risknatForm.showTargetCombo = false;
        this.risknatForm.showAreaCombo = true;
        this.risknatForm.selectedTarget = null;
      }
    },
    onChangeRisknatCombo(value) {
      const layer = GV.app.map.getLayerByName('RisknatDataset');
      const features = this.risknatForm.layerDataset.features.filter(
        item => item.properties.ID == value || item.properties.id == value
      );
      if (layer && features && features[0] && features[0].geometry) {
        layer.clearLayers();
        layer.addData(features[0].geometry);
        if (this.risknatForm.zoom) {
          GV.app.map.flyToBounds(layer.getBounds(), { maxZoom: 17 });
        }
      }
    },
    loadRisknatConfig(panel) {
      getRiskNatConfig().then(data => {
        this.risknatForm.targetList = data.target;
        this.risknatForm.areaList = data.aree;
      });

      const baseUrl =
        GV.globals.DEFAULT_PROXY +
        `http://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=application%2Fjson&typeName=`;
      const url = `${baseUrl}M1324:L3449`;
      getGeoJSON(url).then(response => {
        this.loadRisknatDataset(response.data);
        this.risknatForm.showForm = true;
      });
      getConfig(this.risknatForm.idMap).then(data => {
        this.risknatForm.livelli = data.data.data.layers;
        this.risknatForm.downloadConfig = data.data.data.downloadConfig;
        this.risknatForm.metaData = data.data.data.metaData;
      });
    },
    loadRisknatDataset(data) {
      this.risknatForm.layerDataset = data;
      GV.app.map.loadLayers([
        {
          name: 'RisknatDataset',
          type: 'JSON',
          style: {
            color: '#ffcc00',
            fillOpacity: 0,
            weight: 1,
            opacity: 1,
          },
          visible: true,
          data: null,
        },
      ]);
    },
    //
    parseUrl(url) {
      const parsed = uri.parse(url, true);
      parsed.search = null;
      // const mapfile = parsed.query["map"] || parsed.query["MAP"];
      // parsed.query = {
      //   SERVICE: "WMS",
      //   REQUEST: "GetCapabilities"
      // };
      // if (mapfile) parsed.query["map"] = mapfile;
      if (!parsed.query['SERVICE'] && !parsed.query['service'] && !parsed.query['Service'])
        parsed.query['SERVICE'] = 'WMS';
      if (!parsed.query['REQUEST'] && !parsed.query['request'] && !parsed.query['Request'])
        parsed.query['REQUEST'] = 'GetCapabilities';

      return uri.format(parsed);
    },
    submitWms() {
      let url = this.$refs.wmsUrl.value;
      if (!url) {
        return;
      }
      url = this.parseUrl(url);

      getWmsCapabilities(url).then(capabilities => {
        this.wmsForm.showLayerList = true;

        const serviceTitle = capabilities.Service.Title;
        // const version = capabilities.WMS_Capabilities.Service._version
        const url =
          // capabilities.Service.OnlineResource["_xlink:href"] ||
          capabilities.Capability.Request.GetMap.DCPType.HTTP.Get.OnlineResource['_xlink:href'];

        let layers = capabilities.Capability.Layer.Layer;
        if (!Array.isArray(layers)) {
          layers = [layers];
        }
        const formats = capabilities.Capability.Request.GetMap.Format;
        let format = null;
        formats.forEach(item => {
          if (item === 'image/jpeg') {
            format = item;
          }
        });
        formats.forEach(item => {
          if (item === 'image/png') {
            format = item;
          }
        });

        this.wmsForm.serviceTitle = 'Servizio: ' + serviceTitle;
        this.wmsForm.layerList = [];

        layers.forEach(layer => {
          const popUpUrl =
            layer.Style && layer.Style.LegendURL && layer.Style.LegendURL.OnlineResource
              ? layer.Style.LegendURL.OnlineResource['_xlink:href']
              : null;

          this.wmsForm.layerList.push({
            serviceTitle: serviceTitle,
            name: layer.Name,
            title: layer.Title,
            type: 'WMS',
            opacity: 1,
            visible: true,
            legend: {
              popUpFlag: popUpUrl ? 1 : 0,
              popUpUrl: popUpUrl,
              label: layer.Title,
              icon: 'https://srvcarto.regione.liguria.it/geoviewer/img/legend/classi.gif',
            },
            wmsParams: {
              url: url,
              format: format,
              name: layer.Name,
              layers: layer.Name,
              transparent: true,
            },
          });
        });
      });
    },
    onChangeWmsLayerList(value) {
      this.wmsForm.layerList.forEach(layer => {
        if (layer.name === value) {
          GV.config.addMapConfig({
            addLayerConfig: true,
            id: layer.serviceTitle,
            name: layer.serviceTitle,
            layers: [layer],
          });
        }
      });
    },
    wmsKeyEnterHandler() {
      submitWms();
    },
    // INIZIO KML
    submitKml() {
      const url = this.kmlForm.URL;
      if (url) {
        getKmlUrl(url).then(data => {
          const url = data.file;
          const fileName = data.name;
          const type = data.type;
          this.loadKml(url, fileName, type);
        });
      } else {
        this.$refs.kmlUpload.submit();
      }
    },
    handleSelectionChange(data, checked, indeterminate) {
      if (data.children && !indeterminate) {
        if (checked) {
          data.children.forEach(child => {
            this.addToSelection(child.idMap);
          });
        } else {
          data.children.forEach(child => {
            this.removeFromSelection(child.idMap);
          });
        }
      } else {
        if (checked) {
          this.addToSelection(data.idMap);
        } else {
          this.removeFromSelection(data.idMap);
        }
      }
    },
    addToSelection(idMap) {
      const index = this.multipleSelection.indexOf(idMap);
      if (index == -1) {
        this.multipleSelection.push(idMap);
      }
    },
    removeFromSelection(idMap) {
      const index = this.multipleSelection.indexOf(idMap);
      if (index > -1) {
        this.multipleSelection.splice(index, 1);
      }
    },
    submitMultiSel() {
      if (this.multipleSelection.length > 10) {
        notification(
          `Selezionare un massimo di 10 mappe. Ne hai selezionate ${this.multipleSelection.length}`
        );
        return;
      }
      this.multipleSelection.forEach(idMap => {
        GV.config.addRlMap(`${idMap}`, false, false);
      });
    },
    onKmlUploadSuccess() {
      var file = this.$refs.kmlUpload.uploadFiles[0].name;
      if (file) {
        const url = '/geoservices/temp/' + file;
        let type = null;
        if (url.indexOf('.kml') > -1) type = 'KML';
        if (url.indexOf('.gpx') > -1) type = 'GPX';
        if (url.indexOf('.json') > -1) type = 'JSON';

        if (!type) {
          console.log('Tipo File non ammesso: I file devono avere estensione kml o gpx o json');
          return;
        }
        const fileName = file
          .replace('.kml', '')
          .replace('.gpx', '')
          .replace('.json', '');
        this.loadKml(url, fileName, type);
      }
    },
    loadKml(url, fileName, type) {
      this.$refs.kmlUpload.clearFiles();
      this.kmlForm.URL = '';
      GV.config.addMapConfig({
        addLayerConfig: true,
        id: 'kml-gpx-json',
        name: 'KML/GPX/JSON',
        layers: [
          {
            url: url,
            name: fileName,
            title: fileName,
            visible: true,
            type: 'JSON',
            subType: type,
            projection: 'EPSG:4326',
            infoOptions: {
              infoPopUp: 'simple',
              infoWidth: 300,
              infoHeight: 300,
            },
            inRange: true,
            pointToLayer: function(feature, latlng) {
              return L.marker(latlng, {
                icon: L.icon({
                  iconUrl:
                    'https://srvcarto.regione.liguria.it/geoviewer2/static/img/marker-icon.png',
                  iconSize: [12, 20],
                  iconAnchor: [6, 10],
                  popupAnchor: [0, -20],
                }),
              });
            },
            zoomToLayerExtent: true,
            basePopup: true,
            legend: {
              label: fileName,
              icon: 'https://srvcarto.regione.liguria.it/geoviewer/img/legend/classi.gif',
            },
          },
        ],
      });
    },
    handleKmlIconClick() {
      this.kmlForm.URL = '';
    },
    onChangeEnte(value) {
      this.submitRepertorio();
    },

    submitRepertorio() {
      const panel = this.panels['repertorio'];
      const filtriImpostati = this.formData.query !== '' || this.formData.ente !== '';

      if (filtriImpostati) {
        const params = {
          q: this.formData.query,
          ente: this.formData.ente.toUpperCase(),
          filterDownloadCatalog: GV.config.application.layout.legend.options.filterDownloadCatalog,
        };
        getCatalog(params).then(data => {
          panel.tree = GV.config.catalog = data.children;
          panel.tree.forEach(macro => {
            this.expanded_nodes.push(macro.id);
            if (params.ente !== 'REGIONE LIGURIA' || params.q) {
              macro.children.forEach(cat => {
                this.expanded_nodes.push(cat.id);
              });
            }
          });
        });
        this.expanded_nodes = ['REPERTORIO ENTI LOCALI'];
        this.catalogoCompleto = false;
      } else {
        if (this.catalogoCompleto) {
          return;
        }
        panel.tree = GV.config.catalog = GV.config.catalogFull;
        panel.tree.forEach(node => {
          this.expanded_nodes.push(node.id);
        });
        this.catalogoCompleto = true;
      }
    },
    handleRepertorioIconClick() {
      this.formData.query = '';
      this.submitRepertorio();
    },
    handleNodeClick(data) {
      const idMap = data.idMap;
      if (!idMap) {
        return;
      }
      getScheda(idMap).then(data => {
        if (!data) {
          console.error('Scheda non trovata');
          return;
        }
        GV.config.schedaInfoCartografia = data;
        mountComponent({
          elId: 'gv-map-info-panel',
          clear: true,
          vm: new Vue({
            template: `<gv-map-info-panel visible="true" idMap="${idMap}" addToMapButton="true" downloadable="false"></gv-map-info-panel>`,
          }),
        });
      });
    },
    loadTree(panel) {
      switch (panel.name) {
        case 'repertorio':
          // Se repertorio è in cache lo recupero
          if (GV.config.catalog) {
            panel.tree = GV.config.catalog;
            panel.tree.forEach(node => {
              this.expanded_nodes.push(node.id);
            });
          } else {
            const params = {
              filterDownloadCatalog:
                GV.config.application.layout.legend.options.filterDownloadCatalog,
            };
            getCatalog(params).then(data => {
              panel.tree = GV.config.catalog = GV.config.catalogFull = data.children;
              panel.tree.forEach(node => {
                this.expanded_nodes.push(node.id);
              });
            });
          }
          break;
        case 'canali':
          if (panel.options.multiCanale) {
            this.panels.canali.label = `Canali Tematici`;
            panel.tree = [];
            if (panel.options.canale) {
              const canali = panel.options.canale.toString().split(',');
              canali.forEach(canale => {
                const params = {
                  tematici: panel.options.tematici,
                  canale: canale,
                  pub: panel.options.pub,
                };
                getCanali(params).then(data => {
                  if (data) {
                    panel.tree.push(data);
                  }
                });
              });
            }
            if (panel.options.applicazione) {
              const applicazioni = panel.options.applicazione.split(',');
              applicazioni.forEach(applicazione => {
                const params = {
                  applicazione: applicazione,
                  tematici: panel.options.tematici,
                  pub: panel.options.pub,
                };
                getCanali(params).then(data => {
                  if (data) {
                    panel.tree.push(data);
                  }
                });
              });
            }
          } else {
            console.log(panel.options);
            getCanali(panel.options).then(data => {
              if (data) {
                panel.tree = data.children;
                this.panels.canali.label = `Canali Tematici: ${data.text}`;
              }
            });
          }
          break;
      }
    },
    renderContent(h, { node, data, store }) {
      if (node.data.type === 'MAPPA') {
        return <span style="font-size: 12px; ">{node.label}</span>;
      }

      if (node.data.type === 'CATEGORIA') {
        return <span style="font-size: 12px; font-weight: bold; ">{node.label}</span>;
      }

      if (node.data.type === 'MACROCATEGORIA') {
        return (
          <span style="font-size: 12px; font-weight: bold; background-color: #ddd; padding: 5px; ">
            {node.label}
          </span>
        );
      }
    },
  },
};
</script>

<style scoped>
.gv-map-catalog-tree {
  max-height: 400px;
  height: 400px;
  width: 580px;
  overflow: auto;
}

.gv-map-catalog-panel {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  background-color: #fff;
  z-index: 800;
}

.gv-map-catalog-panel table {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
}

.gv-map-catalog-panel-th {
  white-space: nowrap;
  width: auto;
  padding: 5px 5px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-map-catalog-panel table tr td {
  padding: 5px;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-map-catalog-panel-form {
  padding: 0px 10px 5px;
  width: 580px;
}

.gv-button-ricerca span {
  font-family: 'Raleway', Arial, sans-serif;
  font-weight: bold;
}

.gv-map-catalog-label {
  font-size: 12px;
  padding-left: 5px;
  font-family: 'Raleway', Arial, sans-serif;
}

@media (max-width: 650px) {
  .gv-map-catalog-tree {
    width: 400px;
    height: 350px;
  }
  .gv-map-catalog-panel-form {
    width: 400px;
  }
  .el-select {
    position: relative;
    width: 110px;
  }
}
</style>

<style>
.el-tree-node__label {
  font-size: 12px !important;
}

.el-tabs__item.is-active {
  color: #24386c !important;
}

.el-tree-node {
  white-space: normal !important;
  padding: 5px;
}

.el-tabs__header {
  margin: 0 0 5px !important;
}

.gv-map-catalog-button {
  margin-top: 10px;
  font-size: 12px;
}

.gv-map-catalog-button span {
  font-family: 'Raleway', Arial, sans-serif;
  /* font-weight: bold; */
}
</style>
