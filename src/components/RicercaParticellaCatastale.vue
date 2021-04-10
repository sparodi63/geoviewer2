<template>
  <div class="gv-ricerca-particella gv-inverted-color-scheme" id="gv-ricerca-particella">
    <gv-title v-draggable :title="title" :divId="'gv-ricerca-particella'" :hide="true"></gv-title>
    <div class="gv-ricerca-particella-body" id="gv-ricerca-particella-body">
      <el-form :model="form" ref="form">
        <el-form-item>
          <el-select
            id="gv-ricerca-particella-comuni-select"
            v-model="comune"
            size="mini"
            placeholder="Comune"
            @change="changeComune"
            filterable
          >
            <el-option
              v-for="item in comuni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            id="gv-ricerca-particella-sezioni-select"
            v-model="sezione"
            size="mini"
            placeholder="Sezione"
            @change="changeSezione"
            no-data-text="Seleziona un Comune"
            filterable
          >
            <el-option
              v-for="item in sezioni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            id="gv-ricerca-particella-fogli-select"
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
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            id="gv-ricerca-particella-particelle-select"
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
        </el-form-item>
        <el-form-item class="gv-ricerca-particella-buttons">
          <el-button
            id="gv-ricerca-particella-submit-button"
            v-show="showSubmitButton"
            type="primary"
            size="mini"
            @click="submit"
            >Visualizza</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import mountComponent from '../util/mountComponent';
import globals from '../globals';
import getComuni from '../services/getS3Comuni';
import getSezioni from '../services/getS3Sezioni';
import getFogli from '../services/getS3Fogli';
import getParticelle from '../services/getS3Particelle';
import getWFSFeature from '../services/getWFSFeature';
import InfoWmsManager from '../controls/InfoWmsManager';

import { Button, Input, Form, FormItem, Select, Option, Notification } from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-ricerca-particella',
  data() {
    return {
      title: 'RICERCA PARTICELLA CATASTALE',
      maps: GV.config.maps,
      comuni: null,
      sezioni: null,
      fogli: null,
      particelle: null,
      comune: null,
      sezione: null,
      foglio: null,
      particella: null,
    };
  },
  computed: {
    showSubmitButton() {
      return this.comune && this.sezione && this.foglio && this.particella;
    },
  },
  mounted() {
    getComuni().then(resp => {
      this.comuni = resp;
    });
  },
  methods: {
    changeComune(id) {
      this.sezioni = null;
      this.sezione = null;
      this.fogli = null;
      this.foglio = null;
      this.particelle = null;
      this.particella = null;
      getSezioni(id).then(resp => {
        this.sezioni = resp;
      });
    },
    changeSezione(id) {
      this.fogli = null;
      this.foglio = null;
      this.particelle = null;
      this.particella = null;
      getFogli(this.comune, id).then(resp => {
        this.fogli = resp;
      });
    },
    changeFoglio(id) {
      this.particelle = null;
      this.particella = null;
      getParticelle(this.comune, this.sezione, id).then(resp => {
        this.particelle = resp;
      });
    },
    submit() {
      const layerName = 'L2624';
      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=M1047:L2624&cql_filter=CT24_ID=' +
        this.particella;
      getWFSFeature(null, null, url).then(features => {
        const feature = features[0];
        let layer = GV.app.map.getLayerByName('InfoWmsHilite');
        if (!layer) {
          InfoWmsManager.addHiliteLayer(GV.app.map);
          layer = GV.app.map.getLayerByName('InfoWmsHilite');
        }
        if (GV.app.map.type === 'openlayers') {
          const source = layer.getSource();
          source.clear(true);
          const olFeature = new ol.format.GeoJSON().readFeature(feature, {
            featureProjection: 'EPSG:3857',
          });
          source.addFeature(olFeature);
          GV.app.map.fit(olFeature.getGeometry().getExtent(), { maxZoom: 15 });
          GV.config.hilitedLayer.push(layerName);
        } else {
          layer.clearLayers();
          layer.addData(feature.geometry);
          GV.app.map.fitBounds(layer.getBounds(), { maxZoom: 15 });
          GV.config.hilitedLayer.push(layerName);
        }
      });
    },
    cancel() {
      this.cleanUp();
    },
    cleanUp() {
      if (this.closeWindow === 'true') {
        window.close();
      } else {
        document
          .getElementById('gv-ricerca-particella')
          .parentNode.removeChild(document.getElementById('gv-ricerca-particella'));
      }
    },
    collapse: function(event) {
      if (this.show) {
        document.getElementById('gv-ricerca-particella-body').style.display = 'none';
      } else {
        document.getElementById('gv-ricerca-particella-body').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
};
</script>

<style scoped>
.gv-ricerca-particella {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  width: 300px;
  background-color: #fff;
  z-index: 800;
}

.gv-ricerca-particella-body {
  margin: 10px;
}

.gv-ricerca-particella-label {
  display: inline-block;
  width: 150px;
}

/* #gv-ricerca-particella-value-list-button {
  float: right;
} */

.gv-ricerca-particella-buttons {
  margin-top: -5px;
}

.gv-ricerca-particella-operator-combo {
  width: 100px;
}
</style>

<style>
#gv-ricerca-particella-value {
  width: 250px;
}
</style>
