<template>
  <div id="gv-difesa-suolo-foto" class="gv-difesa-suolo-foto">
    <div class="gv-difesa-suolo-foto-title gv-color-scheme">
      Difesa Suolo: Caricamento Foto
      <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      />
    </div>

    <div
      id="gv-difesa-suolo-foto-wrapper"
      class="gv-difesa-suolo-foto-wrapper gv-inverted-color-scheme"
    >
      <!-- <div>{{ session }}</div> -->
      <div
        id="gv-difesa-suolo-foto-body"
        class="gv-difesa-suolo-foto-body gv-inverted-color-scheme"
      >
        <div id="gv-difesa-suolo-foto-div">
          <div class="gv-difesa-suolo-foto-session">SESSIONE: {{ session }}</div>
          <el-form :model="dsfForm" ref="dsf-form">
            <div class="gv-difesa-suolo-foto-upload">
              <el-form-item>
                <el-upload
                  :action="url"
                  :limit="20"
                  drag
                  :file-list="dsfForm.fileList"
                  :auto-upload="false"
                  :on-success="onUploadSuccess"
                  :on-exceed="handleExceed"
                  ref="dsfUpload"
                  multiple
                  list-type="picture"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    Trascina qui i file o seleziona per upload <br />
                    Limite massimo 20 file
                  </div>
                  <!-- <div class="el-upload__tip" slot="tip">jpg/png file</div> -->
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="gv-difesa-suolo-foto-button">
        <el-button type="primary" class="gv-map-catalog-button" size="mini" @click="submitFoto"
          >Carica i file</el-button
        >
        <el-button type="primary" class="gv-map-catalog-button" size="mini" @click="clear"
          >Pulisci coda</el-button
        >
        <el-button type="primary" class="gv-map-catalog-button" size="mini" @click="validateAll"
          >Valida tutto</el-button
        >
        <el-button
          type="primary"
          class="gv-map-catalog-button-log"
          size="mini"
          @click="openLogPanel"
          >Log</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Button, Form, FormItem, Input, Upload } from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

import { Loading } from 'element-ui';
Vue.use(Loading);

import notification from '../util/notification';

function onFeatureSelect(feature) {
  const div = document.getElementById('gv-difesa-suolo-foto-info');
  if (div) div.remove();
  GV.mount({
    elId: 'gv-difesa-suolo-foto-info',
    toggleEl: true,
    template: `<gv-difesa-suolo-foto-info :feature="feature" ></gv-difesa-suolo-foto-info>`,
    data: {
      feature: feature,
    },
  });
  // GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 19);
}

export default {
  name: 'gv-difesa-suolo-foto',
  data() {
    // const srv_url = 'https://geoservizi.regione.liguria.it/geoserver/M2493/ogc/features/collections/L9643/items?f=application%2Fjson&limit=5000'
    const base_url = 'https://geoservizi.regione.liguria.it/geoserver/M2493/wms?';
    // const base_url = 'http://10.20.4.120:8080/geoserver/M2493/wms?';
    const base_layer = {
      idMap: 'DIFESA_SUOLO_FOTO',
      type: 'WMS',
      visible: true,
      flagGeoserver: true,
      multiClasse: true,
      queryable: true,
      opacity: 1,
      minScale: 0,
      maxScale: 0,
      geomType: 'VECTOR',
      wmsParams: {
        url: base_url,
        name: 'L9643',
        format: 'image/png8',
      },
      wfsParams: {
        url: base_url,
        typeName: 'L9643',
      },
      infoOptions: {
        infoUrl: 'function',
        infoTarget: null,
        infoWidth: 0,
        infoHeight: 0,
        infoIdAttr: 'id',
        infoLabelAttr: null,
      },
    };

    const layer_val = window.structuredClone(base_layer);
    layer_val.id = 'val';
    layer_val.name = 'val';
    layer_val.wmsParams.styles = 'circle_green';
    layer_val.wmsParams.cql_filter = `login = '${GV.globals.SESSION.AUTH.LOGIN}' AND session <> '${GV.globals.SESSION.ID}' AND validato = true`;
    layer_val.legend = {
      icon: `${base_url}LAYER=L9643&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=circle_green`,
      label: `Storico - Validate`,
    };
    layer_val.infoOptions.infoFunction = onFeatureSelect;

    const layer_no_val = window.structuredClone(base_layer);
    layer_no_val.id = 'no_val';
    layer_no_val.name = 'no_val';
    layer_no_val.wmsParams.styles = 'circle_red';
    layer_no_val.wmsParams.cql_filter = `login = '${GV.globals.SESSION.AUTH.LOGIN}' AND session <> '${GV.globals.SESSION.ID}' AND validato = false`;
    layer_no_val.legend = {
      icon: `${base_url}LAYER=L9643&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=circle_red`,
      label: `Storico - Non Validate`,
    };
    layer_no_val.infoOptions.infoFunction = onFeatureSelect;

    const layer_val_s = window.structuredClone(base_layer);
    layer_val_s.id = 'val_s';
    layer_val_s.name = 'val_s';
    layer_val_s.wmsParams.styles = 'triangle_blue';
    layer_val_s.wmsParams.cql_filter = `login = '${GV.globals.SESSION.AUTH.LOGIN}' AND session = '${GV.globals.SESSION.ID}' AND validato = true`;
    layer_val_s.legend = {
      icon: `${base_url}LAYER=L9643&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=triangle_blue`,
      label: `Sessione attiva - Validate`,
    };
    layer_val_s.infoOptions.infoFunction = onFeatureSelect;

    const layer_no_val_s = window.structuredClone(base_layer);
    layer_no_val_s.id = 'no_val_s';
    layer_no_val_s.name = 'no_val_s';
    layer_no_val_s.wmsParams.styles = 'triangle_yellow';
    layer_no_val_s.wmsParams.cql_filter = `login = '${GV.globals.SESSION.AUTH.LOGIN}' AND session = '${GV.globals.SESSION.ID}' AND validato = false`;
    layer_no_val_s.legend = {
      icon: `${base_url}LAYER=L9643&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=triangle_yellow`,
      label: `Sessione attiva - Non Validate`,
    };
    layer_no_val_s.infoOptions.infoFunction = onFeatureSelect;

    const url = `/geoservices/REST/difesa_suolo_foto/upload_foto/?sessione=${GV.globals.SESSION.ID}&login=${GV.globals.SESSION.AUTH.LOGIN}&operatore=${GV.globals.SESSION.AUTH.NOME} ${GV.globals.SESSION.AUTH.COGNOME}`;

    return {
      dsfForm: {
        fileList: [],
        inputStyle: 'width: 350px;',
      },
      // formData: {
      //   session: GV.globals.SESSION.ID,
      // },
      show: true,
      session: GV.globals.SESSION.ID,
      url: url,
      layer_val: layer_val,
      layer_no_val: layer_no_val,
      layer_val2: {
        id: 'val', // layer id
        name: 'val', // layer name
        idMap: 'DIFESA_SUOLO_FOTO',
        type: 'WMS',
        visible: true,
        flagGeoserver: true,
        multiClasse: true,
        queryable: true,
        opacity: 1,
        minScale: 0,
        maxScale: 0,
        geomType: 'VECTOR',
        wmsParams: {
          url: base_url,
          name: 'L9643',
          format: 'image/png8',
          styles: 'circle_green', // style
          cql_filter: `session <> '${GV.globals.SESSION.ID}' AND validato = true`, // filter
        },
        wfsParams: {
          url: base_url,
          typeName: 'L9643',
        },
        legend: {
          icon: `${base_url}LAYER=L9643&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&style=circle_green`, // legend icon
          label: `Validate`, // legend label
        },
        infoOptions: {
          infoUrl: 'function',
          infoFunction: onFeatureSelect, //
          infoTarget: null,
          infoWidth: 0,
          infoHeight: 0,
          infoIdAttr: 'id',
          infoLabelAttr: null,
        },
      },
      layer_val_s: layer_val_s,
      layer_no_val_s: layer_no_val_s,
    };
  },
  mounted() {
    this.addMapConfig();
    this.addLayers();
    GV.globals.DIFESA_SUOLO_FOTO = this;
  },
  methods: {
    openLogPanel() {
      GV.mount({
        elId: 'gv-difesa-suolo-foto-log',
        toggleEl: true,
        template: `<gv-difesa-suolo-foto-log></gv-difesa-suolo-foto-log>`,
      });
    },
    addLayers() {
      GV.config.addLayerToMap(this.layer_no_val, 'DIFESA_SUOLO_FOTO');
      GV.config.addLayerToMap(this.layer_val, 'DIFESA_SUOLO_FOTO');
      GV.config.addLayerToMap(this.layer_no_val_s, 'DIFESA_SUOLO_FOTO');
      GV.config.addLayerToMap(this.layer_val_s, 'DIFESA_SUOLO_FOTO');
    },
    addMapConfig() {
      GV.config.addMapConfig({
        id: 'DIFESA_SUOLO_FOTO',
        name: 'Difesa Suolo Foto',
        flagGeoserver: true,
        layers: [],
      });
    },
    submitFoto() {
      // this.$refs.dsfUpload.uploadFiles.forEach((element) => {
      //   console.log(element.name);
      // });
      this.$refs.dsfUpload.COGNOME = GV.globals.SESSION.AUTH.COGNOME;
      this.$refs.dsfUpload.submit();
    },
    validateAll() {
      let loading = Loading.service({
        fullscreen: true,
        text: 'Salvataggio in corso...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const url = `/geoservices/REST/difesa_suolo_foto/validate_all/`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: GV.globals.SESSION.ID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          loading.close();
          notification('Dati salvati');
          GV.globals.DIFESA_SUOLO_FOTO.refreshMap();
        })
        .catch((error) => {
          loading.close();
          notification('Errore nel salvataggio: ' + error);
          console.error('Error:', error);
        });
    },
    clear() {
      this.$refs.dsfUpload.clearFiles();
    },
    onUploadSuccess(response, file, fileList) {
      if (!response.success) {
        const msg = `Errore durante il caricamento del file ${file.name} - ${response.message}`;
        notification(msg, 'error');
        // return;
      } else {
      }
      setTimeout(() => {
        this.refreshMap();
        this.clear();
      }, 1000);
    },
    refreshMap() {
      this.reloadLayer('no_val', this.layer_no_val);
      this.reloadLayer('val', this.layer_val);
      this.reloadLayer('no_val_s', this.layer_no_val_s);
      this.reloadLayer('val_s', this.layer_val_s);
    },
    reloadLayer(layerName, layerConfig) {
      GV.config.removeLayer(layerName);
      GV.config.addLayerToMap(layerConfig, 'DIFESA_SUOLO_FOTO');
    },
    handleExceed(files, fileList) {
      notification('Numero massimo di file superato', 'warning');
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-panel-collapse gv-color-scheme el-icon-arrow-up'
        : 'gv-panel-collapse gv-color-scheme el-icon-arrow-down';
    },
    hidePanel: function () {
      if (this.show) {
        document.getElementById('gv-difesa-suolo-foto-wrapper').style.display = 'none';
      } else {
        document.getElementById('gv-difesa-suolo-foto-wrapper').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
};
</script>

<style>
.gv-difesa-suolo-foto-upload {
  height: 200px;
}

.gv-map-catalog-button {
  margin-top: 10px;
  font-size: 12px;
}

.gv-map-catalog-button-log {
  margin-left: 45px !important;
  font-size: 12px;
}

.gv-map-catalog-button span {
  font-family: 'Raleway', Arial, sans-serif;
}

.gv-difesa-suolo-foto-title {
  padding: 5px;
  padding-left: 10px;
  font-weight: bold;
  width: 385px;
}

.gv-difesa-suolo-foto {
  position: absolute;
  width: 270px;
  left: 0px;
  top: 0px;
  /* margin-left: 10px;
  margin-top: 10px; */
  z-index: 800;
  padding: 10px;
}

.gv-difesa-suolo-foto-wrapper {
  width: 400px;
  height: 520px;
}

.gv-difesa-suolo-foto-button {
  padding-left: 15px;
}

.gv-difesa-suolo-foto-session {
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: bold;
}

.gv-difesa-suolo-foto-body {
  padding: 15px;
  overflow-y: auto;
  width: 370px;
  height: 450px;
}
</style>


 