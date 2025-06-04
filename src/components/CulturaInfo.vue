<template>
  <div class="gv-cultura-info gv-inverted-color-scheme" id="gv-cultura-info">
    <div v-draggable id="gv-cultura-info-title" class="gv-cultura-info-title gv-color-scheme">
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
      <div class="gv-cultura-info-body" id="gv-cultura-info-body">
        <div class="gv-cultura-info-scheda">
          <div style="font-size: 20px; width: 90%">
            <strong>{{ properties.NOME.toUpperCase() }}</strong>
          </div>
          <br />
          <div style="width: 90%">{{ properties.INDIRIZZO_FORMAT }}</div>
          <br />
          <div style="width: 90%">
            {{ properties.RAGGRUPPAMENTO }} / <strong>{{ properties.CATNAME }}</strong>
          </div>
          <div class="gv-cultura-info-descrizione" v-if="properties.DESCRIZIONE_BREVE">
            <pre><em>{{ properties.DESCRIZIONE_BREVE }}</em></pre>
          </div>
          <div class="gv-cultura-info-descrizione" v-if="properties.DESCRIZIONE">
            <pre>{{ properties.DESCRIZIONE }}</pre>
          </div>
          <!-- Alcune opere correlate -->
          <div v-if="properties.opere.length > 0">
            <div><strong>Alcune opere correlate</strong></div>
            <ul v-for="item in properties.opere" :key="item.id">
              <li>{{ item.nome }}</li>
            </ul>
          </div>

          <!-- <div v-if="properties.SITO">
            <div><strong>Per approfondire</strong></div>
            <ul>
              <li v-if="properties.SITO">
                <a :href="`${properties.SITO}`" target="_blank">SITO</a>
              </li>
            </ul>
          </div> -->
        </div>
        <div v-if="properties.GALLERY.length > 0" class="gv-cultura-info-button">
          <el-button alt="Galleria Immagini" size="mini" type="info" @click="showGallery"
            >Galleria Immagini</el-button
          >
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
Vue.component('gv-cultura-info-gallery', Carousel);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-cultura-info',
  props: {
    properties: Object,
  },
  data() {
    return {
      show: false,
      title: 'SCHEDA LUOGO',
    };
  },
  async mounted() {},
  methods: {
    showGallery() {
      mountComponent({
        elId: 'gv-cultura-info-gallery',
        clear: true,
        vm: new Vue({
          template: `<gv-cultura-info-gallery :gallery="gallery" ></gv-cultura-info-gallery>`,
          data: {
            gallery: this.properties.GALLERY,
          },
        }),
      });
    },
    closePanel: function () {
      let div = document.getElementById('gv-cultura-info');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.eventBus.$emit('cultura-close-panel', {
        flagRicerca: this.flagRicerca,
      });
    },
    handleLink(index, link_documentazione) {
      window.open(link_documentazione);
    },
  },
};
</script>

<style scoped>
.gv-cultura-info {
  position: absolute;
  float: right;
  right: 0;
  top: 0;
  margin-right: 20px;
  margin-top: 20px;

  /* left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 270px; */
  width: 350px;
  z-index: 800;
  /* overflow: auto;
  max-height: 300px; */
}

.gv-cultura-info-title {
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

.gv-cultura-info-title a {
  margin-left: 420px;
  font-size: 15px;
  color: black;
  font-weight: 900;
}

.gv-cultura-info-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-cultura-info-body {
  margin: 10px;
  overflow: auto;
  /* overflow: hidden; */
  max-height: 300px;
}

.gv-cultura-info-descrizione {
  width: 300px;
}

.gv-cultura-info-button {
  margin-top: 10px;
  margin-bottom: 10px;
}

.gv-cultura-info-scheda {
  margin-top: 10px;
  margin-left: 5px;
}

.gv-cultura-info-collapse {
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
  -webkit-appearance: none;
  /* background-color: #e94e1b !important; */
  background-color: #5b565c !important;
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
pre {
  /* white-space: pre-wrap;  */
  white-space: pre-line;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
