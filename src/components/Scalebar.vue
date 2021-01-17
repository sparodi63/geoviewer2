<template>
  <div id="gv-scalebar" class="scalebar">
    <el-select v-model="value" size="mini" placeholder @change="onChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>


<script>
import Vue from "vue";
import { Select, Option } from "element-ui";
Vue.use(Select);
Vue.use(Option);

export default {
  data() {
    const options = [
      {
        value: 8,
        label: "1:1.600.000"
      },
      {
        value: 9,
        label: "1:800.000"
      },
      {
        value: 10,
        label: "1:400.000"
      },
      {
        value: 11,
        label: "1:200.000"
      },
      {
        value: 12,
        label: "1:100.000"
      },
      {
        value: 13,
        label: "1:50.000"
      },
      {
        value: 14,
        label: "1:25.000"
      },
      {
        value: 15,
        label: "1:12.000"
      },
      {
        value: 16,
        label: "1:6.000"
      },
      {
        value: 17,
        label: "1:3.000"
      },
      {
        value: 18,
        label: "1:1.500"
      },
      {
        value: 19,
        label: "1:800"
      },
      {
        value: 20,
        label: "1:400"
      }
    ];

    const options2 = [
      {
        value: 8,
        label: "1:2.300.000"
      },
      {
        value: 9,
        label: "1:1.150.000"
      },
      {
        value: 10,
        label: "1:580.000"
      },
      {
        value: 11,
        label: "1:290.000"
      },
      {
        value: 12,
        label: "1:144.000"
      },
      {
        value: 13,
        label: "1:72.000"
      },
      {
        value: 14,
        label: "1:36.000"
      },
      {
        value: 15,
        label: "1:18.000"
      },
      {
        value: 16,
        label: "1:9.000"
      },
      {
        value: 17,
        label: "1:4.500"
      },
      {
        value: 18,
        label: "1:2.200"
      },
      {
        value: 19,
        label: "1:1.100"
      },
      {
        value: 20,
        label: "1:560"
      }
    ];

    return {
      options: options2,
      value: 9
    };
  },
  methods: {
    onChange(value) {
      GV.app.map.setZoom(value);
    }
  },
  mounted: function() {
    var me = this;
    GV.eventBus.$on("map-zoom", function(zoom) {
      me.value = zoom;
    });
  }
};
</script>

<style scoped >
.scalebar {
  z-index: 800;
  margin-right: -10px;
  display: inline-block;
}
</style>