<template>
  <div class="gv-cem-scheda-panel gv-inverted-color-scheme" id="gv-cem-scheda-panel">
    <gv-title v-draggable :title="titolo" :divId="'gv-cem-scheda-panel'"></gv-title>
    <div class="gv-cem-scheda-panel-body">
      <table>
        <tbody>
          <tr v-for="item in items" :key="item.label">
            <th class="gv-cem-scheda-panel-th gv-secondary-color-scheme">{{item.label}}</th>
            <td>{{item.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 

<script>
import Vue from "vue";
import globals from "../globals";

export default {
  props: [
    "titolo",
    "note",
    "tipo",
    "numValues",
    "siteFileName",
    "elevation",
    "side"
  ],
  data() {
    return {
      items: []
    };
  },
  methods: {},
  mounted() {
    this.items = [
      {
        label: "Titolo",
        value: this.titolo
      },
      {
        label: "Tipo di Esportazione",
        value: this.tipo
      },
      {
        label: "Griglia di Calcolo",
        value: this.numValues
      },
      {
        label: "Nome Postazione",
        value: this.siteFileName
      },
      {
        label: "Quota (m)",
        value: this.elevation
      },
      {
        label: "Lato Area Valutazione (m)",
        value: this.side
      },
      {
        label: "Note",
        value: this.note
      }
    ];
  }
};
</script>

<style scoped>
.gv-cem-scheda-panel {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 200px;
  background-color: #fff;
  z-index: 800;
  max-width: 600px;
}

.gv-cem-scheda-panel table {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
}

.gv-cem-scheda-panel-th {
  white-space: nowrap;
  width: auto;
  padding: 5px 5px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-cem-scheda-panel table tr td {
  padding: 5px;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-cem-scheda-panel-body {
  background-color: #fff;
}
</style>