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
      </el-row>
      <el-row type="flex" class="row-bg" justify="left">
        <el-button
          id="gv-fototeca-selezione-annulla"
          :disabled="buttonDisabled"
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
import RectDraw from '../mixins/RectDraw.js';
import InfoWmsManager from '../controls/InfoWmsManager';

// require('leaflet-draw');

export default {
  name: 'gv-fototeca-selezione-territoriale-panel',
  data() {
    return {
      options: GV.config.getToolOptions('gv-fototeca-selezione-territoriale-button'),
      drawnRectangle: null,
      bbox: null,
      bboxSRS: '4326',
      buttonDisabled: true,
    };
  },
  computed: {},
  mixins: [RectDraw],
  methods: {
    rectOnDraw(event) {
      const r = confirm('Sei sicuro?');
      if (r == true) {
        this.submit(event);
      }
      GV.eventBus.$emit('gv-fototeca-selezione-territoriale-switch');
    },
    submit(event) {
      if (GV.app.map.type === 'openlayers') {
        const coords = this.drawnRectangle
          .getSource()
          .getFeatures()[0]
          .getGeometry()
          .getCoordinates();
        this.bbox = coords.map(coord => { 
          return coord.join(',');
        })[0];
        this.bboxSRS = '3857';
      } else {
        InfoWmsManager.addHiliteLayer(GV.app.map);
        const layer = GV.app.map.getLayerByName('InfoWmsHilite');
        layer.clearLayers();
        layer.addLayer(event.layer);

        const xMin = event.layer.getBounds()._southWest.lng;
        const yMin = event.layer.getBounds()._southWest.lat;
        const xMax = event.layer.getBounds()._northEast.lng;
        const yMax = event.layer.getBounds()._northEast.lat;
        this.bbox = `${xMin},${yMin},${xMax},${yMin},${xMax},${yMax},${xMin},${yMax},${xMin},${yMin}`;
        this.bboxSRS = '4326';
      }
      this.buttonDisabled = false;
      GV.eventBus.$emit('gv-fototeca-reload-voli', {
        bbox: this.bbox,
        bboxSRS: this.bboxSRS,
      });
    },
    annullaSelezione() {
      const r = confirm('Sei sicuro?');
      if (r == true) {
        GV.app.map.getLayerByName('InfoWmsHilite').clearLayers();
        this.bbox = null;
        this.buttonDisabled = true;
        GV.eventBus.$emit('gv-fototeca-reload-voli', {
          bbox: this.bbox,
          bboxSRS: this.bboxSRS,
        });
      }
      GV.eventBus.$emit('gv-fototeca-selezione-territoriale-switch');
    },
  },
  mounted() {
    // GESTIONE EVENTI
    this.rectEnable();
    GV.eventBus.$on('gv-control-fototeca-selezione-territoriale-activate', event => {
      this.rectEnable();
    });
    GV.eventBus.$on('gv-control-fototeca-selezione-territoriale-deactivate', event => {
      GV.app.map.off('draw:created');
      this.rectDisable();
    });
    //
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
