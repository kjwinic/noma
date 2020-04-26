<template>
  <div class="content">
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :map-style="mapStyle"
      @ready="handler"
    ></baidu-map>
  </div>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import mapStyle from './static/mapStyle.json'
// import * as mapv from 'mapv'
import { getComplain } from "@/api/complain.js";

export default {
  name: "Mapv",
  data() {
    return {
      center: "衢州",
      zoom: 10,
      mapStyle: { style: "normal" },
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
      }
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
    handler({ BMap, map }) {
      var mapv = require("mapv");
      getComplain(this.listQuery)
        .then(response => {
        //   console.log(response.data);
          this.complain_points = response.data;
          var randomCount = this.complain_points.length;
          var data = [];
          // 构造数据
          for (var i = 0; i < randomCount; i++) {
            // var cityCenter = mapv.utilCityCenter.getCenterByCityName(
            //   citys[parseInt(Math.random() * citys.length)]
            // );
            data.push({
              geometry: {
                type: "Point",
                coordinates: [
                  this.complain_points[i].lng,
                  this.complain_points[i].lat
                ]
              }
            });
          }
          var dataSet = new mapv.DataSet(data);
          var options = {
            // shadowColor: 'rgba(255, 250, 50, 1)',
            // shadowBlur: 10,
            fillStyle: "rgba(255, 50, 0, 1.0)", // 非聚合点的颜色
            size: 5, // 非聚合点的半径
            minSize: 8, // 聚合点最小半径
            maxSize: 31, // 聚合点最大半径
            globalAlpha: 0.8, // 透明度
            clusterRadius: 150, // 聚合像素半径
            methods: {
              click: function(item) {
                console.log(item); // 点击事件
              }
            },
            maxZoom: 19, // 最大显示级别
            label: {
              // 聚合文本样式
              show: true, // 是否显示
              fillStyle: "white"
              // shadowColor: 'yellow',
              // font: '20px Arial',
              // shadowBlur: 10,
            },
            gradient: { 0: "blue", 0.5: "yellow", 1.0: "rgb(255,0,0)" }, // 聚合图标渐变色
            draw: "cluster"
          };

          // eslint-disable-next-line new-cap
          var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
          console.log(mapvLayer);
        // this.loading = false;
        })
        .catch(response => {
        // this.loading = false;
        });
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
  }
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
