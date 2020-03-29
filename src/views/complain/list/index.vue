<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="select_date"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        unlink-panels="true"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleFilter"
      >
      </el-date-picker>
      <el-select v-model="listQuery.city" placeholder="县市" clearable style="width: 90px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.is_solved" placeholder="是否解决" clearable style="width: 100px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.is_overtime" placeholder="是否超期" clearable style="width: 100px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="搜索用户号码/投诉地点" style="width: 230px;" class="filter-item" @keyup.enter.native="handleFilter" clearable="true" @change="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh-right" @click="handleClear">
        清空筛选
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        批量导出
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleUpload">
        批量导入
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      height="630"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          {{ scope.row.cp_id }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="流水号" width="80" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.cp_no }}
        </template>
      </el-table-column> -->
      <el-table-column label="投诉日期" width="130" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.cp_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="县市" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="乡镇/街道" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.town }}
        </template>
      </el-table-column>
      <el-table-column label="投诉地点" width="100" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="用户号码" width="130" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.user_tel }}
        </template>
      </el-table-column>
      <el-table-column label="投诉内容" width="200" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.cp_info }}
        </template>
      </el-table-column>
      <el-table-column label="处理过程" width="200" align="center" height="50" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.deal_info }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="原因分类" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.cp_type }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="当前进度" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.plan_progres }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否解决" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_solved | statusFilter">{{ scope.row.is_solved }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.cp_id, scope.row)"
          >
            删除 </el-button> -->
          <el-button
            size="mini"
            type="success"
            @click="handleUpdate(scope.row)"
          >
            更新 </el-button>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="地图查看" width="80" align="center">
        <i class="el-icon-view" />
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getComplainList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center width="60%" top="5vh" :before-close="cancelUpdate">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 800px; margin-left:50px;" size="mini">
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="流水号">
              <el-input v-model="temp.cp_no" disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
              <el-form-item label="投诉时间">
              <el-input v-model="temp.cp_time" disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
              <el-form-item label="投诉日期">
              <el-input v-model="temp.cp_date" disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="县市" prop="type">
              <el-select v-model="temp.city" class="filter-item" placeholder="Please select">
                <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="用户号码">
              <el-input v-model="temp.user_tel" disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="用户星级">
              <el-input v-model="temp.user_star"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="终端型号">
              <el-input v-model="temp.phone_type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="投诉区域" prop="type">
              <el-select v-model="temp.area" class="filter-item" placeholder="Please select">
                <el-option v-for="item in area" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="区域类型">
              <el-select v-model="temp.area_type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in area_type" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="6" :sm="25" :md="50" :lg="50" :xl="80">
            <el-form-item label="投诉内容">
              <el-input v-model="temp.cp_info"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="6" :sm="25" :md="60" :lg="90" :xl="120">
            <el-form-item label="处理过程">
              <el-input v-model="temp.deal_info" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="经度" prop="type">
              <el-input v-model="temp.lng"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="纬度" prop="type">
              <el-input v-model="temp.lat"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="投诉栅格" prop="type">
              <el-input v-model="temp.raster"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
          <el-form-item label="原因分类" prop="type">
              <el-select v-model="temp.cp_type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in cp_type" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="影响网络">
              <el-select v-model="temp.net_type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in net_type" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="乡镇街道" prop="type">
              <el-input v-model="temp.town"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="投诉地点" prop="type">
              <el-input v-model="temp.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="影响人口" prop="type">
              <el-input v-model="temp.poor_coverage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="方案类型">
              <el-select v-model="temp.solve_type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in solve_type" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="解决方案" prop="type">
              <el-input v-model="temp.solve_plan"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="方案进度">
              <el-input v-model="temp.plan_progres"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="是否解决" prop="type">
              <el-badge :value="temp.is_solved=='否'?'待解决':''" class="item">
                <el-select v-model="temp.is_solved" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
                </el-select>
              </el-badge>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="预计时间">
              <!-- <el-date-picker
              v-model="temp.plan_time"
              type="date"
              placeholder="选择日期"
              size="mini">
              </el-date-picker> -->
              <el-input v-model="temp.plan_time" placeholder="预计解决（格式2020-03-28）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="实际时间">
              <el-input v-model="temp.solved_time" placeholder="实际解决（格式2020-03-28）"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="6" :sm="25" :md="60" :lg="90" :xl="120">
            <el-form-item label="最新进展">
              <el-input v-model="temp.tracking_info" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="解决方案的最新进度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="处理人">
              <el-input v-model="temp.deal_user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="4" :sm="5" :md="6" :lg="8" :xl="12">
            <el-form-item label="值班人">
              <el-input v-model="temp.duty_user"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">
          取消
        </el-button>
        <el-button type="primary" @click="updateData">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getComplain, updateComplain } from '@/api/complain.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '是': 'success',
        '否': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      select_date: '', // 查询的日期区间
      list: null,
      listLoading: true,
      total: 0,
      keyword: '', // 搜索关键字
      listQuery: {
        page: 1,
        limit: 10, // 每页显示数量
        city: '',
        user_tel: '',
        is_solved: '',
        is_overtime: '',
        start_date: '',
        end_date: ''
      },
      citys: ['柯城', '衢江', '江山', '龙游', '常山', '开化', '外地'],
      area: ['城区', '农村'],
      area_type: ['商业区', '居民小区', '住宅区'],
      cp_type: ['4G弱覆盖', '2G+4G弱覆盖', '2G弱覆盖', '设备故障', '无法确定'],
      net_type: ['4G', '2G+4G', '2G'],
      solve_type: ['规划', '优化', '不解决', '故障'],
      yes_or_no: ['是', '否'],
      temp: {
        cp_no: '',
        city: ''
      }, // 更新数据临时存储
      textMap: {
        update: '投诉详单更新',
        create: '创建投诉详单'
      },
      dialogFormVisible: false, // 控制对话框是否显示
      dialogStatus: '' // 设置对话框是update还是create
    }
  },
  created() {
    // this.fetchData()
    this.getComplainList()
  },
  methods: {
    // 获取用户投诉详单
    getComplainList() {
      this.listLoading = true
      getComplain(this.listQuery).then(response => {
        // console.log(response.total)
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      if (this.checkMobile(this.keyword)) { // 搜索为用户号码
        this.listQuery.user_tel = this.keyword // 用户号码搜索
      } else {
        this.listQuery.address = this.keyword // 投诉地点搜索
      }
      this.listQuery.start_date = this.select_date[0]
      this.listQuery.end_date = this.select_date[1]
      this.getComplainList()
    },
    // 校验手机号码
    checkMobile(tel) {
      var r = RegExp(/^1(3|4|5|7|8|9)\d{9}$/).test(tel)
      if (!r) {
        return false
      } else {
        return true
      }
    },
    // 清空筛选
    handleClear() {
      this.listQuery.city = ''
      this.listQuery.is_solved = ''
      this.listQuery.is_overtime = ''
      this.listQuery.user_tel = ''
      this.listQuery.address = ''
      this.listQuery.start_date = ''
      this.listQuery.end_date = ''
      this.getComplainList()
    },
    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 取消按钮
    cancelUpdate() {
      this.$confirm('是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.dialogFormVisible = false
      }).catch(() => {

      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // console.log(tempData)
          updateComplain(tempData.cp_id, tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提醒',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 批量导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style lang="scss">
    .el-tooltip__popper{max-width:50%}
    .filter-container{
        padding-bottom: 10px;
    }
    .el-row {
      padding: 0px;
      margin-bottom: 0px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
      padding: 0px;
    }
    .el-dialog el-dialog--center{
      font:bold;
    }
    // .el-dialog__footer{
    //   padding: 5px;
    // }
</style>
