<template>
	<view class="content">
		<view class="top">欢迎注册</view>
		<u--form labelPosition="left" :model="params" :rules="rules" ref="form1">
			<u-form-item label="手机号" prop="phone" labelWidth="80" borderBottom>
				<u--input v-model="params.phone" border="none" placeholder="请填写手机号"></u--input>
			</u-form-item>
			<u-form-item label="验证码" prop="code" labelWidth="80" borderBottom>
				<u--input v-model="params.code" border="none" placeholder="请填写验证码"></u--input>
				<u-button slot="right" @tap="getCode" :text="tips" size="mini" :disabled="disabled1" type="success"
					class="code-btn">
				</u-button>
			</u-form-item>
			<u-form-item label="昵称" prop="name" labelWidth="80" borderBottom>
				<u--input v-model="params.name" border="none" placeholder="请填写昵称" maxlength="8"></u--input>
			</u-form-item>
			<u-form-item label="密码" prop="psw" labelWidth="80" borderBottom>
				<u--input v-model="params.psw" border="none" placeholder="请填写密码(8~16位)" maxlength="16" password></u--input>
			</u-form-item>
			<u-form-item label="确认密码" labelWidth="80" borderBottom>
				<u--input v-model="psw2" border="none" placeholder="再次填写密码" maxlength="16" password></u--input>
			</u-form-item>
		</u--form>
		<u-button type="primary" text="立即注册" customStyle="margin-top: 100rpx" @click="submit"></u-button>
		<u-code ref="uCode" @change="codeChange" seconds="60" @start="disabled1 = true" @end="disabled1 = false">
		</u-code>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					phone: '',
					code: '',
					name: '',
					psw: '',
				},
				psw2: '',
				rules: {
					'phone': {
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					},
					'code': {
						type: 'string',
						required: true,
						message: '请填写验证码',
						trigger: ['blur', 'change']
					},
					'name': {
						type: 'string',
						required: true,
						message: '请填写昵称',
						trigger: ['blur', 'change']
					},
					'psw': {
						type: 'string',
						min: 8,
						required: true,
						message: '密码不少于8位',
						trigger: ['change']
					},
				},
				disabled1: false,
				tips: '获取验证码',
			};
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (!uni.$u.test.mobile(this.params.phone)) {
					uni.$u.toast('服了，能填个正确的手机号吗');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '别急，获取中',
						mask: true
					})
					this.$ajax.post('messageCode', {phone: this.params.phone}, (res) => {
						uni.hideLoading();
						if (res.data.code == 1) {
							uni.showToast({
								title: "发送成功",
								icon: "none"
							})
							this.$refs.uCode.start();
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					this.params.name = uni.$u.trim(this.params.name, 'all')
					if (this.params.name == '') {
						uni.$u.toast('昵称非法，请换个昵称')
						return
					}
					if (this.params.psw != this.psw2) {
						uni.$u.toast('两次密码输入都不一样，还注册个毛')
						return
					}
					this.$ajax.post('register', this.params, (res) => {
						if (res.data.code == 1) {
							uni.$u.toast(res.data.msg)
							setTimeout(()=> {
								uni.navigateTo({
								    url: '../login/login'
								});
							}, 500)
						} else {
							uni.$u.toast(res.data.msg)
						}
					})
				}).catch(errors => {
					uni.$u.toast(errors[0].message)
				})
			},
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
