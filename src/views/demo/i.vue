<template>
  <el-row>
    <el-col
      v-loading="loading"
      element-loading-text="地图数据加载中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :span="24"
    >
      <div class="content">
        <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          :map-type="mapType"
          @ready="handler"
        >
          <!--弹窗信息窗体-->
          <bm-info-window
            :position="infoWindow.position"
            :title="infoWindow.title"
            :show="infoWindow.show"
            @close="infoWindowClose"
            @open="infoWindowOpen"
          >
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info1 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info2 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info3 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info4 }}</span>
            </p>
            <p>
              <a class="edit-complain" href>更新信息</a>
            </p>
          </bm-info-window>
        </baidu-map>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import mapStyle from './static/mapStyle.json'
// import * as mapv from 'mapv'
import "@/styles/base.css";
import "@/styles/infowindow.css";
import { getComplain } from "@/api/complain.js";
import { wgs84tobd09 } from "@/utils/transformCoordinate.js";

export default {
  name: "FiveG",
  data() {
    return {
      center: "衢州",
      zoom: 10,
      mapType: "BMAP_HYBRID_MAP",
      // mapStyle: { style: "normal" },
      complain_points: [],
      listQuery: {
        // 投诉库查询参数
        page: 1,
        limit: 0, // 每页显示数量
        city: "",
        user_tel: "",
        is_solved: "",
        is_overtime: "",
        start_date: "",
        end_date: "",
        area: ""
      },
      infoWindow: {
        position: {
          lng: 0,
          lat: 0
        },
        title: "",
        show: false,
        content: {
          info1: "",
          info2: "",
          info3: "",
          info4: ""
        }
      },
      loading: false
    };
  },
  watch: {},
  mounted() {
    // console.log(mapv.OpenlayersLayer, mapv.DataSet, mapv.utilCityCenter)
    this.getDate();
  },
  methods: {
    // 获取当前时间
    getDate() {
      // 时间控件，默认当前日期
      var now = new Date();
      // 格式化日，如果小于9，前面补0
      var day = ("0" + now.getDate()).slice(-2);
      // 格式化月，如果小于9，前面补0
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      // 拼装完整日期格式
      var today = now.getFullYear() + "-" + month + "-" + day;
      this.listQuery.end_date = today;
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    handler({ BMap, map }) {
      var mapv = require("mapv");
      this.loading = true;
      getComplain(this.listQuery)
        .then(response => {
          //   console.log(response.data);
          this.complain_points = response.data;
          var count = this.complain_points.length;
          var data = [];
          var point = [];
          // 构造数据
          for (var i = 0; i < count; i++) {
            point = wgs84tobd09(
              this.complain_points[i].lng,
              this.complain_points[i].lat
            ); // wgs84坐标系转换为bd09l
            data.push({
              geometry: {
                type: "Point",
                coordinates: [point[0], point[1]]
              },
              cp_name: this.complain_points[i].user_tel
            });
          }

          var dataSet = new mapv.DataSet(data);

          var options = {
            fillStyle: "rgba(55, 50, 250, 0.8)",
            shadowColor: "rgba(255, 250, 50, 1)",
            shadowBlur: 20,
            size: 40,
            globalAlpha: 0.5,
            label: {
              show: true,
              fillStyle: "white"
              // shadowColor: 'yellow',
              // font: '20px Arial',
              // shadowBlur: 10,
            },
            gradient: {
              0.25: "rgb(0,0,255)",
              0.55: "rgb(0,255,0)",
              0.85: "yellow",
              1.0: "rgb(255,0,0)"
            },
            draw: "honeycomb"
          };

          // eslint-disable-next-line no-unused-vars
          var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

          options = {
            fillStyle: "rgba(55, 50, 250, 0.8)",
            shadowColor: "rgba(55, 50, 250, 1)",
            shadowBlur: 20,
            size: 30,
            draw: "simple"
          };
          this.loading = false;
        })
        .catch(response => {
          this.loading = false;
        });
    }
  },
  // 获取投诉数据
  getCompalins() {
    // this.complain_flag = !this.complain_flag;
    // this.loading = true;
    getComplain(this.listQuery)
      .then(response => {
        console.log(response.data);
        this.complain_points = response.data;
        this.handler();
        // this.loading = false;
      })
      .catch(response => {
        // this.loading = false;
      });
  }
  // 经纬度转换
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .bm-view {
    width: 100%;
    height: 93vh;
  }
}
</style>
<style>
/*去除百度地图版权*/
/* .anchorBL {
  display: none;
} */
</style>
