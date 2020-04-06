<template>
  <div class="app-container">
    <el-container>
      <el-header class="top-step">
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="方案制定"></el-step>
          <el-step title="方案立项"></el-step>
          <el-step title="方案实施"></el-step>
          <el-step title="投诉闭环"></el-step>
        </el-steps>
      </el-header>
      <!-- 条件过滤部分 -->
      <el-main>
        <div class="filter">
          <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
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
            clearable
            style="width: 90px"
            size="mini"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select
            v-model="listQuery.is_solved"
            placeholder="是否解决"
            clearable
            style="width: 100px"
            size="mini"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select
            v-model="listQuery.is_overtime"
            placeholder="是否超期"
            clearable
            style="width: 100px"
            size="mini"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
          </el-select>
          <el-input
            v-model="keyword"
            prefix-icon="el-icon-search"
            placeholder="搜索方案名称或者投诉区域"
            style="width: 230px;"
            size="mini"
            class="filter-item"
            clearable="true"
            @keyup.enter.native="handleFilter"
            @change="handleFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleFilter"
          >搜索</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-refresh-right"
            @click="handleClear"
          >清空筛选</el-button>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-download"
            @click="handleDownload"
          >批量导出</el-button>
        </div>
        <!-- 表格部分 -->
        <div class="table">
          <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            :row-class-name="tableRowClassName"
            max-height="500"
            @row-dblclick="showProcess"
          >
            <!-- <el-table-column label="序号" align="center" width="80">
              <template slot-scope="{row}">{{ row.plan_id }}</template>
            </el-table-column>-->
            <el-table-column fixed label="县市" width="80" align="center">
              <template slot-scope="{row}">{{ row.city }}</template>
            </el-table-column>
            <el-table-column label="方案名称" width="150" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.plan_name }}</template>
            </el-table-column>
            <el-table-column
              fixed
              label="投诉区域"
              width="100"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">{{ row.address }}</template>
            </el-table-column>
            <el-table-column fixed label="投诉次数" width="80" align="center">
              <template slot-scope="{row}">{{ row.count }}</template>
            </el-table-column>
            <el-table-column label="录入时间" width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.plan_record_date }}</template>
            </el-table-column>
            <el-table-column
              label="确认方案时间"
              width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">{{ row.plan_confirm_date }}</template>
            </el-table-column>
            <el-table-column label="规划编号" width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.plan_no }}</template>
            </el-table-column>
            <el-table-column label="所属规模" width="110" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.project }}</template>
            </el-table-column>
            <el-table-column label="拍照站名" width="110" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.site_name }}</template>
            </el-table-column>
            <el-table-column label="站点类型" width="50" align="center">
              <template slot-scope="{row}">{{ row.site_type }}</template>
            </el-table-column>
            <el-table-column label="设备来源" width="50" align="center" :show-overflow-tooltip="true">
              <template slot-scope="{row}">{{ row.equipment_from }}</template>
            </el-table-column>
            <el-table-column label="建设单位" width="50" align="center">
              <template slot-scope="{row}">{{ row.contractor }}</template>
            </el-table-column>
            <el-table-column label="方案类型" width="50" align="center">
              <template slot-scope="{row}">{{ row.site_type }}</template>
            </el-table-column>
            <el-table-column label="网络类型" width="80" align="center">
              <template slot-scope="{row}">{{ row.net_type }}</template>
            </el-table-column>
            <el-table-column
              label="提交工程时间"
              width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">{{ row.submit_date }}</template>
            </el-table-column>
            <el-table-column label="方案时限" width="50" align="center">
              <template slot-scope="{row}">{{ row.plan_limit }}</template>
            </el-table-column>
            <el-table-column
              label="计划开通时间"
              width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">{{ row.plan_done_date }}</template>
            </el-table-column>
            <el-table-column fixed label="当前环节" width="80" align="center">
              <template slot-scope="{row}">{{ row.current_process }}</template>
            </el-table-column>
            <el-table-column
              fixed
              label="当前进度详情"
              width="150"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">{{ row.process_detail }}</template>
            </el-table-column>
            <el-table-column label="实际开通时间" width="120" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-date-picker
                    v-model="row.finish_date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    size="small"
                  ></el-date-picker>
                </template>
                <span v-else>{{ row.finish_date }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed label="截至当前历时" width="80" align="center">
              <template slot-scope="{row}">{{ row.current_duration }}天</template>
            </el-table-column>
            <el-table-column label="是否超期" width="50" align="center">
              <template slot-scope="{row}">{{ row.is_overtime }}</template>
            </el-table-column>
            <el-table-column label="超期天数" width="80" align="center">
              <template slot-scope="{row}">{{ row.overtime_days }}天</template>
            </el-table-column>
            <el-table-column label="是否解决" width="80" align="center" class-name="status-col">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-select v-model="row.is_solved" size="mini" class="filter-item">
                    <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
                <span v-else>
                  <el-tag :type="row.is_solved | statusFilter">{{ row.is_solved }}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="责任人" width="100" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-input v-model="row.duty_user" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.duty_user }}</span>
              </template>
            </el-table-column>
            <el-table-column label="记录更新人" width="100" align="center">
              <template slot-scope="{row}">{{ row.update_user }}</template>
            </el-table-column>
            <el-table-column label="更新时间" width="110" align="center">
              <template slot-scope="{row}">{{ row.update_time }}</template>
            </el-table-column>
            <el-table-column label="备注" width="200" align="center">
              <template slot-scope="{row}">
                <template v-if="row.edit">
                  <el-input
                    v-model="row.remark"
                    type="textarea"
                    autosize
                    class="edit-input"
                    size="normal"
                  />
                </template>
                <span v-else>{{ row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed="right">
              <template slot-scope="{row}">
                <el-button
                  v-if="row.edit"
                  type="success"
                  size="mini"
                  icon="el-icon-check"
                  @click="confirmEdit(row)"
                >确认</el-button>
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="edit(row)"
                >编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-phone">提醒</el-button>
              </template>
            </el-table-column>
            <el-table-column
              class-name="status-col"
              label="进度跟踪"
              width="50"
              align="center"
              fixed="right"
            >
              <template slot-scope="{row}">
                <el-popover
                  placement="left-start"
                  :title="row.plan_name"
                  width="500"
                  trigger="click"
                >
                  <el-timeline>
                    <el-timeline-item
                      v-for="(item, index) in trackingData"
                      :key="index"
                      :color="item.color"
                      :timestamp="item.timestamp"
                      placement="top"
                    >
                      <el-card>
                        <span class="pop-user">{{ item.user }}</span>
                        更新进度： {{ item.content }}预计完成时间：{{ item.date }}，责任人：{{ item.user }}
                      </el-card>
                    </el-timeline-item>
                    <span v-if="!trackingTotal">暂无跟踪信息</span>
                    <el-pagination
                      v-show="trackingTotal>0"
                      small
                      layout="prev, pager, next"
                      :total="trackingTotal"
                      :current-page.sync="trackingQuery.page"
                      :page-size.sync="trackingQuery.limit"
                      @current-change="handleCurrentChange"
                    />
                  </el-timeline>
                  <el-button
                    slot="reference"
                    type="warning"
                    icon="el-icon-view"
                    size="mini"
                    circle
                    @click="getPlanTracking(row)"
                  ></el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getComplainPlanList"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getComplainPlan,
  updateComplainPlan,
  getComplainPlanTracking
} from "@/api/complain.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Plan",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        是: "success",
        否: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      active: 0,
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
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      select_date: "", // 查询的日期区间
      tableData: [], // 接收表格数据
      listLoading: true,
      total: 0, // 数据总数量
      keyword: "", // 搜索关键字
      fileList: [], // excel文件
      listQuery: {
        page: 1,
        limit: 10, // 每页显示数量
        city: "",
        plan_name: "",
        address: "",
        is_solved: "否",
        is_overtime: "",
        start_date: "",
        end_date: ""
      },
      citys: ["柯城", "衢江", "江山", "龙游", "常山", "开化"],
      net_type: ["4G", "2G+4G", "2G"],
      yes_or_no: ["是", "否"],
      temp: {
        cp_no: "",
        city: ""
      }, // 更新数据临时存储
      textMap: {
        update: "投诉详单更新",
        create: "创建投诉详单"
      },
      dialogFormVisible: false, // 控制对话框是否显示
      dialogStatus: "", // 设置对话框是update还是create
      // demo_download: "static/complain.xlsx", // 导入模板地址
      trackingQuery: {
        // 方案流程跟踪查询参数
        page: 1,
        limit: 3, // 每页显示数量
        plan_id: ""
      },
      rowDate: "",
      trackingTotal: 0,
      trackingData: [
        {
          content: "详情",
          timestamp: "2020-04-06 21:47:19",
          color: "#0bbd87",
          user: "张三"
        }
      ]
    };
  },
  mounted() {
    this.tableRowClassName();
  },
  created() {
    this.getComplainPlanList();
  },
  methods: {
    // 获取用户投诉解决方案详单
    // getComplainPlanList() {
    //   this.listLoading = true;
    //   getComplainPlan(this.listQuery).then(response => {
    //     console.log(response.total);
    //     this.tableData = response.data;
    //     this.total = response.total;
    //     this.listLoading = false;
    //   });
    // },
    getComplainPlanList() {
      this.listLoading = true;
      getComplainPlan(this.listQuery).then(response => {
        // console.log(response.data);
        const items = response.data;
        this.tableData = items.map(v => {
          this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
          // v.original = v.remarks; //  will be used when user click the cancel botton
          return v;
        });
        this.total = response.total;
        this.listLoading = false;
      });
    },
    // 条件过滤
    handleFilter() {
      this.listQuery.page = 1;
      this.listQuery.plan_name = this.keyword; // 用户号码搜索
      this.listQuery.address = this.keyword; // 投诉地点搜索
      this.listQuery.start_date = this.select_date[0];
      this.listQuery.end_date = this.select_date[1];
      this.getComplainPlanList();
    },
    // 清空条件过滤
    handleClear() {
      this.select_date = "";
      this.listQuery.city = "";
      this.listQuery.is_solved = "";
      this.listQuery.is_overtime = "";
      this.listQuery.plan_name = "";
      this.listQuery.address = "";
      this.listQuery.start_date = "";
      this.listQuery.end_date = "";
      this.getComplainPlanList();
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    next() {
      // if (this.active++ > 2) this.active = 0;
      if (this.active < 5) {
        this.active = this.active + 1;
      }
    },
    edit(row) {
      // row.title = row.originalTitle;
      row.edit = true;
      // alert(row.plan_id);
      this.$message({
        message: "开启编辑",
        type: "warning"
      });
    },
    // 确认更新
    confirmEdit(row) {
      row.edit = false;
      // row.originalTitle = row.title;
      const data = { remark: row.remark, update_user: "管理员" };
      updateComplainPlan(row.plan_id, data)
        .then(res => {
          // console.log(res);
          this.$notify({
            title: "提示",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(res => {
          this.$notify({
            title: "提醒",
            message: "更新失败",
            type: "error",
            duration: 2000
          });
        });
    },
    // 查看方案跟踪流程
    getPlanTracking(row) {
      // alert(row.plan_name + "流程跟踪");
      this.rowData = row;
      this.trackingData = [];
      this.trackingQuery.plan_id = row.plan_id;
      getComplainPlanTracking(this.trackingQuery).then(response => {
        // console.log(response.data);
        var data = response.data;
        var len = data.length;
        for (var i = 0; i < len; i++) {
          this.trackingData.push({
            content: data[i].tracking_info,
            timestamp: data[i].update_time,
            user: data[i].update_user,
            date: data[i].expected_time
          });
        }
        this.trackingTotal = response.total;
        this.trackingData[0].color = "#0bbd87"; // 最新的进度绿色图标
        // this.$set(this.trackingData[i], "color", "#0bbd87");
      });
    },
    handleCurrentChange(val) {
      // alert(`当前页: ${val}`);
      this.$forceUpdate();
      this.trackingQuery.page = val;
      this.getComplainPlanTracking(this.rowData);
    },
    // 双击某一行，同步呈现进度步骤条
    showProcess(e) {
      // alert(row.plan_name);
      alert(e.current_process);
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
.top-step {
  margin-top: 20px;
  padding: 10px;
  min-height: 80px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.step {
  margin: 0px 20px;
}
.filter {
  padding-top: 5px;
  align-content: center;
}
.table {
  padding-top: 10px;
}
.el-table .warning-row {
  background: #f56c6c;
}

.el-table .success-row {
  background: #f0f9eb;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.pagination-container {
  padding: 16px;
  float: right;
}
.edit-input {
  padding-right: 0px;
}
.el-main {
  padding: 10px;
}
.pop-user {
  /* font-weight: bold; */
  color: #409eff;
}
.el-timeline {
  padding: 0px 10px;
}
</style>

