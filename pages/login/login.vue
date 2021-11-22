<template>
	<view class="content">
		<view class="top">欢迎登录</view>
		<u--form labelPosition="left" :model="params" ref="form1">
			<u-form-item label="手机号" prop="phone" labelWidth="80" borderBottom>
				<u--input v-model="params.phone" border="none" placeholder="请填写手机号"></u--input>
			</u-form-item>
			<u-form-item label="密码" prop="psw" labelWidth="80" borderBottom>
				<u--input v-model="params.psw" border="none" placeholder="请填写密码" maxlength="16" password></u--input>
			</u-form-item>
		</u--form>
		<u-button type="primary" text="立即登录" customStyle="margin-top: 200rpx" @click="submit"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					phone: '',
					psw: ''
				}
			};
		},
		methods: {
			submit() {
				if (!this.params.phone) {
					uni.$u.toast('想啥呢，手机号都不输就登录');
					return
				}
				if (!this.params.psw) {
					uni.$u.toast('想啥呢，密码都不输就登录');
					return
				}
				if (!uni.$u.test.mobile(this.params.phone)) {
					uni.$u.toast('手机号都填错了，还登录个毛');
					return
				}
				this.$ajax.post('login', this.params, (res) => {
					if (res.data.code == 1) {
						uni.setStorageSync('token', res.data.token)
						uni.navigateTo({
						    url: '../chat/chat'
						});
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.content {
		padding: 20rpx;
	}

	.top {
		font-size: 46rpx;
		color: #2979ff;
		text-align: center;
		padding: 100rpx 0;
	}
</style>
