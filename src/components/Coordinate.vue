<template>
    <div id="gv-coordinate-panel" class="gv-coordinate-panel">
        <gv-title title="Coordinate":divId="'gv-coordinate-panel'" :noClose="true"></gv-title>
        <div class="gv-coodinate-panel-body gv-inverted-color-scheme">
          <p>
            X = {{x}}
            <br/>
            Y = {{y}}
          </p>
        <el-button ref="button" type="primary" @click="submit()" size="mini" :disabled="buttonDisabled">
            <span>Conferma</span>
        </el-button>
        <el-button ref="button" type="primary" @click="cancel()" size="mini">
            <span>Annulla</span>
        </el-button>
        </div>

    </div>
</template>

<script>
import Vue from 'vue';
import getCoordTransform from '../services/getCoordTransform'

import { Button } from 'element-ui'
Vue.use(Button)

export default {
    name: 'gv-coordinate-panel',
    data() {
        return {
            x: null,
            y: null,
            options: GV.config.getToolOptions('gv-coordinate-button'),
            buttonDisabled: true
        }
    },
    methods: {
        submit() {
            if (this.options.submit) {
                this.options.submit(this.x,this.y)
            } 
        },
        cancel() {
            if (this.options.cancel) {
                this.options.cancel()
            } 
        }
    },
    mounted: function () {
        GV.eventBus.$on('map-click', event => {
            if (this.options.projection && this.options.projection !== 'EPSG:4326') {
                const srsIn = "4326"
                const srsOut = this.options.projection.replace("EPSG:","")
                getCoordTransform(srsIn,srsOut,event.latlng.lng,event.latlng.lat).then(response => {
                    if (response.data.points) {
                        const coords = response.data.points[0].split(',')
                        this.x = parseInt(coords[0])
                        this.y = parseInt(coords[1])
                    }
                    this.buttonDisabled = false
                })
            } else {
                this.x = event.latlng.lng
                this.y = event.latlng.lat
                this.buttonDisabled = false
            }
        })
    }
}

</script>

<style>

.gv-coordinate-panel {
  position: absolute;
  width: 210px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-coodinate-panel-body {
  position: absolute;
  padding: 5px;
  overflow-y: auto;
  width: 200px;
  height: 100px;
}

.gv-coodinate-panel-body p {
  background-color: #fff;
  padding-left: 15px;
}

</style>
