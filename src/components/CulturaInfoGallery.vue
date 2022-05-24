<template>
  <div id="gv-cultura-info-gallery" class="gv-cultura-info-gallery gv-inverted-color-scheme" >
    <div
      v-draggable
      id="gv-cultura-info-gallery-title"
      class="gv-cultura-info-title gv-color-scheme"
    >
      <b>{{ title }}</b>
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
      ></el-button>
    </div>
    <div class="gv-cultura-info-body" id="gv-cultura-info-body">
      <div class="gv-cultura-info-gallery">
        <gv-carousel 
          :url="carouselConfig.galleryUrl"
        >
        </gv-carousel>        
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import Carousel from './Carousel.vue';
Vue.component('gv-carousel', Carousel);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-cultura-info-gallery',
  props: {
    id: String,
  },
  data() {
    // const galleryUrl = 
    return {
      show: false,
      title: "Gallery Immagini",
      carouselConfig: {
        galleryUrl: `/geoservices/REST/cultura/getConfigGallery/${this.id}`,
        // height: "400px",
        // interval: 4000,
        // autoplay: true,
        // imgWidth: "600px",
        // openImgLink: false,
      }
    };
  },
  async mounted() {
    // console.log(this.properties)
  },
  methods: {
    closePanel: function() {
      let div = document.getElementById('gv-cultura-info-gallery');
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
.gv-cultura-info-gallery {
  position: absolute;
  left: 0;
  top: 0;
  width: 90%;
  height: 90%;
  margin-left: 10px;
  margin-top: 20px;
  z-index: 800;
}

.gv-cultura-info-title {
  position: relative;
  display: block;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-right: 0rem;
  padding-left: 0.5rem;
  margin-bottom: -1px;
  color: black;
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
}

.gv-cultura-info-scuola {
  margin: 10px;
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
  background-color: #e94e1b !important;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: 800;
  color: black;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
}

span {
  margin-right: 20px;
}
</style>

<style>

/* Definire qui css custom per carousel */

</style>
