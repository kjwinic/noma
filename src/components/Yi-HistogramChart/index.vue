
<template>
  <ve-histogram
    :data="data"
    :title="title"
    :settings="settings"
    :legend-visible="legendVisible"
    :toolbox="toolbox"
    :extend="extend"
    :height="height"
    :width="width"
  ></ve-histogram>
</template>

<script>
import VeHistogram from "v-charts/lib/histogram.common"; // 引入v-echarts地图
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱

import "v-charts/lib/style.css"; // 使用loading属性前先引入css

export default {
  name: "YiHistogramChart",
  components: { VeHistogram },
  props: {
    data: {
      type: Object,
      default() {
        return [{}];
      }
    },
    title: {
      type: Object,
      default() {
        return [{}];
      }
    },
    settings: {
      type: Object,
      default() {
        return [{}];
      }
    },
    legendVisible: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: "200px"
    },
    width: {
      type: String,
      default: "300px"
    }
  },
  data() {
    this.settings = {
      // limitShowNum: 5
      // roseType: "radius"
    };
    // 标题
    this.title = {
      left: "center",
      text: "",
      subtext: ""
    };
    // 工具箱配置
    this.toolbox = {
      feature: {
        magicType: { type: ["line", "bar"] },
        saveAsImage: {}
      }
    };
    // 显示值
    this.extend = {
      series: {
        label: { show: true, position: "top" }
      },
      // 去除分隔线
      // https://www.echartsjs.com/zh/option.html#xAxis.splitLine
      yAxis: {
        splitLine: { show: false }
      }
    };
    return {};
  },
  created() {},
  methods: {}
};
</script>

