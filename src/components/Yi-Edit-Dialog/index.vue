
<template>
  <div class="edit-pop">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="editdata"
      label-position="left"
      label-width="70px"
      style="width: 700px; margin-left:50px;"
      size="mini"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="流水号">
            <el-input v-model="editdata.cp_no" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投诉时间">
            <el-input v-model="editdata.cp_time" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投诉日期">
            <el-input v-model="editdata.cp_date" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="县市" prop="type">
            <el-select v-model="editdata.city" class="filter-item" placeholder="选择县市">
              <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户号码">
            <el-input v-model="editdata.user_tel" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户星级">
            <el-input v-model="editdata.user_star" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="终端型号">
            <el-input v-model="editdata.phone_type" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城区农村" prop="type">
            <el-select v-model="editdata.is_village" class="filter-item" placeholder="选择区域">
              <el-option v-for="item in is_village" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域类型">
            <el-select
              v-model="editdata.place"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in place"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="投诉内容">
            <el-input v-model="editdata.cp_info" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理过程">
            <el-input
              v-model="editdata.deal_info"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="经度" prop="type">
            <el-input
              v-model="editdata.lng"
              tabindex="lng"
              :class="change_flag? 'input-change':''"
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纬度" prop="type">
            <el-input
              v-model="editdata.lat"
              :class="change_flag? 'input-change':''"
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="修改报错">
            <el-button
              v-if="!getcoord_flag"
              type="success"
              icon="el-icon-location"
              size="mini"
              round
              @click="opengetCoord"
            >开启地图拾取经纬度</el-button>
            <el-button
              v-else
              type="danger "
              icon="el-icon-location"
              size="mini"
              round
              @click="opengetCoord"
            >关闭地图拾取经纬度</el-button>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="乡镇街道" prop="type">
            <el-input v-model="editdata.town" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投诉区域" prop="type">
            <el-input v-model="editdata.area" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="影响人口" prop="type">
            <el-input v-model="editdata.poor_coverage" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="详细地址">
            <el-input
              v-model="editdata.address"
              :class="change_flag? 'input-change':''"
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="原因分类" prop="type">
            <el-select v-model="editdata.cp_type" class="filter-item" placeholder="选择原因">
              <el-option v-for="item in cp_type" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="影响网络">
            <el-select v-model="editdata.net_type" class="filter-item" placeholder="请选择">
              <el-option
                v-for="item in net_type"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投诉栅格" prop="type">
            <el-input v-model="editdata.raster" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="方案类型">
            <el-select v-model="editdata.solve_type" class="filter-item" placeholder="选择方案类型">
              <el-option
                v-for="item in solve_type"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="解决方案" prop="type">
            <el-input v-model="editdata.solve_plan" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案进度">
            <el-input v-model="editdata.plan_progres" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="是否解决" prop="type">
            <el-badge :value="editdata.is_solved=='否'?'待解决':''" class="item">
              <el-select
                v-model="editdata.is_solved"
                class="filter-item"
                placeholder="Please select"
              >
                <el-option
                  v-for="item in yes_or_no"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-badge>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预计时间">
            <!-- <el-date-picker
              v-model="editdata.plan_time"
              type="date"
              placeholder="选择日期"
              size="mini">
                      </el-date-picker>-->
            <el-input v-model="editdata.plan_time" placeholder="预计解决（格式2020-03-28）" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际时间">
            <el-input v-model="editdata.solved_time" placeholder="实际解决（格式2020-03-28）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="最新进展">
            <el-input
              v-model="editdata.tracking_info"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2}"
              placeholder="解决方案的最新进度"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="处理人">
            <el-input v-model="editdata.deal_user" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="值班人">
            <el-input v-model="editdata.duty_user" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item>
            <el-button type="info" @click="closeUpdate">关闭</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="updateData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { updateComplain } from "@/api/complain.js";

export default {
  name: "YiEditDialog",
  props: {
    editdata: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      citys: ["柯城", "衢江", "江山", "龙游", "常山", "开化", "外地"],
      is_village: ["城区", "农村", "未知"],
      place: ["商业区", "居民小区", "住宅区"],
      cp_type: ["4G弱覆盖", "2G+4G弱覆盖", "2G弱覆盖", "设备故障", "无法确定"],
      net_type: ["4G", "2G+4G", "2G"],
      solve_type: ["规划", "优化", "不解决", "故障"],
      yes_or_no: ["是", "否"],
      change_flag: false // 是否修改标记
    };
  },
  created() {
    console.log("hello");
    console.log(this.editdata);
  },
  methods: {
    // 输入框发生变化
    inputChange(e) {
      // alert(e);
      if (e === "") {
        this.change_flag = false;
      } else {
        this.change_flag = true;
      }
    },
    // 取消按钮
    closeUpdate() {
      // 无更新直接关闭
      if (!this.change_flag) {
        this.dialogFormVisible = false;
        return;
      }
      this.$confirm("修改未保存，是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.dialogFormVisible = false;
          this.change_flag = false; // 还原默认未修改
          // this.getcoord_flag = false;
        })
        .catch(() => {});
    },
    // 更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.data);
          // console.log(data)
          updateComplain(data.cp_id, data).then(() => {
            // const index = this.list.findIndex(v => v.id === this.data.id)
            // this.list.splice(index, 1, this.data)
            this.dialogFormVisible = false;
            this.$notify({
              title: "提醒",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
          this.getComplainList();
        }
      });
    }
  }
}
</script>
<style>
.edit-pop {
  display: flex;
  flex-flow: row;
}
</style>
