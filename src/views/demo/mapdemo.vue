<template>
  <div class="map">
    <YiBaiduMap
      v-loading="loading"
      element-loading-text="投诉数据加载中"
      :zoom="zoom"
      :center="center"
      :marker="center"
      :is-get-coord="getcoord_flag"
      :points="complain_points"
      @getCoord="getCoord"
    >
    </YiBaiduMap>
  </div>
</template>

<script>
import YiBaiduMap from "@/components/Yi-BaiduMap";

export default {
  name: "MapDemo",
  components: { YiBaiduMap },
  data() {
    return {
      center: "衢州市",
      ak: "U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO",
      zoom: 10,
      lng: 0,
      lat: 0,
      town: "",
      address: "",
      temp: {
        cp_no: "",
        city: ""
      }, // 更新数据临时存储
      change_flag: false, // 是否修改标记
      getcoord_flag: true, // 是否打开坐标拾取标价
      complain_points: [],
      loading: false
    };
  },
  created() {
  },
  methods: {
    // 打开拾取坐标功能
    opengetCoord() {
      this.getcoord_flag = !this.getcoord_flag;
      // this.getcoord_flag = true;
      if (this.getcoord_flag) {
        this.$message({
          message: "已开启坐标拾取功能",
          type: "success",
          duration: "1000"
        });
      } else {
        this.$message({
          message: "坐标拾取已关闭",
          duration: "1000"
        });
      }
    },
    // 显示坐标地址信息
    getCoord(data) {
      // alert(data.address);
      this.temp.lng = data.lng;
      this.temp.lat = data.lat;
      this.temp.town = data.town;
      this.temp.address = data.address;
      this.change_flag = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  padding-top: 20px;
}
// 穿透bm-view样式
.map /deep/ .bm-view {
  width: 100%;
  height: 800px;
}

</style>
