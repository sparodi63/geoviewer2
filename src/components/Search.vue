<template>
    <div id="gv-search" class="gv-search">
        <el-select
            id="gv-seach-input"
            v-model="address"
            filterable
            clearable
            remote
            size="mini"
            placeholder="Ricerca..."
            :remote-method="search"
            @change="onChange"
            :loading="loading"
            loading-text="Caricamento... "
            no-match-text="Nessun elemento trovato"
            no-data-text="Nessun elemento trovato"
        >
            <el-option
                v-for="item in results"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>


<script>
import Vue from 'vue'
import { Select, Option } from 'element-ui'
Vue.use(Select)
Vue.use(Option)

export default {
  data() {
    return {
      results: [],
      address: [],
      recordsCache: {},
      layers: null,
      cachedLayers: [],
      propertyName: null,
      loading: false,
      marker: null,
    }
  },
  mounted: function() {
    this.layers = GV.config.getToolOptions('gv-search').layers
    this.propertyName = GV.config.getToolOptions('gv-search').propertyName
  },
  methods: {
    search(query) {
      this.results = []
      if (query.length < 4) {
        return
      }
      const results = this.filterData(query)

      if (Object.keys(results).length > 0) {
        Object.keys(results).forEach((key, index) => {
          this.results.push({
            label: key,
            value: key,
            location: results[key],
          })
        })
      } else {
        this.results = []
      }
    },
    filterData(text) {
      let frecords = {}
      text = text.replace(/[*+?^${}()|[\]\\]/g, '')
      if (text === '') {
        return []
      }
      this.layers.forEach(sLayer => {
        GV.app.map.eachLayer(layer => {
          if (layer.name === sLayer) {
            if (layer instanceof L.LayerGroup) {
              layer.eachLayer(m => {
                let loc = m.getLatLng()
                loc.layer = m
                const key = m.feature.properties[this.propertyName]
                if(new RegExp(text, 'i').test(key)) {
                  frecords[key] = loc
                }
              })
            }
          }
        })
      })
      return frecords
    },
    onChange(value) {
      let marker = this.results.find(item => item.value === value)
      if (marker) {
        marker.type = 'circle'
        marker.zoomLevel = 16
        this.marker = GV.app.map.addMarker(marker)
      } else {
        if (this.marker) {
          GV.app.map.removeLayer(this.marker)
        }
      }
    },
  },
}
</script>

<style>
.gv-search {
  height: 32px;
  width: 250px;
  z-index: 800;
  margin-top: 5px;
  display: inline-block;
}
.el-select {
  width: 250px;
}
</style>