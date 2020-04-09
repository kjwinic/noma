<template>
  <div class="map">
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="autoScroll"
      map-type="BMAP_HYBRID_MAP"
      @click="getCoord"
    >
      <bm-marker :position="marker" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      <bm-marker :position="{lng: coord.lng, lat: coord.lat}" :dragging="true" :icon="coord.icon">
        <bm-label
          :content="coord.label"
          :label-style="labelStyle"
          :offset="{width: -100, height: -60}"
        />
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
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
      }
    };
  },
  mounted() {
    // this.center = "衢州市";
  },
  methods: {
    async getCoord(e) {
      // alert(e);
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
      // this.value = "当前经纬度：" + this.coord.lng + ";" + this.coord.lat; // 经纬度赋值到搜索框，用于粘贴
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
    }
    // closeDialog() {
    //   this.visible = false;
    //   this.$emit("closeDialog", false);
    // }
  }
};
</script>
<style>
.bm-view {
  width: 100%;
  height: 600px;
}
</style>
