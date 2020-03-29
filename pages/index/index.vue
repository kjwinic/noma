<template>
	<div>
		<div id="sidebar" v-show="is_show">
			<div id="menu">
				<ul>
					<li id="list_item1">
						<p class="one_head">时间选择</p>
						<view class="date">
							<view class="title">起始日期</view>
							<picker mode="date" :value="date_start" start="2018-01-01" end="2025-01-01" @change="dateStartChange">
								<view class="picker">
									{{date_start}}
								</view>
							</picker>
						</view>
						<view class="date">
							<view class="title">截止日期</view>
							<picker mode="date" :value="date_end" start="2018-01-01" end="2025-01-01" @change="dateEndChange">
								<view class="picker">
									{{date_end}}
								</view>
							</picker>
						</view>
						<view class="btn">
							<button type="primary" size="mini" form-type="submit">查询</button>
						</view>
					</li>

					<li id="list_item2">
						<p class="one_head">投诉概况</p>
						<tr>
							<p style="text-align: center;"></p>
						</tr>

					</li>

					<li id="list_item3">
						<p class="one_head">热点投诉区域</p>
						<div id="submenu1" class="submenu">
							<dl>
								test
							</dl>
						</div>
					</li>
					<li id="list_item3">
						<p class="one_head">重复投诉用户</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="clearfix" id="map">
			<baidu-map class="bm-view" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" :map-type="map_type" @ready="setDistanceToolInstance"
			 @moveend="getMapCenter" @zoomend="getZoom" @click="getCoord">
				<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
				<!-- <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale><!-- 比例尺 --> -->
				<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :showAddressBar="true" :autoLocation="true"></bm-geolocation><!-- 定位控件 -->
				<bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT" offset="{width:20,height:50" }></bm-panorama><!-- 全景控件 -->
				<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation><!-- 缩放控件 -->
				<!-- 测距控件 -->
				<bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:100,height:10}">
					<button @click="openDistanceTool" class="ctrl-btn">开启测距</button>
				</bm-control>
				<bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width:180,height:10}">
					<button @click="loadCompalins" class="ctrl-btn">加载数据</button>
				</bm-control>
				<!-- 自动填充 -->
				<bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 500, height: 0}">
					<bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 5}" @confirm="searchMap">
						<view class="cu-bar search bg-white">
							<view class="search-form round">
								<text class="cuIcon-search"></text>
								<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索地图"
								 confirm-type="search" class="uni-input-input" :value="value"></input>
							</view>
							<!-- <view class="action">
						 		<button class="cu-btn bg-green shadow-blur round">搜索</button>
						 	</view> -->
						</view>
					</bm-auto-complete>
				</bm-control>
				<bm-local-search :localtion="center" forceLocal="true" :keyword="keyword" :auto-viewport="true"></bm-local-search>
				
				<!-- 行政区域 -->
				<bm-boundary name="衢州市柯城区" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>
				<bm-boundary name="衢州市衢江区" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>
				<bm-boundary name="衢州市江山市" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>
				<bm-boundary name="衢州市龙游县" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>
				<bm-boundary name="衢州市常山县" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>
				<bm-boundary name="衢州市开化县" :strokeWeight="2" strokeColor="red" fillColor=""></bm-boundary>

				<!-- 点聚合 -->
				<!-- <bml-marker-clusterer :averageCenter="true">
		    <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>
		  </bml-marker-clusterer> -->
				<!--信息窗体-->
				<bm-info-window :position="infoWindow.position" :title="infoWindow.title" :show="infoWindow.show" @close="infoWindowClose"
				 @open="infoWindowOpen">
					<p><span class="left"></span><span class="right">{{infoWindow.content.info1}}</span></p>
					<p><span class="left"></span><span class="right">{{infoWindow.content.info2}}</span></p>
					<p><span class="left"></span><span class="right">{{infoWindow.content.info3}}</span></p>
					<p><span class="left"></span><span class="right">{{infoWindow.content.info4}}</span></p>
				</bm-info-window>
				<!-- 加载基站点 -->
				<bm-marker v-for="marker in markers" :key="marker.id" :position="{lng: marker.lng, lat: marker.lat}" :icon="marker.icon"
				 :title="marker.title" @click="clickSitesHandler">
					<!-- 右键菜单 -->
					<bm-context-menu>
						<bm-context-menu-item :callback="editSite" text="修改站点" iconUrl="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"></bm-context-menu-item>
						<bm-context-menu-item seperator></bm-context-menu-item>
						<bm-context-menu-item text="上传图片" iconUrl="http://lbsyun.baidu.com/skins/MySkin/resources/img/red.png"></bm-context-menu-item>
					</bm-context-menu>
				</bm-marker>
				<!-- 加载投诉海量点 -->
				<bm-point-collection :points="complain_points" shape="BMAP_POINT_SHAPE_RHOMBUS" color="#00ffff" size="BMAP_POINT_SIZE_NORMAL"
				 @click="clickComplainsHandler"></bm-point-collection>
				<!-- 加载故障海量点 -->
				<bm-point-collection :points="fault_points" shape="BMAP_POINT_SHAPE_RHOMBUS" color="#ff0000" size="BMAP_POINT_SIZE_NORMAL"
				 @click="clickHandler"></bm-point-collection>
				<!-- 获取坐标 -->
				<!-- <bm-marker :position="{lng: lng, lat: lat}" :dragging="true" icon="../../static/image/coord-point.png">
				</bm-marker> -->
				<bm-marker :position="{lng: coord.lng, lat: coord.lat}" :dragging="true" :icon="coord.icon">
					<bm-label :content="coord.label" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -60, height: -40}" />
				</bm-marker>
			</baidu-map>
		</div>
	</div>
</template>


<script>
	import '../../common/base.css'
	import '../../common/infowindow.css'
	import DistanceTool from '../../common/bmaplib.new-distancetool'
	export default {
		data() {
			return {
				is_show: false, // 控制侧边栏显示
				auto_flag: true,
				complain_flag: false,
				center: "衢州市",
				map_type: "BMAP_NORMAL_MAP",
				zoom: 10,
				scale: 16, // 该层级显示卫星图层
				map: {
					width: '1000px',
					height: '710px'
				},
				town: "白云街道",
				address: '',
				lng: 0,
				lat: 0,
				coord: {
					lng: 0,
					lat: 0,
					label: '',
					icon: '',
					style: "",
				}, // 坐标拾取 
				site_points: [], //加载基站点

				site_data: [],
				complain_points: [], //加载投诉点
				fault_points: [], //加载故障点
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
						info4: '',
					},
				},
				date_start: '2020-01-01',
				date_end: '2020-03-16',
				leftHeight: '540px',
				containerHeight: '700px',
				districtType: 0, //行政区域
				districtTypeOptions: '', //行政区域选项
				array: ['中国', '美国', '巴西', '日本'],
				index: 0,
			}
		},
		unmount() {
			distanceTool && distanceTool.close()
		},
		onLoad() {
			this.getDate(); //获取当前时间
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
			// 获取当前时间
			getDate() {
				//时间控件，默认当前日期
				var now = new Date();
				//格式化日，如果小于9，前面补0
				var day = ("0" + now.getDate()).slice(-2);
				//格式化月，如果小于9，前面补0
				var month = ("0" + (now.getMonth() + 1)).slice(-2);
				//拼装完整日期格式
				var today = now.getFullYear() + "-" + (month) + "-" + (day);
				this.date_end = today;
			},

			// 获取地图中心点坐标
			getMapCenter(e) {
				this.lng = e.target.getCenter().lng;
				this.lat = e.target.getCenter().lat;
				// alert(e.target.getCenter().lng); //获取地图中心点
				if (this.zoom >= this.scale) {
					this.map_type = "BMAP_HYBRID_MAP"; // 切换至混合地图
					this.getSites(); //移动时动态获取站点
				}
			},
			// 获取地图当前缩放级别
			getZoom(e) {
				// alert(e.target.getZoom());
				this.zoom = e.target.getZoom();
				if (this.zoom >= this.scale) {
					this.map_type = "BMAP_HYBRID_MAP", // 切换至混合地图
						this.getSites(); //缩放时动态获取站点
				} else {
					this.map_type = "BMAP_NORMAL_MAP"; // 切换至混合地图
					this.markers = []; // 清空基站图标
				}
			},
			async getCoord(e) {
				// 放大到16级时才允许拾取坐标系
				if (this.zoom < this.scale) {
					return
				}
				this.coord.lng = e.point.lng;
				this.coord.lat = e.point.lat;
				await this.baiduReverseGeocoder(this.coord.lng, this.coord.lat);
				// console.log(this.address);
				this.coord.label = "经纬度：" + this.coord.lng + ";" + this.coord.lat + "<br />地  址:" + this.address;
				this.value = "当前经纬度:" + this.coord.lng + ";" + this.coord.lat; // 经纬度赋值到搜索框，用于粘贴
			},
			searchMap() {
				// alert("hello");
			},
			//==============================================
			//===========2019年10月13日 23:43:58================= 
			//===========搜索基站数据=============
			//============================================== 	
			searchSite() {
				s = document.getElementById("idSiteSearch").value;
				if (s != "") {
					var points = []; // 保存所有搜索到的数据
					for (var i = 0; i < data.data.length; i++) {
						// 遍历所有的点匹配点击的经纬度，添加需要的标签信息
						if (data.data[i][2].search(s) != -1) {
							points.push(data.data[i]);
						}
					}
					for (var i = 0; i < points.length; i++) {
						//		points.push(new BMap.Point(data.data[i][0], data.data[i][1], data.data[i][2], data.data[i][3]));
						site_name = points[i][2];
						tower_type = points[i][3];
						lng = points[i][0] + 0.011245;
						lat = points[i][1] + 0.002519; // 转换为百度经纬度，用于信息标注

						var point = new BMap.Point(lng, lat);
						var opts = {
							offset: new BMap.Size(25, 0),
							width: 0, // 信息窗口宽度根据内容自动调整
							height: 0, // 信息窗口高度根据内容自动调整
						}
						var marker = new BMap.Marker(point);
						map.addOverlay(marker);
						marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
						var label = new BMap.Label(site_name, opts);
						label.setStyle({
							color: "#fff",
							backgroundColor: "#333333",
							border: "0",
							fontSize: "12px",
							width: "100px",
							opacity: "0.6",
							verticalAlign: "center",
							fontWeight: "bold",
							borderRadius: "2px",
							whiteSpace: "normal",
							wordWrap: "break-word",
							padding: "7px",
						});
						marker.setLabel(label);
						map.centerAndZoom(point, 14); //放大地图  
					}
				}
			},
			loadCompalins() {
				this.complain_flag = !this.complain_flag;
				if (this.complain_flag) {
					uni.showLoading({
						title: '加载中'
					});
					this.getComplains();
					uni.hideLoading();
				} else {
					return
				}
			},
			//=======请求百度地图web API获取详细POI==============
			//=====2020年1月28日 19:49:57===================
			//=====coordtype=bd09ll,extensions_poi=1=======
			async baiduReverseGeocoder(lng, lat) {
				let url =
					"http://api.map.baidu.com/reverse_geocoding/v3/?ak=" + this.config.BAIDU_AK +
					"&output=json&coordtype=bd09ll&ret_coordtype=bd09ll&extensions_poi=1&extensions_town=true&location=" +
					lat + "," + lng;
				let [err, res] = await this.$http.bmap_request(url, {}, "bmap", {
					token: true,
					checkToken: false
				});
				//请求错误
				if (!this.$http.checkError(err, res)) {
					uni.showToast({
						title: '请求资源失败，请重试...',
						duration: 1000,
						icon: 'none',
					});
					return;
				}
				//请求成功	
				var data = res.data.result;
				this.lng = data.location.lng; //显示在底部cover-view
				this.lat = data.location.lat;
				this.town = data.addressComponent.town; //乡镇、街道
				// console.log(this.town);
				var address = data.addressComponent.district + data.addressComponent.town; //县市+乡镇/街道					
				var poi = data.sematic_description.split(",")[0]; //poi，具体到小区或村庄
				this.address = address + poi;
			},
			// ====加载投诉数据========
			//====2020年3月17日 22:58:50====
			async getComplains() {
				let url = "/complains?";
				let [err, res] = await this.$http.get(url, {}, {
					token: true,
					checkToken: false
				});
				let error = this.$http.checkError(err, res, () => {
					// uni.hideLoading();
				}, () => {
					// uni.hideLoading();
				});
				//请求错误
				if (!this.$http.checkError(err, res)) {
					uni.showToast({
						title: '请求资源失败，请重试...',
						duration: 1000,
						icon: 'none',
					});
					return;
				}
				// 请求成功
				this.complain_points = res.data.data;

			},
			clickComplainsHandler(e) {
				var len = this.complain_points.length;
				for (var i = 0; i < len; i++) {
					var data = this.complain_points[i];
					if (data.lng == e.point.lng && data.lat == e.point.lat) {
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
								info4: '解决方案：' + data.solve_plan,
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
			//====加载基站数据==========
			//=========================
			async getSites() {
				await this.baiduReverseGeocoder(this.lng, this.lat);
				// alert(this.town);
				// let api = "http://yihaov.com:8086/sitenavi/api/v1/sites";
				var center = this.CoordTrans.bd09towgs84(this.lng, this.lat);
				var lng = center[0];
				var lat = center[1];
				//从服务器获取基站数据
				let url = "/sites?town=" + this.town + "&lng=" + lng + "&lat=" + lat;
				let [err, res] = await this.$http.get(url, {}, {
					token: true,
					checkToken: false
				});
				//请求错误
				if (!this.$http.checkError(err, res)) {
					return;
				}
				//请求成功
				this.site_data = res.data.data;
				console.log(res.data.data)
				this.showSites();
			},
			//加载基站图标
			showSites() {
				var len = this.site_data.length;
				var data = this.site_data;
				var icon;
				var markers;
				markers = [];
				for (var i = 0; i < len; i++) {
					var point = this.CoordTrans.wgs84tobd09(data[i].lng, data[i].lat);
					if (data[i].tower == "无塔桅") {
						icon = '../../static/image/indoor.png'
					} else {
						icon = '../../static/image/site.png'
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
							},
						},
						title: data[i].site_name,
					});
					this.markers = markers; //赋值到this
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
					if (data.site_name == site_name) {
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
								info4: '纬度：' + data.lat,
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
					uni.showToast({
						title: '不能大于截止日期',
						duration: 1000,
						icon: 'none',
					});
					return
				}
				this.date_start = e.detail.value;
			},
			dateEndChange(e) {
				console.log(e.target);
				if (e.detail.value < this.date_start) {
					uni.showToast({
						title: '不能小于起始日期',
						duration: 1000,
						icon: 'none',
					});
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
	.bm-view {
		width: 100%;
		height: 850px;
	}

	.top {
		display: flex;
		flex-direction: row;
	}

	.date {
		display: flex;
		justify-content: space-between;
		padding: 2upx 10upx;
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

	.btn {
		display: flex;
		justify-content: center;
	}

	.cu-bar {
		min-height: 40px;
	}

	.cu-bar .search-form {
		line-height: 32px;
		height: 32px;
		font-size: 12px;
		margin: 0 15px;
		margin: 0 5px;
	}

	.cu-bar .search-form input {
		height: 32px;
		line-height: 32px;
		font-size: 12px;
		padding: 0px;
		width: 300px;
	}

	/* .uni-input-input{
		width: 300px;
	} */
</style>
