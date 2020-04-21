
<template>
  <div>
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
      @change="handleQuery"
    />
    <el-select
      v-model="listQuery.city"
      placeholder="县市"
      :clearable="true"
      style="width: 90px"
      size="mini"
      class="filter-item"
      @change="handleFilter"
      @clear="clearFilter"
    >
      <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
    </el-select>
  </div>
</template>

<script>
import { getLastMonthStartDate, getLastMonthEndDate } from "@/utils/getDate.js";

export default {
  name: "YiFilter",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "当月",
            onClick(picker) {
              const end = new Date();
              // const start = new Date();
              const start = new Date(end.getFullYear(), end.getMonth(), 1); // 构造当月第一天
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上月",
            onClick(picker) {
              const start = getLastMonthStartDate();
              const end = getLastMonthEndDate();
              // const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              // alert(start + ";" + end);
              picker.$emit("pick", [start, end]);
            }
          },
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
      listQuery: {
        // 查询参数
        city: "衢州",
        // month: "",
        // year: "",
        start_date: "2019-06-01",
        end_date: "2019-08-30"
      }
    };
  },
  created() {},
  methods: {
    // 查询数据库
    handleQuery() {
      if (this.select_date) {
        this.listQuery.start_date = this.select_date[0];
        this.listQuery.end_date = this.select_date[1];
      }
      // 查询参数传递至父组件
      this.$emit("query", this.listQuery);
    },
    // 条件过滤
    handleFilter() {
      var city = this.listQuery.city;
      // 查询参数传递至父组件
      this.$emit("filter", city);
    },
    // 清除过滤
    clearFilter() {
      this.$emit("filter", "衢州");
    }
  }
};
</script>

