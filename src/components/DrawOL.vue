<template>
  <div id="gv-draw-panel" class="gv-draw-panel">
    <gv-title :title="title" :divId="'gv-draw-panel'" v-draggable :noClose="true"></gv-title>
    <div id="gv-draw-panel-body" class="gv-draw-panel-body gv-inverted-color-scheme">
      <el-button
        id="gv-draw-Point"
        title="Disegna punto"
        v-show="pointButton"
        @click="draw('Point')"
        class="gv-color-scheme fg-point"
        size="mini"
      ></el-button>
      <el-button
        id="gv-draw-LineString"
        title="Disegna linea"
        v-show="lineButton"
        @click="draw('LineString')"
        class="gv-color-scheme fg-polyline-pt"
        size="mini"
      ></el-button>
      <el-button
        id="gv-draw-Polygon"
        title="Disegna poligono"
        v-show="polygonButton"
        @click="draw('Polygon')"
        class="gv-color-scheme fg-polygon-pt"
        size="mini"
      >
        <!-- <i class="fas fa-draw-polygon"></i> -->
      </el-button>
      <el-button
        id="gv-draw-modify"
        title="Modifica"
        v-show="modifyButton"
        @click="draw('modify')"
        class="gv-color-scheme fa fa-edit"
        size="mini"
      ></el-button>
      <el-button
        id="gv-draw-delete"
        title="Cancella"
        v-show="deleteButton"
        @click="draw('delete')"
        class="gv-color-scheme el-icon-delete"
        size="mini"
      ></el-button>
    </div>
    <el-row type="flex" class="row-bg" justify="left">
      <el-checkbox v-model="snap" @change="setSnapInteraction">Snap</el-checkbox>
      <!-- <el-button
        id="gv-draw-snap"
        title="Snap"
        @click="setSnapInteraction"
        class="gv-color-scheme fg-snap"
        size="mini"
      ></el-button> -->
    </el-row>
    <el-row type="flex" class="row-bg" justify="left">
      <el-button
        id="gv-draw-submit"
        title="Salva i dati sul DB"
        @click="confirmSubmit"
        class="gv-color-scheme"
        size="mini"
        >Salva su DB</el-button
      >
      <el-button
        id="gv-draw-cancel"
        v-show="cancelButton"
        title="Ritorno alla applicazione"
        @click="cancel"
        class="gv-color-scheme"
        size="mini"
        >Annulla</el-button
      >
      <el-button
        id="gv-draw-cancel"
        v-show="refreshButton"
        title="Ricarica dati salvati sul DB"
        @click="confirmRefresh"
        class="gv-color-scheme"
        size="mini"
        >Ricarica</el-button
      >
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import getWFSFeature from '../services/getWFSFeature';

import { Button, Row, Col, Loading, Notification } from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);

export default {
  name: 'gv-draw-panel',
  data() {
    const options = GV.config.getToolOptions('gv-draw-button');
    // console.log(options);
    return {
      options: options,
      title: 'Acquisizione Geometrie',
      pointClass: 'el-button--default el-button--mini el-button gv-color-scheme ms fg-point',
      lineClass: 'el-button--default el-button--mini el-button gv-color-scheme ms fg-polyline-pt',
      areaClass: 'el-button--default el-button--mini el-button gv-color-scheme ms fg-polygon-pt',
      modifyClass: 'el-button--default el-button--mini el-button gv-color-scheme fa fa-edit',
      deleteClass: 'el-button--default el-button--mini el-button gv-color-scheme el-icon-delete',
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33',
          }),
        }),
      }),
      type: null,
      layer: null,
      interaction: null,
      snap: true,
      snapInteraction: true,
      deletedItems: [],
      submitButton: options.buttons && options.buttons.submit,
      cancelButton: options.buttons && options.buttons.cancel,
      refreshButton: options.buttons && options.buttons.refresh,
      pointButton: options.tools && options.tools.draw && options.tools.draw.point,
      lineButton: options.tools && options.tools.draw && options.tools.draw.polyline,
      polygonButton: options.tools && options.tools.draw && options.tools.draw.polygon,
      modifyButton: options.tools && options.tools.edit && options.tools.edit.edit,
      deleteButton: options.tools && options.tools.edit && options.tools.edit.remove,
    };
  },
  computed: {},
  methods: {
    setButtonClass(type) {
      document.getElementById('gv-draw-Point').className = this.pointClass;
      document.getElementById('gv-draw-LineString').className = this.lineClass;
      document.getElementById('gv-draw-Polygon').className = this.areaClass;
      document.getElementById('gv-draw-modify').className = this.modifyClass;
      document.getElementById('gv-draw-delete').className = this.deleteClass;
      if (type) document.getElementById(`gv-draw-${type}`).className += ' gv-button-selected';
    },
    draw(type) {
      this.type = type;
      this.setButtonClass(null);
      this.setButtonClass(type);

      GV.app.map.getOverlays().clear();

      // GV.app.map.on('pointermove', this.pointerMoveHandler);
      if (this.interaction) GV.app.map.removeInteraction(this.interaction);
      switch (type) {
        case 'modify':
          this.addInteractionModify();
          break;
        case 'delete':
          this.addInteractionDelete();
          break;
        default:
          this.addInteractionDraw(type);
          break;
      }
    },
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return;
      }
      let helpMsg = 'Click per disegnare';
      if (this.sketch) {
        const geom = this.sketch.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
          helpMsg = this.continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
          helpMsg = this.continueLineMsg;
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);
      this.helpTooltipElement.classList.remove('hidden');
    },
    setSnapInteraction() {
      if (this.snap) {
        this.snapInteraction = new ol.interaction.Snap({ source: this.layer.getSource() });
        GV.app.map.addInteraction(this.snapInteraction);
      } else {
        GV.app.map.removeInteraction(this.snapInteraction);
      }
    },
    addInteractionModify() {
      this.interaction = new ol.interaction.Modify({ source: this.layer.getSource() });
      GV.app.map.addInteraction(this.interaction);

      this.setSnapInteraction();
    },
    addInteractionDelete() {
      this.interaction = new ol.interaction.Select({ source: this.layer.getSource() });
      GV.app.map.addInteraction(this.interaction);

      this.setSnapInteraction();

      this.interaction.on('select', evt => {
        const delFeature = evt.target.getFeatures().getArray()[0];
        this.layer.getSource().removeFeature(delFeature);
        this.deletedItems.push(delFeature);
      });
    },
    addInteractionDraw(type) {
      this.interaction = new ol.interaction.Draw({
        source: this.layer.getSource(),
        type: type,
        style: this.style,
      });
      GV.app.map.addInteraction(this.interaction);

      // this.createMeasureTooltip();
      // this.createHelpTooltip();

      this.setSnapInteraction();

      this.interaction.on('drawstart', evt => {
        console.log('drawstart');
      });

      this.interaction.on('drawend', evt => {
        const newFeature = evt.feature;
        console.log('drawend', newFeature);
        if (!this.options.multiGeom) {
          for (const feature of this.layer.getSource().getFeatures()) {
            console.log(feature);
            this.layer.getSource().removeFeature(feature);
          }
        }
        console.log('drawend 2', this.layer.getSource().getFeatures());
      });
    },
    addLayerFeatures(initWfsRequests) {
      // console.log('initWfsRequests', initWfsRequests);
      this.layer.getSource().clear(true);
      for (const request of initWfsRequests) {
        getWFSFeature(null, null, request.wfsURL)
          .then(features => {
            if (features && features.length > 0) {
              const source = this.layer.getSource();
              for (const feature of features) {
                if (feature.geometry) {
                  const olFeature = new ol.format.GeoJSON().readFeature(feature, {
                    featureProjection: 'EPSG:3857',
                  });
                  source.addFeature(olFeature);
                }
              }
              GV.app.map.fit(source.getExtent(), {
                maxZoom: 17,
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    clear() {
      GV.app.map.getOverlays().clear();
      GV.app.map.removeInteraction(this.interaction);
      GV.app.map.removeInteraction(this.snapInteraction);
      this.setButtonClass(null);
    },
    cancel() {
      if (this.options.cancel) this.options.cancel();
    },
    confirmRefresh() {
      var r = confirm(
        "L'operazione cancella eventuali modifiche non salvate su DB.\n\nSei sicuro?"
      );
      if (r == true) {
        this.refresh();
      }
      return;
    },
    refresh() {
      this.layer.getSource().clear();
      this.deletedItems = [];
      if (this.options.initWfsRequests) this.addLayerFeatures(this.options.initWfsRequests);
    },
    confirmSubmit() {
      var r = confirm('Sei sicuro?');
      if (r == true) {
        this.submit();
      }
    },
    submit() {
      this.loading = Loading.service({
        text: 'Salvataggio...',
        background: 'rgba(0, 0, 0, 0.8)',
      });
      const geoJSON = new ol.format.GeoJSON().writeFeaturesObject(
        this.layer.getSource().getFeatures()
      );
      const deleted = new ol.format.GeoJSON().writeFeaturesObject(this.deletedItems);
      console.log('submit', geoJSON, deleted);

      this.options.submit(geoJSON, deleted, this.loading, this.refresh);
    },
  },
  mounted: function() {
    GV.eventBus.$on('gv-control-draw-activate', ev => {
      console.log('gv-control-draw-activate');
      this.layer.setVisible(true);
    });
    GV.eventBus.$on('gv-control-draw-deactivate', ev => {
      console.log('gv-control-draw-deactivate');
      this.clear();
      this.layer.setVisible(false);
    });

    this.layer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: this.style,
      zIndex: 800,
    });
    GV.app.map.addLayer(this.layer);

    if (this.options.initWfsRequests) this.addLayerFeatures(this.options.initWfsRequests);

    GV.app.map.clearLayer('InfoWmsHilite');
  },
};
</script>

<style>
.gv-draw-panel {
  position: absolute;
  width: 260px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-draw-panel-body {
  padding: 10px;
  overflow-y: auto;
  width: 240px;
  height: 25px;
}

.gv-draw-panel-result {
  position: absolute;
  padding-left: 3px;
  margin: 0px;
  width: 230px;
}

.gv-draw-buttons {
  width: 20px;
  float: left;
  margin: 4px;
}

.gv-draw-buttons-reset {
  width: 36px;
  padding-left: 2px;
}

#gv-draw-modify {
  margin-left: 25px;
  padding-top: 5.8px;
}

#gv-draw-delete {
  padding-top: 5.8px;
}

.el-row {
  padding: 5px 5px 5px 10px;
}
</style>
