/* eslint-disable vue/attribute-hyphenation */

<template>
  <ve-map
    :data="data"
    :title="title"
    :settings="settings"
    :visual-map="visualMap"
    :toolbox="toolbox"
    :extend="extend"
    :legend-visible="false"
    :height="height"
    :width="width"
  ></ve-map>
</template>

<script>
import VeMap from "v-charts/lib/map.common"; // 引入v-echarts地图
import "echarts/lib/component/title"; // 引入标题
import "echarts/lib/component/toolbox"; // 引入工具箱
import "echarts/lib/component/visualMap"; // 引入视觉映射组件

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
    settings: {
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
      left: "center", // 位置
      text: "分县市投诉量", // 主标题
      subtext: "落单投诉" // 副标题
    };
    this.visualMap = {
      left: "left", // 水平位置
      top: "70%", // 垂直位置
      min: 5,
      max: 30,
      splitNumber: 5, // 区间分段数量
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
        label: {
          normal: {
            show: true,
            position: "inner", // 标签的位置
            // textStyle: {
            //   fontWeight: 300,
            //   fontSize: 16 // 文字的字体大小
            // },
            formatter: "{b}\n\n{c}起" // 设置显示格式，中间换行
          }
        }
      }
    };
    return {};
  },
  created() {
    this.getDataMax();
  },
  methods: {
    // 获取最大值
    getDataMax() {
      var data = this.data.rows;
      // console.log(data);
      var max = data[0].total;
      for (var i = 0; i < data.length - 1; i++) {
        max = max < data[i + 1].total ? data[i + 1].total : max;
      }
      // console.log(max);
      // 设置图例最大值
      max = Math.ceil(max / 10) * 10; // 向上取整
      // console.log(max);
      this.visualMap.max = max; // 设置图例最大值
    }
  }
};
</script>

