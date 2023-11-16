<template>
  <div id="gv-cdu-seleziona-particelle-panel" class="gv-cdu-seleziona-particelle-panel">
    <gv-title
      title="Stampa C.D.U."
      :divId="'gv-cdu-seleziona-particelle-panel'"
      :noClose="true"
    ></gv-title>
    <div class="gv-cdu-seleziona-particelle-body gv-inverted-color-scheme">
      <el-row type="flex" class="row-bg" justify="left">
        <div class="gv-cdu-seleziona-padding-left"><b>PARTICELLE SELEZIONATE</b></div>
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <div class="gv-cdu-seleziona-particelle-table">
          <el-table
            :data="particelleSelezionate"
            border
            :cell-style="{ padding: '2px', maxHeight: '10px' }"
          >
            <el-table-column label="FOGLIO" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.ct24_foglio }}</span>
              </template>
            </el-table-column>
            <el-table-column label="MAPPALE" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.ct24_numero }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <div class="gv-cdu-seleziona-padding-left">Aggiungi una particella:</div>
      </el-row>
      <!-- Selezionare una particella:<br /> -->
      <el-row type="flex" class="row-bg" justify="left">
        <el-select
          id="gv-cdu-seleziona-fogli-select"
          v-model="foglio"
          size="mini"
          placeholder="Foglio"
          @change="changeFoglio"
          no-data-text="Seleziona una Sezione"
          filterable
        >
          <el-option
            v-for="item in fogli"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          id="gv-cdu-seleziona-particelle-select"
          v-model="particella"
          size="mini"
          placeholder="Particella"
          no-data-text="Seleziona una Foglio"
          filterable
        >
          <el-option
            v-for="item in particelle"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="add()" icon="el-icon-plus"></el-button>
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <div class="gv-cdu-seleziona-padding-left">
          E' anche possibile aggiungere/cancellare particelle selezionandole sulla mappa.
        </div>
      </el-row>
    </div>
    <el-row type="flex" class="row-bg" justify="left">
      <div class="gv-cdu-seleziona-padding-left">
        <el-button
          id="gv-cdu-seleziona-particelle-panel-submit"
          ref="button"
          title="Salva i dati sul DB"
          type="primary"
          @click="submit()"
          size="mini"
          :disabled="buttonDisabled"
        >
          <span>Stampa PDF</span>
        </el-button>
      </div>
    </el-row>
  </div>
</template> 

<script>
import Vue from 'vue';
import InfoWmsManager from '../controls/InfoWmsManager';
import getFeatureInfo from '../services/getFeatureInfo';
import getWFSFeature from '../services/getWFSFeature';
import getFogli from '../services/getS3Fogli';
import getParticelle from '../services/getS3Particelle';

import { Button, Row, Loading, Notification, Popover } from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Popover);

export default {
  name: 'gv-cdu-seleziona-particelle-panel',
  data() {
    const options = GV.config.getToolOptions('gv-cdu-seleziona-particelle-button');
    return {
      comune: options.codComBelfiore,
      idLayerParticelle: 'L6592',
      particelleSelezionate: [],
      hiliteLayer: null,
      sezione: '_',
      fogli: null,
      foglio: null,
      particelle: null,
      particella: null,
      options: options,
    };
  },
  computed: {},
  methods: {
    subscribeMapEvent(event) {
      GV.app.map.on('click', (event) => {
        if (!this.layerConfig.visible) return;
        const wmsUrl = this.getWmsUrl(event);
        getFeatureInfo(wmsUrl).then((features) => {
          if (features && features[0] && features[0].properties && features[0].properties.ct24_id) {
            this.add(features[0].properties.ct24_id);
          }
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
      features.forEach((feature) => {
        if (this.alreadySelected(feature)) {
          this.particelleSelezionate = this.particelleSelezionate.filter((particella) => {
            return particella.id !== feature.id;
          });
          this.hiliteLayer.eachLayer((layer) => {
            if (layer.feature.id == feature.id) {
              GV.app.map.removeLayer(layer);
            }
          });
        } else {
          this.addParticella(feature);
        }
      });
    },
    alreadySelected(feature) {
      let selected = false;
      this.particelleSelezionate.forEach((particella) => {
        if (feature.id === particella.id) {
          selected = true;
        }
      });
      return selected;
    },
    changeFoglio(id) {
      this.particelle = null;
      this.particella = null;
      getParticelle(this.comune, this.sezione, id).then((resp) => {
        this.particelle = resp;
      });
    },
    add(idParticella) {
      if (!idParticella && !this.particella) return;
      if (!idParticella) idParticella = this.particella;
      const cqlFilter = 'ct24_id = ' + idParticella;
      const featureType = `M2002:${this.idLayerParticelle}`;
      const wfsUrl =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        featureType +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, wfsUrl).then((features) => {
        this.updateParticelleSelezionate(features);
      });
    },
    addParticella(feature) {
      this.particelleSelezionate.push(feature);
      this.hiliteLayer.addData(feature);
      const bounds = this.hiliteLayer.getBounds();
      GV.app.map.fitBounds(bounds, {
        maxZoom: 18,
      });
    },
    handleDelete(index, row) {
      this.particelleSelezionate = this.particelleSelezionate.filter((particella) => {
        return particella.id !== row.id;
      });
      this.hiliteLayer.eachLayer((layer) => {
        if (layer.feature.id == row.id) {
          GV.app.map.removeLayer(layer);
        }
      });
    },
    submit() {
      var r = confirm('Sei sicuro?');
      if (r == true) {
        // this.saveData();
      }
      return;
    },
    loadLayer() {
      GV.app.map.loadLayers([
        {
          name: 'SelezioneParticelle',
          type: 'JSON',
          style: {
            color: '#ffcc00',
            fillOpacity: 0.0,
            weight: 5,
            opacity: 0.6,
          },
          visible: true,
        },
      ]);
      this.hiliteLayer = GV.app.map.getLayerByName('SelezioneParticelle');
    },
    hideLayer() {
      this.hiliteLayer.eachLayer((layer) => {
        layer.getElement().style.display = 'none';
      });
    },
    showLayer() {
      this.hiliteLayer.eachLayer((layer) => {
        layer.getElement().style.display = 'block';
      });
    },
  },
  mounted() {
    // Carico fogli
    getFogli(this.comune, this.sezione).then((resp) => {
      this.fogli = resp;
    });

    // CARICO LAYER PER HILITE
    this.layerConfig = GV.config.getLayerConfig(this.idLayerParticelle);
    if (!this.layerConfig) {
      GV.eventBus.$on('gv-config-init', (event) => {
        this.layerConfig = GV.config.getLayerConfig(this.idLayerParticelle);
      });
    }
    this.loadLayer();

    // GESTIONE EVENTI
    GV.eventBus.$on('gv-control-cdu-seleziona-particelle-activate', (event) => {
      this.subscribeMapEvent(event);
      this.showLayer();
    });
    GV.eventBus.$on('gv-control-cdu-seleziona-particelle-deactivate', (event) => {
      GV.app.map.off('click');
      this.hideLayer();
    });
    this.subscribeMapEvent(event);
  },
};
</script>

<style>
.gv-cdu-seleziona-particelle-panel {
  position: absolute;
  width: 340px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-cdu-seleziona-particelle-body {
  padding: 5px;
  width: 330px;
  height: 350px;
}

.gv-cdu-seleziona-particelle-table {
  width: 320px;
  height: 200px;
  min-height: 200px;
  max-height: 200px;
}

.gv-cdu-seleziona-padding-left {
  padding-left: 5px;
}

.el-row {
  padding: 5px 5px 5px 5px;
}

.el-table {
  overflow-y: scroll;
  max-height: 200px;
}
</style>

