<template>
  <view class="container">
    <!-- 原有的页面内容保持不变 -->
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="header-top-bar">
        <text class="title-text">我的</text>
        <view class="settings-icon" @click="openset">
          <uni-icons type="gear-filled" size="22" color="#fff" v-if="userInfo.signal"/>
        </view>
      </view>
      <view class="header-content">
        <image class="avatar"  :src="userInfo.info.Image ? userInfo.info.Image : '/static/icon/empty.png'" mode="aspectFill"></image>
        <view class="user-info">
          <text class="username" @click="admin">{{ userInfo.info.username || '点击登录' }}</text>
          <text class="slogan">{{ userInfo.info.slogan || '请登录后设置个人签名' }}</text>
        </view>
      </view>
    </view>
    <view class="main-content">
      <view class="card">
          <view class="top-section">
                  <image class="icon" src="/static/icon/fire.png" mode="aspectFit"></image>
                  <view class="title-group">
                    <text class="card-title">累计在线天数</text>
                    <text class="card-number">{{ userInfo.info.daysOnline }}</text>
                  </view>
                </view>
        
                <view class="bottom-section">
                  <view class="bottom-item">
                    <text class="bottom-number">{{ userInfo.info.newsViews }}</text>
                    <text class="bottom-label">查看新闻数</text>
                  </view>
                  <view class="vertical-line"></view>
                  <view class="bottom-item">
                    <text class="bottom-number">{{ userInfo.info.policyViews }}</text>
                    <text class="bottom-label">查看政策数</text>
                  </view>
                  <view class="vertical-line"></view>
                  <view class="bottom-item">
                    <text class="bottom-number">{{ userInfo.info.field }}</text>
                    <text class="bottom-label">关注领域</text>
                  </view>
                </view>
      </view>
    </view>

    <!-- 优化后的弹窗组件 -->
    <uni-popup ref="popupRef" type="bottom" :custom-style="popupStyle">
      <view class="setting-popup">
        <!-- 标题栏 -->
        <view class="popup-header">
          <text class="popup-title">设置</text>
        </view>
        
        <!-- 分割线 -->
        <view class="popup-divider"></view>
        
        <!-- 功能项 -->
        <view class="popup-item" @click="logout">
          <uni-icons type="logout" size="24" color="#ff4d4f" />
          <text class="item-text">退出登录</text>
        </view>
        
        <!-- 取消按钮 -->
        <view class="popup-cancel" @click="closePopup">
          <text>取消</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed ,onMounted} from 'vue'
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
import {useInfoStore} from '@/store/Info.js'

// 初始化pinia对象
const userInfo=useInfoStore()

// 获取系统信息
const SYSTEMINFO = uni.getSystemInfoSync()
const popupRef = ref(null)
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight)



// 底部导航栏高度（默认50px，可根据实际情况调整）
const tabBarHeight = ref(50)

// 弹窗样式（关键优化点：避开底部导航栏）
const popupStyle = computed(() => ({
  'border-radius': '20rpx 20rpx 0 0',
  'bottom': `${tabBarHeight.value}px`, // 关键：设置底部偏移量
  'z-index': 9999, // 确保弹窗在最上层
  'max-width': '750rpx', // 限制最大宽度
  'margin': '0 auto',
  'background-color': 'transparent' // 外层透明，让圆角显示
}))
// 页面挂载钩子
onMounted(()=>{
	// userInfo.getinfo()
	
	
})
// 登录功能
function admin(){
	if(userInfo.signal){
		console.log("已登录")
	}else{
		userInfo.getinfo()
	}
}

// 打开弹窗
function openset() {
  popupRef.value.open()
}

// 关闭弹窗
function closePopup() {
  popupRef.value.close()
}

// 退出登录
function logout() {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出当前账号吗？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        userInfo.deleteinfo()
        // 关闭弹窗
        closePopup()
        // 提示用户
        uni.showToast({
          title: '已退出登录',
          icon: 'none'
        })
      }
    }
  })
}
</script>

<style lang="scss">
	.container {
	  min-height: 100vh;
	  background-color: #f5f5f5;
	  padding-bottom: env(safe-area-inset-bottom); // 防止底部内容被遮挡
	}
	
	.header {
	  background: linear-gradient(to right, #ff4d4f, #ff7a7a);
	  padding: 0 20rpx;
	  padding-top: env(safe-area-inset-top); // 适配刘海屏顶部
	  position: relative;
	  height: 600rpx;
	  box-sizing: border-box;
	
	  .status-bar {
	    height: var(--status-bar-height); // 或动态赋值
	  }
	
	  .header-top-bar {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    padding-top: 20rpx;
	
	    .title-text {
	      font-size: 36rpx;
	      font-weight: bold;
	      color: #fff;
	    }
	
	    .settings-icon {
	      width: 60rpx;
	      height: 60rpx;
	    }
	  }
	
	  .header-content {
	    display: flex;
	    align-items: center;
	    padding-top: 150rpx;
	
	    .avatar {
	      width: 140rpx;
	      height: 140rpx;
	      border-radius: 50%;
	      border: 4rpx solid #fff;
	      margin-right: 30rpx;
	    }
	
	    .user-info {
	      display: flex;
	      flex-direction: column;
	      color: #fff;
	
	      .username {
	        font-size: 40rpx;
	        font-weight: bold;
	        margin-bottom: 8rpx;
	      }
	
	      .slogan {
	        font-size: 28rpx;
	        opacity: 0.9;
	      }
	    }
	  }
	}
	
	.main-content {
	  position: relative;
	  z-index: 2;
	  padding: 0 32rpx;
	  margin-top: -100rpx;
	}
	
	.card {
	  background-color: #fff;
	  border-radius: 28rpx;
	  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.08);
	  padding: 40rpx;
	}
	
	.top-section {
	  display: flex;
	  align-items: center;
	  margin-bottom: 40rpx;
	
	  .icon {
	    width: 60rpx;
	    height: 60rpx;
	    margin-right: 20rpx;
	  }
	
	  .title-group {
	    display: flex;
	    flex-direction: column;
	
	    .card-title {
	      font-weight: bold;
	      font-size: 32rpx;
	      color: #333;
	    }
	
	    .card-number {
	      font-size: 48rpx;
	      font-weight: bold;
	      color: #ff4d4f;
	      margin-top: 8rpx;
	    }
	  }
	}
	
	.bottom-section {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	
	  .bottom-item {
	    flex: 1;
	    text-align: center;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	
	    .bottom-number {
	      font-size: 36rpx;
	      font-weight: bold;
	      color: #333;
	    }
	
	    .bottom-label {
	      font-size: 26rpx;
	      color: #888;
	      margin-top: 4rpx;
	    }
	  }
	
	  .vertical-line {
	    width: 2rpx;
	    height: 80rpx;
	    background-color: #eee;
	    margin: 0 20rpx;
	  }
	}
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 原有样式保持不变 */
}

/* 优化后的弹窗样式 */
.setting-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .popup-header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    
    .popup-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
  }
  
  .popup-divider {
    height: 2rpx;
    background-color: #eee;
  }
  
  .popup-item {
    height: 96rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    font-size: 34rpx;
    color: #333;
    
    uni-icons {
      margin-right: 24rpx;
    }
  }
  
  .popup-cancel {
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16rpx;
    background-color: #fff;
    font-size: 34rpx;
    color: #888;
  }
}
</style>    