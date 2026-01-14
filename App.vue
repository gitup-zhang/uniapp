<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useInfoStore } from '@/store/Info.js'

onLaunch(async () => {
  const infoStore = useInfoStore()
  
  // 从本地存储恢复Token
  const hasToken = infoStore.loadTokensFromStorage()
  
  if (hasToken) {
    console.log('Token已恢复，尝试获取用户信息...')
    try {
      await infoStore.getinfo()
      console.log('登录状态恢复成功')
    } catch (e) {
      console.error('用户信息拉取失败:', e)
      
      // 如果是Token过期错误，刷新逻辑会在request.js中自动处理
      // 如果是其他错误，清除登录状态
      if (e.message !== '登录已过期' && e.message !== 'Token刷新失败') {
        console.log('清除登录状态')
        infoStore.deleteinfo()
      }
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