<template>
  <div id="gv-difesa-suolo-foto-log" class="gv-difesa-suolo-foto-log">
    <div
      v-draggable
      id="gv-difesa-suolo-foto-log-title"
      class="gv-difesa-suolo-foto-log-title gv-color-scheme"
    >
      Difesa Suolo: LOG ERRORI
      <el-button
        class="gv-close gv-color-scheme"
        icon="el-icon-close"
        type="button"
        @click="closePanel"
        title="Chiudi Panello"
        alt="Chiudi Panello"
      ></el-button>
    </div>

    <div
      id="gv-difesa-suolo-foto-log-wrapper"
      class="gv-difesa-suolo-foto-log-wrapper gv-inverted-color-scheme"
    >
      <!-- <div>{{ session }}</div> -->
      <div
        id="gv-difesa-suolo-foto-log-body"
        class="gv-difesa-suolo-foto-log-body gv-inverted-color-scheme"
      >
        <div class="gv-difesa-suolo-foto-log-select">
          <b>SESSIONE</b>
          <el-select v-model="sel_session" size="mini" @change="onChange">
            <el-option
              v-for="item in sessions"
              :key="item.session"
              :value="item.session"
              :label="item.session"
            >
              <span style="font-size: 16px">{{ item.session }}</span>
            </el-option>
          </el-select>
        </div>
        <el-table empty-text="Nessun Log" :data="sel_logs" size="mini" style="width: 100%">
          <el-table-column label="Nome Foto" width="150">
            <template slot-scope="scope"> {{ scope.row.file_name }} </template>
          </el-table-column>
          <el-table-column label="Errore" width="200">
            <template slot-scope="scope"> {{ scope.row.errore }} </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Button, Table } from 'element-ui';
Vue.use(Button, Table);

import lang from 'element-ui/lib/locale/lang/it';
import locale from 'element-ui/lib/locale';
locale.use(lang);

import { Loading } from 'element-ui';
Vue.use(Loading);

import notification from '../util/notification';

export default {
  name: 'gv-difesa-suolo-foto-log',
  data() {
    return {
      login: GV.globals.SESSION.AUTH.LOGIN,
      session: GV.globals.SESSION.ID,
      sessions: null,
      logs: null,
      sel_session: null,
      sel_logs: null,
    };
  },
  mounted() {
    const url = `/geoservices/REST/difesa_suolo_foto/read_log/${this.login}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.logs = data.data.logs;
        this.sessions = data.data.sessions;
        this.sel_session = this.session;
        this.sel_logs = this.filterLogs(this.sel_session);
      })
      .catch((error) => {
        notification('Errore lettura log: ' + error);
        console.error('Error:', error);
      });
  },
  methods: {
    closePanel: function () {
      let div = document.getElementById('gv-difesa-suolo-foto-log');
      if (!div) return;
      div.parentNode.removeChild(div);
    },
    onChange: function () {
      console.log('onChange', this.sel_session);
      this.sel_logs = this.filterLogs(this.sel_session);
    },
    filterLogs: function (session) {
      return this.logs.filter((log) => log.session == session);
    },
  },
};
</script>

<style>
.gv-difesa-suolo-foto-log-upload {
  height: 200px;
}

.gv-map-catalog-button {
  margin-top: 10px;
  font-size: 12px;
}

.gv-map-catalog-button-validate {
  margin-left: 95px !important;
  font-size: 12px;
}

.gv-map-catalog-button span {
  font-family: 'Raleway', Arial, sans-serif;
}

.gv-difesa-suolo-foto-log-title {
  padding: 5px;
  padding-left: 10px;
  font-weight: bold;
  width: 385px;
}

.gv-difesa-suolo-foto-log {
  position: absolute;
  width: 270px;
  left: 0px;
  top: 0px;
  /* margin-left: 10px;
  margin-top: 10px; */
  z-index: 800;
  padding: 10px;
}

.gv-difesa-suolo-foto-log-wrapper {
  width: 400px;
  height: 520px;
}

.gv-difesa-suolo-foto-log-button {
  padding-left: 15px;
}

.gv-difesa-suolo-foto-log-select {
  padding-bottom: 10px;
}

.gv-difesa-suolo-foto-log-body {
  padding: 15px;
  overflow-y: auto;
  width: 370px;
  height: 450px;
}

.gv-close {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  appearance: none;
  /* background-color: #e94e1b !important; */
  /* background-color: #5b565c !important; */
  color: #ddd;
  float: right;
  font-size: 1rem;
  line-height: 1;
  font-weight: 800;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 3px;
}
</style>


 