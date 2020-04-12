
<template>
  <div class="app">
    <ve-line
      :data="chartData"
      :data-zoom="dataZoom"
      :title="chartTitle"
      :settings="chartSettings"
      :mark-point="markPoint"
      :toolbox="toolbox"
      width="100%"
    ></ve-line>
    <!-- <ve-histogram
      :title="chartTitle"
      :data="chartData"
      :data-zoom="dataZoom"
      :settings="chartSettings"
      :extend="extend"
      :toolbox="toolbox"
      width="100%"
    ></ve-histogram>-->
  </div>
</template>

<script>
import VeLine from "v-charts/lib/line.common";
import VeHistogram from "v-charts/lib/histogram.common";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱
import { getDayData } from "@/api/chart.js";

export default {
  components: { VeLine, VeHistogram },
  data() {
    this.chartSettings = {
      stack: { 县市: ["柯城", "衢江", "江山", "龙游", "常山", "开化"] }, // 堆叠柱状图,https://v-charts.js.org/#/histogram
      area: true
      // showLine: ["柯城"]
      // metrics: ["柯城"] // 设置显示的指标维度，https://v-charts.js.org/#/data
    };
    this.chartTitle = {
      left: "left",
      subtext: "落单投诉",
      text: "每日无线投诉量趋势"
    };
    // this.extend = {
    //   series: {
    //     label: { show: true, position: "top" }
    //   }
    // };
    this.markLine = {
      data: [
        {
          name: "平均线",
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
    this.dataZoom = [
      {
        type: "slider",
        start: 0,
        end: 180
      }
    ];
    this.toolbox = {
      feature: {
        magicType: { type: ["line", "bar"] },
        saveAsImage: {}
      }
    };
    return {
      listQuery: {
        city: "衢州",
        month: "",
        year: "",
        start_date: "2019-06-01",
        end_date: "2019-08-30"
      },
      chartData: {} // 图表数据
      // chartData: {
      //   columns: ["日期", "成本", "利润"],
      //   rows: [
      //     { 日期: "1月1日", 成本: 1523, 利润: 1231 },
      //     { 日期: "1月2日", 成本: 1223, 利润: 2523 },
      //     { 日期: "1月3日", 成本: 2123, 利润: 1000 },
      //     { 日期: "1月4日", 成本: 4123, 利润: 3223 },
      //     { 日期: "1月5日", 成本: 3123, 利润: 3023 },
      //     { 日期: "1月6日", 成本: 7123, 利润: 5523 }
      //   ]
      // }
    };
  },
  created() {
    this.getDayChart();
  },
  methods: {
    getDayChart() {
      // 当前县市全量投诉
      getDayData(this.listQuery)
        .then(res => {
          this.chartData = res.data;
          // this.loading = false;
        })
        .catch(res => {
          // this.loading = false;
        });
    }
  }
};
</script>
<style scoped>
.app {
  padding-top: 80px;
}
</style>
