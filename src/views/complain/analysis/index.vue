
<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="filter">
          <YiFilter @filter="handleFilter" />
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="落单投诉">
            <el-row>
              <el-col :span="9" class="v-divider">
                <YiMapChart
                  :data="mapData"
                  :title="mapTitle"
                  :settings="mapSettings"
                  height="610px"
                  width="480px"
                />
              </el-col>
              <el-col :span="15">
                <YiPieChart
                  :data="pieData"
                  :title="pieTitle"
                  :settings="pieSettings"
                  height="300px"
                  width="420px"
                />
                <el-row>
                  <el-col :span="12" class="h-divider">
                    <YiHistogramChart
                      :data="histogramData"
                      :title="histogramTitle"
                      :settings="histogramSettings"
                      height="350px"
                      width="400px"
                    />
                  </el-col>
                  <el-col :span="12" class="h-divider"></el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="h-divider">
              <el-col :span="24">
                <YiLineChart :data="chartData" :loading="loading" width="1400px" />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="广义投诉">
            <YiLineChart
              :data="allMonthData"
              :title="allMonthTitle"
              :settings="allMonthLineSettings"
              data-zoom
              height="300px"
              width="800px"
            />
            <YiLineChart
              :data="allDateData"
              :title="allDateTitle"
              :settings="allDateLineSettings"
              data-zoom
              height="300px"
              width="800px"
            />
          </el-tab-pane>
          <el-tab-pane label="热点投诉"></el-tab-pane>

          <el-tab-pane label="报表输出"></el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import YiMapChart from "@/components/Yi-MapChart";
import YiLineChart from "@/components/Yi-LineChart";
import YiPieChart from "@/components/Yi-PieChart";
import YiHistogramChart from "@/components/Yi-HistogramChart"; // 柱状图
import YiFilter from "@/components/Yi-Filter"; // 柱状图

import "echarts/lib/component/title"; // 标题
import "echarts/lib/component/dataZoom"; // 设置区域缩放组件
import "echarts/lib/component/toolbox"; // 工具箱
import "v-charts/lib/style.css"; // 使用loading属性前先引入css
import { getDayData } from "@/api/chart.js";

export default {
  components: {
    YiLineChart,
    YiMapChart,
    YiPieChart,
    YiHistogramChart,
    YiFilter
  },
  data() {
    // 地图设置
    this.mapSettings = {
      positionJsonLink:
        "https://geo.datav.aliyun.com/areas_v2/bound/330800_full.json",
      position: "QZ",
      beforeRegisterMap(json) {
        // edit data here such as:
        // json.features[0].properties.cp = [121.509062, 26.044332]
        return json;
      },
      labelMap: {
        total: "投诉量"
      }
    };
    this.mapTitle = {
      text: "4月截止8日无线投诉量",
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
    this.pieSettings = {
      radius: 80 // 饼图大小
    };
    this.pieTitle = {
      left: "center",
      text: "4月截止8日无线投诉原因分类",
      subtext: "狭义落单投诉"
    };
    this.histogramSettings = {
      labelMap: {
        duration: "平均历时"
      }
    };
    this.histogramTitle = {
      left: "center",
      text: "无线投诉平均处理历时（小时）"
    };
    // 广义投诉月趋势
    this.allMonthLineSettings = {
      labelMap: {
        lastyear: "2019年",
        currentyear: "2020年"
      }
    };
    this.allMonthTitle = {
      left: "left",
      text: "2019年~2020年广义无线投诉月趋势"
    };
    // 广义投诉日趋势
    this.allDateTitle = {
      left: "left",
      text: "近90天广义无线投诉日趋势"
    };
    return {
      mapData: {
        columns: ["city", "total"],
        rows: [
          { city: "柯城区", total: 24 },
          { city: "衢江区", total: 17 },
          { city: "江山市", total: 21 },
          { city: "龙游县", total: 12 },
          { city: "常山县", total: 9 },
          { city: "开化县", total: 8 }
        ]
      },
      pieData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "弱覆盖", 访问用户: 56 },
          { 日期: "高负荷", 访问用户: 32 },
          { 日期: "现场测试正常", 访问用户: 13 },
          { 日期: "设备故障", 访问用户: 6 },
          { 日期: "隐性故障", 访问用户: 11 },
          { 日期: "干扰", 访问用户: 3 }
        ]
      },
      histogramData: {
        columns: ["city", "duration"],
        rows: [
          { city: "柯城区", duration: 12.1 },
          { city: "衢江区", duration: 13.2 },
          { city: "江山市", duration: 16.3 },
          { city: "龙游县", duration: 15.5 },
          { city: "常山县", duration: 12.2 },
          { city: "开化县", duration: 14.6 }
        ]
      },
      allMonthData: {
        columns: ["月份", "lastyear", "currentyear"],
        rows: [
          { 月份: "1月", lastyear: 2794, currentyear: 2238 },
          { 月份: "2月", lastyear: 2211, currentyear: 1847 },
          { 月份: "3月", lastyear: 2136, currentyear: 2327 },
          { 月份: "4月", lastyear: 2419, currentyear: 0 },
          { 月份: "5月", lastyear: 3017, currentyear: 0 },
          { 月份: "6月", lastyear: 3216, currentyear: 0 },
          { 月份: "7月", lastyear: 3474, currentyear: 0 },
          { 月份: "8月", lastyear: 3069, currentyear: 0 },
          { 月份: "9月", lastyear: 3393, currentyear: 0 },
          { 月份: "10月", lastyear: 3352, currentyear: 0 },
          { 月份: "11月", lastyear: 3085, currentyear: 0 },
          { 月份: "12月", lastyear: 2703, currentyear: 0 }
        ]
      },
      listQuery: {
        // 查询参数
        city: "衢州",
        // month: "",
        // year: "",
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
    this.getdate();
  },
  methods: {
    getdate() {
      // const end = new Date();
      // // const start = new Date();
      // const start = end.getFullYear() + "-0" + end.getMonth() + "-01"; // 拼接为当月第一天
      // // alert(start);
    },
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
    handleFilter(data) {
      // console.log(data);
      this.listQuery = data;
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
.filter {
  padding-bottom: 10px;
}
.v-divider {
  border-right: dashed 1px #dcdfe6;
}
.h-divider {
  margin-top: 5px;
  padding-top: 10px;
  border-top: dashed 1px #dcdfe6;
}
.chart-right {
  /* margin-left: 20px; */
  padding-left: 20px;
}
</style>
