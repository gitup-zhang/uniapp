<template>
  <view class="login-container">
    <!-- 登录页面UI -->
    <view class="login-content">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      <text class="app-name">您的应用名称</text>
      <text class="welcome-text">欢迎使用，请先登录</text>
      
      <!-- 登录状态显示 -->
      <view class="user-info" v-if="isLoggedIn">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill" />
        <text class="username">{{ userInfo.nickName }}</text>
        <text class="phone">{{ userInfo.phoneNumber }}</text>
        <button class="logout-btn" @click="logout">退出登录</button>
      </view>
      
      <!-- 登录按钮 -->
      <view class="login-section" v-else>
        <button 
          class="wechat-login-btn" 
          open-type="getPhoneNumber"
          @getphonenumber="handlePhoneLogin"
          :disabled="isLoading"
        >
          <image class="wechat-icon" src="/static/images/wechat.png" mode="aspectFit" />
          <text>{{ isLoading ? '登录中...' : '微信手机号快捷登录' }}</text>
        </button>
        
        <text class="login-tip">登录即表示同意<text class="link">《用户协议》</text>和<text class="link">《隐私政策》</text></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const isLoggedIn = ref(true)
const isLoading = ref(false)
const userInfo = ref({
  openid: '',
  unionid: '',
  session_key: '',
  nickName: '',
  avatarUrl: '',
  phoneNumber: '',
  purePhoneNumber: '',
  countryCode: '',
  token: ''
})

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})

/**
 * 检查本地登录状态
 */
const checkLoginStatus = () => {
  try {
    const token = uni.getStorageSync('user_token')
    const savedUserInfo = uni.getStorageSync('user_info')
    
    if (token && savedUserInfo) {
      userInfo.value = JSON.parse(savedUserInfo)
      isLoggedIn.value = true
      console.log('用户已登录:', userInfo.value)
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
    clearLocalUserData()
  }
}

/**
 * 处理微信手机号授权登录
 * @param {Object} e - 手机号授权回调事件
 */
const handlePhoneLogin = async (e) => {
  console.log('手机号授权回调:', e.detail)
  
  // 检查用户是否同意授权
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    handleAuthError(e.detail.errMsg)
    return
  }
  
  // 开始登录流程
  await performLogin(e.detail)
}

/**
 * 处理授权错误
 * @param {String} errMsg - 错误信息
 */
const handleAuthError = (errMsg) => {
  let message = '授权失败'
  
  switch (errMsg) {
    case 'getPhoneNumber:fail user deny':
      message = '用户拒绝授权手机号'
      break
    case 'getPhoneNumber:fail':
      message = '获取手机号失败，请重试'
      break
    default:
      message = '授权异常，请重试'
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 3000
  })
}

/**
 * 执行登录流程
 * @param {Object} phoneDetail - 手机号授权详情
 */
const performLogin = async (phoneDetail) => {
  isLoading.value = true
  
  try {
    // 1. 获取微信登录code
    const loginResult = await getWeChatLoginCode()
    
    // 2. 准备登录数据
    const loginData = {
      code: loginResult.code,
      encryptedData: phoneDetail.encryptedData,
      iv: phoneDetail.iv,
      cloudID: phoneDetail.cloudID // 如果使用云开发
    }
    
    // 3. 调用后端登录接口
    const response = await callLoginAPI(loginData)
    
    // 4. 处理登录成功
    await handleLoginSuccess(response)
    
  } catch (error) {
    console.error('登录失败:', error)
    handleLoginError(error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 获取微信登录code
 */
const getWeChatLoginCode = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (result) => {
        if (result.code) {
          console.log('获取微信登录code成功:', result.code)
          resolve(result)
        } else {
          reject(new Error('获取微信登录code失败'))
        }
      },
      fail: (error) => {
        console.error('微信登录失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 调用后端登录API
 * @param {Object} loginData - 登录数据
 */
const callLoginAPI = (loginData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/auth/wechat-phone-login', // 替换为您的API地址
      method: 'POST',
      data: loginData,
      header: {
        'content-type': 'application/json'
      },
      success: (response) => {
        console.log('登录API响应:', response)
        
        if (response.statusCode === 200 && response.data.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.data.message || '登录失败'))
        }
      },
      fail: (error) => {
        console.error('请求登录API失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 处理登录成功
 * @param {Object} response - 登录成功响应
 */
const handleLoginSuccess = async (response) => {
  try {
    const { data } = response
    
    // 更新用户信息
    userInfo.value = {
      openid: data.openid,
      unionid: data.unionid,
      session_key: data.session_key,
      nickName: data.nickName || '微信用户',
      avatarUrl: data.avatarUrl || '/static/images/default-avatar.png',
      phoneNumber: data.phoneNumber,
      purePhoneNumber: data.purePhoneNumber,
      countryCode: data.countryCode,
      token: data.token
    }
    
    // 保存到本地存储
    uni.setStorageSync('user_token', data.token)
    uni.setStorageSync('user_info', JSON.stringify(userInfo.value))
    
    // 更新登录状态
    isLoggedIn.value = true
    
    // 显示成功提示
    uni.showToast({
      title: '登录成功！',
      icon: 'success',
      duration: 2000
    })
    
    // 可选：跳转到主页或其他页面
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 2000)
    
    console.log('登录成功，用户信息:', userInfo.value)
    
  } catch (error) {
    console.error('处理登录成功数据失败:', error)
    throw error
  }
}

/**
 * 处理登录错误
 * @param {Error} error - 错误对象
 */
const handleLoginError = (error) => {
  let message = '登录失败，请重试'
  
  if (error.message) {
    message = error.message
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 3000
  })
}

/**
 * 退出登录
 */
const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出当前账号吗？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        performLogout()
      }
    }
  })
}

/**
 * 执行退出登录
 */
const performLogout = () => {
  try {
    // 清除本地数据
    clearLocalUserData()
    
    // 重置状态
    isLoggedIn.value = false
    resetUserInfo()
    
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    })
    
    console.log('用户已退出登录')
    
  } catch (error) {
    console.error('退出登录失败:', error)
    uni.showToast({
      title: '退出失败',
      icon: 'none'
    })
  }
}

/**
 * 清除本地用户数据
 */
const clearLocalUserData = () => {
  try {
    uni.removeStorageSync('user_token')
    uni.removeStorageSync('user_info')
  } catch (error) {
    console.error('清除本地数据失败:', error)
  }
}

/**
 * 重置用户信息
 */
const resetUserInfo = () => {
  userInfo.value = {
    openid: '',
    unionid: '',
    session_key: '',
    nickName: '',
    avatarUrl: '',
    phoneNumber: '',
    purePhoneNumber: '',
    countryCode: '',
    token: ''
  }
}

/**
 * 检查登录状态（供其他页面调用）
 */
const isUserLoggedIn = () => {
  return isLoggedIn.value && userInfo.value.token
}

/**
 * 获取用户token（供API调用使用）
 */
const getUserToken = () => {
  return userInfo.value.token || uni.getStorageSync('user_token')
}

/**
 * 获取用户信息（供其他页面使用）
 */
const getUserInfo = () => {
  return userInfo.value
}

// 导出方法供其他页面使用
defineExpose({
  isUserLoggedIn,
  getUserToken,
  getUserInfo,
  logout: performLogout
})
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-content {
  width: 100%;
  max-width: 640rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 80rpx 60rpx;
  text-align: center;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 32rpx;
}

.app-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.welcome-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 80rpx;
}

// 已登录用户信息
.user-info {
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 24rpx;
  }
  
  .username {
    display: block;
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .phone {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 40rpx;
  }
  
  .logout-btn {
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 24rpx 48rpx;
    font-size: 28rpx;
    
    &::after {
      border: none;
    }
  }
}

// 登录区域
.login-section {
  .wechat-login-btn {
    width: 100%;
    background: #07c160;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 32rpx;
    font-size: 32rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    
    &:disabled {
      background: #ccc;
    }
    
    &::after {
      border: none;
    }
    
    .wechat-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 16rpx;
    }
  }
  
  .login-tip {
    font-size: 24rpx;
    color: #999;
    line-height: 1.5;
    
    .link {
      color: #007aff;
    }
  }
}
</style>