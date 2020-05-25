/* eslint-disable vue/attribute-hyphenation */

<template>
  <ve-line
    :data="data"
    :data-zoom="dataZoom"
    :title="title"
    :settings="settings"
    :extend="extend"
    :mark-line="markLine"
    :mark-point="markPoint"
    :toolbox="toolbox"
    :loading="loading"
    :height="height"
    :width="width"
  ></ve-line>
</template>

<script>
import VeLine from "v-charts/lib/line.common"; // 引入v-echarts地图
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱
import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";
import "v-charts/lib/style.css"; // 使用loading属性，前先引入css

export default {
  name: "YiLineChart",
  components: { VeLine },
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
        return {};
      }
    },
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    extend: {
      type: Object,
      default() {
        return [{}];
      }
    },
    dataZoom: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default: "400px"
    },
    width: {
      type: String,
      default: "100%"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // this.settings = {
    //   stack: { 县市: ["柯城", "衢江", "江山", "龙游", "常山", "开化"] }, // 堆叠柱状图,https://v-charts.js.org/#/histogram
    //   area: true
    //   // showLine: ["柯城"] // 选择显示line的
    //   // metrics: ["柯城"] // 设置显示的指标维度，https://v-charts.js.org/#/data
    // };
    // this.title = {
    //   left: "left",
    //   subtext: "落单投诉",
    //   text: "无线落单投诉量日趋势"
    // };
    this.markLine = {
      data: [
        {
          name: "平均值",
          type: "average"
        }
      ]
    };
    this.markPoint = {
      data: [
        {
          name: "最大值",
          type: "max"
        }
      ]
    };
    // this.dataZoom = {
    //   type: "slider",
    //   start: 0,
    //   end: 180
    // };
    this.toolbox = {
      feature: {
        magicType: { type: ["line", "bar"] },
        saveAsImage: {}
      }
    };
    // this.extend = {
    //   // 图例显示位置
    //   legend: {
    //     // bottom: "20"
    //     // top: "30",
    //     right: "80"
    //   },
    //   // series: {
    //   //   label: { show: true, position: "top" }
    //   // },
    //   // 去除分隔线
    //   // https://www.echartsjs.com/zh/option.html#xAxis.splitLine
    //   yAxis: {
    //     splitLine: { show: false }
    //   }
    // };
    return {};
  },
  created() {},
  methods: {}
};
</script>

