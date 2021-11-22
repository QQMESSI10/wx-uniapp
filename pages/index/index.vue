<template>
	<view class="content">
		<view class="title">红旗学习小分队</view>
		<view class="btn">
			<u-button type="primary" size="large" text="登 录" @click="toLogin()"></u-button>
			<u-button class="btn-register" type="primary" size="large" :plain="true" text="注 册" @click="toRegister()"></u-button>
		</view>
	</view>
</template>

<script>
	import { io } from 'socket.io-client'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			const socket = io("http://localhost:3000", { path: "/socket/" })
			socket.on("connect", ()=> {
				console.log(999)
			})
			socket.on('msg', (msg)=> {
				console.log(msg)
			})
		},
		methods: {
			toLogin() {
				uni.navigateTo({
				    url: '../login/login'
				});
			},
			toRegister() {
				console.log(123)
				uni.navigateTo({
				    url: '../register/register'
				});
			}
		}
	}
</script>

<style scoped>
	.content {
		position: relative;
		height: 100vh;
	}
	.title {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 50rpx;
		color: #2979FF;
	}
	.btn {
		position: absolute;
		bottom: 150rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		width: 100%;
		box-sizing: border-box;
		padding: 0 50rpx;
		justify-content: space-between;
		align-items: center;
	}
	.btn-register {
		margin-left: 50rpx;
	}
</style>
