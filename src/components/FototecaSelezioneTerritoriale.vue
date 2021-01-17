<template>
  <div
    id="gv-fototeca-selezione-territoriale-panel"
    class="gv-fototeca-selezione-territoriale-panel"
  >
    <gv-title
      title="Fototeca Selezione Territoriale"
      :divId="'gv-fototeca-selezione-territoriale-panel'"
      :noClose="true"
    ></gv-title>
    <div class="gv-fototeca-selezione-territoriale-body gv-inverted-color-scheme">
      <el-row type="flex" class="row-bg" justify="left">
        Disegna un rettangolo sulla mappa<br />
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <!-- <el-button
          id="gv-fototeca-selezione-submit"
          v-show="showSubmit"
          title="Conferma"
          @click="submit"
          class="gv-color-scheme"
          size="mini"
          >Conferma</el-button
        > -->
        <el-button
          id="gv-fototeca-selezione-annulla"
          v-show="showAnnulla"
          title="Annulla Selezione"
          @click="annullaSelezione"
          class="gv-color-scheme"
          size="mini"
          >Annulla Selezione Corrente</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Row, Button } from 'element-ui';
Vue.use(Row);
Vue.use(Button);

require('leaflet-draw');

export default {
  name: 'gv-fototeca-selezione-territoriale-panel',
  data() {
    return {
      options: GV.config.getToolOptions('gv-fototeca-selezione-territoriale-button'),
      drawnRectangle: null,
      bbox: null,
      bboxSRS: '4326',
      showAnnulla: false,
      // showSubmit: false,
    };
  },
  computed: {},
  methods: {
    subscribeMapEvent(event) {
      if (!GV.app.map.drawRectangle) {
        GV.app.map.addHandler('drawRectangle', L.Draw.Rectangle);
      }
      GV.app.map.drawRectangle.enable();
      GV.app.map.on('draw:created', event => {
        const r = confirm('Sei sicuro?');
        if (r == true) {
          this.submit(event);
        }
        GV.eventBus.$emit('gv-fototeca-selezione-territoriale-switch');
      });
    },
    submit(event) {
      this.drawnRectangle.clearLayers();
      this.drawnRectangle.addLayer(event.layer);
      const xMin = event.layer.getBounds()._southWest.lng;
      const yMin = event.layer.getBounds()._southWest.lat;
      const xMax = event.layer.getBounds()._northEast.lng;
      const yMax = event.layer.getBounds()._northEast.lat;
      this.bbox = `${xMin},${yMin},${xMax},${yMin},${xMax},${yMax},${xMin},${yMax},${xMin},${yMin}`;
      this.showAnnulla = true;
      GV.eventBus.$emit('gv-fototeca-reload-voli', {
        bbox: this.bbox,
        bboxSRS: this.bboxSRS,
      });
    },
    annullaSelezione() {
      const r = confirm('Sei sicuro?');
      if (r == true) {
        this.drawnRectangle.clearLayers();
        this.bbox = null;
        this.showAnnulla = false;
        GV.eventBus.$emit('gv-fototeca-reload-voli', {
          bbox: this.bbox,
          bboxSRS: this.bboxSRS,
        });
      }
      GV.eventBus.$emit('gv-fototeca-selezione-territoriale-switch');
    },
    addLayerRettangolo() {
      this.drawnRectangle = new L.FeatureGroup();
      GV.app.map.addLayer(this.drawnRectangle);
    },
  },
  mounted() {
    // GESTIONE EVENTI
    this.subscribeMapEvent(event);
    GV.eventBus.$on('gv-control-fototeca-selezione-territoriale-activate', event => {
      this.subscribeMapEvent(event);
    });
    GV.eventBus.$on('gv-control-fototeca-selezione-territoriale-deactivate', event => {
      GV.app.map.off('draw:created');
      GV.app.map.drawRectangle.disable();
    });

    //
    this.addLayerRettangolo();
  },
};
</script>

<style>
.gv-fototeca-selezione-territoriale-panel {
  position: absolute;
  width: 260px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-fototeca-selezione-territoriale-body {
  padding: 5px;
  width: 250px;
  height: 60px;
}
</style>
