//封装自定义request组件
import config from "./config.js"
import User from "./user.js"

export default {
	config: {
		baseUrl: config.WEB_URL,
		requestType: "server",
		header: {
			// "Authorization":"bearer "+a_token, 
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json"
	},
	request(options = {}) {
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		//请求类型,默认为请求服务器,其它为请求百度地图web API
		options.requestType = options.requestType || this.config.requestType; 
		// console.log(options.requestType);
		if (options.requestType =="server") {
			options.url = this.config.baseUrl + options.url; //请求服务器,拼接字符串
			// console.log(options.url);
		} else {
			options.url = options.url;
		}
		if (options.token) {
			if (options.checkToken && User.token) {
				uni.showToast({
					title: '请先登录',
					icon: "none"
				})
				return uni.navigateTo({
					url: '/pages/login/login'
				})
			}
			options.header.token = User.token;
		}
		return uni.request(options);
	},
	get(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	put(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'PUT';
		return this.request(options);
	},
	delete(url, options = {}) {
		options.url = url;
		options.method = 'DELETE';
		return this.request(options);
	},
	checkError(err, res, errfun = false, resfun = false) {
		if (err) {
			typeof errfun === 'function' && errfun();
			uni.showToast({
				title: '加载失败',
				icon: "none"
			});
			return false;
		}
		if (res.data.errcode) {
			typeof errfun === 'function' && resfun();
			uni.showToast({
				title: res.data.msg,
				icon: "none"
			});
			return false;
		}
		return true;
	},
	// 验证用户是否登录
	checkToken(checkToken) {
		if (checkToken && !User.token) {
			uni.showToast({
				title: '请先登录',
				icon: "none"
			})
			uni.navigateTo({
				url: '/pages/login/login'
			});
			return false;
		}
		return true;
	},
	// 验证用户权限
	checkAuth(checkAuth) {
		if (checkAuth && !User.userinfo.phone) {
			uni.showToast({
				title: '请先绑定手机号码',
				icon: "none"
			})
			uni.navigateTo({
				url: '/pages/user-bind-phone/user-bind-phone'
			});
			return false;
		}
		return true;
	},
	//百度地图web api请求
	bmap_request(url, data, requestType,options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'GET';
		options.requestType = requestType;
		return this.request(options);
	}
}
