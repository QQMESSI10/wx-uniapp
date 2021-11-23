<template>
	<view class="page">
		<view class="page-status-bg"></view>
		<view class="top">
			<text>红旗学习小队聊天室</text>
			<u-icon name="account" color="#ffffff" size="50rpx" class="top-my" @click="showPopup = true"></u-icon>
			<!-- <image @click="showPopup = true" src="../../static/d2.png" class="top-my" mode="heightFix"></image> -->
			<!-- <u-alert style="position: absolute;top: 82rpx;left: 0;width: 100%;height: 70rpx;" :title="'欢迎来到红旗学习小组聊天室'+version" type = "primary" :closable="true"></u-alert> -->
		</view>
		<view class="list" id="list">
			<!-- <u-notice-bar direction="row" :text="'欢迎来到红旗学习小组聊天室'+version" mode="closable"></u-notice-bar> -->
			<view class="list-line" :class="{'my-line': item.isMy}" v-for="(item, index) in newsList" :key="index">
				<template v-if="item.isMy">
					<view class="line-content my-content">
						<view class="content-info">
							<u-loading-icon v-if="item.isLoading" mode="circle" timingFunction="linear"  class="send-loading" size="28rpx"></u-loading-icon>
							<view class="send-error" v-if="item.isError">
								<u-icon name="error" color="#fff" size="16rpx"></u-icon>
							</view>
							<view class="content-time">{{item.time | timeFormat}}</view>
							<view class="info-name">{{item.name}}</view>
						</view>
						<view class="content-text">{{item.content}}</view>
					</view>
					<u-avatar :text="item.name[0]" fontSize="40rpx" randomBgColor size="80rpx" shape="square" class="line-avatar"></u-avatar>
				</template>
				<template v-else>
					<u-avatar :text="item.name[0]" fontSize="40rpx" randomBgColor size="80rpx" shape="square" class="line-avatar"></u-avatar>
					<view class="line-content">
						<view class="content-info">
							<view class="info-name">{{item.name}}</view>
							<view class="content-time">{{item.time | timeFormat}}</view>
							<u-loading-icon v-if="item.isLoading" mode="circle" timingFunction="linear"  class="send-loading" size="28rpx"></u-loading-icon>
							<view class="send-error" v-if="item.isError">
								<u-icon name="error" color="#fff" size="16rpx"></u-icon>
							</view>
						</view>
						<view class="content-text">{{item.content}}</view>
					</view>
				</template>
			</view>
		</view>
		<view class="bottom">
			<u-row>
				<u-col span="10">
					<u--input v-model="content" class="content-input" maxlength="50" @confirm="sendMsg()"></u--input>
				</u-col>
				<u-col span="2">
					<u-button class="send-btn" type="primary" text="发送" @click="sendMsg()"></u-button>
				</u-col>
			</u-row>
		</view>
		<u-popup :show="showPopup" mode="right" borderRadius="12" @close="closePopup">
			<view class="my-popup">
				<view class="popup-info">
					<u-avatar :text="name[0]" fontSize="44rpx" randomBgColor size="100rpx"></u-avatar>
					<view class="popup-line popup-name">
						<view v-if="isEditName" class="flex-center">
							<u--input v-model="editName" class="edit-input" maxlength="8"></u--input>
							<u-button class="send-btn margin_l_10" type="primary" size="mini" text="保存" @click="submitEdit"></u-button>
						</view>
						<view v-else class="flex-center" @click="isEditName = true">
							<text class="my-name">{{name}}</text>
							<u-icon name="edit-pen" top="2" size="36rpx"></u-icon>
						</view>
					</view>
					<text class="popup-line my-phone">{{phone}}</text>
				</view>
				<u-button class="out-btn" type="primary" text="退出登录" @click="outLogin"></u-button>
			</view>
		</u-popup>
		<u-notify ref="uNotify" duration="2000"></u-notify>
	</view>
</template>

<script>
	import { io } from 'socket.io-client'
	import {config} from '../../common/index.js'
	export default {
		data() {
			return {
				content: '',
				showPopup: false,
				isEditName: false,
				name: '',
				editName: '',
				phone: '',
				newsList: [],
				version: '',
				isChatHistory: true,
			}
		},
		onLoad() {
			if (!uni.getStorageSync('token')) {
				uni.navigateTo({
					url: '../index/index'
				})
			}
			this.getInfo()
			this.getChatHistory()
			// const socket = io("http://wxapi.qinxiang.cc", { path: "/socket/" })
			const socket = io("http://localhost:3000", { path: "/socket/" })
			socket.on("connect", ()=> {
				console.log('socket已连接')
			})
			this.version = config.version
			socket.on('newMsg', (res)=> {
				if (res.phone == this.phone) {
					let msg = this.newsList.find(f => f.time == res.sendTime)
					if (msg) {
						msg.isLoading = false
					} else {
						this.newsList.push(res)
					}
				} else {
					this.newsList.push(res)
				}
			})
			socket.on('chatStatusIn', (res) => {
				if (this.$refs.uNotify) {
					this.$refs.uNotify.show({ type: 'success', message: res, duration: 2000 })
				}
			})
			socket.on('chatStatusOut', (res) => {
				if (this.$refs.uNotify) {
					this.$refs.uNotify.show({ type: 'error', message: res, duration: 2000 })
				}
			})
		},
		watch: {
			newsList: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.newsList.forEach(e => {
						if (e.phone == this.phone) {
							e.isMy = true
						}
					})
				}
			}
		},
		onReady() {
			// setTimeout(()=> {
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query.select('.top').boundingClientRect(data => {
			// 	  console.log(data);
			// 	  console.log("节点离页面顶部的距离为" + data.top);
			// 	}).exec();
			// },2000)
		},
		onShow() {
			this.$ajax.post('chatStateIn', {phone: uni.getStorageSync('token'), time: new Date().getTime()}, (res) => {})
		},
		onHide() {
			this.$ajax.post('chatStateOut', {name: this.name, time: new Date().getTime()}, (res) => {})
		},
		filters: {
			timeFormat(val) {
				let time = Number(val)
				let day = uni.$u.timeFormat(time, 'mm-dd');
				let nowDay = uni.$u.timeFormat(new Date().getTime(), 'mm-dd');
				if (day == nowDay) {
					return uni.$u.timeFormat(time, 'hh:MM')
				} else {
					return uni.$u.timeFormat(time, 'mm-dd hh:MM')
				}
			}
		},
		methods: {
			getInfo() {
				this.$ajax.post('userInfo', {}, (res) => {
					if (res.data.code == 1) {
						this.name = res.data.data.name
						this.editName = this.name
						this.phone = res.data.data.phone
					}
				})
			},
			getChatHistory(id) {
				let params = {}
				if (id) {
					params.chatId = id
				}
				this.$ajax.post('chatHistory', params, (res) => {
					if (res.data.code == 1) {
						if (res.data.data.length > 0) {
							this.newsList = res.data.data.concat(this.newsList)
							this.$nextTick(()=>{
								setTimeout(()=> {
									uni.pageScrollTo({scrollTop: 99999, duration: 0});
								}, 50)
							})
						} else {
							this.isChatHistory = false
							if (id) {
								uni.$u.toast('没有更多了')
							}
						}
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
			sendMsg() {
				if (!this.content || !uni.$u.trim(this.content, 'all')) {
					uni.$u.toast('发送消息不能为空')
					return
				}
				let sendTime = new Date().getTime()
				this.newsList.push({name: this.name, content: this.content, time: sendTime, phone: this.phone, isLoading: true})
				this.$nextTick(()=>{
					setTimeout(()=> {
						uni.pageScrollTo({scrollTop: 99999, duration: 0});
					}, 50)
				})
				let params = { sendTime, content: this.content }
				this.$ajax.post('sendMsg', params, (res) => {
					if (res.data.code != 1) {
						let msg = this.newsList.find(f => f.time == sendTime)
						if (msg) {
							msg.isLoading = false
							msg.isError = true
						}
					}
				})
				this.content = ''
			},
			submitEdit() {
				this.$ajax.post('editName', {name: this.editName}, (res) => {
					if (res.data.code == 1) {
						this.name = this.editName
						this.isEditName = false
						this.newsList.forEach(e => {
							if (e.phone == this.phone) {
								e.name = this.name
							}
						})
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
			closePopup() {
				this.showPopup = false
				setTimeout(()=> {
					this.editName = this.name
					this.isEditName = false
				}, 400)
			},
			outLogin() {
				uni.removeStorageSync('token')
				uni.navigateTo({
					url: "../index/index"
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #ededed;
	}
</style>
<style scoped>
	.page {
		/* height: 100vh; */
		position: relative;
		background-color: #ededed;
	}
	
	.page-status-bg {
		position: absolute;
		width: 100%;
		height: var(--status-bar-height);
		top: 0;
		left: 0;
		z-index: 9;
		background-color: #3C9CFF;
	}

	.top {
		width: 100%;
		position: fixed;
		top: var(--status-bar-height);
		color: #fff;
		left: 0;
		background: #3C9CFF;
		text-align: center;
		height: 82rpx;
		line-height: 82rpx;
		z-index: 9;
	}

	.top-my {
		position: absolute;
		right: 20rpx;
		top: 50%;
		height: 60rpx;
		transform: translateY(-50%);
	}

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		height: 116rpx;
		background: #f7f7f7;
		padding: 20rpx;
	}

	.content-input {
		background-color: #fff;
	}

	.send-btn {
		margin-right: 0;
		height: 36px;
	}

	.my-popup {
		position: relative;
		height: 100%;
		width: 425rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.popup-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 200rpx;
	}

	.popup-avatar {
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #2979ff;
		color: #fff;
		font-size: 40rpx;
	}

	.popup-line {
		margin-top: 50rpx;
	}

	.popup-name {
		display: flex;
		align-items: center;
	}

	.out-btn {
		position: absolute;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.margin_l_10 {
		margin-left: 10rpx;
	}
	.my-name {
		font-size: 36rpx;
	}
	.my-phone {
		color: #909399;
	}
	.list {
		margin-top: var(--status-bar-height);
		padding: 82rpx 0 130rpx 0;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
	}
	.list-line {
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		margin: 20rpx 20rpx 0 20rpx;
		padding-right: 50rpx;
	}
	.line-avatar {
		margin-top: 14rpx;
	}
	.line-content {
		margin-left: 14rpx;
	}
	.content-info {
		display: flex;
		align-items: center;
		color: #909399;
		font-size: 28rpx;
	}
	.content-time {
		margin-left: 15rpx;
	}
	.content-text {
		background: #fff;
		padding: 15rpx;
		margin-top: 6rpx;
		width: fit-content;
	}
	.my-line {
		justify-content: flex-end;
		padding-right: 0;
		padding-left: 50rpx;
	}
	.my-content {
		margin-left: 0;
		margin-right: 14rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.send-loading {
		margin-left: 15rpx;
	}
	.send-error {
		margin-left: 15rpx;
		width: 28rpx;
		height: 28rpx;
		border-radius: 50%;
		background: #e45656;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.my-content .send-loading, .my-content .send-error, .my-content .content-time {
		margin-left: 0;
		margin-right: 15rpx;
	}
</style>
