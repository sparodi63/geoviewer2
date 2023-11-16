<template>
  <el-dialog width="50%" title="Avvertenze" :visible.sync="dialogVisible">
    <div>
      Prima di proseguire è necessario visualizzare le
      <a :href="link" target="_blank">{{ label }}</a
      >. <br /><br />
      Cliccando su
      <span style="color: #00377c">
        <b>"Accetto"</b>
      </span>
      l’utente dichiara di aver preso visione dell’avviso.
    </div>
    <br />
    <!-- <div>
      <a :href="link" target="_blank">{{ label }}</a>
    </div>
    <br /> -->
    <span>
      <el-checkbox @change="toggleSubmit"
        >Dichiaro di aver preso visione delle Avvertenze</el-checkbox
      >
    </span>
    <span slot="footer">
      <el-button @click="cancel">
        <span style="color: #00377c; font-weight: bold">Annulla</span>
      </el-button>
      <el-button type="primary" @click="submit" :disabled="submitDisabled">
        <span style="color: #ffffff; font-weight: bold">Accetto</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Dialog, Checkbox } from 'element-ui';
Vue.use(Dialog, Checkbox);

export default {
  name: 'gv-conferma-dettaglio',
  props: ['link', 'label', 'idMap'],
  data() {
    return {
      dialogVisible: true,
      submitDisabled: true,
    };
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
    },
    submit() {
      GV.config.addRlMap(this.idMap, false, true);
      this.dialogVisible = false;
    },
    toggleSubmit() {
      this.submitDisabled = !this.submitDisabled;
    },
  },
};
</script>

<style>
.el-dialog__body {
  color: #000000 !important;
}
.el-dialog__footer {
  background-color: #e7e7e7;
}
.el-dialog__header {
  background-color: #e7e7e7;
}
.el-dialog__body {
  background-color: #e7e7e7;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  font-weight: 800;
}
</style>