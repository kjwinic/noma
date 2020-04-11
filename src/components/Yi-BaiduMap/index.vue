<template>
  <div id="map" class="map">
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="autoScroll"
      map-type="BMAP_HYBRID_MAP"
      @click="getCoord"
    >
      <!-- 定位控件 -->
      <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT" offset="{width:20,height:50" }></bm-panorama>
      <!-- 全景控件 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <!-- 单个坐标点   -->
      <bm-marker :position="marker" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>经纬度拾取
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
import { bd09towgs84 } from "@/utils/transformCoordinate.js";

export default {
  name: "YiBaiduMap",
  props: {
    center: {
      // 地图中心
      type: String,
      default: "衢州市"
    },
    zoom: {
      type: Number,
      default: 12
    },
    mapType: {
      type: String,
      default: "BMAP_HYBRID_MAP"
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
      lng: 0,
      lat: 0,
      town: "白云街道",
      address: "",
      // 拾取坐标的信息
      coord: {
        lng: 0,
        lat: 0,
        label: "",
        icon: "",
        style: ""
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
  methods: {
    async getCoord(e) {
      // alert(e);
      if (!this.isGetCoord) {
        return;
      }
      // 打开坐标拾取
      this.coord.lng = e.point.lng;
      this.coord.lat = e.point.lat;
      await this.baiduReverseGeocoder(this.coord.lng, this.coord.lat);
      console.log(this.address);
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
  height: 500px;
}
</style>
