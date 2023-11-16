<template>
  <div class="gv-difesa-suolo-foto-info gv-inverted-color-scheme" id="gv-difesa-suolo-foto-info">
    <div
      v-draggable
      id="gv-difesa-suolo-foto-info-title"
      class="gv-difesa-suolo-foto-info-title gv-color-scheme"
    >
      <strong style="margin-left: 10px">{{ title }}</strong>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
        alt="Chiudi Panello"
      ></el-button>
    </div>

    <div v-bar>
      <div class="gv-difesa-suolo-foto-info-body" id="gv-difesa-suolo-foto-info-body">
        <div class="gv-difesa-suolo-foto-info-scheda">
          <div style="font-size: 20px; width: 90%">
            <strong>NOME FILE: </strong> {{ properties.file_name }}
          </div>
          <div style="font-size: 20px; width: 90%">
            <strong>DATA: </strong> {{ properties.datetime }}
          </div>
          <div style="font-size: 20px; width: 90%">
            <el-checkbox v-model="properties.validato" @change="toggleValidate"
              >Validato</el-checkbox
            >
            <span class="gv-difesa-suolo-foto-label">Direzione</span>
            <el-input
              id="gv-difesa-suolo-foto-direzione"
              style="width: 33px"
              size="mini"
              maxlength="3"
              placeholder="Direzione"
              type="integer"
              v-model="properties.direzione"
            ></el-input>
            <span class="gv-difesa-suolo-foto-degree">°</span>
            <el-button
              id="gv-measure-point"
              title="Sposta"
              @click="measurePoint"
              class="gv-color-scheme fas fa-hand-point-down"
              size="mini"
            />
            <br />
            <el-button
              id="gv-difesa-suolo-foto-info-submit"
              ref="button"
              title="Salva"
              type="primary"
              @click="submit()"
              size="mini"
              :disabled="!changed"
            >
              Salva
            </el-button>
            <!-- <br /> -->
            <el-button
              id="gv-difesa-suolo-foto-info-delete"
              ref="button"
              title="Cancella Foto"
              type="danger"
              @click="deletePhoto()"
              size="mini"
            >
              Cancella Foto
            </el-button>
          </div>
          <br />
          <div style="font-size: 20px; width: 90%">
            <a :href="properties.url" target="_blank">
              <img width="300px" :src="properties.url" />
            </a>
          </div>
          <div style="font-size: 20px; width: 90%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import Vuebar from 'vuebar';
Vue.use(Vuebar);

import mountComponent from '../util/mountComponent';

import Carousel from './CulturaInfoGallery.vue';
Vue.component('gv-difesa-suolo-foto-info-gallery', Carousel);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

import { Loading } from 'element-ui';
Vue.use(Loading);

import notification from '../util/notification';

import getCoordTransform from '../services/getCoordTransform';

export default {
  name: 'gv-difesa-suolo-foto-info',
  props: {
    feature: Object,
  },
  data() {
    return {
      show: false,
      properties: this.feature.properties,
      title: 'SCHEDA FOTO',
      session: GV.globals.SESSION.ID,
      changed: true,
      pointHandler: new L.Draw.Marker(GV.app.map.map, {
        icon: L.icon({
          iconUrl: '/geoservices/apps/viewer/dist/static/img/marker-icon.png',
          iconSize: [12, 20],
          iconAnchor: [6, 20],
        }),
      }),
      layer: null,
      lon: null,
      lat: null,
    };
  },
  async mounted() {
    console.log(this.lon, this.lat);
    GV.eventBus.$on('gv-control-measure-activate', (ev) => {
      GV.app.map.on('draw:created', (e) => {
        this.drawCreated(e);
      });
    });
    GV.eventBus.$on('gv-control-measure-deactivate', (ev) => {
      this.clear();
      GV.app.map.off('draw:created');
    });
    GV.app.map.on('draw:created', (e) => {
      this.drawCreated(e);
    });
  },
  methods: {
    toggleValidate() {
      // this.changed = !this.changed;
    },
    closePanel: function () {
      let div = document.getElementById('gv-difesa-suolo-foto-info');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.app.map.clearLayer('InfoWmsHilite');
      this.clear();
    },
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
    measurePoint() {
      this.clear();
      this.pointHandler.enable();
    },
    clear() {
      this.pointHandler.disable();
      this.lon = null;
      this.lat = null;

      if (this.layer) {
        GV.app.map.removeLayer(this.layer);
      }
    },
    handleMarker(latlng) {
      getCoordTransform('4326', '25832', latlng.lng, latlng.lat).then((response) => {
        if (response.data.points) {
          const coords = response.data.points[0].split(',');
          this.lon = parseInt(coords[0]);
          this.lat = parseInt(coords[1]);
        }
      });
    },
    drawCreated(e) {
      this.layer = e.layer;
      this.layer.addTo(GV.app.map);
      this.handleMarker(this.layer.editing._marker._latlng);
    },
    submit() {
      var r = confirm('Sei sicuro?');
      if (r == true) {
        this.saveData();
      }
      return;
    },
    saveData() {
      console.log(this.lon, this.lat);
      // return;
      let loading = Loading.service({
        fullscreen: true,
        text: 'Salvataggio in corso...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const url = `/geoservices/REST/difesa_suolo_foto/update_foto/`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.properties.id,
          validato: this.properties.validato,
          direzione: parseInt(this.properties.direzione),
          lon: this.lon,
          lat: this.lat,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          loading.close();
          this.clear();
          this.toggleValidate();
          this.closePanel();
          notification('Dati salvati');
          GV.globals.DIFESA_SUOLO_FOTO.refreshMap();
        })
        .catch((error) => {
          loading.close();
          notification('Errore nel salvataggio: ' + error);
          console.error('Error:', error);
        });
    },
    deletePhoto() {
      var r = confirm('Sei sicuro?');
      if (r == true) {
        this.deleteData();
      }
      return;
    },
    deleteData() {
      let loading = Loading.service({
        fullscreen: true,
        text: 'Cancellazione in corso...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const url = `/geoservices/REST/difesa_suolo_foto/delete_foto/${this.properties.id}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          loading.close();
          this.toggleValidate();
          notification('Dati salvati');
          GV.globals.DIFESA_SUOLO_FOTO.refreshMap();
        })
        .catch((error) => {
          loading.close();
          notification('Errore nel salvataggio: ' + error);
          console.error('Error:', error);
        });
    },
  },
};
</script>

<style scoped>
.gv-difesa-suolo-foto-info {
  position: absolute;
  float: right;
  right: 0;
  top: 0;
  margin-right: 10px;
  margin-top: 280px;

  /* left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 270px; */
  width: 350px;
  z-index: 800;
  /* overflow: auto;
  max-height: 300px; */
}

.gv-difesa-suolo-foto-info-title {
  position: relative;
  display: block;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-right: 0rem;
  padding-left: 0.5rem;
  margin-bottom: -1px;
  /* color: black; */
  cursor: default;
  font-weight: 800;
  font-family: 'Raleway', Arial, sans-serif !important;
  font-size: 14px;
}

.gv-difesa-suolo-foto-info-title a {
  margin-left: 420px;
  font-size: 15px;
  color: black;
  font-weight: 900;
}

#gv-difesa-suolo-foto-info-delete {
  /* right: 0 !important; */
  margin-left: 150px !important;
}

#gv-measure-point {
  margin-left: 25px !important;
}

.gv-difesa-suolo-foto-label {
  margin-left: 25px;
  margin-right: 1px;
  font-size: 15px;
}

.gv-difesa-suolo-foto-degree {
  margin-left: 0px;
  margin-right: 15px;
  font-size: 20px;
  font-weight: 900;
}

.gv-difesa-suolo-foto-info-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-difesa-suolo-foto-info-body {
  margin: 10px;
  overflow: auto;
  /* overflow: hidden; */
  max-height: 350px;
}

.gv-difesa-suolo-foto-info-descrizione {
  width: 300px;
}

.gv-difesa-suolo-foto-info-button {
  margin-top: 10px;
  margin-bottom: 10px;
}

.gv-difesa-suolo-foto-info-scheda {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-difesa-suolo-foto-info-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}

.gv-close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  appearance: none;
  /* background-color: #e94e1b !important; */
  /* background-color: #5b565c !important; */
  color: #ddd;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: 800;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
}

span {
  margin-right: 20px;
}
</style>

<style>
.el-input__inner {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

pre {
  /* white-space: pre-wrap;  */
  white-space: pre-line;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
