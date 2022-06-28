<template>
  <div id="gv-cultura-info-gallery" class="gv-cultura-info-gallery gv-inverted-color-scheme">
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
    <div class="gv-cultura-info-gallery-body" id="gv-cultura-info-gallery-body">
      <el-carousel
        type="card"
        :interval="interval"
        :autoplay="autoplay"
        indicator-position="none"
        arrow="never"
      >
        <el-carousel-item v-for="item in gallery" :key="item.id">
          <div>
            <div class="item">
              <div :title="item.text" class="item__content">
                {{ item.label }}
              </div>
              <img style="width: 100%; height: auto" :src="item.imgUrl" :title="item.text" />
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

// import Carousel from './Carousel.vue';
// Vue.component('gv-carousel', Carousel);

import axios from 'axios';
import { Carousel, CarouselItem } from 'element-ui';
Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-cultura-info-gallery',
  props: {
    // id: String,
    gallery: Array,
  },
  data() {
    // DIMENSIONI DA IMPOSTARE
    // HEIGHT

    return {
      show: false,
      // galleryUrl: `/geoservices/REST/cultura/getConfigGallery/${this.id}`,
      title: 'Gallery Immagini',
      // gallery: null,
      autoplay: false,
      interval: 4000,
    };
  },
  async mounted() {
    // const result = await axios.get(this.galleryUrl);
    // if (result.data.gallery) {
    //   console.log(result.data.gallery);
    //   this.gallery = result.data.gallery;
    //   this.resizePanel();
    // }
    this.resizePanel();
  },
  methods: {
    resizePanel: function () {
      const carousel = document.getElementsByClassName('el-carousel')[0];
      const width = carousel.offsetWidth;
      carousel.setAttribute(
        'style',
        `height:${width / 2.7}px !important; min-height:300px !important`
      );

      // console.log('resize')

      // NON FUNZIONA
      // const carousel_container = document.getElementsByClassName("el-carousel__container")[0]
      // carousel_container.setAttribute("style",`height:${width/2.5}px !important`);
      // console.log(carousel_container.offsetHeight)
    },
    closePanel: function () {
      let div = document.getElementById('gv-cultura-info-gallery');
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

<style>
/* Definire qui css custom per carousel */

/* .el-carousel {
    padding-bottom: 5%;
  } */

/* .el-carousel__container {
  } */

.el-carousel__item {
  height: auto !important;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel--horizontal {
  overflow: hidden !important;
}

.item__content {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 15px;
}

/* .item__image {
    width: 300px;
    object-fit: cover;
  } */
</style>

<style scoped>
.gv-cultura-info-gallery {
  /* position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 20px; */
  /* top: 5%; */
  display: block;
  margin: 5%;
  margin-top: 50px;
  position: absolute;
  width: 90%;
  height: auto;
  z-index: 800;
  /* background-color: white; */
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
  /* color: black; */
  font-weight: 900;
}

.gv-cultura-info-title :focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.gv-cultura-info-gallery-body {
  margin: 20px;
  /* height: 500px;
  overflow: hidden; */
}

.gv-close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
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


