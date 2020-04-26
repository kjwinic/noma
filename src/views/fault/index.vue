<template>
  <div class="content">
    <baidu-map class="bm-view" :center="center" :zoom="zoom" :mapStyle="mapStyle" @ready="handlers"></baidu-map>
  </div>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import mapStyle from './static/mapStyle.json'
// import mapv from '@/utils/mapv.min.js'
// import { baiduMapLayer, DataSet, utilCityCenter } from 'mapv'
import * as mapv from 'mapv'

export default {
  // name: "Mapv",
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      mapStyle: { style: "light" }
    };
  },
  watch: {},
  mounted() {
    // console.log(DataSet);
  },
  methods: {
    handlers({ BMap, map }) {
      var mapv = require("mapv");
      map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      console.log(BMap, map);
      this.center.lng = 105.403119;
      this.center.lat = 38.028658;
      this.zoom = 5;
      var randomCount = 300;
      var data = [];
      var citys = [
        "北京",
        "天津",
        "上海",
        "重庆",
        "石家庄",
        "太原",
        "呼和浩特",
        "哈尔滨",
        "长春",
        "沈阳",
        "济南",
        "南京",
        "合肥",
        "杭州",
        "南昌",
        "福州",
        "郑州",
        "武汉",
        "长沙",
        "广州",
        "南宁",
        "西安",
        "银川",
        "兰州",
        "西宁",
        "乌鲁木齐",
        "成都",
        "贵阳",
        "昆明",
        "拉萨",
        "海口"
      ];
      // 构造数据
      while (randomCount--) {
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(
          citys[parseInt(Math.random() * citys.length)]
        );
        data.push({
          geometry: {
            type: "Point",
            coordinates: [
              cityCenter.lng - 2 + Math.random() * 4,
              cityCenter.lat - 2 + Math.random() * 4
            ]
          },
          count: 30 * Math.random()
        });
      }
      var dataSet = new mapv.DataSet(data);
      // console.log(dataSet);
      var options = {
        fillStyle: "rgba(255, 50, 50, 0.6)",
        shadowColor: "rgba(255, 50, 50, 1)",
        shadowBlur: 30,
        globalCompositeOperation: "lighter",
        methods: {
          click: function(item) {
            console.log(item);
          }
        },
        size: 5,
        draw: "simple"
      };
      console.log(options);
      var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
      // mapvLayer.show(); // 显示图层
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .bm-view {
    width: 100%;
    height: 81vh;
  }
}
</style>
<style>
/*去除百度地图版权*/
.anchorBL {
  display: none;
}
</style>
