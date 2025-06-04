<template>
  <div class="libioss gv-color-scheme">
    <div class="libioss-title gv-color-scheme">
      Libioss - Distribuzione specie animali
      <!-- <button
        :class="toggleCollapseClass()"
        size="mini"
        @click="hidePanel"
        title="Nascondi Pannello"
      /> -->
      <button
        id="libioss-download-button"
        title="Download Dati"
        @click="download"
        class="gv-color-scheme libioss-download-button el-icon-download"
        size="mini"
      />
      <button
        id="libioss-download-button"
        title="Gestione Livelli"
        @click="layerMngr"
        class="gv-color-scheme libioss-download-button el-icon-files"
        size="mini"
      />
    </div>
    <div id="libioss-wrapper" class="libioss-wrapper gv-color-scheme">
      <div class="combo">
        <el-select
          placeholder="Seleziona Gruppo"
          v-model="gruppo"
          size="mini"
          filterable
          @change="onChangeGruppo"
        >
          <el-option v-for="item in gruppi" :key="item.id" :value="item.id" :label="item.label">
          </el-option>
        </el-select>
      </div>

      <div v-show="showSpecie" class="combo">
        <el-select
          filterable
          placeholder="Seleziona Specie"
          v-model="specie"
          size="mini"
          @change="onChangeSpecie"
        >
          <el-option
            v-for="item in listaSpecie"
            :disabled="item.disabled"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          >
          </el-option>
        </el-select>
      </div>

      <div v-show="showLayerMngr">
        <div class="layer-mngr">
          <div class="combo">GESTIONE LIVELLI</div>
          <div class="combo">
            <el-select placeholder="Seleziona Livello" v-model="layer" size="mini">
              <el-option v-for="item in layers" :key="item.id" :value="item.id" :label="item.label">
              </el-option>
            </el-select>
          </div>
          <div class="combo">
            <el-button
              class="gv-close gv-color-scheme"
              icon="el-icon-delete"
              type="button"
              size="mini"
              @click="removeLayer"
            >
              <span style="color: #ffffff; font-weight: bold">Rimuovi livello</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Row, Button } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Button);
import notification from '../util/notification';
import { t } from 'element-ui/lib/locale';
import getConfig from '../services/getConfig';
import { Loading } from 'element-ui';

export default {
  data() {
    const gruppi = [
      { id: 1, label: 'Mammiferi', classi: '2757' },
      { id: 2, label: 'Uccelli', classi: '2756' },
      { id: 3, label: 'Rettili', classi: '2761' },
      { id: 4, label: 'Anfibi', classi: '2758' },
      { id: 5, label: 'Pesci (Agnati, Osteitti e Petromizonti)', classi: '3102, 2759, 2791,3133' },
      { id: 6, label: 'Insetti', classi: '2745' },
      { id: 7, label: 'Crostacei', classi: '2836' },
      { id: 8, label: 'Aracnida, Chilopodi e Diplodi', classi: '2755, 2752, 2748' },
      { id: 9, label: 'Bivalvi e Gastropodi', classi: '2754, 2747' },
    ];

    const styles = this.getStyles();

    const layerName = 'L9631';
    return {
      idAncillaryMap: 'D849',
      mapConfig: null,
      styles: styles,
      gruppi: gruppi,
      gruppo: null,
      specie: null,
      listaSpecie: [],
      show: true,
      buttonDisabled: true,
      legendUrl: null,
      layer: null,
      layers: [],
      showLayerMngr: true,
      ancillaryMap: null,
      layerConfig: {
        id: null,
        idMap: 'LIBIOSS_SPECIE',
        name: layerName,
        type: 'WMS',
        visible: true,
        flagGeoserver: true,
        multiClasse: true,
        queryable: true,
        opacity: 1,
        minScale: 0,
        maxScale: 0,
        wmsParams: {
          name: layerName,
          format: 'image/png8',
          url: 'https://geoservizi.regione.liguria.it/geoserver/M2490/wms?',
        },
        wfsParams: {
          url: 'https://geoservizi.regione.liguria.it/geoserver/M2490/wfs?',
          typeName: layerName,
        },
        legend: {
          icon: 'https://geoservizi.regione.liguria.it/geoserver/M2490/wms?LAYER=L9631&RULE=R0&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:off',
          label: 'TEST STAZIONI SPECIE',
          popUpFlag: 0,
          popUpUrl: null,
          popUpWidth: 0,
          popUpHeight: 0,
        },
        infoOptions: {
          infoUrl:
            'http://srvcarto.regione.liguria.it/info/repertoriocartografico/siraLibiossStazioni_Specie.xsl',
          infoTarget: null,
          infoWidth: 0,
          infoHeight: 0,
          infoIdAttr: 'id',
          infoLabelAttr: null,
        },
      },
    };
  },
  watch: {},
  methods: {
    getStyles() {
      const shapes = ['circle', 'square', 'triangle', 'star'];
      const colors = ['red', 'yellow', 'green', 'blue', 'purple'];
      let styles = [];
      shapes.forEach((shape) => {
        colors.forEach((color) => {
          const style = {
            id: `${shape}_${color}`,
            used: false,
          };
          styles.push(style);
        });
      });
      return styles;
    },
    async onChangeGruppo(value) {
      const gruppo = this.gruppi.find((g) => g.id === value);
      const response = await fetch(`/geoservices/REST/libioss/ppf_gruppo_specie/${gruppo.classi}`);
      const data = await response.json();
      this.listaSpecie = data.lista_specie.map((s) => {
        s.disabled = false;
        return s;
      });
      this.specie = null;
    },
    onChangeSpecie(value) {
      this.addLayer(value);
    },
    addLayer(cod_specie) {
      const specie = this.listaSpecie.find((s) => s.id === cod_specie);
      if (this.layers.length >= 20) {
        notification('Massimo 20 specie', 'warning');
        return;
      }
      const style = this.getLayerStyle();
      this.loadLayer(specie, style);
      this.layers.push({
        id: specie.id,
        label: specie.label,
        style: style,
      });
      specie.disabled = true;
    },
    loadLayer(specie, style) {
      const layerConfig = Object.assign({}, this.layerConfig);
      layerConfig.wmsParams = Object.assign({}, this.layerConfig.wmsParams);
      layerConfig.legend = Object.assign({}, this.layerConfig.legend);
      layerConfig.name = 'S' + specie.id;
      layerConfig.title = specie.label;
      layerConfig.legend.label = specie.label;
      layerConfig.legend.icon = `http://geoservizi.regione.liguria.it/geoserver/M2490/wms?LAYER=L9631&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:off&style=${style}`;
      layerConfig.wmsParams.cql_filter = 'cod_specie=' + specie.id;
      layerConfig.wmsParams.styles = style;

      GV.config.addLayerToMap(layerConfig, 'LIBIOSS_SPECIE');
    },
    getLayerStyle() {
      const style = this.styles.find((s) => !s.used);
      style.used = true;
      return style.id;
    },

    removeLayer() {
      if (!this.layer) {
        notification('Nessuna livello selezionato', 'warning');
        return;
      }

      // RIMUOVO LAYER DALLA MAPPA
      GV.config.removeLayer('S' + this.layer);
      // SE ULTIMO LAYER RICONFIGURO LA MAPPA
      const mapConfig = GV.config.getMapConfig('LIBIOSS_SPECIE');
      if (!mapConfig) this.addMapConfig();
      // ABILITO SPECIE IN SELECT
      this.enableSpecie();
      // LIBERO STILE PER RIUTILIZZO
      this.makeStyleAvailable();
      // RESETTO SELECT SPECIE
      this.resetComboSpecie();
      // RIMUOVO LAYER DALLA LISTA
      this.removeLayerFromLayers();
      // RESETTO SELECT LAYER
      this.layer = null;
    },
    resetComboSpecie() {
      const layer = this.layers.find((l) => l.id === this.layer);
      const specie = this.listaSpecie.find((s) => s.id === layer.id);
      if (specie && specie.id === this.specie) {
        this.specie = null;
      }
    },
    enableSpecie() {
      const layer = this.layers.find((l) => l.id === this.layer);
      const specie = this.listaSpecie.find((s) => s.id === layer.id);
      // console.log(layer.id, specie, this.listaSpecie);
      if (specie) specie.disabled = false;
    },
    makeStyleAvailable() {
      const layer = this.layers.find((l) => l.id === this.layer);
      const style = this.styles.find((s) => s.id === layer.style);
      style.used = false;
    },
    removeLayerFromLayers() {
      this.layers.filter((layer, index, arr) => {
        if (layer.id === this.layer) {
          arr.splice(index, 1);
          return true;
        }
        return false;
      });
    },
    addMapConfig() {
      GV.config.addMapConfig({
        id: 'LIBIOSS_SPECIE',
        name: 'Libioss - Distribuzione specie animali',
        flagGeoserver: true,
        layers: [],
        ancillaryMaps: [this.ancillaryMap],
      });
    },
    toggleCollapseClass() {
      return this.show
        ? 'gv-panel-collapse gv-color-scheme el-icon-arrow-up'
        : 'gv-panel-collapse gv-color-scheme el-icon-arrow-down';
    },
    hidePanel: function () {
      if (this.show) {
        document.getElementById('libioss-wrapper').style.display = 'none';
      } else {
        document.getElementById('libioss-wrapper').style.display = 'block';
      }
      this.show = !this.show;
    },
    layerMngr() {
      this.showLayerMngr = !this.showLayerMngr;
    },
    async download() {
      const lista_specie = this.layers.map((s) => s.id).join(',');
      if (lista_specie.length === 0) {
        notification('Nessuna specie selezionata', 'warning');
        return;
      } else {
        let loading = Loading.service({
          // target: "#gv-layer-search-topo-body",
          text: 'Preparazione dati...',
          background: 'rgba(0, 0, 0, 0.8)',
        });

        const response = await fetch(`/geoservices/REST/libioss/ppf_download/${lista_specie}`);
        const data = await response.json();
        loading.close();
        this.downloadURI(data.url);
      }
    },
    downloadURI(url) {
      var link = document.createElement('a');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.href = url;
      link.click();
    },
  },
  computed: {
    showSpecie() {
      return true;
    },
  },
  mounted: function () {
    getConfig(this.idAncillaryMap).then((data) => {
      this.ancillaryMap = data.data.data;
      this.addMapConfig();
    });
  },
};
</script>

<style scoped>
.libioss {
  width: 270px;
  z-index: 800;
  padding: 1px;
}
.libioss-title {
  padding: 5px;
  padding-left: 10px;
  font-weight: bold;
}

.libioss-button {
  margin-left: 10px;
  margin-bottom: 10px;
}

.libioss-download-button {
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 3px;
  border: 0;
  -webkit-appearance: none;
  font-size: 14px;
  font-weight: 800;
  float: right;
}

.label {
  display: inline-block;
  width: 120px;
}
.combo {
  max-width: 200px;
  width: 200px;
  margin: 10px;
}
.gv-panel-collapse {
  cursor: pointer;
  border: 0;
  -webkit-appearance: none;
  float: right;
  font-size: 14px;
  margin-top: 3px;
  opacity: 1;
}
.gv-iframe-panel {
  overflow: hidden;
  margin: 10px;
  background-color: #eee;
}

.layer-mngr {
  padding-top: 10px;
}
</style>

<style>
.el-select-dropdown__item {
  overflow: visible;
}
.el-select-dropdown__empty {
  display: none;
}
.el-select-dropdown__list {
  max-width: 800px !important;
}
</style>
