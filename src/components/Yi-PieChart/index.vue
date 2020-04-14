
<template>
  <ve-pie
    :data="data"
    :title="title"
    :settings="settings"
    :toolbox="toolbox"
    :extend="extend"
    :legend-visible="false"
    :height="height"
    :width="width"
  ></ve-pie>
</template>

<script>
import VePie from "v-charts/lib/pie.common"; // 引入v-echarts地图
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱

import "v-charts/lib/style.css"; // 使用loading属性前先引入css

export default {
  name: "YiPieChart",
  components: { VePie },
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
    height: {
      type: String,
      default: "400px"
    },
    width: {
      type: String,
      default: "500px"
    }
  },
  data() {
    // 设置最多显示数量
    this.settings = {
      limitShowNum: 5
      // roseType: "radius"
    };
    // 标题
    this.title = {
      left: "center",
      text: "投诉原因分类",
      subtext: "落单投诉"
    };
    // 工具箱配置
    this.toolbox = {
      feature: {
        magicType: { type: ["line", "bar"] },
        saveAsImage: {}
      }
    };
    this.extend = {
      series: {
        label: {
          normal: {
            show: true,
            // position: "inner", // 标签的位置
            textStyle: {
              // fontWeight: 200,
              // fontSize: 14, // 文字的字体大小
              color: "black"
            },
            formatter: "{b}\n{c}起, {d}%" // 设置显示格式，中间换行
          }
        }
      }
    };
    return {};
  },
  created() {},
  methods: {}
};
</script>

