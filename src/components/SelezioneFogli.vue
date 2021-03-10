<template>
  <div class="gv-map-selezione-fogli gv-inverted-color-scheme" id="gv-map-selezione-fogli">
    <gv-title
      v-draggable
      :title="title"
      :divId="'gv-map-selezione-fogli'"
      :noClose="true"
      :collapsible="'gv-map-selezione-fogli-body'"
    ></gv-title>
    <div class="gv-map-selezione-fogli-body" id="gv-map-selezione-fogli-body">
      <el-select v-model="fogli" size="mini" multiple collapse-tags placeholder="Seleziona">
        <el-option
          v-for="item in config.fogli"
          :key="item.codice"
          :value="item.codice"
          :label="item.nome"
        >
        </el-option>
      </el-select>
      <div class="gv-map-selezione-fogli-buttons">
        <el-button id="gv-map-selezione-fogli-submit" type="primary" size="mini" @click="submit"
          >Conferma</el-button
        >
        <el-button id="gv-map-selezione-fogli-cancel" type="primary" size="mini" @click="cancel"
          >Annulla</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import globals from '../globals';
import getGeoJSON from '../services/getGeoJSON';
import notification from '../util/notification';

import { Button, Form, FormItem, Select, Option, Notification } from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

export default {
  name: 'gv-map-selezione-fogli',
  props: {
    idMap: String,
    selFogli: String,
    field: String,
  },
  data() {
    return {
      title: 'SELEZIONE FOGLI',
      fogli: [],
      config: {},
      storageKey: 'selFogli',
    };
  },
  computed: {},
  watch: {
    fogli(fogliSel) {
      this.syncFogli(fogliSel);
    },
  },
  mounted() {
    // imposto la configurazione dopo il caricamento della config della mappa
    GV.eventBus.$on('gv-config-init', () => {
      this.config = GV.config.getMapConfig(this.idMap).downloadConfig;
      this.addLayerSquadri();
      this.show = true;
    });
  },
  methods: {
    syncFogli(fogliSel) {
      const layerFogli = GV.app.map.getLayerByName('SelezioneSquadri');
      if (!layerFogli) {
        return;
      }
      layerFogli.eachLayer(layer => {
        layer.setStyle({ fillOpacity: 0, weight: 1 });
      });
      layerFogli.eachLayer(layer => {
        fogliSel.forEach(foglio => {
          const codice =
            layer.feature.properties.COD_SQUADRO || layer.feature.properties.cod_squadro;
          if (codice === foglio) {
            layer.setStyle({ fillOpacity: 0.6, weight: 2 });
          }
        });
      });
    },
    addLayerSquadri() {
      const baseUrl =
        globals.DEFAULT_PROXY +
        `https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=application%2Fjson&typeName=`;
      const url = `${baseUrl}${this.config.livelloSquadri}`;
      getGeoJSON(url).then(response => {
        this.loadDataSquadri(response.data);
      });
    },
    loadDataSquadri(data) {
      if (GV.app.map.getLayerByName('SelezioneSquadri')) {
        GV.app.map.removeLayer(GV.app.map.getLayerByName('SelezioneSquadri'));
      }

      const filteredFeatures = data.features.filter(feature => {
        const filter = this.config.fogli.filter(foglio => {
          const codice = feature.properties.COD_SQUADRO || feature.properties.cod_squadro;
          return foglio.codice === codice;
        });
        return filter.length > 0;
      });
      data.features = filteredFeatures;

      this.layerFogli = data;

      this.loadLayer();
    },
    submit() {
      this.postMessage('conferma');
    },
    cancel() {
      this.postMessage('annulla');
    },
    postMessage(button) {
      const message = {
        fogliSelezionati: this.fogli.join(','),
        field: parseInt(this.field),
        button: button,
      };
      //console.log(message)
      window.parent.postMessage(message, '*');
    },
    loadLayer() {
      GV.app.map.loadLayers([
        {
          name: 'SelezioneSquadri',
          type: 'JSON',
          style: {
            color: '#ffcc00',
            fillOpacity: 0,
            weight: 1,
            opacity: 1,
          },
          visible: true,
          data: this.layerFogli,
          onEachFeature: (feature, layer) => {
            layer.on('click', ev => {
              const codice = feature.properties.COD_SQUADRO || feature.properties.cod_squadro;
              if (this.fogli.indexOf(codice) > -1) {
                this.fogli = this.fogli.filter(item => item !== codice);
              } else {
                this.fogli.push(codice);
              }
            });
          },
        },
      ]);
      GV.config.activeControl.deactivate();

      if (this.selFogli) {
        this.fogli = this.selFogli.split(',');
      }

      notification('Selezionare un foglio sulla mappa o dalla lista', 'info');
    },
    collapse: function(event) {
      if (this.show) {
        document.getElementById('gv-map-selezione-fogli-body').style.display = 'none';
      } else {
        document.getElementById('gv-map-selezione-fogli-body').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
};
</script>

<style scoped>
.gv-map-selezione-fogli {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 10px;
  z-index: 800;
}

.gv-map-selezione-fogli-body {
  margin: 10px;
}

.gv-map-selezione-fogli-label {
  display: inline-block;
  width: 150px;
}

.gv-map-selezione-fogli-title {
  display: inline-block;
  font-weight: 800;
  width: 400px;
  margin-bottom: 20px;
}
.gv-map-selezione-fogli-buttons {
  margin-top: 10px;
}
.gv-map-selezione-fogli-buttons img {
  float: left;
  margin-right: 150px;
  margin-top: 10px;
}
</style>

<style>
.el-tree-node__label {
  font-size: 12px !important;
}

.el-tabs__item.is-active {
  color: #24386c !important;
}

.el-tabs__header {
  margin: 0 0 5px !important;
}
</style>
