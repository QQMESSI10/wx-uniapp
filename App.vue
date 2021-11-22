<script>
	export default {
		onLaunch: function() {
			if (uni.getStorageSync('token')) {
				uni.navigateTo({
					url: 'pages/chat/chat'
				})
			}
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}
	/*每个页面公共css */
</style>
