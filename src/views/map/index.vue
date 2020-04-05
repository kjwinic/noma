<template>
  <div>
    <div id="map" class="map">
      <baidu-map
        class="bm-view"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        :map-type="mapType"
        @ready="setDistanceToolInstance"
        @moveend="getMapCenter"
        @zoomend="getZoom"
        @rightclick="getCoord"
      >
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_LEFT"
        ></bm-map-type>
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_LEFT"
          :show-address-bar="true"
          :auto-location="true"
        ></bm-geolocation>
        <!-- 定位控件 -->
        <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT" offset="{width:20,height:50" }></bm-panorama>
        <!-- 全景控件 -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!-- 缩放控件 -->
        <!-- 测距控件 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:100,height:10}">
          <el-button size="mini" type="primary" @click="openDistanceTool">开启测距</el-button>
        </bm-control>
        <!-- 加载控件 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:185,height:10}">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini" :loading="loading">
              加载数据
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">无线投诉</el-dropdown-item>
              <el-dropdown-item command="b" divided>有线投诉</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </bm-control>
        <!-- 日期筛选 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:300,height:10}">
          <el-date-picker
            v-model="select_date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :unlink-panels="true"
            type="datetimerange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:60%"
            @change="handleFilter"
          />
        </bm-control>
        <!-- 下拉菜单 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:550,height:10}">
          <el-select
            v-model="value"
            clearable
            placeholder="搜索类型"
            size="mini"
            style="width:55%;"
            type="primary"
            @change="selectSearch"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </bm-control>
        <!-- 自动填充搜索 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 650, height: 10}">
          <!-- <bm-auto-complete
          v-model="keyword_map"
          :sug-style="{ zIndex: 5 }"
          @confirm="searchComplain"
          >-->
          <!-- <el-input v-model="keyword" size="mini" placeholder="搜索地点"></el-input> -->
          <el-autocomplete
            v-model="keyword"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            placeholder="输入搜索关键字"
            size="mini"
            :clearable="true"
            @select="handleSelect"
          >
            <i class="el-icon-edit el-input__icon" @click="handleIconClick"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.time }}</span>
            </template>
          </el-autocomplete>
          <!-- </bm-auto-complete> -->
        </bm-control>
        <bm-local-search
          :localtion="center"
          :force-local="true"
          :keyword="keyword"
          :auto-viewport="true"
        ></bm-local-search>
        <!-- 搜索按钮 -->
        <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:840,height:10}">
          <el-button size="mini" type="primary" @click="handleSearch">搜索</el-button>
        </bm-control>
        <!-- 行政区域 -->
        <bm-boundary name="衢州市柯城区" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>
        <bm-boundary name="衢州市衢江区" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>
        <bm-boundary name="衢州市江山市" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>
        <bm-boundary name="衢州市龙游县" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>
        <bm-boundary name="衢州市常山县" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>
        <bm-boundary name="衢州市开化县" :stroke-weight="2" stroke-color="red" fill-color></bm-boundary>

        <!-- 点聚合 -->
        <!-- <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>
        </bml-marker-clusterer>-->
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
        <!-- 加载基站点 -->
        <bm-marker
          v-for="marker in markers"
          :key="marker.id"
          :position="{lng: marker.lng, lat: marker.lat}"
          :icon="marker.icon"
          :title="marker.title"
          @click="clickSitesHandler"
        >
          <!-- 右键菜单 -->
          <bm-context-menu>
            <bm-context-menu-item
              :callback="editSite"
              text="修改站点"
              icon-url="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"
            ></bm-context-menu-item>
            <bm-context-menu-item seperator></bm-context-menu-item>
            <bm-context-menu-item
              text="上传图片"
              icon-url="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"
            ></bm-context-menu-item>
          </bm-context-menu>
        </bm-marker>
        <!-- 加载搜索结果 -->
        <bm-marker
          v-for="marker2 in search_results"
          :key="marker2.id"
          :position="{lng: marker2.lng, lat: marker2.lat}"
          :icon="marker2.icon"
          animation="BMAP_ANIMATION_BOUNCE"
        >
          <bm-label
            :content="marker2.label"
            :label-style="{color: 'red', fontSize : '12px'}"
            :offset="{width: -60, height: -40}"
          />
        </bm-marker>
        <!-- 加载投诉海量点 -->
        <bm-point-collection
          :points="complain_points"
          shape="BMAP_POINT_SHAPE_RHOMBUS"
          color="#00ffff"
          size="BMAP_POINT_SIZE_NORMAL"
          @click="clickComplainsHandler"
        ></bm-point-collection>
        <!-- 加载故障海量点 -->
        <!-- <bm-point-collection
        :points="fault_points"
        shape="BMAP_POINT_SHAPE_RHOMBUS"
        color="#ff0000"
        size="BMAP_POINT_SIZE_NORMAL"
        @click="clickHandler"
        ></bm-point-collection>-->
        <!-- 获取坐标 -->
        <!-- <bm-marker :position="{lng: lng, lat: lat}" :dragging="true" icon="../../static/image/coord-point.png">
        </bm-marker>-->
        <bm-marker :position="{lng: coord.lng, lat: coord.lat}" :dragging="true" :icon="coord.icon">
          <bm-label
            :content="coord.label"
            :label-style="{color: 'red', fontSize : '12px'}"
            :offset="{width: -60, height: -40}"
          />
        </bm-marker>
        <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{width:10,height:350}">
          <el-button
            type="success"
            icon="el-icon-d-arrow-left"
            circle
            @mouseover.native="handleShow"
          ></el-button>
        </bm-control>
      </baidu-map>
    </div>

    <!-- 搜索结果 -->
    <el-drawer
      :visible.sync="show_results"
      direction="rtl"
      size="330px"
      :with-header="false"
      :modal="false"
      :before-close="handleClose"
    >
      <div class="pop-layer">
        <h3 class="title">
          共
          <span class="title-color">{{ search_results.length }}</span>条搜索结果
        </h3>
        <div id="container" class="container">
          <div class="right">
            <div class="list">
              <div class="list-context">
                <div ref="box" class="list-scroll bmr-y-scroll" :style="{height:popHeight}">
                  <!-- 结果列表-->
                  <div class="listItemDIV">
                    <div
                      v-for="item of search_results"
                      :key="item.id"
                      class="row"
                      :class="{active: activeName == item.name}"
                      @click="viewMarker(item)"
                    >
                      <div class="head-title" :title="item.name" v-text="item.name"></div>
                      <div class="row-second">{{ item.time }}</div>
                      <div class="row-second">{{ item.user_tel }}</div>
                      <div
                        class="row-second"
                      >经纬度：{{ item.lng.toFixed(6) }};{{ item.lat.toFixed(6) }}</div>
                      <div class="row-second">{{ item.cp_type }}</div>
                      <div class="row-content">
                        <span class="item fl">{{ item.solve_plan }}</span>
                        <span class="item fl2">
                          <i
                            :class="[item.is_solved=='否'?'el-icon-close':'el-icon-check']"
                            class="iconfont"
                          ></i>
                          {{ item.is_solved=='否'?'未解决':'已解决' }}
                        </span>
                      </div>
                    </div>
                    <div style="clear:both;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import "@/styles/base.css";
import "@/styles/infowindow.css";
import DistanceTool from "bmaplib.new-distancetool";
// import { reverseGeocoder } from '@/api/bmap.js'
import { getComplain } from "@/api/complain.js";
import { getSite } from "@/api/site.js";
import { wgs84tobd09, bd09towgs84 } from "@/utils/transformCoordinate.js";

export default {
  name: "Map",
  data() {
    return {
      distanceTool: "",
      auto_flag: true,
      complain_flag: false,
      center: "衢州市",
      ak: "U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO",
      mapType: "BMAP_NORMAL_MAP",
      zoom: 10,
      scale: 16, // 该层级显示卫星图层
      map: {
        width: "100%",
        height: "710px"
      },
      town: "白云街道",
      address: "",
      lng: 0,
      lat: 0,
      coord: {
        lng: 0,
        lat: 0,
        label: "",
        icon: "",
        style: ""
      }, // 坐标拾取
      site_points: [], // 加载基站点
      loading: false, // 加载状态
      site_data: [],
      complain_points: [], // 加载投诉点
      fault_points: [], // 加载故障点
      markers: [],
      keyword: "",
      value: "搜索地图",
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
        address: ""
      },
      select_date: "",
      popHeight: "700px",
      // containerHeight: "700px",
      // districtType: 0, // 行政区域
      // districtTypeOptions: "", // 行政区域选项
      // array: ["中国", "美国", "巴西", "日本"],
      index: 0,
      options: [
        {
          value: "map",
          label: "搜索地图"
        },
        {
          value: "cp",
          label: "搜索投诉"
        },
        {
          value: "site",
          label: "搜索站点"
        },
        {
          value: "coord",
          label: "搜索坐标"
        }
      ],
      screenWidth: "",
      search_type: "",
      search_results: [],
      show_results: false,
      activeName: "",
      state2: ""
    };
  },
  mounted() {
    // this.screenWidth = document.body.clientWidth;
  },
  unmount() {
    this.distanceTool && this.distanceTool.close();
  },
  onLoad() {
    this.getDate(); // 获取当前时间
    this.getMapCenter();
    // this.getCoord();
  },
  methods: {
    querySearch(queryString, cb) {
      var search_results = this.search_results;
      var results = queryString
        ? search_results.filter(this.createFilter(queryString))
        : search_results;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    // //地图初始化
    // handler({
    // 	BMap,
    // 	map
    // }) {
    // 	console.log(BMap, map)
    // 	// this.map.center.lng = 118.802422
    // 	// this.map.center.lat = 32.065631
    // 	// this.map.zoom = 12;
    // 	this.map.width = document.getElementById("container").clientWidth - 330 + 'px';
    // 	this.map.height = document.body.clientHeight - 160 + 'px';
    // 	// this.getProPositionMap();
    // },
    // 处理下拉菜单
    handleCommand(command) {
      if (command === "a") {
        this.initFilter();
        // 加载投诉数据
        this.getCompalins();
      }
    },
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
    // 条件过滤搜索
    handleFilter() {
      this.listQuery.start_date = this.select_date[0];
      this.listQuery.end_date = this.select_date[1];
      this.getCompalins();
      // if (this.checkMobile(this.keyword)) {
      //   // 搜索为用户号码
      //   this.listQuery.user_tel = this.keyword // 用户号码搜索
      // } else {
      //   this.listQuery.address = this.keyword // 投诉地点搜索
      // }
    },
    // 清空条件过滤
    initFilter() {
      this.select_date = "";
      console.log(this.listQuery);
      this.listQuery = {
        page: 1,
        limit: 0, // 每页显示数量
        city: "",
        user_tel: "",
        is_solved: "",
        is_overtime: "",
        start_date: "",
        end_date: "",
        address: ""
      };
      console.log("清空后");
      console.log(this.listQuery);
    },
    // 下拉选择搜索类型
    selectSearch(e) {
      // console.log(e) // 为选中的value
      this.search_type = e;
    },
    handleSearch() {
      // console.log(e) // 为选中的value
      if (this.keyword.length < 2) {
        return;
      }
      switch (this.search_type) {
        case "map":
          break;
        case "cp":
          this.searchComplain(this.keyword);
          break;
        case "site":
          this.searchSite(this.keyword);
          break;
        case "coord":
          this.searchCoord(this.keyword);
          break;
        default:
      }
    },
    handleClose() {
      this.show_results = false;
    },
    handleShow() {
      this.show_results = true;
    },
    searchComplain(keyword) {
      this.show_results = true;
      this.search_results = [];
      this.listQuery.page = 1;
      this.listQuery.limit = 20;
      this.listQuery.address = keyword;
      getComplain(this.listQuery)
        .then(response => {
          // console.log(response.data);
          var data = response.data;
          var len = data.length;
          for (var i = 0; i < len; i++) {
            console.log(data[i].lng);
            var point = wgs84tobd09(data[i].lng, data[i].lat);
            // console.log(point[0]);
            this.search_results.push({
              name: data[i].cp_info,
              time: "投诉时间：" + data[i].cp_time,
              user_tel: "用户号码：" + data[i].user_tel,
              lng: point[0],
              lat: point[1],
              label: data[i].cp_info,
              id: data[i].cp_id,
              cp_type: "投诉原因：" + data[i].cp_type,
              solve_plan: "解决方案：" + data[i].solve_plan,
              is_solved: data[i].is_solved
            });
            // this.createMarker(point[0], point[1], "测试");
          }
          // this.search_results = response.data;
          // this.loading = false;
        })
        .catch(response => {
          // this.loading = false;
        });
    },
    // 右侧点击搜索结果，定位到地图中心并放大地图
    viewMarker(data) {
      this.activeName = data.name;
      this.center = { lng: data.lng, lat: data.lat };
      this.zoom = 19;
    },
    searchSite(keyword) {
      alert("搜索站点" + keyword);
    },
    searchCoord(keyword) {
      // alert("搜索坐标" + keyword);
      var arr = keyword.split(/,|，|;|；/);
      var lng = parseFloat(arr[0]); // 转换为float
      var lat = parseFloat(arr[1]);
      var label = "当前经纬度：" + lng + ";" + lat;
      // 判断是否可以转换为float
      if (!lng & !lat) {
        this.list = [];
      } // 搜索结果为空
      this.center = { lng: lng, lat: lat }; // 设置地图中心
      this.zoom = 19;
      this.createMarker(lng, lat, label); // 创建搜索结果点
    },
    createMarker(lng, lat, label) {
      this.coord.lng = lng;
      this.coord.lat = lat;
      this.coord.label = label;
      // this.coord.icon = "/image/coord-point.png";
    },
    // 获取地图中心点坐标
    getMapCenter(e) {
      this.lng = e.target.getCenter().lng;
      this.lat = e.target.getCenter().lat;
      // alert(e.target.getCenter().lng); //获取地图中心点
      console.log(this.town);
      if (this.zoom >= this.scale) {
        this.mapType = "BMAP_HYBRID_MAP"; // 切换至混合地图
        this.getSites(); // 移动时动态获取站点
      }
    },
    // 获取地图当前缩放级别
    getZoom(e) {
      // alert(e.target.getZoom());
      this.zoom = e.target.getZoom();
      if (this.zoom >= this.scale) {
        this.mapType = "BMAP_HYBRID_MAP"; // 切换至混合地图
        this.getSites(); // 缩放时动态获取站点
      } else {
        this.mapType = "BMAP_NORMAL_MAP";
        this.markers = []; // 清空基站图标
      }
    },
    // 右键拾取坐标，并获取经纬度+地址信息
    async getCoord(e) {
      // 放大到16级时才允许拾取坐标系
      if (this.zoom < this.scale) {
        return;
      }
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
      this.value = "当前经纬度：" + this.coord.lng + ";" + this.coord.lat; // 经纬度赋值到搜索框，用于粘贴
    },
    // 获取投诉数据
    getCompalins() {
      // this.complain_flag = !this.complain_flag;
      this.loading = true;
      getComplain(this.listQuery)
        .then(response => {
          console.log(response.data);
          this.complain_points = response.data;
          this.loading = false;
        })
        .catch(response => {
          this.loading = false;
        });
    },
    // =======请求百度地图web API获取详细POI==============
    // =====2020年4月1日 22:02:45===================
    // =====coordtype=bd09ll,extensions_poi=1=======
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

    clickComplainsHandler(e) {
      var len = this.complain_points.length;
      for (var i = 0; i < len; i++) {
        var data = this.complain_points[i];
        if (data.lng === e.point.lng && data.lat === e.point.lat) {
          this.infoWindow = {
            position: {
              lng: e.point.lng,
              lat: e.point.lat
            },
            title: data.city + data.town + data.address,
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
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    // ====加载基站数据==========
    // =========================
    async getSites() {
      await this.baiduReverseGeocoder(this.lng, this.lat);
      var center = bd09towgs84(this.lng, this.lat);
      var lng = center[0];
      var lat = center[1];
      await getSite(this.town, lng, lat)
        .then(response => {
          // console.log(response)
          this.site_data = response.data;
          this.showSites();
        })
        .catch(response => {});
    },
    // 加载基站图标
    showSites() {
      var len = this.site_data.length;
      var data = this.site_data;
      var icon;
      var markers;
      markers = [];
      for (var i = 0; i < len; i++) {
        var point = wgs84tobd09(data[i].lng, data[i].lat);
        if (data[i].tower === "无塔桅") {
          icon = "/image/indoor.png";
        } else {
          icon = "/image/site.png";
        }
        markers.push({
          id: data[i].site_id,
          lng: point[0],
          lat: point[1],
          icon: {
            url: icon,
            size: {
              width: 80,
              height: 100
            }
          },
          title: data[i].site_name
        });
        this.markers = markers; // 赋值到this
        // }
      }
      // that.sites_len = that.markers.length; //保存屏幕显示站点的数量
    },
    // 基站图标点击事件
    clickSitesHandler(e) {
      var len = this.site_data.length;
      var site_name = e.target.getTitle();
      // console.log(e.target.getTitle());
      for (var i = 0; i < len; i++) {
        var data = this.site_data[i];
        // console.log(data);
        if (data.site_name === site_name) {
          this.infoWindow = {
            position: {
              lng: e.point.lng,
              lat: e.point.lat
            },
            title: data.site_name,
            show: true,
            content: {
              info1: "塔桅类型：" + data.tower,
              info2: "塔桅高度：" + data.height + "米",
              info3: "经度：" + data.lng,
              info4: "纬度：" + data.lat
            }
          };
          return;
        }
      }
    },
    // 右键编辑站点信息
    editSite() {
      alert("hello");
    },
    gotoBeijing() {
      return;
    },
    gotoShanghai() {
      return;
    },
    dateStartChange(e) {
      console.log(e.target);
      if (e.detail.value > this.date_end) {
        // uni.showToast({
        //   title: '不能大于截止日期',
        //   duration: 1000,
        //   icon: 'none'
        // });
        return;
      }
      this.date_start = e.detail.value;
    },
    dateEndChange(e) {
      console.log(e.target);
      if (e.detail.value < this.date_start) {
        // uni.showToast({
        //   title: '不能小于起始日期',
        //   duration: 1000,
        //   icon: 'none'
        // });
        return;
      }
      this.date_end = e.detail.value;
    },
    setDistanceToolInstance({ map }) {
      this.distanceTool = new DistanceTool(map, {
        lineStroke: 2
      });
    },
    openDistanceTool(e) {
      const { distanceTool } = this;
      distanceTool && distanceTool.open();
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  padding-top: 30px;
}
.bm-view {
  width: 100%;
  height: 800px;
}
.ctrl-btn {
  background-color: #8ea8e0;
  box-shadow: 0.5px 0.5px 1px 1px #aaaaaa;
  border-radius: 2px;
  width: 72px;
  /* height: 20px; */
  line-height: 22px;
  padding: 0px 1px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.edit-complain {
  font: bold;
  color: red;
  text-decoration: underline;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
$bgBlueColor: #1881bf;

h3.title {
  box-sizing: border-box;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  font-weight: 600;
  padding: 0 0 0 10px;
  border: 1px #e5eef3 solid;
  color: #2274a4;
  background: #f5f9f9;
  width: 100%;
  text-align: center;
}
.title-color {
  color: red;
  padding: 0px 5px;
}
.container {
  margin: 0 auto;
  min-width: 1366px;
  padding: 0px;
  min-height: 760px;

  .right {
    width: 320px;
    float: left;

    .header {
      width: 320px;
      clear: left;
      height: 34px;
      line-height: 34px;
      color: black;
      background: #f5f9f9;
      padding-left: 20px;
    }

    .top {
      height: 70px;
      padding: 8px 5px 12px 5px;
    }
  }

  .right-context {
    float: left;
  }

  .item {
    height: 28px;
    line-height: 28px;
    font-size: 14px;

    .el-icon-check {
      color: #67c23a;
    }

    .el-icon-close {
      color: #f56c6c;
    }

    .iconfont {
      font-size: 25px;
      line-height: 25px;
    }
  }
  .list {
    .item {
      width: 93px;
      height: 30px;
      line-height: 30px;
      display: block;
    }

    .item.fl {
      float: left;
      font-weight: bold;
    }
    .item.fl2 {
      float: right;
      font-weight: bold;
      padding-right: 5px;
    }
    .list-context {
      border-radius: 5px;
      margin-top: 10px;
      background: white;

      .list-scroll {
        margin-top: 10px;
        overflow-y: auto;
        min-height: 537px;
        overflow-x: hidden;
        scrollbar-face-color: seagreen;
        scrollbar-arrow-color: skyblue;

        .row {
          float: left;
          width: 320px;
          cursor: pointer;
          margin-top: 5px;
          margin-left: 5px;
          padding-top: 5px;
          border: 1px solid #ebeef5;
          border-radius: 5px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

          .head-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: #1781bf;
            font-weight: 400;
            padding-left: 10px;
            height: 30px;
            line-height: 30px;
          }
          .row-second {
            padding-left: 10px;
            font-size: 12px;
            padding-top: 5px;
          }
          .row-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            // padding-bottom: 5px;
            font-size: 12px;
            color: rgb(128, 128, 128);
            // border-bottom: 1px solid #eee;
            padding-left: 10px;
            line-height: 15px;
          }
        }

        .row.active {
          background-color: #e1f3d8;
        }
      }
    }
  }
}
</style>
