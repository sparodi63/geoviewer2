<template>
  <div id="gv-genio-seleziona-particelle-panel" class="gv-genio-seleziona-particelle-panel">
    <gv-title
      title="Seleziona Particelle"
      :divId="'gv-genio-seleziona-particelle-panel'"
      :noClose="true"
      v-draggable
    ></gv-title>
    <div class="gv-genio-seleziona-particelle-body gv-inverted-color-scheme">
      <div class="gv-genio-seleziona-particelle-table">
        <el-table
          :data="particelleSelezionate"
          empty-text="Nessuna particella selezionata"
          @cell-mouse-enter="selectRiga"
          @cell-mouse-leave="deselectRiga"
          highlight-current-row
          :cell-style="{ padding: '2px', maxHeight: '10px' }"
        >
          <el-table-column label="ESTREMI" align="center" width="140">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p>COMUNE: {{ scope.row.properties.CT24_COD_COM }}</p>
              </el-popover>
              <div slot="reference" class="name-wrapper">{{ scope.row.label }}</div>
            </template>
          </el-table-column>
          <el-table-column label="PROT" align="center" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.properties.CT24_PROT_IN }}</span>
            </template>
          </el-table-column>
          <el-table-column label="DATA DBTI" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.properties.CT24_DATA_AGG.substr(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="DATA SEL" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.properties.DATA_SEL.substr(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="AREA" align="center" width="50">
            <template slot-scope="scope">
              <span>{{ scope.row.properties.AREA }}</span>
            </template>
          </el-table-column>

          <el-table-column label="PARZ." align="center" width="60">
            <template slot-scope="scope">
              <span>
                <el-checkbox
                  v-show="editableRow(scope.row.properties.STATO)"
                  v-model="scope.row.properties.parziale"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column width="46">
            <template slot-scope="scope">
              <el-button
                v-show="editableRow(scope.row.properties.STATO)"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="left">
      <el-button
        id="gv-genio-seleziona-particelle-panel-submit"
        ref="button"
        title="Salva i dati sul DB"
        type="primary"
        @click="submit()"
        size="mini"
        :disabled="buttonDisabled"
      >
        <span>Salva su DB</span>
      </el-button>
      <el-button
        id="gv-draw-cancel"
        title="Ricarica dati salvati sul DB"
        @click="refresh"
        class="gv-color-scheme"
        size="mini"
        >Ricarica</el-button
      >
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import getCoordTransform from '../services/getCoordTransform';
import InfoWmsManager from '../controls/InfoWmsManager';
import getFeatureInfo from '../services/getFeatureInfo';
import getWFSFeature from '../services/getWFSFeature';
import insertParticelleGenio from '../services/insertParticelleGenio';

import { Button, Row, Loading, Notification, Popover } from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Popover);

export default {
  name: 'gv-genio-seleziona-particelle-panel',
  data() {
    return {
      particelleSelezionate: [],
      hiliteLayer: null,
      geojsonLayerList: [],
      options: GV.config.getToolOptions('gv-genio-seleziona-particelle-button'),
    };
  },
  computed: {
    buttonDisabled() {
      return false;
      // return this.particelleSelezionate.length === 0;
    },
  },
  methods: {
    refresh() {
      this.loadParticelle();
    },
    editableRow(stato) {
      return stato === 'M';
    },
    submit() {
      var r = confirm('Sei sicuro?');
      if (r == true) {
        this.saveData();
      }
      return;
    },
    saveData() {
      const listaParticelle = this.particelleSelezionate.map(particella => {
        particella.properties.id = particella.id;
        return particella.properties;
      });
      var data = {
        prov: this.options.prov,
        codicePratica: this.options.codicePratica,
        listaParticelle: listaParticelle,
        idPunto: this.options.idPunto,
      };
      const loading = Loading.service({
        text: 'Salvataggio dati...',
        background: 'rgba(0, 0, 0, 0.8)',
      });
      insertParticelleGenio(data).then(resp => {
        if (loading) loading.close();
        if (resp.success) {
          GV.utils.notification('Dati salvati correttamente', 'info');
          // this.loadParticelle();
          this.reloadLayer();
        } else {
          GV.utils.notification('Errore nella scrittura sul DB', 'error');
        }
      });
    },
    reloadLayer() {
      var layer = GV.globals.GW_CONFIG[this.options.prov].idLayerPratica;
      if (
        this.options.codicePratica.startsWith('GDE') ||
        this.options.codicePratica.startsWith('IMD') ||
        this.options.codicePratica.startsWith('SVD') ||
        this.options.codicePratica.startsWith('SPD')
      ) {
        layer = GV.globals.GW_CONFIG[this.options.prov].idLayerPraticaDe;
      }
      if (this.options.idPunto) {
        layer = GV.globals.GW_CONFIG[this.options.prov].idLayerEttariIrrigati;
      }

      var layerConfig = GV.config.getLayerConfig(layer);
      GV.eventBus.$emit('set-layer-visible', {
        layer: layerConfig,
        checked: false,
      });
      GV.eventBus.$emit('set-layer-visible', {
        layer: layerConfig,
        checked: true,
      });
    },
    loadLayer() {
      GV.app.map.loadLayers([
        {
          name: 'SelezioneParticelle',
          type: 'JSON',
          style: {
            color: '#ff0000',
            fillOpacity: 0.0,
            weight: 3,
            opacity: 0.7,
          },
          visible: true,
        },
      ]);
      this.hiliteLayer = GV.app.map.getLayerByName('SelezioneParticelle');
      this.loadParticelle();
    },
    loadParticelle() {
      this.hiliteLayer.clearLayers();
      this.particelleSelezionate = [];
      const workSpace = `M${this.options.idMap}`;
      let cqlFilter, layer;
      if (this.options.idPunto) {
        cqlFilter = `SV06_CODICE_PRATICA = '${this.options.codicePratica}' AND SV06_COD_COM IS NOT NULL`;
        layer = this.options.idLayerEttariIrrigati;
      } else {
        cqlFilter = `CODICE_PRATICA = '${this.options.codicePratica}' AND MAPPALE IS NOT NULL`;
        layer = this.options.idLayerPratica;
      }
      const wfsUrl = `https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=${workSpace}:${layer}&cql_filter=${cqlFilter}`;
      getWFSFeature(null, null, wfsUrl).then(features => {
        features.forEach(feature => {
          const codCom = feature.properties.COD_COM || feature.properties.SV06_COD_COM;
          const sez = feature.properties.SEZ || feature.properties.SV06_SEZ;
          const foglio = feature.properties.FOGLIO || feature.properties.SV06_FOGLIO;
          const mappale = feature.properties.MAPPALE || feature.properties.SV06_MAPPALE;
          const allegato = feature.properties.ALLEGATO || feature.properties.SV06_ALLEGATO;
          const sviluppo = feature.properties.SVILUPPO || feature.properties.SV06_SVILUPPO;
          const protDbti = feature.properties.PROT_DBTI || feature.properties.SV06_PROT_DBTI;
          const dataDbti = feature.properties.DATA_DBTI || feature.properties.SV06_DATA_DBTI;
          const dataSel = feature.properties.DATA_SEL || feature.properties.SV06_DATA_SEL;
          const area = feature.properties.AREA || feature.properties.SV06_AREA;
          const stato = feature.properties.G_STATO || feature.properties.SV06_STATO;
          const mappaleParziale =
            feature.properties.MAPPALE_PARZIALE || feature.properties.SV06_MAPPALE_PARZIALE;

          const particella = {
            type: 'Feature',
            id: feature.id,
            geometry: feature.geometry,
            bbox: feature.bbox,
            geometry_name: feature.geometry_name,
            properties: {
              CT24_ID: null,
              CT24_COD_COM: codCom,
              CT24_SEZ: sez,
              CT24_FOGLIO: foglio,
              CT24_NUMERO: mappale,
              CT24_ALLEGATO: allegato,
              CT24_SVILUPPO: sviluppo,
              CT24_PROT_IN: protDbti,
              CT24_DATA_AGG: dataDbti,
              DATA_SEL: dataSel,
              AREA: area,
              STATO: stato,
              parziale: mappaleParziale ? true : false,
            },
          };
          particella.label = `${particella.properties.CT24_COD_COM}/${
            particella.properties.CT24_SEZ
          }/${particella.properties.CT24_FOGLIO}/${particella.properties.CT24_NUMERO.trim()}/${
            particella.properties.CT24_ALLEGATO
          }/${particella.properties.CT24_SVILUPPO}`;
          particella.id = particella.label;
          this.particelleSelezionate.push(particella);
          this.hiliteLayer.addData(particella);
        });
      });
    },
    getWmsUrl(event) {
      if (!this.layerConfig) {
        console.error('Configurazione Layer non trovata');
        return;
      }
      this.layerConfig.wmsParams.infoFormat = 'application/json';
      this.layerConfig.infoBuffer = 0;
      return InfoWmsManager.getGetFeatureInfoUrl(this.layerConfig, event);
    },
    updateParticelleSelezionate(features) {
      features.forEach(feature => {
        this.setFeatureProperties(feature);
        if (this.notEditable(feature)) {
          return;
        }
        if (this.alreadySelected(feature)) {
          this.particelleSelezionate = this.particelleSelezionate.filter(particella => {
            return particella.id !== feature.id;
          });
          this.hiliteLayer.eachLayer(layer => {
            if (layer.feature.id == feature.id) {
              GV.app.map.removeLayer(layer);
            }
          });
        } else {
          this.particelleSelezionate.push(feature);
          this.updateLayer(feature);
        }
      });
    },
    setFeatureProperties(feature) {
      feature.properties.DATA_SEL = '';
      feature.properties.STATO = 'M';
      feature.label = (feature.properties.CT24_COD_COM) ? `${feature.properties.CT24_COD_COM}/${feature.properties.CT24_SEZ}/${
        feature.properties.CT24_FOGLIO
      }/${feature.properties.CT24_NUMERO.trim()}/${feature.properties.CT24_ALLEGATO}/${
        feature.properties.CT24_SVILUPPO
      }` :
      `${feature.properties.ct24_cod_com}/${feature.properties.ct24_sez}/${
        feature.properties.ct24_foglio
      }/${feature.properties.ct24_numero.trim()}/${feature.properties.ct24_allegato}/${
        feature.properties.ct24_sviluppo
      }` ;
      feature.id = feature.label;
      feature.properties.parziale = false;
      feature.properties.catalogo = true;
      feature.properties.AREA = (feature.properties.CT24_AREA) ? feature.properties.CT24_AREA : feature.properties.ct24_area;
    },
    updateLayer(feature, type) {
      const cqlFilter = 'ct24_id = ' + feature.properties.CT24_ID;
      const wfsUrl =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=M1047:L2624&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, wfsUrl).then(features => {
        features.forEach(feature => {
          this.setFeatureProperties(feature);
          this.hiliteLayer.addData(feature);
        });
      });
    },
    notEditable(feature) {
      let notEditable = false;
      this.particelleSelezionate.forEach(particella => {
        if (feature.id === particella.id && particella.properties.STATO !== 'M') {
          notEditable = true;
        }
      });
      return notEditable;
    },
    alreadySelected(feature) {
      let selected = false;
      this.particelleSelezionate.forEach(particella => {
        if (feature.id === particella.id) {
          selected = true;
        }
      });
      return selected;
    },
    handleDelete(index, row) {
      this.particelleSelezionate = this.particelleSelezionate.filter(particella => {
        return particella.id !== row.id;
      });
      this.hiliteLayer.eachLayer(layer => {
        if (layer.feature.id == row.id) {
          GV.app.map.removeLayer(layer);
        }
      });
    },
    selectRiga(row) {
      if (row) {
        this.hiliteLayer.eachLayer(layer => {
          if (layer.feature.id == row.id) {
            layer.setStyle({ fillOpacity: 0.4 });
          } else {
            layer.setStyle({ fillOpacity: 0.0 });
          }
        });
      }
    },
    deselectRiga(row) {
      if (row) {
        this.hiliteLayer.eachLayer(layer => {
          if (layer.feature.id == row.id) {
            layer.setStyle({ fillOpacity: 0.0 });
          }
        });
      }
    },
    subscribeMapEvent(event) {
      // GV.eventBus.$on('map-click', event => {
      GV.app.map.on('click', event => {
        const wmsUrl = this.getWmsUrl(event);
        getFeatureInfo(wmsUrl).then(features => this.updateParticelleSelezionate(features));
      });
    },
    hideLayer() {
      this.hiliteLayer.eachLayer(layer => {
        layer.getElement().style.display = 'none';
      });
    },
    showLayer() {
      this.hiliteLayer.eachLayer(layer => {
        layer.getElement().style.display = 'block';
      });
    },
  },
  mounted() {
    this.layerConfig = GV.config.getLayerConfig(this.options.idLayerParticella);
    if (!this.layerConfig) {
      GV.eventBus.$on('gv-config-init', event => {
        this.layerConfig = GV.config.getLayerConfig(this.options.idLayerParticella);
      });
    }
    this.loadLayer();

    // GESTIONE EVENTI
    GV.eventBus.$on('gv-control-genio-seleziona-particelle-activate', event => {
      this.subscribeMapEvent(event);
      this.showLayer();
      this.loadParticelle();
    });
    GV.eventBus.$on('gv-control-genio-seleziona-particelle-deactivate', event => {
      GV.app.map.off('click');
      this.hideLayer();
    });
    this.subscribeMapEvent(event);
  },
};
</script>

<style>
.gv-genio-seleziona-particelle-panel {
  position: absolute;
  width: 560px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-genio-seleziona-particelle-body {
  padding: 5px;
  width: 550px;
  height: 350px;
}

.gv-genio-seleziona-particelle-table {
  padding: 5px;
  width: 540px;
  height: 200px;
  max-height: 410px;
}

.el-table__body-wrapper {
  max-height: 300px !important;
  overflow-y: auto;
}

.el-table {
  font-size: 10px !important;
}
</style>
