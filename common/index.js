import {config} from './config.js'
const ajax = {
	get: function(url, params, doSuccess, doFail ,options={}) {
		let initial_url = url
		let header = {
			"content-type": "application/json",
		}
		if(uni.getStorageSync('token')){
			header.Authorization = uni.getStorageSync('token')
		}
		
		url = config.apiDomain + url

		uni.request({
			url: url,
			data: params,
			header,
			method: 'GET',
			success: (res) => {
				if (res.statusCode==500){
					uni.showToast({
						title: "服务器内部错误",
						icon: "none",
						duration: 2000
					})
					doFail&&doFail(res)
					return
				}
				if (res.data.code == -1) {
					uni.showToast({
						title: "请先登录",
						icon: "none",
						duration: 2000
					})
					setTimeout(()=> {
						uni.navigateTo({
						    url: '/pages/index/index.vue'
						});
					}, 2000)
				}
				if (res.data.code == -2) {
					uni.showToast({
						title: "登录已失效，请重新登录",
						icon: "none",
						duration: 2000
					})
					setTimeout(()=> {
						uni.navigateTo({
						    url: '/pages/index/index.vue'
						});
					}, 2000)
				}
				doSuccess(res)
			},
			fail: (err) => {
				if (doFail) {
					doFail(err)
				}
			},
		});
	},
	post: function(url, params, doSuccess, doFail, options={}) {
		let initial_url = url
		let header = {
			"content-type": "application/json",
		}
		if(uni.getStorageSync('token')){
			header.Authorization = uni.getStorageSync('token')
		}
		
		url = config.apiDomain + url
		
		uni.request({
			url: url,
			data: params,
			header,
			method: 'POST',
			success: (res) => {
				if (res.statusCode==500){
					uni.showToast({
						title: "服务器内部错误",
						icon: "none",
						duration: 2000
					})
					doFail&&doFail(res)
					return
				}
				if (res.data.code == -1) {
					uni.showToast({
						title: "请先登录",
						icon: "none",
						duration: 2000
					})
					setTimeout(()=> {
						uni.navigateTo({
						    url: '/pages/index/index.vue'
						});
					}, 2000)
				}
				if (res.data.code == -2) {
					uni.showToast({
						title: "登录已失效，请重新登录",
						icon: "none",
						duration: 2000
					})
					setTimeout(()=> {
						uni.navigateTo({
						    url: '/pages/index/index.vue'
						});
					}, 2000)
				}
				doSuccess(res)
			},
			fail: (err) => {
				if (doFail) {
					doFail(err)
				}
			},
		});
	}
}

module.exports = {
	ajax,
	config
}