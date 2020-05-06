<template>
  <div id="map" class="map">
    <baidu-map
      :map-type="maptype"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="autoScroll"
      :map-style="mapStyle"
      @moveend="getMapCenter"
      @zoomend="getZoom"
      @rightclick="getCoord"
      @ready="setDistanceToolInstance"
    >
      <!-- 切换地图类型 -->
      <!-- <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_LEFT"
      ></bm-map-type> -->
      <!-- 获取当前位置 -->
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :show-address-bar="true"
        :auto-location="true"
      ></bm-geolocation>
      <!-- 全景控件 -->
      <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT" offset="{width:20,height:50" }></bm-panorama>
      <!-- 缩放控件 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <!-- 测距控件 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:100,height:10}">
        <el-button size="mini" type="primary" @click="openDistanceTool">开启测距</el-button>
      </bm-control>
      <!-- 行政区域 -->
      <bm-boundary name="衢州市柯城区" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>
      <bm-boundary name="衢州市衢江区" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>
      <bm-boundary name="衢州市江山市" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>
      <bm-boundary name="衢州市龙游县" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>
      <bm-boundary name="衢州市常山县" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>
      <bm-boundary name="衢州市开化县" :stroke-weight="2" stroke-style="dashed" stroke-color="red" fill-color></bm-boundary>

      <!-- 自动填充搜索 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 650, height: 10}">
        <bm-auto-complete
          v-model="keyword"
          :sug-style="{ zIndex: 5 }"
          @confirm="search"
        >
          <el-input v-model="keyword" size="mini" placeholder="搜索地图地点" style="width:300px" @focus="startSearch"></el-input>
          <!-- <search-field placeholder="搜索地图地点"></search-field> // 这里指代一个自定义搜索框组件 -->
        </bm-auto-complete>
      </bm-control>
      <bm-local-search
        :localtion="center"
        :force-local="true"
        :keyword="keyword"
        :auto-viewport="true"
        :select-first-result="true"
        :panel="false"
        @searchcomplete="poiResult"
      ></bm-local-search>

      <!-- 单个坐标点   -->
      <bm-marker :position="marker" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      <bm-marker :position="{lng: coord.lng, lat: coord.lat}" :dragging="true" :icon="coord.icon">
        <bm-label
          :content="coord.label"
          :label-style="labelStyle"
          :offset="{width: -100, height: -60}"
        />
      </bm-marker>
      <!-- 加载批量坐标点 -->
      <bm-point-collection
        :points="points"
        shape="BMAP_POINT_SHAPE_RHOMBUS"
        color="#00ffff"
        size="BMAP_POINT_SIZE_NORMAL"
        @click="clickComplainsHandler"
      ></bm-point-collection>
      <!--信息窗体-->
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
</template>

<script>
import "@/styles/base.css";
import "@/styles/infowindow.css";
import DistanceTool from "bmaplib.new-distancetool";
import { bd09towgs84 } from "@/utils/transformCoordinate.js";

export default {
  name: "YiBaiduMap",
  props: {
    center: {
      // 地图中心
      type: String,
      default: "衢州市"
    },
    // zoom: {
    //   type: Number,
    //   default: 11
    // },
    mapType: {
      type: String,
      default: "BMAP_NORMAL_MAP"
    },
    marker: {
      // 创建的marker
      type: String,
      default: ""
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    isGetCoord: {
      type: Boolean,
      default: false
    },
    points: {
      type: Array,
      default() {
        return [{ lng: 0, lat: 0 }];
      }
    }
  },
  data() {
    return {
      distanceTool: "",
      ak: "U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO",
      zoom: 10,
      scale: 15, // 该层级显示卫星图层
      lng: 0,
      lat: 0,
      town: "白云街道",
      address: "",
      keyword: "",
      result: [],
      // 拾取坐标的信息
      coord: {
        lng: 0,
        lat: 0,
        label: "",
        icon: "",
        style: ""
      },
      maptype: this.mapType,
      mapStyle: {
        styleJson: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": {
              "hue": "#007fff",
              "saturation": 89
            }
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": {
              "color": "#ffffff",
              "visibility": "off"
            }
          }
        ]
      },
      // marker的标签样式
      labelStyle: {
        padding: "10px",
        color: "gray",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "5px"
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
      }
    };
  },
  mounted() {
    // this.center = "衢州市";
  },
  unmount() {
    this.distanceTool && this.distanceTool.close();
  },
  methods: {
    // 启动搜索前放大地图，解决无法呈现结果问题
    startSearch() {
      this.zoom = this.zoom + 1;
    },
    // poi搜索结果
    poiResult(res) {
      if (!res) {
        return
      }
      var data = res.Ir;
      var len = data.length;
      for (var i = 0; i < len; i++) {
        this.result.push({
          title: data[i].title,
          lng: data[i].point.lng,
          lat: data[i].point.lat,
          address: data[i].address
        })
      }
      console.log(this.result);
    },
    // 确认结果
    search(res) {
      var data = res;
      console.log(data);
    },
    // 测距
    setDistanceToolInstance({ map }) {
      this.distanceTool = new DistanceTool(map, {
        lineStroke: 2
      });
    },
    openDistanceTool(e) {
      const { distanceTool } = this;
      distanceTool && distanceTool.open();
      // this.isGetCoord = false;
    },
    // 获取地图中心点坐标
    getMapCenter(e) {
      this.lng = e.target.getCenter().lng;
      this.lat = e.target.getCenter().lat;
      // alert(e.target.getCenter().lng); //获取地图中心点
      // console.log(this.town);
      if (this.zoom >= this.scale) {
        this.maptype = "BMAP_HYBRID_MAP"; // 切换至混合地图
        // this.getSites(); // 移动时动态获取站点
      }
    },
    // 获取地图当前缩放级别
    getZoom(e) {
      // alert(e.target.getZoom());
      this.zoom = e.target.getZoom();
      if (this.zoom >= this.scale) {
        this.maptype = "BMAP_HYBRID_MAP"; // 切换至混合地图
        // this.getSites(); // 缩放时动态获取站点
        // 显示投诉数据
        // this.complain_points = this.temp_complains;
      } else {
        this.maptype = "BMAP_NORMAL_MAP";
        // this.markers = []; // 清空基站图标
      }
    },
    // 拾取坐标
    async getCoord(e) {
      // alert(e);
      if (!this.isGetCoord) {
        return;
      }
      // 放大到一定级别允许拾取
      if (this.zoom <= this.scale) {
        return;
      }
      // 打开坐标拾取
      this.coord.lng = e.point.lng;
      this.coord.lat = e.point.lat;
      await this.baiduReverseGeocoder(this.coord.lng, this.coord.lat);
      // console.log(this.address);
      this.coord.label =
        "经纬度：" +
        this.coord.lng +
        ";" +
        this.coord.lat +
        "<br />地  址：" +
        this.address;
      // 百度坐标系bd09转换为wgs84
      const point = bd09towgs84(this.coord.lng, this.coord.lat);
      const data = {
        lng: point[0],
        lat: point[1],
        town: this.town,
        address: this.address
      };
      // alert(this.coord.lng);
      this.$emit("getCoord", data);
    },
    // 百度逆地址转换
    async baiduReverseGeocoder(lng, lat) {
      var url =
        "http://api.map.baidu.com/reverse_geocoding/v3/?ak=" +
        this.ak +
        "&output=json&coordtype=bd09ll&ret_coordtype=bd09ll&extensions_poi=1&extensions_town=true&&location=" +
        lat +
        "," +
        lng;
      await this.$jsonp(url).then(res => {
        // console.log(res.result)
        var data = res.result;
        this.lng = data.location.lng; // 显示在底部cover-view
        this.lat = data.location.lat;
        this.town = data.addressComponent.town; // 乡镇、街道
        // console.log(this.town);
        var address =
          data.addressComponent.district + data.addressComponent.town; // 县市+乡镇/街道
        var poi = data.sematic_description.split(",")[0]; // poi，具体到小区或村庄
        this.address = address + poi;
      });
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    clickComplainsHandler(e) {
      var len = this.points.length;
      for (var i = 0; i < len; i++) {
        var data = this.points[i];
        if (data.lng === e.point.lng && data.lat === e.point.lat) {
          this.infoWindow = {
            position: {
              lng: e.point.lng,
              lat: e.point.lat
            },
            title: data.city + data.town + data.area,
            show: true,
            content: {
              info1: "投诉时间：" + data.cp_time,
              info2: "投诉内容：" + data.cp_info,
              info3: "处理过程：" + data.deal_info,
              info4: "解决方案：" + data.solve_plan
            }
          };
          return;
        }
      }
    }
  }
};
</script>
<style>
.bm-view {
  width: 100%;
  height: 90vh;
}
</style>
