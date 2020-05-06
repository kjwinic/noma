
<template>
  <div class="app-container" style="overflow:auto">
    <el-container>
      <el-main>
        <div class="filter">
          <YiFilter @query="handleQuery" @filter="handleFilter" />
        </div>
        <el-tabs type="border-card" @tab-click="tabChange">
          <el-tab-pane label="落单投诉概况">
            <el-row :gutter="20">
              <el-col :span="9" class="v-divider">
                <YiMapChart
                  v-loading="loading"
                  element-loading-text="地图加载中"
                  :data="mapData"
                  :title="mapTitle"
                  :settings="mapSettings"
                  :visual-map="visualMap"
                  :extend="mapExtend"
                  height="610px"
                  width="480px"
                  @filter="handleFilter"
                />
              </el-col>
              <el-col :span="8" class="v-divider">
                <YiPieChart
                  v-loading="loading"
                  element-loading-text="数据加载中"
                  :data="pieData"
                  :title="pieTitle"
                  :settings="pieSettings"
                  height="300px"
                  width="420px"
                />
                <div class="top-padding h-divider">
                  <YiPieChart
                    v-loading="loading"
                    element-loading-text="数据加载中"
                    :data="pieData2"
                    :title="pieTitle2"
                    :settings="pieSettings"
                    height="300px"
                    width="420px"
                  />
                </div>
              </el-col>
              <el-col :span="7">
                <YiHistogramChart
                  :data="histogramData"
                  :title="histogramTitle"
                  :settings="histogramSettings"
                  height="300px"
                  width="400px"
                />
                <div class="top-padding h-divider">
                  <YiHistogramChart
                    :data="histogramData"
                    :title="histogramTitle"
                    :settings="histogramSettings"
                    height="300px"
                    width="400px"
                  />
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="落单投诉趋势">
            <el-row :gutter="20">
              <el-col :span="12" class="v-divider">
                <YiLineChart
                  :data="chartData"
                  :extend="lineExtend"
                  :loading="loading"
                  width="700px"
                />
              </el-col>
              <el-col :span="12">
                <YiLineChart
                  :data="chartData"
                  :extend="lineExtend"
                  :loading="loading"
                  width="700px"
                />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="热点投诉">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>重复用户{{ timeInterval }}</span>
                    <el-button style="width:60px;float: right; padding: 3px 0" type="text" @click="handleDownload_repeat">下载表格</el-button>
                  </div>
                  <el-table
                    v-loading="hotLoading"
                    align="center"
                    :data="hotData.list1"
                    style="width:100%;height:550px;font-size:12px"
                    element-loading-text="加载中"
                    max-height="600"
                  >
                    <el-table-column prop="user_tel" label="用户号码" align="center" width="100px" />
                    <el-table-column prop="count" label="投诉次数" align="center" width="80px" />
                    <el-table-column prop="city" label="县市" align="center" width="60px" />
                    <el-table-column
                      prop="area"
                      label="投诉地点"
                      align="center"
                      width="100px"
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column
                      prop="cp_type"
                      label="最近投诉原因"
                      align="center"
                      width="100px"
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column
                      prop="solve_plan"
                      label="解决方案"
                      width="100px"
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column prop="cp_date" label="最近投诉时间" align="center" width="100px" />
                    <el-table-column
                      prop="is_solved"
                      label="是否解决"
                      align="center"
                      width="80px"
                      :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' }]"
                      :filter-method="filterTag"
                      filter-placement="bottom-end"
                    >
                      <template slot-scope="scope">
                        <el-tag
                          :type="scope.row.is_solved === '否' ? 'danger' : 'success'"
                          disable-transitions
                        >{{ scope.row.is_solved }}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>热点区域{{ timeInterval }}</span>
                    <el-button style="width:60px;float: right; padding: 3px 0" type="text">下载表格</el-button>
                  </div>
                  <el-table
                    v-loading="hotLoading"
                    align="center"
                    :data="hotData.list2"
                    style="width:100%;height:550px;font-size:12px"
                    element-loading-text="加载中"
                    max-height="600"
                  >
                    <el-table-column prop="city" label="县市" align="center" />
                    <el-table-column prop="area" label="投诉区域" :show-overflow-tooltip="true" />
                    <el-table-column prop="count" label="投诉次数" align="center" />
                    <el-table-column prop="user_count" label="关联用户数" align="center" />
                    <el-table-column prop="cp_type" label="投诉原因" :show-overflow-tooltip="true" />
                    <el-table-column prop="solve_plan" label="解决方案" :show-overflow-tooltip="true" />
                    <el-table-column prop="cp_date" label="最近投诉时间" align="center" width="100px" />
                    <el-table-column
                      prop="is_solved"
                      label="是否解决"
                      align="center"
                      width="80px"
                      :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' }]"
                      :filter-method="filterTag"
                      filter-placement="bottom-end"
                    >
                      <template slot-scope="scope">
                        <el-tag
                          :type="scope.row.is_solved === '否' ? 'danger' : 'success'"
                          disable-transitions
                        >{{ scope.row.is_solved }}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane v-loading="tableLoading" label="报表输出" element-loading-text="加载中">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>分县市投诉量{{ timeInterval }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="handleDownload">下载表格</el-button>
                  </div>
                  <el-table
                    :data="allData.list1"
                    align="center"
                    style="width:100%;height:450px;font-size:12px"
                  >
                    <el-table-column prop="city" label="县市" width="50px" />
                    <el-table-column prop="total" label="投诉数量" align="center" width="70px" />
                    <el-table-column
                      prop="zhanbi"
                      label="投诉量占比"
                      :formatter="stateFormat"
                      align="center"
                      width="80px"
                    />
                    <el-table-column prop="citynum" label="城区投诉量" align="center" width="80px" />
                    <el-table-column
                      prop="cityzhanbi"
                      label="城区投诉占比"
                      :formatter="stateFormat"
                      align="center"
                      width="100px"
                    />
                    <el-table-column prop="countrynum" label="农村投诉量" align="center" width="80px" />
                    <el-table-column
                      prop="countryzhanbi"
                      label="农村投诉占比"
                      :formatter="stateFormat"
                      align="center"
                      width="100px"
                    />
                    <el-table-column prop="jiejuenum" label="已解决数量" align="center" width="80px" />
                    <el-table-column
                      prop="jiejuelv"
                      label="解决率"
                      :formatter="stateFormat"
                      align="center"
                      width="70px"
                    />
                  </el-table>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>投诉原因分类{{ timeInterval }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">下载表格</el-button>
                  </div>
                  <el-table
                    :data="allData.list2"
                    style="width:100%;height:450px;font-size:12px"
                    max-height="450"
                  >
                    <el-table-column prop="classify" label="原因分类" />
                    <el-table-column prop="total" label="投诉量" />
                    <el-table-column prop="zhanbi" sortable label="占比" :formatter="stateFormat" />
                    <el-table-column prop="kecheng" :formatter="stateFormat" label="柯城" />
                    <el-table-column prop="qujiang" :formatter="stateFormat" label="衢江" />
                    <el-table-column prop="jiangshan" :formatter="stateFormat" label="江山" />
                    <el-table-column prop="longyou" :formatter="stateFormat" label="龙游" />
                    <el-table-column prop="chanshan" :formatter="stateFormat" label="常山" />
                    <el-table-column prop="kaihua" :formatter="stateFormat" label="开化" />
                    <el-table-column prop="jiejuelv" label="解决率" sortable :formatter="stateFormat" />
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>投诉场景分类{{ timeInterval }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">下载表格</el-button>
                  </div>
                  <el-table
                    :data="allData.list3"
                    style="width:100%;font-size:12px"
                    max-height="450"
                  >
                    <el-table-column prop="classify" label="投诉场景" />
                    <el-table-column prop="total" label="投诉量" />
                    <el-table-column prop="zhanbi" sortable label="占比" :formatter="stateFormat" />
                    <el-table-column prop="kecheng" :formatter="stateFormat" label="柯城" />
                    <el-table-column prop="qujiang" :formatter="stateFormat" label="衢江" />
                    <el-table-column prop="jiangshan" :formatter="stateFormat" label="江山" />
                    <el-table-column prop="longyou" :formatter="stateFormat" label="龙游" />
                    <el-table-column prop="chanshan" label="常山" :formatter="stateFormat" />
                    <el-table-column prop="kaihua" :formatter="stateFormat" label="开化" />
                    <el-table-column prop="jiejuelv" label="解决率" sortable :formatter="stateFormat" />
                  </el-table>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>弱覆盖解决情况{{ timeInterval }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">下载表格</el-button>
                  </div>
                  <div v-for="o in 4" :key="o" class="text item">{{ '列表内容 ' + o }}</div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
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
import { getDayData, getAllData, getHotData } from "@/api/complain-chart.js";
import { formatDate } from "@/utils/getDate.js";
import { parseTime } from "@/utils";

export default {
  name: "ComplainWorkorder",
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
      positionJsonLink: "http://localhost:9528/static/quzhou.json",
      // "https://geo.datav.aliyun.com/areas_v2/bound/330800_full.json",
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
      text: "分县市无线投诉量",
      subtext: "狭义落单投诉"
    };
    this.mapExtend = {
      series: {
        nameMap: {
          柯城区: "柯城",
          衢江区: "衢江",
          常山县: "常山",
          江山市: "江山",
          开化县: "开化",
          龙游县: "龙游"
        },
        label: {
          normal: {
            show: true,
            position: "inner", // 标签的位置
            formatter: "{b}\n\n{c}起" // 设置显示格式，中间换行
          }
        }
      }
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
    this.pieSettings = {
      radius: 80, // 饼图大小
      limitShowNum: 5
    };
    this.pieTitle = {
      left: "left",
      text: "全市无线投诉原因分类",
      subtext: "狭义落单投诉"
    };
    this.pieTitle2 = {
      left: "left",
      text: "全市无线投诉场景分类",
      subtext: "狭义落单投诉"
    };
    this.histogramSettings = {
      labelMap: {
        duration: "平均历时（小时)",
        overtime: "超时24小时工单（单）"
      },
      showLine: ["duration"]
    };
    this.histogramTitle = {
      left: "center",
      text: "无线投诉现场处理平均历时"
    };
    this.lineExtend = {
      // 图例显示位置
      legend: {
        // bottom: "20"
        top: "30",
        right: "50"
      },
      // 去除分隔线
      // https://www.echartsjs.com/zh/option.html#xAxis.splitLine
      yAxis: {
        splitLine: { show: false }
      }
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
          { city: "柯城", total: 34 },
          { city: "衢江", total: 17 },
          { city: "江山", total: 21 },
          { city: "龙游", total: 12 },
          { city: "常山", total: 9 },
          { city: "开化", total: 8 }
        ]
      },
      pieData: {
        columns: ["classify", "total"],
        rows: [
          { classify: "弱覆盖", total: 56 },
          { classify: "高负荷", total: 32 },
          { classify: "现场测试正常", total: 13 },
          { classify: "设备故障", total: 6 },
          { classify: "隐性故障", total: 11 },
          { classify: "干扰", total: 3 }
        ]
      },
      pieData2: { columns: ["classify", "total"], rows: [] },
      histogramData: {
        columns: ["city", "duration", "overtime"],
        rows: [
          { city: "柯城区", duration: 12.1, overtime: 0 },
          { city: "衢江区", duration: 13.2, overtime: 2 },
          { city: "江山市", duration: 16.3, overtime: 1 },
          { city: "龙游县", duration: 15.5, overtime: 0 },
          { city: "常山县", duration: 12.2, overtime: 0 },
          { city: "开化县", duration: 14.6, overtime: 2 }
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
        start_date: "2020-01-01",
        end_date: "2020-03-30"
      },
      timeInterval: "", // 数据时间区间
      chartData: {}, // 图表数据
      loading: false,
      allData: {},
      tableLoading: false,
      hotData: {}, // 热点投诉
      hotLoading: false,
      downloadLoading: false
    };
  },
  created() {
    this.getDate();
    this.timeInterval =
      "（" + this.listQuery.start_date + " ~ " + this.listQuery.end_date + "）";
    this.getChartData();

    // this.getDayChart();
    // this.getdate();
  },
  methods: {
    // 表格筛选
    filterTag(value, row) {
      return row.is_solved === value;
    },
    getDate() {
      const end = new Date();
      // const start = new Date();
      var start = new Date(end.getFullYear(), end.getMonth(), 1); // 构造当月第一天
      this.listQuery.start_date = formatDate(start);
      this.listQuery.end_date = formatDate(end);
    },
    // 查询日期初始化，近三个月
    // getDate() {
    //   const end = new Date();
    //   const start = new Date();
    //   // 近三个月
    //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    //   this.listQuery.start_date = start
    //     .toLocaleDateString()
    //     .replace(/\//g, "-"); // 转换为"2020-03-13"格式
    //   this.listQuery.end_date = end.toLocaleDateString().replace(/\//g, "-");
    // },
    // 数据库查询
    handleQuery(data) {
      // console.log(data);
      this.listQuery = data;
      this.getDayChart();
      this.getChartData();
      // this.initChart();
    },
    // 条件过滤
    handleFilter(data) {
      // alert(data);
      // 无线投诉原因分类，按照县市条件过滤
      switch (data) {
        case "衢州":
          this.pieData.columns = ["classify", "total"];
          this.pieTitle.text = "全市无线投诉原因分类";
          this.pieData2.columns = ["classify", "total"];
          this.pieTitle2.text = "全市无线投诉场景分类";
          break;
        case "柯城":
          this.pieData.columns = ["classify", "kc"];
          this.pieTitle.text = "无线投诉原因分类（柯城）";
          this.pieData2.columns = ["classify", "kc"];
          this.pieTitle2.text = "无线投诉场景分类（柯城）";
          break;
        case "衢江":
          this.pieData.columns = ["classify", "qj"];
          this.pieTitle.text = "无线投诉原因分类（衢江）";
          this.pieData2.columns = ["classify", "qj"];
          this.pieTitle2.text = "无线投诉场景分类（衢江）";
          break;
        case "江山":
          this.pieData.columns = ["classify", "js"];
          this.pieTitle.text = "无线投诉原因分类（江山）";
          this.pieData2.columns = ["classify", "js"];
          this.pieTitle2.text = "无线投诉场景分类（江山）";
          break;
        case "龙游":
          this.pieData.columns = ["classify", "ly"];
          this.pieTitle.text = "无线投诉原因分类（龙游）";
          this.pieData2.columns = ["classify", "ly"];
          this.pieTitle2.text = "无线投诉场景分类（龙游）";
          break;
        case "常山":
          this.pieData.columns = ["classify", "cs"];
          this.pieTitle.text = "无线投诉原因分类（常山）";
          this.pieData2.columns = ["classify", "cs"];
          this.pieTitle2.text = "无线投诉场景分类（常山）";
          break;
        case "开化":
          this.pieData.columns = ["classify", "kh"];
          this.pieTitle.text = "无线投诉原因分类（开化）";
          this.pieData2.columns = ["classify", "kh"];
          this.pieTitle2.text = "无线投诉场景分类（开化）";
          break;
      }
      // 无线投诉场景分类，按照县市条件过滤
    },
    // 获取地图图例最大最小值
    getDataMaxmin() {
      var data = this.mapData.rows;
      // console.log(data);
      var max = data[0].total;
      var min = data[0].total;
      for (var i = 0; i < data.length - 3; i++) {
        max = max < data[i + 1].total ? data[i + 1].total : max;
        min = min > data[i + 1].total ? data[i + 1].total : min;
      }
      // console.log(max);
      max = Math.ceil(max / 10) * 10; // 向上取整
      min = Math.floor(min / 10) * 10; // 向下取整
      // console.log(max);
      this.visualMap.max = max; // 设置图例最大值
      this.visualMap.min = min; // 设置图例最小值
    },
    initChart() {
      // 图标标题时间区间
      this.timeInterval =
        "（" +
        this.listQuery.start_date +
        " ~ " +
        this.listQuery.end_date +
        "）";
      this.mapTitle.subtext = this.timeInterval;
      this.getDataMaxmin(); // 设置图例区间
      // 饼图
      this.pieTitle.subtext = this.timeInterval;
      this.pieTitle2.subtext = this.timeInterval;
      this.$notify({
        title: "提醒",
        message: "查询成功",
        type: "success",
        duration: 2000
      });
    },
    // 切换tab页
    tabChange(e) {
      // alert(e.index);
      switch (e.index) {
        case "0":
          // this.getSites();
          break;
        case "1":
          this.getDayChart();
          break;
        case "2":
          this.getHotComplain();
          break;
        case "3":
          // this.getTable();
          break;
      }
    },
    getHotComplain() {
      this.hotLoading = true;
      getHotData(this.listQuery)
        .then(res => {
          console.log(res);
          this.hotData = res;
          this.hotLoading = false;
        })
        .catch(res => {
          this.hotLoading = false;
        });
    },
    getChartData() {
      this.loading = true;
      getAllData(this.listQuery)
        .then(res => {
          console.log(res);
          this.allData = res;
          this.mapData.rows = res.list1;
          this.pieData.rows = res.list2;
          this.pieData2.rows = res.list3;
          // console.log(res.list2);
          this.initChart();
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 格式化表格
    stateFormat(row, column) {
      if (row[column.property] !== "/") {
        var string = String(row[column.property] * 100).substr(0, 5) + "%";
        return string;
      } else {
        return "/";
      }
    },
    headerStyle({ row, column, rowIndex, columnIndex }) {
      return "table-header";
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
    },

    // 批量导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "县市",
          "投诉数量",
          "投诉量占比",
          "城区投诉量",
          "城区投诉占比",
          "农村投诉量",
          "农村投诉占比",
          "已解决数量",
          "解决率"
        ];
        const filterVal = [
          "city",
          "total",
          "zhanbi",
          "citynum",
          "cityzhanbi",
          "countrynum",
          "countryzhanbi",
          "jiejuenum",
          "jiejuelv"
        ];
        const list = this.allData.list1;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "无线分县市投诉量" + this.timeInterval,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    handleDownload_repeat() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "用户号码",
          "投诉次数",
          "县市",
          "投诉地点",
          "最近投诉原因",
          "解决方案",
          "最近投诉时间",
          "是否解决"
        ];
        const filterVal = [
          "user_tel",
          "count",
          "city",
          "area",
          "cp_type",
          "solve_plan",
          "cp_date",
          "is_solved"
        ];
        const list = this.hotData.list1;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "重复用户清单" + this.timeInterval,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style>
.top-padding {
  margin-top: 20px;
}
.bg {
  background-color: rgb(240, 242, 245);
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
.el-card__header {
  background: #0257b9;
  color: white;
}
/* .headerStyle {
  background-color: #1989fa !important;
  color: #fff;
  font-weight: 400;
} */
</style>
