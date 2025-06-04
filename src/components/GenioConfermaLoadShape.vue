<template>
  <div id="gv-genio-conferma-load-shape" class="gv-genio-conferma-load-shape">
    <gv-title title="Conferma salvataggio" :divId="'gv-genio-conferma-load-shape'"></gv-title>
    <div class="gv-genio-conferma-load-shape-body gv-inverted-color-scheme">
      <br />
      <b>Accetti le geometrie?</b>
      <br />
      <br />
      Se si accetta le geometrie caricate nei livelli di staging vengono caricate sui livelli di
      produzione e vengono cancellate eventuali geometrie pregresse per quel codice pratica
      <br />
      <br />
      Se si rifiuta vengono ripulite le tabelle di staging
      <br />
      <br />
      <div>
        <el-button type="primary" @click="submit" :disabled="buttonDisabled">SÌ</el-button>
        <el-button @click="cancel" :disabled="buttonDisabled">NO</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import { Loading, Notification } from 'element-ui';
// Vue.use(Loading);
// Vue.use(Row);
// Vue.use(Popover);

const name = 'gv-genio-conferma-load-shape';

export default {
  data() {
    const options = GV.config.getToolOptions(name);
    return {
      buttonDisabled: false,
      data: {
        codice_pratica: GV.globals.GW_CONFIG.codice_pratica,
        prov: GV.globals.GW_CONFIG.prov,
        action: null,
      },
    };
  },
  methods: {
    async cancel() {
      this.data.action = 'cancel';
      var r = confirm('Sei sicuro?');
      if (r == true) {
        await this.postData();
      }
      return;
    },
    async submit() {
      this.data.action = 'submit';
      var r = confirm('Sei sicuro?');
      if (r == true) {
        await this.postData();
      }
      return;
    },
    async postData() {
      const loading = Loading.service({
        text: 'Salvataggio dati...',
        background: 'rgba(0, 0, 0, 0.8)',
      });

      axios
        .post('/geoservices/REST/genioweb/load_shape', {
          headers: { Accept: 'text/xml' },
          data: this.data,
        })
        .then((response) => {
          const resp = response.data;
          if (loading) loading.close();
          if (resp.success) {
            GV.utils.notification('Dati salvati correttamente', 'info');
          } else {
            GV.utils.notification('Errore nella scrittura sul DB', 'error');
          }
          this.buttonDisabled = true;
          setTimeout(() => {
            window.close();
          }, '3000');
        });
    },
  },
};
</script>

<style>
.gv-genio-conferma-load-shape {
  position: absolute;
  width: 300px;
  left: 0px;
  top: 0px;
  margin-left: 10px;
  margin-top: 50px;
  z-index: 800;
}

.gv-genio-conferma-load-shape-body {
  padding: 5px;
  width: 290px;
  height: 270px;
}
</style>
