<template>
  <div class="gv-gas gv-inverted-color-scheme" id="gv-gas">
    <gv-title
      v-draggable
      :title="title"
      :divId="'gv-gas'"
      :noClose="true"
      :collapsible="'gv-gas-body'"
    ></gv-title>
    <div class="gv-gas-body" id="gv-gas-body">
      <el-select
        class="gv-gas-combo"
        placeholder="Seleziona Area"
        v-model="area"
        size="mini"
        @change="onChangeArea"
      >
        <el-option
          v-for="item in aree"
          :key="item.codice"
          :value="item.codice"
          :label="item.descrizione"
        >
        </el-option>
      </el-select>
      <el-select class="gv-gas-combo" placeholder="Seleziona Modulo" v-model="modulo" size="mini">
        <el-option
          v-for="item in moduli"
          :key="item.codice"
          :value="item.codice"
          :label="item.descrizione"
        >
        </el-option>
      </el-select>
      <div class="gv-gas-checkbox">
        <el-checkbox v-model="soloPostiDisponibili"
          >Solo strutture con posti disponibili</el-checkbox
        >
      </div>
      <el-select
        class="gv-gas-combo"
        placeholder="Seleziona Provincia"
        v-model="provincia"
        size="mini"
        @change="onChangeProvincia"
      >
        <el-option
          v-for="item in province"
          :key="item.codice"
          :value="item.codice"
          :label="item.descrizione"
        >
        </el-option>
      </el-select>
      <el-select
        class="gv-gas-combo"
        placeholder="Seleziona ASL"
        v-model="asl"
        size="mini"
        @change="onChangeASL"
      >
        <el-option
          v-for="item in listaAsl"
          :key="item.codice"
          :value="item.codice"
          :label="item.descrizione"
        >
        </el-option>
      </el-select>
      <el-button id="gv-gas-submit" type="primary" size="mini" icon="el-icon-search" @click="submit"
        >Visualizza</el-button
      >
      <el-button
        id="gv-gas-elenco"
        type="primary"
        size="mini"
        icon="el-icon-document"
        @click="elenco"
        >Elenco Strutture</el-button
      >
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Select, Option, Checkbox, Button, Notification } from 'element-ui';
Vue.use(Select, Option, Button, Notification);
Vue.use(Checkbox);

import getGasComboConfig from '../services/getGasComboConfig';
import getGasStrutture from '../services/getGasStrutture';

export default {
  data() {
    return {
      name: 'gv-gas',
      title: 'FILTRI',
      aree: null,
      area: null,
      province: [
        { codice: null, descrizione: 'TUTTE LE PROVINCE' },
        { codice: '010', descrizione: 'GENOVA' },
        { codice: '008', descrizione: 'IMPERIA' },
        { codice: '011', descrizione: 'LA SPEZIA' },
        { codice: '009', descrizione: 'SAVONA' },
      ],
      provincia: null,
      moduli: [],
      modulo: null,
      listaAsl: [],
      asl: 0,
      soloPostiDisponibili: false,
      features: null,
      options: GV.config.getToolOptions('gv-gas'),
    };
  },
  methods: {
    onChangeArea(value) {
      this.moduli = this.aree.filter(area => {
        return area.codice === value;
      })[0].moduli;
    },
    onChangeProvincia(value) {
      this.asl = 0;
    },
    onChangeASL(value) {
      this.provincia = null;
    },
    elenco() {
      window.open('http://www.alisa.liguria.it/index.php?option=com_docman&view=docman&Itemid=382');
    },
    submit() {
      if (this.area) {
        this.showFeatures();
      } else {
        Notification({
          title: 'Attenzione',
          type: 'info',
          duration: 5000,
          offset: 70,
          dangerouslyUseHTMLString: true,
          position: 'bottom-left',
          message: 'Il parametro "Area" è obbligatorio',
        });
      }
    },
    showFeatures() {
      const filteredFeatures = this.features.filter(feature => {
        const filterArea = this.area ? feature.properties.idarea === this.area.toString() : true;
        const filterProv = this.provincia
          ? feature.properties.codProvincia === this.provincia
          : true;
        const filterPosti = this.soloPostiDisponibili
          ? feature.properties.disponibilita === 'S'
          : true;
        const filterAsl = this.asl ? feature.properties.ASL == this.asl : true;
        let filterModuli = false;
        if (this.modulo) {
          if (feature.properties.idModuli) {
            const moduli = feature.properties.idModuli.split(',');
            moduli.forEach(modulo => {
              if (modulo == this.modulo) filterModuli = true;
            });
          }
        } else {
          filterModuli = true;
        }
        return filterArea && filterProv && filterPosti && filterModuli && filterAsl;
      });
      this.loadLayer(filteredFeatures);
    },
    loadLayer(filteredFeatures) {
      // Cancello eventuale layer esistente
      const layer = GV.app.map.getLayerByName('Strutture');
      if (layer) {
        GV.app.map.removeLayer(layer);
      }

      if (filteredFeatures.length === 0) {
        Notification({
          title: 'Attenzione',
          type: 'info',
          duration: 5000,
          offset: 70,
          dangerouslyUseHTMLString: true,
          position: 'bottom-left',
          message: 'Nessuna struttura soddisfa i parametri<br>di ricerca',
        });
        return;
      }

      const customPopup = function(layer) {
        const properties = layer.feature.properties;
        let indirizzo = '';
        if (properties['cVia']) indirizzo += ` ${properties['cVia']}`;
        if (properties['via']) indirizzo += ` ${properties['via']}`;
        if (properties['nCivico']) indirizzo += ` ${properties['nCivico']}`;
        indirizzo += ', ';
        if (properties['cap']) indirizzo += `${properties['cap']} `;
        if (properties['desComune']) indirizzo += `${properties['desComune']} `;
        if (properties['telefono']) indirizzo += `<br/>Tel: ${properties['telefono']} `;

        const urlScheda = `${GV.globals.GAS_SCHEDA}gasweb/gestione/scheda?ID=${properties['idul']}`;
        const popUp = `
              <p><b>${properties['denominazione']}</b></p> 
              <p>${indirizzo}<br/><br/>
              Moduli: ${properties['moduli']}<br/>
              <a href="${urlScheda}" target="_blank">Scheda dettaglio</a>
        `;
        return popUp;
      };

      GV.app.map.loadLayers([
        {
          name: 'Strutture',
          type: 'JSON',
          geomSubType: 'POINT',
          classes: [
            {
              name: 'CLASSE_BASE',
              style: {
                iconUrl: '/geoservices/apps/viewer/static/img/gas/strutture.png',
                iconSize: [22, 27],
                iconAnchor: [11, 27],
                popupAnchor: [0, -27],
              },
            },
          ],
          visible: true,
          data: filteredFeatures,
          customPopup: customPopup,
          cluster: {
            options: {
              iconCreateFunction: function(cluster) {
                return L.divIcon({
                  html: cluster.getChildCount(),
                  className: 'cluster',
                  iconSize: L.point(28, 28),
                });
              },
              showCoverageOnHover: false,
              maxClusterRadius: 80,
            },
          },
        },
      ]);
      GV.app.map.fitBounds(GV.app.map.getLayerByName('Strutture').getBounds());
      if (GV.app.map.getZoom() > 18) GV.app.map.setZoom(18);
    },
  },
  mounted() {
    Notification({
      title: 'Attenzione',
      type: 'info',
      duration: 10000,
      offset: 70,
      dangerouslyUseHTMLString: true,
      position: 'bottom-left',
      message:
        'Sulla mappa potrebbero non comparire <br>tutte le strutture.<br>Per ottenere un elenco di tutte le <br>strutture selezionare il bottone <br><b>"Elenco Strutture"</b>',
    });
  },
  created() {
    const urlCombo = '/geoservices/REST/gas/combo?ENV=' + this.options.env;
    getGasComboConfig(urlCombo).then(data => {
      this.aree = data.aree.sort((a, b) => {
        return a.descrizione > b.descrizione ? 1 : b.descrizione > a.descrizione ? -1 : 0;
      });

      this.aree.forEach(area => {
        area.moduli.unshift({
          codiceArea: 0,
          codice: 0,
          descrizione: 'TUTTI',
        });
      });
      this.listaAsl = data.asl;
      this.listaAsl = this.listaAsl.sort(function(a, b) {
        if (a.descrizione < b.descrizione) {
          return -1;
        }
        if (a.descrizione > b.descrizione) {
          return 1;
        }
        return 0;
      });
      this.listaAsl.unshift({
        codice: 0,
        descrizione: 'TUTTE LE ASL',
      });
    });
    const urlStrutture = '/geoservices/REST/gas/strutture?ENV=' + this.options.env;
    getGasStrutture(urlStrutture).then(features => {
      this.features = features;
    });
  },
};
</script>

<style scoped>
.gv-gas {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 45px;
  /* background-color: #fff; */
  z-index: 800;
  width: 270px;
}

.label {
  display: inline-block;
  width: 120px;
}
.gv-gas-checkbox {
  padding: 10px;
}

#gv-gas-submit {
  margin: 10px;
}

#gv-gas-elenco {
  margin-left: 20px;
}
.gv-gas-combo {
  margin: 10px;
}
</style>
