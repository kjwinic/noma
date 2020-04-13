/* eslint-disable vue/attribute-hyphenation */

<template>
  <div class="app">
    <ve-map
      :data="data"
      :title="title"
      :settings="settings"
      :visualMap="visualMap"
      :toolbox="toolbox"
      :extend="extend"
      :height="height"
      :width="width"
    ></ve-map>
  </div>
</template>

<script>
import VeMap from "v-charts/lib/map.common"; // 引入v-echarts地图
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱
import "echarts/lib/component/visualMap"; // 视觉映射组件

import "v-charts/lib/style.css"; // 使用loading属性前先引入css

export default {
  name: "YiMapChart",
  components: { VeMap },
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
    height: {
      type: String,
      default: "800px"
    },
    width: {
      type: String,
      default: "600px"
    }
  },
  data() {
    // 数据来源https://datav.aliyun.com/tools/atlas/#&lat=31.840232667909365&lng=104.2822265625&zoom=4
    this.settings = {
      positionJsonLink:
        "https://geo.datav.aliyun.com/areas_v2/bound/330800_full.json",
      position: "QZ",
      beforeRegisterMap(json) {
        // edit data here such as:
        // json.features[0].properties.cp = [121.509062, 26.044332]
        return json;
      }
    };
    // 标题
    this.title = {
      text: "分县市投诉量",
      subtext: "落单投诉"
    };
    this.visualMap = {
      min: 5,
      max: 30,
      splitNumber: 5,
      color: ["orangered", "yellow", "lightskyblue"],
      textStyle: {
        color: "#333"
      }
    };
    // 工具箱配置
    this.toolbox = {
      show: true,
      orient: "vertical",
      left: "right",
      top: "top",
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    };
    this.extend = {
      series: {
        nameMap: {
          kechengqu: "柯城",
          qujiangqu: "衢江",
          changshanxian: "常山",
          jiangshanshi: "江山",
          kaihuaxian: "开化",
          longyouxian: "龙游"
        }
      }
    };
    return {};
  },
  created() {},
  methods: {}
};
</script>

