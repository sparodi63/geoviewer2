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
            id="gv-geocoder"
        >
            <el-option
                class="gv-geocoder-options"
                v-for="item in results"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
</template>


<script>

import geocoder from '../services/getHereGeocode'

import Vue from 'vue'
import { Select, Option } from 'element-ui'
Vue.use(Select)
Vue.use(Option)

export default {
  data() {
    return {
      results: [],
      address: [],
      loading: false,
      marker: null,
    }
  },
  methods: {
    remoteMethod(query) {
      if (query.length < 4) {
        this.results = []
        return
      }
      this.loading = true
      geocoder(query)
        .then(results => {
          this.loading = false
          if (results && results.length > 0) {
            this.results = results.map(result => ({
              label: result.formatted_address,
              value: result.place_id,
              location: result.geometry.location,
            }))
          } else {
            this.results = []
          }
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    onChange(value) {
      const result = this.results.find(item => item.value === value)
      if (result) {
        this.marker = GV.app.map.addMarker(result)
      } else {
        if (this.marker) {
          GV.app.map.removeLayer(this.marker)
        }
      }
    },
  },
  mounted: function() {},
}
</script>

<style scoped>
.gv-geocoder {
  margin-right: 10px;
  width: 180px;
}
@media only screen and (max-width: 540px) {
  .gv-geocoder {
    width: 140px;
  }
}

</style>