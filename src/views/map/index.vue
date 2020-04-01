<template>
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
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :show-address-bar="true" :auto-location="true"></bm-geolocation><!-- 定位控件 -->
      <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT" offset="{width:20,height:50" }></bm-panorama><!-- 全景控件 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation><!-- 缩放控件 -->
      <!-- 测距控件 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:100,height:10}">
        <el-button size="mini" type="primary" @click="openDistanceTool">开启测距</el-button>
      </bm-control>
      <!-- 加载控件 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:185,height:10}">
        <el-dropdown @command="handleCommand">
          <el-button type="primary" size="mini" :loading="loading">
            加载数据<i class="el-icon-arrow-down el-icon--right"></i>
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
        <el-select v-model="value" clearable placeholder="搜索类型" size="mini" style="width:55%;" type="primary" @change="handleSearch">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </bm-control>
      <!-- 自动填充搜索 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 660, height: 10}">
        <bm-auto-complete v-model="keyword" :sug-style="sug_style">
          <el-input v-model="keyword" size="mini" placeholder="搜索地点"></el-input>
        </bm-auto-complete>
      </bm-control>
      <bm-local-search :localtion="center" :force-local="true" :keyword="keyword" :auto-viewport="true"></bm-local-search>

      <!-- 行政区域 -->
      <bm-boundary name="衢州市柯城区" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>
      <bm-boundary name="衢州市衢江区" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>
      <bm-boundary name="衢州市江山市" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>
      <bm-boundary name="衢州市龙游县" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>
      <bm-boundary name="衢州市常山县" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>
      <bm-boundary name="衢州市开化县" :stroke-weight="2" stroke-color="red" fill-color=""></bm-boundary>

      <!-- 点聚合 -->
      <!-- <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>
      </bml-marker-clusterer> -->
      <!--信息窗体-->
      <bm-info-window
        :position="infoWindow.position"
        :title="infoWindow.title"
        :show="infoWindow.show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
      >
        <p><span class="left"></span><span class="right">{{ infoWindow.content.info1 }}</span></p>
        <p><span class="left"></span><span class="right">{{ infoWindow.content.info2 }}</span></p>
        <p><span class="left"></span><span class="right">{{ infoWindow.content.info3 }}</span></p>
        <p><span class="left"></span><span class="right">{{ infoWindow.content.info4 }}</span></p>
        <p><a class="edit-complain" href="">更新信息</a></p>
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
          <bm-context-menu-item :callback="editSite" text="修改站点" icon-url="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"></bm-context-menu-item>
          <bm-context-menu-item seperator></bm-context-menu-item>
          <bm-context-menu-item text="上传图片" icon-url="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"></bm-context-menu-item>
        </bm-context-menu>
      </bm-marker>
      <!-- 加载投诉海量点 -->
      <bm-point-collection
        :points="complain_points"
        shape="BMAP_POINT_SHAPE_RHOMBUS"
        color="#00ffff"
        size="BMAP_POINT_SIZE_NORMAL"
        @click="clickComplainsHandler"
      >
      </bm-point-collection>
      <!-- 加载故障海量点 -->
      <!-- <bm-point-collection
        :points="fault_points"
        shape="BMAP_POINT_SHAPE_RHOMBUS"
        color="#ff0000"
        size="BMAP_POINT_SIZE_NORMAL"
        @click="clickHandler"
      ></bm-point-collection> -->
      <!-- 获取坐标 -->
      <!-- <bm-marker :position="{lng: lng, lat: lat}" :dragging="true" icon="../../static/image/coord-point.png">
				</bm-marker> -->
      <bm-marker :position="{lng: coord.lng, lat: coord.lat}" :dragging="true" :icon="coord.icon">
        <bm-label :content="coord.label" :label-style="{color: 'red', fontSize : '12px'}" :offset="{width: -60, height: -40}" />
      </bm-marker>
    </baidu-map>
  </div>
</template>
<script>
import '@/styles/base.css'
import '@/styles/infowindow.css'
import DistanceTool from 'bmaplib.new-distancetool'
// import { reverseGeocoder } from '@/api/bmap.js'
import { getComplain } from '@/api/complain.js'
import { getSite } from '@/api/site.js'
import { bd09towgs84, wgs84tobd09 } from '@/utils/transformCoordinate.js'

export default {
  data() {
    return {
      distanceTool: '',
      auto_flag: true,
      complain_flag: false,
      center: '衢州市',
      ak: 'U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO',
      mapType: 'BMAP_NORMAL_MAP',
      zoom: 10,
      scale: 16, // 该层级显示卫星图层
      map: {
        width: '100%',
        height: '710px'
      },
      town: '白云街道',
      address: '',
      lng: 0,
      lat: 0,
      coord: {
        lng: 0,
        lat: 0,
        label: '',
        icon: '',
        style: ""
      }, // 坐标拾取
      site_points: [], // 加载基站点
      loading: false, // 加载状态
      site_data: [],
      complain_points: [], // 加载投诉点
      fault_points: [], // 加载故障点
      markers: [],
      keyword: '',
      value: '搜索地图',
      infoWindow: {
        position: {
          lng: 0,
          lat: 0
        },
        title: '',
        show: false,
        content: {
          info1: '',
          info2: '',
          info3: '',
          info4: ''
        }
      },
      listQuery: { // 投诉库查询参数
        page: 1,
        limit: 0, // 每页显示数量
        city: '',
        user_tel: '',
        is_solved: '',
        is_overtime: '',
        start_date: '',
        end_date: '',
        address: ''
      },
      select_date: '',
      leftHeight: '540px',
      containerHeight: '700px',
      districtType: 0, // 行政区域
      districtTypeOptions: '', // 行政区域选项
      array: ['中国', '美国', '巴西', '日本'],
      index: 0,
      options: [{
        value: 'map',
        label: '搜索地图'
      }, {
        value: 'cp',
        label: '搜索投诉'
      }, {
        value: 'site',
        label: '搜索站点'
      }, {
        value: 'coord',
        label: '搜索坐标'
      }],
      sug_style: { zIndex: 5 }
    }
  },
  unmount() {
    this.distanceTool && this.distanceTool.close()
  },
  onLoad() {
    this.getDate(); // 获取当前时间
    this.getMapCenter();
    // this.getCoord();
  },
  methods: {
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
      if (command === "a") { // 加载投诉数据
        this.getCompalins()
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
      var today = now.getFullYear() + "-" + (month) + "-" + (day);
      this.listQuery.end_date = today;
    },
    // 条件过滤搜索
    handleFilter() {
      this.listQuery.start_date = this.select_date[0]
      this.listQuery.end_date = this.select_date[1]
      this.getCompalins()
      // if (this.checkMobile(this.keyword)) {
      //   // 搜索为用户号码
      //   this.listQuery.user_tel = this.keyword // 用户号码搜索
      // } else {
      //   this.listQuery.address = this.keyword // 投诉地点搜索
      // }
    },
    handleSearch(e) {
      // console.log(e) // 为选中的value
      switch (e) {
        case 'map':
          alert('搜索地图')
          break;
        case 'cp':
          alert('搜索投诉')
          this.sug_style = { zIndex: 1 }
          break;
        case 'site':
          alert('搜索站点')
          break;
        case 'coord':
          alert('搜索坐标')
          break;
        default:
      }
    },
    // 获取地图中心点坐标
    getMapCenter(e) {
      this.lng = e.target.getCenter().lng
      this.lat = e.target.getCenter().lat
      // alert(e.target.getCenter().lng); //获取地图中心点
      console.log(this.town)
      if (this.zoom >= this.scale) {
        this.mapType = "BMAP_HYBRID_MAP" // 切换至混合地图
        this.getSites() // 移动时动态获取站点
      }
    },
    // 获取地图当前缩放级别
    getZoom(e) {
      // alert(e.target.getZoom());
      this.zoom = e.target.getZoom();
      if (this.zoom >= this.scale) {
        this.mapType = "BMAP_HYBRID_MAP" // 切换至混合地图
        this.getSites(); // 缩放时动态获取站点
      } else {
        this.mapType = "BMAP_NORMAL_MAP"
        this.markers = [] // 清空基站图标
      }
    },
    // 右键拾取坐标，并获取经纬度+地址信息
    async getCoord(e) {
      // 放大到16级时才允许拾取坐标系
      if (this.zoom < this.scale) {
        return
      }
      this.coord.lng = e.point.lng;
      this.coord.lat = e.point.lat;
      await this.baiduReverseGeocoder(this.coord.lng, this.coord.lat);
      console.log(this.address);
      this.coord.label = "经纬度：" + this.coord.lng + ";" + this.coord.lat + "<br />地  址：" + this.address;
      this.value = "当前经纬度：" + this.coord.lng + ";" + this.coord.lat; // 经纬度赋值到搜索框，用于粘贴
    },
    // 获取投诉数据
    getCompalins() {
      // this.complain_flag = !this.complain_flag;
      this.loading = true
      getComplain(this.listQuery).then(response => {
        // console.log(response.data)
        this.complain_points = response.data;
        this.loading = false
      })
        .catch(response => {
          this.loading = false
        })
    },
    // =======请求百度地图web API获取详细POI==============
    // =====2020年4月1日 22:02:45===================
    // =====coordtype=bd09ll,extensions_poi=1=======
    async baiduReverseGeocoder(lng, lat) {
      var url = 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=' + this.ak + '&output=json&coordtype=bd09ll&ret_coordtype=bd09ll&extensions_poi=1&extensions_town=true&&location=' + lat + ',' + lng
      await this.$jsonp(url)
        .then(res => {
          // console.log(res.result)
          var data = res.result;
          this.lng = data.location.lng; // 显示在底部cover-view
          this.lat = data.location.lat;
          this.town = data.addressComponent.town; // 乡镇、街道
          // console.log(this.town);
          var address = data.addressComponent.district + data.addressComponent.town; // 县市+乡镇/街道
          var poi = data.sematic_description.split(",")[0]; // poi，具体到小区或村庄
          this.address = address + poi;
        })
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
              info1: '投诉时间：' + data.cp_time,
              info2: '投诉内容：' + data.cp_info,
              info3: '处理过程：' + data.deal_info,
              info4: '解决方案：' + data.solve_plan
            }
          };
          return
        }
      }
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true
    },
    infoWindowClose(e) {
      this.infoWindow.show = false
    },
    // ====加载基站数据==========
    // =========================
    async getSites() {
      await this.baiduReverseGeocoder(this.lng, this.lat);
      var center = bd09towgs84(this.lng, this.lat)
      var lng = center[0]
      var lat = center[1]
      await getSite(this.town, lng, lat).then(response => {
        // console.log(response)
        this.site_data = response.data
        this.showSites()
      })
        .catch(response => {
        })
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
          icon = '/image/indoor.png'
        } else {
          icon = '/image/site.png'
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
              info1: '塔桅类型：' + data.tower,
              info2: '塔桅高度：' + data.height + '米',
              info3: '经度：' + data.lng,
              info4: '纬度：' + data.lat
            }
          };
          return
        }
      }
    },
    // 右键编辑站点信息
    editSite() {
      alert("hello");
    },
    gotoBeijing() {
      return
    },
    gotoShanghai() {
      return
    },
    dateStartChange(e) {
      console.log(e.target);
      if (e.detail.value > this.date_end) {
        // uni.showToast({
        //   title: '不能大于截止日期',
        //   duration: 1000,
        //   icon: 'none'
        // });
        return
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
        return
      }
      this.date_end = e.detail.value
    },
    setDistanceToolInstance({
      map
    }) {
      this.distanceTool = new DistanceTool(map, {
        lineStroke: 2
      })
    },
    openDistanceTool(e) {
      const {
        distanceTool
      } = this
      distanceTool && distanceTool.open()
    }
  }
}
</script>

<style>
  .map{
    padding-top: 30px;
  }
  .bm-view {
    width: 100%;
    height: 800px;
  }
	.ctrl-btn {
		background-color: #8EA8E0;
		box-shadow: 0.5px 0.5px 1px 1px #AAAAAA;
		border-radius: 2px;
		width: 72px;
		/* height: 20px; */
		line-height: 22px;
		padding: 0px 1px;
		font-size: 12px;
		font-weight: bold;
		color: #FFFFFF;
	}
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .edit-complain{
    font:bold;
    color:red;
    text-decoration: underline;
  }
</style>
