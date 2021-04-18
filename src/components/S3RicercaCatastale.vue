<template>
  <div class="gv-ricerca-catastale gv-inverted-color-scheme" id="gv-ricerca-catastale">
    <gv-title v-draggable :title="title" :divId="'gv-ricerca-catastale'" :hide="true"></gv-title>
    <div class="gv-ricerca-catastale-body" id="gv-ricerca-catastale-body">
      <el-form :model="form" ref="form">
        <el-form-item>
          <el-select
            id="gv-ricerca-catastale-select"
            v-model="tipo"
            size="mini"
            placeholder="Tipo"
            @change="changeTipo"
          >
            <el-option
              v-for="item in tipi"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="show[0]">
          <el-select
            id="gv-ricerca-catastale-comuni-select"
            v-model="comune"
            size="mini"
            placeholder="Comune"
            @change="changeComune"
            filterable
          >
            <el-option
              v-for="item in comuni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-sezioni-select"
            v-model="sezione"
            size="mini"
            placeholder="Sezione"
            @change="changeSezione"
            no-data-text="Seleziona un Comune"
            filterable
          >
            <el-option
              v-for="item in sezioni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-fogli-select"
            v-model="foglio"
            size="mini"
            placeholder="Foglio"
            @change="changeFoglio"
            no-data-text="Seleziona una Sezione"
            filterable
          >
            <el-option
              v-for="item in fogli"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-particelle-select"
            v-model="particella"
            size="mini"
            placeholder="Particella"
            no-data-text="Seleziona una Foglio"
            filterable
          >
            <el-option
              v-for="item in particelle"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="show[1]">
          <el-select
            id="gv-ricerca-catastale-comuni2-select"
            v-model="comune"
            size="mini"
            placeholder="Comune"
            @change="changeComune2"
            filterable
          >
            <el-option
              v-for="item in comuni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-indirizzi-select"
            v-model="indirizzo"
            size="mini"
            placeholder="Digita un criterio di ricerca"
            :remote-method="findIndirizzi"
            @change="changeIndirizzo"
            no-data-text="Seleziona un Comune"
            filterable
            remote
          >
            <el-option
              v-for="item in indirizzi"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-civico-select"
            v-model="civico"
            size="mini"
            placeholder="Civico"
            @change="changeCivico"
            no-data-text="Seleziona un Indirizzo"
            filterable
          >
            <el-option
              v-for="item in civici"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <div v-show="showTableCensuario" id="gv-ricerca-catastale-attenzione-censuario">
            Attenzione, la correttezza del risultato non e' garantita (allineamento tra censuari
            ancora in corso)
          </div>
          <el-table
            id="gv-ricerca-catastale-civico-table"
            :data="particelleCensuario"
            highlight-current-row
            v-show="showTableCensuario"
            @current-change="changeParticelleCensuario"
            size="mini"
            border
            style="width: 100%"
          >
            <el-table-column
              label="Sez. fabb."
              width="40px"
              style="word-wrap: break-word"
              prop="sezFabbricati"
            ></el-table-column>
            <el-table-column
              label="Sez. urb."
              width="30px"
              style="word-wrap: break-word"
              prop="sezUrbana"
            ></el-table-column>
            <el-table-column
              label="Foglio fabb."
              width="40px"
              style="word-wrap: break-word"
              prop="foglioFabbricati"
            ></el-table-column>
            <el-table-column
              label="Sez. terr."
              width="40px"
              style="word-wrap: break-word"
              prop="codSez"
            ></el-table-column>
            <el-table-column
              label="Foglio terr."
              width="40px"
              style="word-wrap: break-word"
              prop="codFoglio"
            ></el-table-column>
            <el-table-column
              label="Mappale"
              width="60px"
              style="word-wrap: break-word"
              prop="codParticella"
            ></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-show="show[2]">
          <el-select
            id="gv-ricerca-catastale-bacino-select"
            v-model="bacino"
            size="mini"
            placeholder="Bacino"
            @change="changeBacino"
            filterable
          >
            <el-option
              v-for="item in bacini"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-corso-acqua-select"
            v-model="affluente"
            size="mini"
            placeholder="Corso d'acqua"
            no-data-text="Seleziona un Bacino"
            filterable
          >
            <el-option
              v-for="item in affluenti"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="show[3]">
          <el-select
            id="gv-ricerca-catastale-comuni3-select"
            v-model="comune"
            size="mini"
            placeholder="Comune"
            @change="changeComune3"
            filterable
          >
            <el-option
              v-for="item in comuni"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-strade-select"
            v-model="strada"
            size="mini"
            placeholder="Indirizzo"
            no-data-text="Seleziona un Comune"
            filterable
          >
            <el-option
              v-for="item in strade"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="show[4]">
          <el-select
            id="gv-ricerca-catastale-squadro-select"
            v-model="squadro"
            size="mini"
            placeholder="Squadro"
            @change="changeSquadro"
            filterable
          >
            <el-option
              v-for="item in squadri"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            id="gv-ricerca-catastale-fogli-squadro-select"
            v-model="foglioSquadro"
            size="mini"
            placeholder="Foglio"
            no-data-text="Seleziona uno Squadro"
            filterable
          >
            <el-option
              v-for="item in fogliSquadro"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="gv-ricerca-catastale-buttons">
          <el-button
            id="gv-ricerca-catastale-submit-button"
            v-show="showSubmitButton"
            type="primary"
            size="mini"
            @click="submit"
            >Visualizza</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import mountComponent from '../util/mountComponent';
import globals from '../globals';
import getComuni from '../services/getS3Comuni';
import getSezioni from '../services/getS3Sezioni';
import getFogli from '../services/getS3Fogli';
import getParticelle from '../services/getS3Particelle';
import getIndirizzi from '../services/getS3Indirizzi';
import getCivici from '../services/getS3Civici';
import getParticelleCensuario from '../services/getS3ParticelleCensuario';
import getReticolo from '../services/getS3Reticolo';
import getStrade from '../services/getS3Strade';
import getFogliSquadro from '../services/getS3FogliSquadro';

import getWFSFeature from '../services/getWFSFeature';

import { Button, Input, Form, FormItem, Select, Option, Notification } from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

export default {
  name: 'gv-ricerca-catastale',
  data() {
    const options = GV.config.getToolOptions('gv-ricerca-catastale-button');

    return {
      title: 'RICERCA CATASTALE',
      options: options,
      tipo: 0,
      tipi: [
        {
          id: 0,
          label: 'Identificativo Catastale',
        },
        {
          id: 1,
          label: 'Indirizzo Catastale',
        },
        {
          id: 2,
          label: "Bacino / Corso d'acqua",
        },
        {
          id: 3,
          label: 'Elemento Stradale',
        },
        {
          id: 4,
          label: 'Quadro di unione',
        },
      ],
      show: [true, false, false, false, false],
      comuni: null,
      sezioni: null,
      fogli: null,
      particelle: null,
      comune: null,
      sezione: null,
      foglio: null,
      particella: null,
      indirizzi: null,
      indirizzo: null,
      civici: null,
      civico: null,
      particelleCensuario: [],
      bacino: null,
      bacini: null,
      affluente: null,
      affluenti: null,
      strada: null,
      strade: null,
      squadri: [
        {
          id: 5000,
          layer: 'M31:L64',
          label: 'Squadro 1:5000',
        },
        {
          id: 10000,
          layer: 'M31:L60',
          label: 'Squadro 1:10000',
        },
        {
          id: 25000,
          layer: 'M31:L62',
          label: 'Squadro 1:25000',
        },
        {
          id: 50000,
          layer: 'M31:L65',
          label: 'Squadro 1:50000',
        },
      ],
      squadro: 5000,
      fogliSquadro: null,
      foglioSquadro: null,
    };
  },
  computed: {
    showSubmitButton() {
      if (this.tipo === 0) {
        return this.comune;
      }
      if (this.tipo === 1) {
        return this.comune && this.indirizzo && this.civico;
      }
      if (this.tipo === 2) {
        return this.bacino && this.affluente;
      }
      if (this.tipo === 3) {
        return this.comune && this.strada;
      }
      if (this.tipo === 4) {
        return this.squadro && this.foglioSquadro;
      }
    },
    showTableCensuario() {
      if (this.civico) return true;
      return false;
    },
  },
  mounted() {
    getComuni(this.options.codIstatProv).then(resp => {
      this.comuni = resp;
      this.comune = this.comuni[0].id;
      this.changeComune(this.comune);
      this.changeComune2(this.comune);
      this.changeComune3(this.comune);
    });
    getReticolo().then(resp => {
      this.bacini = resp;
      this.bacino = this.bacini[0].id;
      this.changeBacino(this.bacino);
    });
    getFogliSquadro(5000, this.options.codIstatProv).then(resp => {
      this.fogliSquadro = resp;
    });
  },
  methods: {
    changeTipo(id) {
      this.comune = this.comuni[0].id;
      this.sezione = null;
      this.foglio = null;
      this.particella = null;
      this.indirizzo = null;
      this.civico = null;
      this.affluente = null;
      this.strada = null;
      this.show = [false, false, false, false, false];
      this.show[id] = true;
    },
    changeBacino(id) {
      this.affluente = null;
      getReticolo(id.replace(/'/g, "''")).then(resp => {
        this.affluenti = resp;
      });
    },
    changeComune(id) {
      this.sezioni = null;
      this.sezione = null;
      this.fogli = null;
      this.foglio = null;
      this.particelle = null;
      this.particella = null;
      getSezioni(id).then(resp => {
        this.sezioni = resp;
      });
    },
    changeSezione(id) {
      this.fogli = null;
      this.foglio = null;
      this.particelle = null;
      this.particella = null;
      getFogli(this.comune, id).then(resp => {
        this.fogli = resp;
      });
    },
    changeFoglio(id) {
      this.particelle = null;
      this.particella = null;
      getParticelle(this.comune, this.sezione, id).then(resp => {
        this.particelle = resp;
      });
    },
    changeComune2(id) {
      this.indirizzo = null;
      this.civico = null;
      this.indirizzi = [];
      // getIndirizzi(id).then(resp => {
      //   this.indirizzi = resp;
      // });
    },
    changeIndirizzo(id) {
      this.civico = null;
      const ids = id.split(',');
      getCivici(ids[0], ids[1], ids[2]).then(resp => {
        this.civici = resp;
      });
    },
    findIndirizzi(query) {
      // console.log(query);
      if (
        (this.comune === 'D969' && query.length > 1) ||
        (this.comune !== 'D969' && query.length > 0)
      ) {
        getIndirizzi(this.comune, query).then(resp => {
          this.indirizzi = resp;
        });
      }
    },
    changeCivico(id) {
      this.particelleCensuario = null;
      const ids = this.indirizzo.split(',');
      getParticelleCensuario(ids[0], ids[1], ids[2], id).then(resp => {
        this.particelleCensuario = resp;
      });
    },
    changeParticelleCensuario(item) {
      this.particellaCensuario = item;
    },
    changeComune3(id) {
      this.strada = null;
      getStrade(id).then(resp => {
        this.strade = resp;
      });
    },
    changeSquadro(id) {
      this.foglioSquadro = null;
      getFogliSquadro(id, this.options.codIstatProv).then(resp => {
        this.fogliSquadro = resp;
      });
    },
    submit() {
      switch (this.tipo) {
        case 0: // Ricerca per Identificativo Catastale
          this.submitIdentificativo();
          break;
        case 1: // Ricerca per Indirizzo Catastale
          this.submitIndirizzo();
          break;
        case 2: // Ricerca per Reticolo Idrografico
          this.submitReticolo();
          break;
        case 3: // Ricerca per Strade
          this.submitStrade();
          break;
        case 4: // Ricerca per Strade
          this.submitSquadri();
          break;
      }
    },
    submitSquadri() {
      const typeName = this.squadri.filter(squadro => squadro.id === this.squadro)[0].layer;
      const cqlFilter = "id='" + this.foglioSquadro + "'";
      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        typeName +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, url).then(features => {
        GV.app.map.hiliteFeatures(features);
      });
    },
    submitStrade() {
      let typeName = 'M2245:L8244';
      // console.log(this.strada)
      let cqlFilter = `NOME_ST='${this.strada}' AND COD_CATASTALE='${this.comune}'`;
      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        typeName +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, url).then(features => {
        GV.app.map.hiliteFeatures(features);
      });
    },
    // submitStrade() {
    //   let typeName = 'M419:L684';
    //   let cqlFilter = "cod_strada='" + this.strada + "'";
    //   const url =
    //     'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
    //     typeName +
    //     '&cql_filter=' +
    //     cqlFilter;
    //   getWFSFeature(null, null, url).then(features => {
    //     GV.app.map.hiliteFeatures(features);
    //   });
    // },
    submitReticolo() {
      let typeName = 'M626:L1080';
      let cqlFilter = "denom_corpo='" + this.affluente.replace(/'/g, "''") + "'";

      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        typeName +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, url).then(features => {
        GV.app.map.hiliteFeatures(features);
      });
    },
    submitIndirizzo() {
      let typeName = 'M1047:L2624';
      let cqlFilter = 'CT24_ID=' + this.particellaCensuario.id;
      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        typeName +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, url).then(features => {
        GV.app.map.hiliteFeatures(features);
      });
    },
    submitIdentificativo() {
      let typeName = null;
      let cqlFilter = null;
      if (this.comune) {
        typeName = 'M2002:L6588';
        cqlFilter = "aa01_cod_com='" + this.comune + "'";
      }
      if (this.foglio) {
        typeName = 'M2002:L6589';
        cqlFilter =
          "ct31_cod_com='" +
          this.comune +
          "' AND ct31_sez='" +
          this.sezione +
          "' AND ct31_foglio='" +
          this.foglio +
          "'";
      }
      if (this.particella) {
        typeName = 'M1047:L2624';
        cqlFilter = 'CT24_ID=' + this.particella;
      }

      const url =
        'https://geoservizi.regione.liguria.it/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A4326&outputFormat=application%2Fjson&typeName=' +
        typeName +
        '&cql_filter=' +
        cqlFilter;
      getWFSFeature(null, null, url).then(features => {
        GV.app.map.hiliteFeatures(features);
      });
    },
    cancel() {
      this.cleanUp();
    },
    cleanUp() {
      if (this.closeWindow === 'true') {
        window.close();
      } else {
        document
          .getElementById('gv-ricerca-catastale')
          .parentNode.removeChild(document.getElementById('gv-ricerca-catastale'));
      }
    },
    collapse: function(event) {
      if (this.show) {
        document.getElementById('gv-ricerca-catastale-body').style.display = 'none';
      } else {
        document.getElementById('gv-ricerca-catastale-body').style.display = 'block';
      }
      this.show = !this.show;
    },
  },
};
</script>

<style scoped>
.gv-ricerca-catastale {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 50px;
  width: 300px;
  background-color: #fff;
  z-index: 800;
}

.gv-ricerca-catastale-body {
  margin: 10px;
}

.gv-ricerca-catastale-label {
  display: inline-block;
  width: 150px;
}

/* #gv-ricerca-catastale-value-list-button {
  float: right;
} */

.gv-ricerca-catastale-buttons {
  margin-top: -5px;
}

.gv-ricerca-catastale-operator-combo {
  width: 100px;
}
#gv-ricerca-catastale-attenzione-censuario {
  line-height: 15px;
  color: red;
  margin: 5px;
}
</style>

<style>
#gv-ricerca-catastale-value {
  width: 250px;
}
.el-scrollbar__bar.is-horizontal {
  height: 0px;
  left: 2px;
}
.el-select-dropdown__empty {
  display: none;
}
</style>
