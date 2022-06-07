<template>
  <div class="gv-cultura-info gv-inverted-color-scheme" id="gv-cultura-info">
    <div
      v-draggable
      id="gv-cultura-info-title"
      class="gv-cultura-info-title gv-color-scheme"
    >
      <b style="margin-left: 10px">{{ title }}</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
      ></el-button>
      <!-- <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      ></button> -->
    </div>

    <div v-bar>
      <div class="gv-cultura-info-body" id="gv-cultura-info-body">
        <div class="gv-cultura-info-scheda">
          <div style="font-size: 20px;"><strong>{{ properties.NOME.toUpperCase() }}</strong></div>
          <br>
          <div>{{ properties.INDIRIZZO_FORMAT }}</div>
          <br>
          <div>{{ properties.RAGGRUPPAMENTO }} / <strong>{{ properties.CATNAME }}</strong></div>
          <div class="gv-cultura-info-descrizione" v-if="properties.DESCRIZIONE_BREVE"><pre><em>{{ properties.DESCRIZIONE_BREVE }}</em></pre></div>
          <div class="gv-cultura-info-descrizione" v-if="properties.DESCRIZIONE"><pre>{{ properties.DESCRIZIONE }}</pre></div>

          <div v-if="properties.SITO || properties.EMAIL">
            <div><strong>Per approfondire</strong></div>
            <ul>
            <li v-if="properties.SITO">
              <a :href="`http://${properties.SITO}`" target=_blank>SITO</a>
            </li>
            <li v-if="properties.EMAIL">
              <a :href="`mailto://${properties.EMAIL}`" target=_blank>EMAIL</a>
            </li>
            </ul>

          </div>
        </div>
        <div class="gv-cultura-info-button" >
          <el-button size="mini" @click="showGallery">Galleria Immagini</el-button>
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
  async mounted() {
    console.log(this.properties)
  },
  methods: {
  //   componiIndirizzo() {
  //     const province = {
  //       "008": "IM",
  //       "009": "SV",
  //       "010": "GE",
  //       "011": "SP"
  //     }
  //     let indirizzo = ''
  //     if (this.properties.INDIRIZZO) indirizzo += this.properties.INDIRIZZO + ' '  
  //     if (this.properties.NUMCIVICO) indirizzo += this.properties.NUMCIVICO + ' '
  //     if (this.properties.LOCALITA) indirizzo += this.properties.LOCALITA + ' '
  //     if (indirizzo !== '') indirizzo += ' - '
  //     indirizzo += this.properties.NOMECOMUNE
  //     indirizzo += ' (' + province[this.properties.COD_PROV] + ')'
  //     return indirizzo
  //   },
    showGallery() {
      mountComponent({
        elId: 'gv-cultura-info-gallery',
        clear: true,
        vm: new Vue({
          template: `<gv-cultura-info-gallery :id="id" ></gv-cultura-info-gallery>`,
          data: {
            id: this.properties.OID,
          },
        }),
      });      
    },
    closePanel: function() {
      let div = document.getElementById('gv-cultura-info');
      if (!div) return;
      div.parentNode.removeChild(div);
      GV.eventBus.$emit('cultura-close-panel', {
        flagRicerca: this.flagRicerca,
      });
    },
    hidePanel: function(event) {
      if (this.show) {
        document.getElementById('gv-cultura-info-body').style.display = 'block';
        document.getElementById('gv-cultura-info').style.width = '800px';
      } else {
        document.getElementById('gv-cultura-info-body').style.display = 'none';
        document.getElementById('gv-cultura-info').style.width = '200px';
      }
      this.show = !this.show;
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-cultura-info-collapse gv-color-scheme el-icon-arrow-down'
        : 'gv-cultura-info-collapse gv-color-scheme el-icon-arrow-up';
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
  margin-top:   20px;

  /* left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 270px; */
  width: 600px;
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
 width: 550px;
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
  background-color: #5B565C !important;
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
/* Definire qui css custom per carousel */

</style>
