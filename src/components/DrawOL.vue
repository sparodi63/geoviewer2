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
        >Salva</el-button
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
    <div v-if="showVertexEditor" class="gv-draw-vertex-editor gv-inverted-color-scheme">
      <el-row>
        <b>EDITOR VERTICI</b>
      </el-row>
      <el-row>
        X:
        <el-input style="width: 80px" size="mini" placeholder="X" v-model="vertexX"></el-input> Y:
        <el-input style="width: 80px" size="mini" placeholder="Y" v-model="vertexY"></el-input>
      </el-row>
      <el-row>
        <el-button
          id="gv-draw-vertex-editor-submit"
          title="Modifica Vertice"
          @click="submitVertexEditor"
          class="gv-color-scheme"
          size="mini"
          >Modifica</el-button
        >
        <el-button
          id="gv-draw-vertex-editor-cancel"
          title="Annulla Modifica Vertice"
          @click="cancelVertexEditor"
          class="gv-color-scheme"
          size="mini"
          >Annulla</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import getWFSFeature from '../services/getWFSFeature';
import getCoordTransform from '../services/getCoordTransform';
import axios from 'axios';

import { Button, Row, Col, Loading, Notification } from 'element-ui';
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);

export default {
  name: 'gv-draw-panel',
  data() {
    const options = GV.config.getToolOptions('gv-draw-button');
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
      idLayer: options.idLayer,
      submitButton: options.buttons && options.buttons.submit,
      cancelButton: options.buttons && options.buttons.cancel,
      refreshButton: options.buttons && options.buttons.refresh,
      pointButton: options.tools && options.tools.draw && options.tools.draw.point,
      lineButton: options.tools && options.tools.draw && options.tools.draw.polyline,
      polygonButton: options.tools && options.tools.draw && options.tools.draw.polygon,
      modifyButton: options.tools && options.tools.edit && options.tools.edit.edit,
      deleteButton: options.tools && options.tools.edit && options.tools.edit.remove,
      vertexEditorFeature: null,
      vertexEditorGeomType: null,
      showVertexEditor: false,
      vertexIndex: -1,
      vertexX: 0,
      vertexY: 0,
      vertexMarker: null,
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
    submitVertexEditor() {
      getCoordTransform(this.options.epsg, '3857', this.vertexX, this.vertexY).then((response) => {
        if (response.data.points) {
          const coords = response.data.points[0].split(',');
          if (this.vertexEditorGeomType === 'Point') {
            const newCoords = [coords[0], coords[1]];
            this.vertexEditorFeature.getGeometry().setCoordinates(newCoords);
          } else {
            let featureCoords = this.vertexEditorFeature.getGeometry().getCoordinates();
            if (this.vertexEditorGeomType === 'Polygon') featureCoords = featureCoords[0];
            let newCoords = featureCoords.map((coord, index) => {
              if (index === this.vertexIndex) {
                coord[0] = parseInt(coords[0]);
                coord[1] = parseInt(coords[1]);
              }
              return coord;
            });
            if (this.vertexEditorGeomType === 'Polygon') newCoords = [newCoords];
            this.vertexEditorFeature.getGeometry().setCoordinates(newCoords);
          }
          this.showVertexEditor = false;
          GV.app.map.getLayerByName('InfoWmsHilite').getSource().clear();
        }
      });
    },
    cancelVertexEditor() {
      this.vertexX = 0;
      this.vertexY = 0;
      this.showVertexEditor = false;
      GV.app.map.getLayerByName('InfoWmsHilite').getSource().clear();
    },
    setVertexIndex(vertexCoords) {
      let featureCoords = this.vertexEditorFeature.getGeometry().getCoordinates();
      if (this.vertexEditorGeomType === 'Polygon') featureCoords = featureCoords[0];

      this.vertexIndex = -1;
      for (let i = 0; i < featureCoords.length; i++) {
        if ((featureCoords[i][0] === vertexCoords[0]) & (featureCoords[i][1] === vertexCoords[1]))
          this.vertexIndex = i;
      }
    },
    setModifyCondition() {
      let condition = null;
      if (this.options.vertexEditor) {
        condition = (e) => {
          const f = GV.app.map.map.getFeaturesAtPixel(e.pixel, {
            hitTolerance: 5,
          });
          if (f) {
            this.vertexEditorFeature = f[0].getProperties('features').features[0];
            this.vertexEditorGeomType = this.vertexEditorFeature.getGeometry().getType();
            const vertexCoords = f[0].getGeometry().flatCoordinates;
            this.setVertexIndex(vertexCoords);
            const srsIn = '3857';
            const srsOut = this.options.epsg;
            getCoordTransform(
              srsIn,
              srsOut,
              parseInt(vertexCoords[0]),
              parseInt(vertexCoords[1])
            ).then((response) => {
              if (response.data.points) {
                const coords = response.data.points[0].split(',');
                this.vertexX = parseInt(coords[0]);
                this.vertexY = parseInt(coords[1]);
                this.showVertexEditor = true;
                const features = [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: ol.proj.transform(vertexCoords, 'EPSG:3857', 'EPSG:4326'),
                    },
                  },
                ];
                GV.app.map.hiliteFeatures(features);
              }
            });
          }
          return true;
        };
      }
      return condition;
    },
    addInteractionModify() {
      this.interaction = new ol.interaction.Modify({
        source: this.layer.getSource(),
        condition: this.setModifyCondition(),
      });
      GV.app.map.addInteraction(this.interaction);

      this.setSnapInteraction();
    },
    addInteractionDelete() {
      this.interaction = new ol.interaction.Select({ source: this.layer.getSource() });
      GV.app.map.addInteraction(this.interaction);

      this.setSnapInteraction();

      this.interaction.on('select', (evt) => {
        // console.log(evt.target.getFeatures().getArray());
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

      this.interaction.on('drawstart', (evt) => {
        // console.log('drawstart');
      });

      this.interaction.on('drawend', (evt) => {
        const newFeature = evt.feature;
        // console.log('drawend', newFeature);
        if (!this.options.multiGeom) {
          for (const feature of this.layer.getSource().getFeatures()) {
            // console.log(feature);
            this.layer.getSource().removeFeature(feature);
          }
        }
        // console.log('drawend 2', this.layer.getSource().getFeatures());
      });
    },
    addLayerFeatures(data, type) {
      this.layer.getSource().clear(true);
      // console.log('Sono in addLayerFeatures');
      if (type === 'wfs') {
        // console.log('wfs');
        for (const request of data) {
          getWFSFeature(null, null, request.wfsURL)
            .then((features) => {
              this.addFeatures(features, source);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        return;
      }
      const source = this.layer.getSource();
      if (type === 'geojson') {
        if (typeof data === 'string') data = JSON.parse(data);
        // console.log('geojson', data);
        this.addFeatures(data.features, source);
        // console.log('features', source.getFeatures());
        return;
      }
      if (type === 'wkt') {
        for (const wkt_geom of data) {
          const wktFormat = new ol.format.WKT({});
          const feature = wktFormat.readFeature(wkt_geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });
          source.addFeature(feature);
        }
        return;
      }
    },
    addFeatures(features, source) {
      if (features && features.length > 0) {
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
      if (this.options.initWfsRequests) this.addLayerFeatures(this.options.initWfsRequests, 'wfs');
      if (this.options.geoJson) this.addLayerFeatures(this.options.geoJson, 'geojson');
      if (this.options.WKT) this.addLayerFeatures(this.options.WKT, 'wkt');
      this.refreshWMS();
    },
    refreshWMS() {
      let layers = [];
      if (Array.isArray(this.idLayer)) {
        this.idLayer.forEach((idLayer) => {
          layers.push(idLayer);
        });
      } else {
        layers.push(this.idLayer);
      }
      layers.forEach((idLayer) => {
        const layer = GV.app.map.getLayerByName(idLayer);
        if (layer) {
          const params = layer.getSource().getParams();
          layer.getSource().updateParams(params);
        }
      });
    },
    async confirmSubmit() {
      if (this.options.noConfirm) {
        this.submit();
      } else {
        const r = confirm('Sei sicuro?');
        if (r == true) {
          this.submit();
        }
      }
    },
    async submit() {
      this.loading = Loading.service({
        text: 'Salvataggio...',
        background: 'rgba(0, 0, 0, 0.8)',
      });
      let data = new ol.format.GeoJSON().writeFeaturesObject(this.layer.getSource().getFeatures());

      if (this.options.coord3d) {
        data.features = await this.setElevation(data.features);
      }

      //Conversione coordinate
      if (this.options.epsgOut && this.options.epsgOut !== '3857') {
        const response = await fetch('/geoservices/REST/coordinate/transform_geojson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geoJSON: data,
            srsIn: '3857',
            srsOut: this.options.epsgOut,
          }),
        });
        const data_tr = await response.json();
        data = data_tr.geoJSON;
      }

      //Conversione formato: WKT
      if (this.options.formatOut && this.options.formatOut === 'WKT') {
        const featureProjection =
          this.options.epsgOut && this.options.epsgOut !== '3857'
            ? `EPSG:${this.options.epsgOut}`
            : 'EPSG:3857';
        const wktList = [];
        data.features.forEach((feature) => {
          const olFeature = new ol.format.GeoJSON().readFeature(feature, {
            featureProjection: featureProjection,
          });
          const wktFormat = new ol.format.WKT({});
          const wkt = wktFormat.writeFeature(olFeature);
          wktList.push(wkt);
        });
        data = {
          wkt_geom_list: wktList,
        };
      }

      const deleted = new ol.format.GeoJSON().writeFeaturesObject(this.deletedItems);

      this.options.submit(data, deleted, this.loading, this.refresh);
    },
    async setElevation(features) {
      for (var i = 0; i < features.length; i++) {
        const feature = features[i];
        let coords;
        if (feature.geometry.type === 'Point') {
          coords = `${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}`;
        } else {
          let coordArray = feature.geometry.coordinates.map((coord) => {
            return `${coord[0]},${coord[1]}`;
          });
          coords = coordArray.join('|');
        }

        const el = await axios.get(
          `https://srvcarto.regione.liguria.it/geoservices/REST/coordinate/elevation/3857/${coords}`
        );
        if (el.data && el.data.status && el.data.status === 'OK') {
          // console.log(el.data.elevation);
          if (feature.geometry.type === 'Point') {
            if (feature.geometry.coordinates[2]) {
              feature.geometry.coordinates[2] = el.data.elevation[0];
            } else {
              feature.geometry.coordinates.push(el.data.elevation[0]);
            }
          } else {
            let ind = 0;
            feature.geometry.coordinates.forEach((coord) => {
              if (coord[2]) {
                coord[2] = el.data.elevation[ind];
              } else {
                coord.push(el.data.elevation[ind]);
              }
              // console.log('line', ind, coord);
              ind++;
            });
            // console.log('line', feature.geometry.coordinates);
          }
        }
      }
      return features;
    },
  },
  created() {
    GV.app.tools.draw = this;
  },
  mounted: function () {
    GV.eventBus.$on('gv-control-draw-activate', (ev) => {
      // console.log('gv-control-draw-activate');
      this.layer.setVisible(true);
    });
    GV.eventBus.$on('gv-control-draw-deactivate', (ev) => {
      // console.log('gv-control-draw-deactivate');
      this.clear();
      this.layer.setVisible(false);
    });

    this.layer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: this.style,
      zIndex: 800,
    });
    GV.app.map.addLayer(this.layer);

    if (this.options.initWfsRequests) this.addLayerFeatures(this.options.initWfsRequests, 'wfs');
    if (this.options.geoJson) this.addLayerFeatures(this.options.geoJson, 'geojson');
    if (this.options.wkt) this.addLayerFeatures(this.options.wkt, 'wkt');

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

.gv-draw-vertex-editor {
  padding-top: 10px;
  border: 1px solid white;
}
.gv-draw-panel-body {
  padding: 10px;
  overflow-y: auto;
  width: 240px;
  /* height: 25px; */
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
