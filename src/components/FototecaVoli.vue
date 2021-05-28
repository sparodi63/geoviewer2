<template>
  <el-select
    v-model="volo"
    filterable
    remote
    size="mini"
    placeholder="Seleziona un volo..."
    @change="onChange"
    class="gv-fototeca-voli"
    id="gv-fototeca-voli"
  >
    <el-option
      class="gv-fototeca-voli-options"
      v-for="item in voli"
      :key="item.id"
      :label="item.nome"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
import Vue from 'vue';
import { Select, Option } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
import getVoli from '../services/getFototecaVoli';
import getCoordTransformBbox from '../services/getCoordTransformBbox';
import mountComponent from '../util/mountComponent';
import FototecaImmagine from './FototecaImmagine.vue';
Vue.component('gv-fototeca-immagine', FototecaImmagine);
Vue.component('gv-fototeca-scheda-volo-panel', () => import('./FototecaSchedaVolo.vue'));

export default {
  data() {
    return {
      voli: [],
      volo: [],
      loading: false,
      marker: null,
      bbox: null,
      baseWfsUrl: `${GV.globals.DEFAULT_PROXY}https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&`,
      strisciata: null,
      foto: null,
    };
  },
  methods: {
    onChange(value) {
      GV.globals.FOTOTECA_SEL_VOLO = this.voli.filter(volo => {
        // console.log(volo.id, value);
        return volo.id === value;
      })[0];
      const workSpace = `M${GV.globals.FOTOTECA_SEL_VOLO.id}`;
      const layer = `L${GV.globals.FOTOTECA_SEL_VOLO.codLivStrisciata}`;
      const cqlFilter = "presenza_fotogrammi='SI'";
      const wfsUrl = `${this.baseWfsUrl}typeName=${workSpace}:${layer}&cql_filter=${cqlFilter}`;
      this.loadLayerStrisciata(wfsUrl);
      this.showSchedaVolo();
    },
    showSchedaVolo() {
      mountComponent({
        elId: 'gv-fototeca-scheda-volo-panel',
        containerId: GV.config.containerId,
        toggleEl: true,
        vm: new Vue({
          template: `<gv-fototeca-scheda-volo-panel></gv-fototeca-scheda-volo-panel>`,
        }),
      });
    },
    hiliteStrisciata(layer) {
      const layerStrisciate = GV.app.map.getLayerByName('strisciate');
      layerStrisciate.eachLayer(l => {
        l.setStyle({
          color: '#ff0000',
        });
      });
      layer.setStyle({
        color: '#ffff00',
      });
    },
    loadLayerStrisciata(url) {
      const layerConfig = {
        type: 'JSON',
        dataType: 'json',
        name: 'strisciate',
        visible: true,
        geomSubType: 'POLYGON',
        url: url,
        idMap: 'fototeca',
        style: {
          color: '#ff0000',
          fillOpacity: 0.0,
          weight: 2,
          opacity: 1,
        },
        zoomToLayerExtent: true,
        onEachFeature: (feature, layer) => {
          layer.on('click', ev => {
            this.strisciata = ev.target.feature.properties.id_strisciata;
            this.hiliteStrisciata(layer);
            this.loadLayerFoto();
          });
          layer.on('mouseover', ev => {
            if (this.strisciata === ev.target.feature.properties.id_strisciata) return;
            layer.setStyle({
              color: '#ff9900',
            });
          });
          layer.on('mouseout', ev => {
            if (this.strisciata === ev.target.feature.properties.id_strisciata) return;
            layer.setStyle({
              color: '#ff0000',
            });
          });
        },
      };
      const idMap = layerConfig.idMap;
      GV.config.removeMap(idMap);
      GV.config.addMapConfig({
        id: idMap,
        name: 'Fototeca',
        flagGeoserver: true,
        layers: [layerConfig],
      });
    },
    hiliteFoto(layer) {
      const layerFoto = GV.app.map.getLayerByName('foto');
      layerFoto.eachLayer(l => {
        l.setStyle({
          color: '#ff0000',
        });
      });
      layer.setStyle({
        color: '#ffff00',
      });
    },
    loadLayerFoto() {
      GV.config.removeLayer('foto');
      const workSpace = `M${GV.globals.FOTOTECA_SEL_VOLO.id}`;
      const layer = `L${GV.globals.FOTOTECA_SEL_VOLO.codLivFoto}`;
      const cqlFilter = `id_strisciata='${this.strisciata}'`;
      const url = `${this.baseWfsUrl}typeName=${workSpace}:${layer}&cql_filter=${cqlFilter}`;
      const layerConfig = {
        type: 'JSON',
        name: 'foto',
        visible: true,
        geomSubType: 'POINT',
        url: url,
        idMap: 'fototeca',
        pointToLayer: (feature, latlng) => {
          const style = {
            color: '#ff0000',
            fillColor: '#ff0000',
            fill: true,
            weight: 3,
            radius: 2,
          };
          return L.circleMarker(latlng, style);
        },
        zoomToLayerExtent: true,
        onEachFeature: (feature, layer) => {
          layer.on('click', ev => {
            this.foto = ev.target.feature.properties.foto;
            this.hiliteFoto(layer);
            GV.app.map.setView([layer._latlng.lat, layer._latlng.lng], 15);
            if (ev.target.feature.properties.immagine === 'obliterato') {
              GV.utils.notification(
                `Fotogramma consultabile presso lo Sportello Cartografico <br>Codice Fotogramma: <b>${this.foto}</b>`,
                'info'
              );
            } else {
              this.showFoto();
            }
          });
          layer.on('mouseover', ev => {
            if (this.foto === ev.target.feature.properties.foto) return;
            layer.setStyle({
              color: '#ff9900',
            });
          });
          layer.on('mouseout', ev => {
            if (this.foto === ev.target.feature.properties.foto) return;
            layer.setStyle({
              color: '#ff0000',
            });
          });
        },
      };
      const idMap = layerConfig.idMap;
      GV.config.addLayerToMap(layerConfig, 'fototeca');
    },
    showFoto() {
      mountComponent({
        elId: 'gv-fototeca-immagine',
        clear: true,
        vm: new Vue({
          template: `<gv-fototeca-immagine :volo="volo" :foto="foto" ></gv-fototeca-immagine>`,
          data: {
            volo: GV.globals.FOTOTECA_SEL_VOLO.volo.toLowerCase(),
            foto: this.foto,
          },
        }),
      });
    },
  },
  mounted: function() {
    getVoli(this.bbox).then(resp => {
      this.voli = resp;
    });
    GV.eventBus.$on('gv-fototeca-reload-voli', event => {
      const bbox = event.bbox;
      const srsIn = event.bboxSRS;
      const srsOut = '3003';
      if (bbox) {
        getCoordTransformBbox(srsIn, srsOut, bbox).then(response => {
          if (response.data.data) {
            this.bbox = response.data.data[0][0] + ',' + response.data.data[1][0];
            getVoli(this.bbox).then(resp => {
              this.voli = resp;
            });
          }
        });
      } else {
        this.bbox = bbox;
        getVoli(this.bbox).then(resp => {
          this.voli = resp;
        });
      }
    });
  },
};
</script>

<style scoped>
.gv-fototeca-voli {
  margin-right: 10px;
  width: 300px;
}
</style>
