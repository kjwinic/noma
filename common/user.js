export default {
	token: false, //用户口令
	user_info: false,//用户信息
	navigate(options, type = "navigateTo") {
		if (!this.token) { //验证不通过跳转至登录页
			return uni.navigateTo({
				url: 'pages/login/login'
			});
		}
		switch (type) {
			case "navigateTo":
				uni.navigateTo(
					options);
				break;
			case "redirectTo":
				uni.redirectTo(
					options);
				break;
			case "reLaunch":
				uni.reLaunch(
					options);
				break;
			case "switchTab":
				uni.switchTab(
					options);
				break;
		}
	}
}
