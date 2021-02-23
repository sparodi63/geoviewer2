<template>
  <div
    class="gv-atlante-geochimico-scheda-panel gv-inverted-color-scheme"
    id="gv-atlante-geochimico-scheda-panel"
  >
    <gv-title
      :title="titolo"
      :divId="'gv-atlante-geochimico-scheda-panel'"
      class="ag-scheda-title"
    ></gv-title>
    <div class="gv-atlante-geochimico-scheda-panel-body">
      <div class="gv-atlante-geochimico-unita">Unità di Misura: {{ this.unitaMisura }}</div>
      <table>
        <tbody>
          <tr v-for="item in items" :key="item.label">
            <th class="gv-atlante-geochimico-scheda-panel-th gv-color-scheme">
              {{ item.label }}
            </th>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import globals from '../globals';

export default {
  props: [
    'pcdf',
    'pest',
    'plower',
    'pupper',
    'Q1',
    'Q2',
    'Q3',
    'QCD',
    'cifre',
    'unitaMisura',
    'titolo',
  ],
  data() {
    const labels = [
      '95° percentile',
      'Media',
      'Media -sigma',
      'Media +sigma',
      'Primo quartile (25° percentile)',
      'Mediana (50° percentile)',
      'Terzo quartile (75° percentile)',
      'Coeff. di dispersione dei quartili',
    ];
    const items = [
      {
        label: 'Media',
        value: `${parseFloat(this.pest).toFixed(this.cifre)}`,
      },
      {
        label: 'Media -sigma',
        value: `${parseFloat(this.plower).toFixed(this.cifre)}`,
      },
      {
        label: 'Media +sigma',
        value: `${parseFloat(this.pupper).toFixed(this.cifre)}`,
      },
      {
        label: 'Primo quartile (25° percentile)',
        value: `${parseFloat(this.Q1).toFixed(this.cifre)}`,
      },
      {
        label: 'Mediana (50° percentile)',
        value: `${parseFloat(this.Q2).toFixed(this.cifre)}`,
      },
      {
        label: 'Terzo quartile (75° percentile)',
        value: `${parseFloat(this.Q3).toFixed(this.cifre)}`,
      },
      {
        label: '95° percentile',
        value: `${parseFloat(this.pcdf).toFixed(this.cifre)}`,
      },
      {
        label: 'Coeff. di dispersione dei quartili',
        value: `${parseFloat(this.QCD).toFixed(2)}`,
      },
    ];
    return {
      items: items,
      // titolo: 'INFO',
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.gv-atlante-geochimico-scheda-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #ccc;
  z-index: 700;
  max-width: 600px;
  height: 350px;
}

.gv-atlante-geochimico-scheda-panel table {
  border: 1px solid #ddd;
  width: 100%;
  padding: 10px;
  color: #24386c;
  background-color: #ccc;
}

.gv-atlante-geochimico-scheda-panel-th {
  white-space: nowrap;
  width: 180px;
  padding: 5px 5px;
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-atlante-geochimico-scheda-panel table tr td {
  padding: 5px;
  font-size: 12px;
  border: 1px solid #e5e5e5;
}

.gv-atlante-geochimico-scheda-panel-body {
  background-color: #ccc;
}

.gv-atlante-geochimico-unita {
  margin: 15px;
  padding: 5px;
  color: #24386c;
  background-color: #ccc;
}
.ag-scheda-title {
  padding-left: 20px;
}
</style>
