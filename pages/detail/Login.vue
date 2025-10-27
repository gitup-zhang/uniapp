<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <uni-icons type="left" size="24" color="#fff"/>
      </view>
      <text class="nav-title">登录</text>
      <view class="nav-right"></view>
    </view>

    <!-- 登录界面 -->
    <view class="login-container">
      <view class="login-card">
        <!-- Logo区域 -->
        <view class="logo-section">
          <image class="logo-image" src="/static/logo.jpg" mode="aspectFit"/>
          <text class="app-title">智源齐说</text>
        </view>
        
        <!-- 微信登录 -->
        <view class="login-form">
          <view class="wechat-info">
            <uni-icons type="weixin" size="60" color="#1aad19"/>
            <text class="wechat-text">使用微信授权登录</text>
            <text class="wechat-desc">安全快捷，一键登录</text>
          </view>
          
          <!-- <button 
            class="login-btn wechat-btn" 
            @click="wechatlogin"
            :disabled="isLogging"
          >
            <uni-load-more v-if="isLogging" status="loading" color="#fff" :content-text="{ contentnomore: '' }"/>
            <view v-else class="btn-content">
              <uni-icons type="weixin" size="20" color="#fff"/>
              <text>微信授权登录</text>
            </view>
          </button> -->

          <button 
            class="login-btn phone-btn" 
            open-type="getPhoneNumber" 
            @getphonenumber="handlePhoneAuth"
            :disabled="isLogging"
          >
            <uni-load-more v-if="isLogging" status="loading" color="#667eea" :content-text="{ contentnomore: '' }"/>
            <view v-else class="btn-content">
              <uni-icons type="phone" size="20" color="#667eea"/>
              <text>获取手机号登录</text>
            </view>
          </button>
        </view>
        
        <!-- 隐私协议 -->
        <view class="privacy-notice">
          <text class="notice-text">登录即表示同意</text>
          <text class="notice-link" @click="showUserAgreement">《用户协议》</text>
          <text class="notice-text">和</text>
          <text class="notice-link" @click="showPrivacyPolicy">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useInfoStore } from '@/store/Info.js'

// Store 和基础数据
const userInfo = useInfoStore()
const SYSTEMINFO = uni.getSystemInfoSync()
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight)

// 加载状态
const isLogging = ref(false)

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果无法返回，则跳转到首页或者个人中心
      uni.switchTab({
        url: 'pages/mymessage/mymessage'
      })
    }
  })
}

// 微信登录
const wechatlogin = async () => {
  try {
    isLogging.value = true
    const res = await userInfo.loginWithWeChat()
    isLogging.value = false
    
    if (res) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 登录成功后返回上一页或跳转到个人中心
      setTimeout(() => {
        goBack()
      }, 1500)
    }
    
  } catch (e) {
    console.log(e)
    isLogging.value = false
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'error'
    })
  }
}

// 获取手机号登录
const handlePhoneAuth = async (e) => {
  console.log('获取手机号事件:', e)
  
  // 用户拒绝授权
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({
      title: '已取消授权',
      icon: 'none'
    })
    return
  }
  
  try {
    isLogging.value = true
	console.log("手机号信息:",e)
    
    // 调用后端接口，传递加密数据
    const loginResult = await userInfo.loginWithWeChat(
       e.detail.encryptedData,
       e.detail.iv
    )
	if(loginResult){
		 // 保存登录信息
    // await userInfo.saveLoginInfo(loginResult)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 登录成功后返回上一页或跳转到个人中心
    setTimeout(() => {
      goBack()
    }, 1500)
	}else{
		uni.showToast({
		  title: '登录失败,请重试',
		  icon: 'error'
		})
	}
    
   
    
  } catch (error) {
    console.error('手机号登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'error'
    })
  } finally {
    isLogging.value = false
  }
}

// 手机号登录API


// 显示用户协议
const showUserAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/user'
  })
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  uni.navigateTo({
    url: '/pages/agreement/privacy'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg,  #ff4757 0%, #ff6b7a 100%);
}

.status-bar {
  background: transparent;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: relative;
  z-index: 10;

  .nav-left {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.3s ease;

    &:active {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0.95);
    }
  }

  .nav-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
  }

  .nav-right {
    width: 64rpx;
  }
}

// 登录界面样式
.login-container {
  min-height: calc(100vh - 200rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx 40rpx;
  width: 100%;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 40rpx;

  .logo-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
  }

  .app-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: #333;
  }
}

.login-form {
  .wechat-info {
    text-align: center;
    padding: 20rpx 0 40rpx;

    .wechat-text {
      display: block;
      font-size: 32rpx;
      color: #333;
      margin: 24rpx 0 12rpx;
      font-weight: 600;
    }

    .wechat-desc {
      display: block;
      font-size: 26rpx;
      color: #666;
    }
  }

  .login-btn {
    width: 100%;
    height: 88rpx;
    border: none;
    border-radius: 16rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;

    &:disabled {
      opacity: 0.6;
    }

    &::after {
      border: none;
    }

    &.wechat-btn {
      background: linear-gradient(135deg, #1aad19 0%, #259b24 100%);

      .btn-content {
        display: flex;
        align-items: center;
        
        text {
          margin-left: 12rpx;
        }
      }
    }

    &.phone-btn {
      background: #fff;
      color: #667eea;
      border: 2rpx solid #667eea;

      .btn-content {
        display: flex;
        align-items: center;
        
        text {
          margin-left: 12rpx;
        }
      }
    }
  }
}

.privacy-notice {
  text-align: center;
  margin-top: 40rpx;

  .notice-text, .notice-link {
    font-size: 24rpx;
    color: #999;
  }
  
  .notice-link {
    color: #667eea;
    font-weight: 500;
  }
}

// 响应式适配
@media screen and (max-width: 320px) {
  .login-card {
    margin: 0 20rpx;
    padding: 40rpx 24rpx;
  }
}
</style>