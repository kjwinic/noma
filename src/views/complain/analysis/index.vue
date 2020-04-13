
<template>
  <div class="app">
    <el-container>
      <el-header class="top-step">
        <div class="filter">
          <el-date-picker
            v-model="select_date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :unlink-panels="true"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            align="right"
            @change="handleFilter"
          />
          <el-select
            v-model="listQuery.city"
            placeholder="县市"
            style="width: 90px"
            size="mini"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </el-header>
      <el-main>
        <ve-line
          :data="chartData"
          :data-zoom="dataZoom"
          :title="chartTitle"
          :settings="chartSettings"
          :mark-point="markPoint"
          :toolbox="toolbox"
          :loading="loading"
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
        <!-- <ve-map
          :data="mapData"
          :title="mapTitle"
          :settings="mapSettings"
          :extend="mapExtend"
          height="800px"
          width="600px"
        ></ve-map>-->
        <YiMapChart :data="mapData" :title="mapTitle" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import VeLine from "v-charts/lib/line.common"; // 折线图
import VeHistogram from "v-charts/lib/histogram.common"; // 柱状图
// import VeMap from "v-charts/lib/map.common"; // 地图
import YiMapChart from "@/components/Yi-MapChart";

import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱
import "v-charts/lib/style.css"; // 使用loading属性前先引入css
import { getDayData } from "@/api/chart.js";

export default {
  components: { VeLine, VeHistogram, YiMapChart },
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
    // 地图设置
    this.mapSettings = {
      positionJsonLink:
        "https://geo.datav.aliyun.com/areas_v2/bound/330800_full.json",
      position: "QZ",
      beforeRegisterMap(json) {
        // edit data here such as:
        // json.features[0].properties.cp = [121.509062, 26.044332]
        return json;
      }
    };
    this.mapTitle = {
      text: "分县市投诉量",
      subtext: "狭义落单投诉"
    };
    this.mapExtend = {
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
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "2020年至今",
            onClick(picker) {
              const start = new Date("2020-01-01 00:00:00"); // 转换为GMT格式
              const end = new Date();
              // alert(start + ";" + end);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "2019年至今",
            onClick(picker) {
              const start = new Date("2019-01-01 00:00:00");
              const end = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "2018年至今",
            onClick(picker) {
              const start = new Date("2018-01-01 00:00:00");
              const end = new Date();
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      select_date: "", // 查询的日期区间
      citys: ["衢州", "柯城", "衢江", "江山", "龙游", "常山", "开化"],
      mapData: {
        columns: ["位置", " 投诉量"],
        rows: [
          { 位置: "柯城区", " 投诉量": 24 },
          { 位置: "衢江区", " 投诉量": 17 },
          { 位置: "江山市", " 投诉量": 21 },
          { 位置: "龙游县", " 投诉量": 12 },
          { 位置: "常山县", " 投诉量": 9 },
          { 位置: "开化县", " 投诉量": 8 }
        ]
      },
      listQuery: {
        // 查询参数
        city: "衢州",
        month: "",
        year: "",
        start_date: "2019-06-01",
        end_date: "2019-08-30"
      },
      chartData: {}, // 图表数据
      loading: false
    };
  },
  created() {
    this.getDate();
    this.getDayChart();
  },
  methods: {
    // 查询日期初始化，近三个月
    getDate() {
      const end = new Date("2019-06-01 00:00:00");
      const start = new Date("2019-06-01 00:00:00");
      // 近三个月
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      this.listQuery.start_date = start
        .toLocaleDateString()
        .replace(/\//g, "-"); // 转换为"2020-03-13"格式
      this.listQuery.end_date = end.toLocaleDateString().replace(/\//g, "-");
    },
    // 条件过滤
    handleFilter() {
      // this.listQuery.start_date = this.select_date[0];
      // this.listQuery.end_date = this.select_date[1];
      this.getDayChart();
    },

    getDayChart() {
      this.loading = true;
      getDayData(this.listQuery)
        .then(res => {
          this.chartData = res.data;
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
    }
  }
};
</script>
<style scoped>
.app {
  padding-top: 40px;
}
</style>
