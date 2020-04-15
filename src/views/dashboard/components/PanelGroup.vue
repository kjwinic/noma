<template>
  <div class="app-container">
    <!-- <el-divider>
      <i class="el-icon-view"></i>
      <span>故障投诉</span>
    </el-divider>-->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="gotoComplain">
          <div class="card-panel-icon-wrapper icon-one">
            <svg-icon icon-class="wireless" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">无线投诉</div>
            <div class="count">
              <div class="day">
                日
                <count-to :start-val="0" :end-val="11" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
              </div>
              <div class="month">
                月累计
                <count-to :start-val="0" :end-val="328" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
                <span class="increase">
                  <i class="el-icon-top-right"></i>
                  25起
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="gotoFault">
          <div class="card-panel-icon-wrapper icon-two">
            <svg-icon icon-class="site" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">基站退服</div>
            <div class="count">
              <div class="day">
                日
                <count-to :start-val="0" :end-val="12" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
              </div>
              <div class="month">
                月累计
                <count-to :start-val="0" :end-val="208" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
                <span class="decrease">
                  <i class="el-icon-bottom-right"></i>
                  12起
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-three">
            <svg-icon icon-class="wired" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">有线投诉</div>
            <div class="count">
              <div class="day">
                日
                <count-to :start-val="0" :end-val="123" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
              </div>
              <div class="month">
                月累计
                <count-to :start-val="0" :end-val="2280" :duration="3200" class="card-panel-num" />
                <span class="day">起</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-four">
            <svg-icon icon-class="workorder" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">故障工单</div>
            <div class="count">
              <div class="day">
                超时
                <count-to :start-val="0" :end-val="5" :duration="3000" class="card-panel-num" />
                <span class="day">张</span>
              </div>
              <div class="month">
                月平均历时
                <span class="card-panel-num">5.35</span>
                <span class="day">小时</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-divider class="my">
      <i class="el-icon-search"></i>
      <span>运维管理</span>
    </el-divider>-->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-five">
            <svg-icon icon-class="kpi" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">省对市考核指标完成</div>
            <div class="count">
              <div class="day">
                超挑战值
                <count-to :start-val="0" :end-val="1" :duration="3000" class="card-panel-num" />
                <span class="day">项</span>
              </div>
              <div class="month">
                超基准值
                <count-to :start-val="0" :end-val="2" :duration="3000" class="card-panel-num" />
                <span class="day">项</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-six">
            <svg-icon icon-class="mark" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">市对县考核及运维评价</div>
            <div class="count">
              <div class="day">
                超挑战值
                <count-to :start-val="0" :end-val="1" :duration="3000" class="card-panel-num" />
                <span class="day">项</span>
              </div>
              <div class="month">
                超基准值
                <count-to :start-val="0" :end-val="6" :duration="3600" class="card-panel-num" />
                <span class="day">项</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-seven">
            <svg-icon icon-class="todo" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待办事项</div>
            <div class="count">
              <div class="day">
                重点工作
                <count-to :start-val="0" :end-val="20" :duration="3000" class="card-panel-num" />
                <span class="day">起</span>
              </div>
              <div class="month">
                督办提醒
                <count-to :start-val="0" :end-val="6" :duration="3600" class="card-panel-num" />
                <span class="day">起</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-eight">
            <svg-icon icon-class="safe" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">割接管控</div>
            <div class="count">
              <div class="day">
                本月割接
                <count-to :start-val="0" :end-val="13" :duration="3000" class="card-panel-num" />
                <span class="day">项</span>
              </div>
              <div class="month">
                违规
                <count-to :start-val="0" :end-val="1" :duration="3600" class="card-panel-num" />
                <span class="day">项</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    gotoComplain() {
      this.$router.push({ name: "ComplainAnalysis" });
    },
    gotoFault() {
      this.$router.push({ name: "FalutAnalysis" });
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 30px;
  .count {
    display: flex;
    flex-flow: row;
  }
  .day {
    color: #606266;
    font-size: 12px;
  }
  .month {
    color: #606266;
    font-size: 12px;
    padding-left: 10px;
  }
  .increase {
    color: red;
  }
  .decrease {
    color: #67c23a;
  }
  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-one {
        background: #40c9c6;
      }

      .icon-two {
        background: #36a3f7;
      }

      .icon-three {
        background: #f4516c;
      }

      .icon-four {
        background: #ffcb8c;
      }
      .icon-five {
        background: #67c23a;
      }
      .icon-six {
        background: #d87a80;
      }
      .icon-seven {
        background: red;
      }
    }

    .icon-one {
      color: #40c9c6;
    }

    .icon-two {
      color: #36a3f7;
    }

    .icon-three {
      color: #f4516c;
    }

    .icon-four {
      color: #ffcb8c;
    }
    .icon-five {
      color: #67c23a;
    }
    .icon-six {
      color: #d87a80;
    }
    .icon-seven {
      color: red;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 54px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      margin-right: 2px;

      .card-panel-text {
        line-height: 18px;
        // color: rgba(0, 0, 0, 0.45);
        color: #303133;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
        color: #909399;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
