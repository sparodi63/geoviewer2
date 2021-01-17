<template>
  <div id="gv-fototeca-scheda-volo-panel" class="gv-fototeca-scheda-volo-panel">
    <gv-title :title="title" :divId="'gv-fototeca-scheda-volo-panel'"></gv-title>
    <div class="gv-fototeca-scheda-volo-body gv-inverted-color-scheme">
      <div v-for="item in abstract" :key="item.value" class="gv-inverted-color-scheme">
        {{ item.value }}
      </div>
      <br />
      <a :href="urlCertificato" target="_blank">Certificato Calibrazione</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Loading, Notification } from 'element-ui';

export default {
  name: 'gv-fototeca-scheda-volo-panel',
  data() {
    const abs = GV.globals.FOTOTECA_SEL_VOLO.abstract
      .replace('N. 367 - 29 SETTEMBRE 2000', '29 SETTEMBRE 2000, n.367 - ')
      .split(' - ');
    const abstract = abs.map(item => {
      if (item === '') item = '.';
      return { value: item };
    });
    console.log(abstract);
    return {
      options: GV.config.getToolOptions('gv-fototeca-scheda-volo-button'),
      title: GV.globals.FOTOTECA_SEL_VOLO.nome,
      abstract: abstract,
      anno: GV.globals.FOTOTECA_SEL_VOLO.anno,
      urlCertificato: `https://geoservizi.regione.liguria.it/dtuff/Img/voli/Certificati_Calibrazione/${GV.globals.FOTOTECA_SEL_VOLO.certificato_calibrazione}`,
    };
  },
  computed: {},
  methods: {},
  mounted() {
    // console.log(GV.globals.FOTOTECA_SEL_VOLO);
  },
};
</script>

<style>
.gv-fototeca-scheda-volo-panel {
  position: absolute;
  width: 340px;
  right: 0px;
  bottom: 0px;
  margin-right: 10px;
  margin-bottom: 20px;
  z-index: 800;
}

.gv-fototeca-scheda-volo-body {
  padding: 15px;
  width: 310px;
  height: 210px;
  font-size: 12px;
}

.gv-fototeca-scheda-volo-body div {
  font-size: 12px;
}
</style>
