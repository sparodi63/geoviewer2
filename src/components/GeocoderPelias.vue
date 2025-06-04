<template>
  <el-select
    v-model="address"
    filterable
    clearable
    remote
    size="mini"
    placeholder="Ricerca Indirizzo..."
    :remote-method="remoteMethod"
    @change="onChange"
    :loading="loading"
    loading-text="Caricamento... "
    no-match-text="Nessun indirizzo trovato"
    no-data-text="Nessun indirizzo trovato"
    class="gv-geocoder"
    id="gv-geocoder-pelias"
  >
    <el-option
      class="gv-geocoder-options"
      v-for="item in results"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import geocoder from '../services/getPeliasGeocode';

import Vue from 'vue';
import { Select, Option } from 'element-ui';
Vue.use(Select);
Vue.use(Option);

export default {
  data() {
    return {
      results: [],
      address: [],
      loading: false,
      marker: null,
    };
  },
  methods: {
    remoteMethod(query) {
      if (query.length < 4) {
        this.results = [];
        return;
      }
      this.loading = true;
      const timeOutTime = 500;
      setTimeout(() => {
        geocoder(query)
          .then((results) => {
            this.loading = false;
            console.log(results);
            const features = results ? results.features : null;
            if (features && features.length > 0) {
              this.results = features.map((feature) => ({
                label: feature.properties.label,
                value: feature.properties.id,
                location: {
                  lat: feature.geometry.coordinates[1],
                  lng: feature.geometry.coordinates[0],
                },
              }));
            } else {
              this.results = [];
            }
          })
          .catch((error) => {
            this.loading = false;
            console.error(error);
          });
      }, timeOutTime);
    },
    onChange(value) {
      let result = this.results.find((item) => item.value === value);
      if (result) {
        result.type = 'circle';
        this.marker = GV.app.map.addMarker(result);
      } else {
        if (this.marker) {
          GV.app.map.removeLayer(this.marker);
        }
      }
    },
  },
  mounted: function () {},
};
</script>

<style scoped>
.gv-geocoder {
  margin-right: 10px;
  width: 240px;
}
@media only screen and (max-width: 540px) {
  .gv-geocoder {
    width: 140px;
  }
}
</style>
