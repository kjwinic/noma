<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >1
      </el-date-picker>
      <el-select v-model="listQuery.city" placeholder="县市" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery.title" placeholder="搜索用户号码/投诉地点" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
      height="650"
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
      <el-table-column label="地点" width="100" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="用户号码" width="100" align="center" show-overflow-tooltip="true">
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
            @click="handleEdit(scope.row.cp_id, scope.row)"
          >
            更新 </el-button>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="查看地图" width="80" align="center">
        <i class="el-icon-view" />
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getComplainList" />

  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getComplain } from '@/api/complain.js'
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
      value2: '',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10, // 每页显示数量
        city: undefined
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      citys: ['柯城', '衢江', '江山', '龙游', '常山', '开化']
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
</style>
