<script setup>
	import { onLaunch } from '@dcloudio/uni-app'
	// export default {
	// 	onLaunch: function() {
			
			
	// 		console.log('App Launch')
	// 	},
	// 	onShow: function() {
	// 		console.log('App Show')
	// 	},
	// 	onHide: function() {
	// 		console.log('App Hide')
	// 	}
	// }
	import { useInfoStore } from '@/store/Info.js'
	
	onLaunch(async () => {
	  const infoStore = useInfoStore()
	  const localToken = uni.getStorageSync('token')
	
	  if (localToken) {
	    infoStore.token = localToken
	    infoStore.signal = true
	    try {
	      await infoStore.getUserInfo()
	      console.log('登录状态恢复成功')
	    } catch (e) {
	      console.log('用户信息拉取失败，清除登录状态')
	      infoStore.logout()
	    }
	  } else {
	    console.log('本地无登录状态')
	  }
	})
	
</script>

<style>
	/*每个页面公共css */
	@import "style/colorui/icon.css";
	@import "style/colorui/main.css"
</style>
