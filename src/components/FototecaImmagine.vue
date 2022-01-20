<template>
  <div class="gv-fototeca-immagine gv-inverted-color-scheme" id="gv-fototeca-immagine">
    <gv-title v-draggable :title="title" :divId="'gv-fototeca-immagine'"></gv-title>
    <el-button
      id="gv-button-fototeca-immagine-carrello"
      icon="el-icon-circle-plus-outline"
      title="Aggiungi al Carrello"
      @click="addToBasket"
      class="gv-color-scheme gv-button-fototeca-immagine-carrello"
      size="mini"
      >Aggiungi al Carrello</el-button
    >

    <div class="gv-fototeca-immagine-body" id="gv-fototeca-immagine-body">
      <image-viewer :imgUrl="imgUrl" :logo="logo" width="400" height="400"></image-viewer>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import mountComponent from '../util/mountComponent';

// import ImageViewer from './ImageViewer.vue';
// Vue.component('image-viewer', ImageViewer);

Vue.component('image-viewer', () => import('./ImageViewer.vue'));

Vue.component('gv-fototeca-carrello-panel', () => import('./FototecaCarrello.vue'));

export default {
  name: 'gv-fototeca-immagine',
  props: ['volo', 'foto'],

  data() {
    const baseUrl = 'https://srvcarto.regione.liguria.it/dtuff/Img/voli/';
    const imgUrl = `${baseUrl}${this.volo}/${this.foto}.jpg`;
    return {
      title: `Fotogramma: ${this.foto}`,
      imgUrl: imgUrl,
      logo: '/geoservices/apps/imageviewer2/fototeca/logo.gif',
    };
  },
  methods: {
    addToBasket() {
      // test se volo già presente
      const voli = GV.globals.FOTOTECA_CARRELLO.filter(volo => {
        return volo.id === GV.globals.FOTOTECA_SEL_VOLO.id;
      });
      if (voli.length === 0) {
        GV.globals.FOTOTECA_CARRELLO.push({
          id: GV.globals.FOTOTECA_SEL_VOLO.id,
          label: GV.globals.FOTOTECA_SEL_VOLO.nome,
          dir: GV.globals.FOTOTECA_SEL_VOLO.volo.toLowerCase(),
          children: [
            {
              label: this.foto,
              file: `${this.foto}.jpg`,
            },
          ],
        });
      } else {
        const volo = voli[0];
        let fotoPresente = false;
        volo.children.forEach(foto => {
          if (foto.label === this.foto) fotoPresente = true;
        });
        if (!fotoPresente) {
          volo.children.push({
            label: this.foto,
            file: `${this.foto}.jpg`,
          });
        }
      }
      this.showCart();
    },
    showCart() {
      mountComponent({
        elId: 'gv-fototeca-carrello-panel',
        containerId: GV.config.containerId,
        toggleEl: false,
        vm: new Vue({
          template: `<gv-fototeca-carrello-panel></gv-fototeca-carrello-panel>`,
        }),
      });
    },
  },
  mounted: function() {},
};
</script>

<style scoped>
.gv-fototeca-immagine {
  position: absolute;
  width: 402px;
  height: 470px;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
  display: block;
}
.gv-button-fototeca-immagine-carrello {
  margin: 5px;
}
</style>
