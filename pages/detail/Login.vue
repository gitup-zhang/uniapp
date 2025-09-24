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
          <!-- <text class="app-slogan">欢迎登录</text> -->
        </view>
        
        <!-- 登录方式切换 -->
        <!-- <view class="login-tabs"> -->
          <!-- <view 
            class="tab-item" 
            :class="{ active: loginType === 'account' }"
            @click="switchLoginType('account')"
          >
            账号登录
          </view>
          <view 
            class="tab-item" 
            :class="{ active: loginType === 'sms' }"
            @click="switchLoginType('sms')"
          >
            短信登录
          </view> -->
         <!-- <view 
            class="tab-item" 
            :class="{ active: loginType === 'wechat' }"
            @click="switchLoginType('wechat')"
          >
            微信登录
          </view> -->
        <!-- </view> -->
        
        <!-- 账号密码登录 -->
       <!-- <view v-if="loginType === 'account'" class="login-form">
          <view class="form-item">
            <view class="input-wrapper" :class="{ 'error': accountForm.usernameError }">
              <uni-icons type="person" size="20" color="#999"/>
              <input 
                class="form-input" 
                placeholder="请输入账号/手机号" 
                v-model="accountForm.username"
                :disabled="isLogging"
                @blur="validateUsername"
                @input="clearUsernameError"
              />
            </view>
            <text v-if="accountForm.usernameError" class="error-tip">{{ accountForm.usernameError }}</text>
          </view>
          
          <view class="form-item">
            <view class="input-wrapper" :class="{ 'error': accountForm.passwordError }">
              <uni-icons type="locked" size="20" color="#999"/>
              <input 
                class="form-input" 
                placeholder="请输入密码" 
                password
                v-model="accountForm.password"
                :disabled="isLogging"
                @blur="validatePassword"
                @input="clearPasswordError"
              />
              <text class="forgot-password" @click="handleForgotPassword">忘记密码？</text>
            </view>
            <text v-if="accountForm.passwordError" class="error-tip">{{ accountForm.passwordError }}</text>
          </view>
          
          <button 
            class="login-btn" 
            @click="handleAccountLogin"
            :disabled="isLogging"
          >
            <uni-load-more v-if="isLogging" status="loading" color="#fff" :content-text="{ contentnomore: '' }"/>
            <text v-else>登录</text>
          </button>
        </view> -->
        
        <!-- 短信验证码登录 -->
        <!-- <view v-if="loginType === 'sms'" class="login-form">
          <view class="form-item">
            <view class="input-wrapper" :class="{ 'error': smsForm.phoneError }">
              <uni-icons type="phone" size="20" color="#999"/>
              <input 
                class="form-input" 
                placeholder="请输入手机号" 
                type="number"
                maxlength="11"
                v-model="smsForm.phone"
                :disabled="isLogging"
                @blur="validatePhone"
                @input="clearPhoneError"
              />
            </view>
            <text v-if="smsForm.phoneError" class="error-tip">{{ smsForm.phoneError }}</text>
          </view>
          
          <view class="form-item">
            <view class="input-wrapper" :class="{ 'error': smsForm.codeError }">
              <uni-icons type="chatboxes" size="20" color="#999"/>
              <input 
                class="form-input" 
                placeholder="请输入验证码" 
                type="number"
                maxlength="6"
                v-model="smsForm.code"
                :disabled="isLogging"
                @blur="validateSmsCode"
                @input="clearCodeError"
              />
              <button 
                class="sms-btn" 
                @click="sendSmsCode"
                :disabled="!isValidPhone || smsCountdown > 0"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
              </button>
            </view>
            <text v-if="smsForm.codeError" class="error-tip">{{ smsForm.codeError }}</text>
          </view>
          
          <button 
            class="login-btn" 
            @click="handleSmsLogin"
            :disabled="isLogging"
          >
            <uni-load-more v-if="isLogging" status="loading" color="#fff" :content-text="{ contentnomore: '' }"/>
            <text v-else>登录</text>
          </button>
        </view> -->
        
        <!-- 微信登录 -->
        <view v-if="loginType === 'wechat'" class="login-form">
          <view class="wechat-info">
            <uni-icons type="weixin" size="60" color="#1aad19"/>
            <text class="wechat-text">使用微信授权登录</text>
            <text class="wechat-desc">安全快捷，一键登录</text>
          </view>
          
          <button 
            class="login-btn wechat-btn" 
            open-type="getPhoneNumber" 
            @getphonenumber="handlePhoneAuth"
            :disabled="isLogging"
            @click="wechatlogin"
          >
            <view class="btn-content">
              <uni-icons type="weixin" size="20" color="#fff"/>
              <text>微信授权登录</text>
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

    <!-- 加载提示 -->
    <uni-popup ref="loadingPopup" type="center">
      <view class="loading-container">
        <uni-load-more status="loading" :content-text="loadingText"/>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useInfoStore } from '@/store/Info.js'

// Store 和基础数据
const userInfo = useInfoStore()
const SYSTEMINFO = uni.getSystemInfoSync()
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight)

// 弹窗引用
const loadingPopup = ref(null)

// 加载状态
const isLogging = ref(false)
const loadingText = ref({ more: '加载中...' })

// 登录类型
const loginType = ref('wechat') // account, sms, wechat

// 表单数据
const accountForm = reactive({
  username: '',
  password: '',
  usernameError: '',
  passwordError: ''
})

const smsForm = reactive({
  phone: '',
  code: '',
  phoneError: '',
  codeError: ''
})

// 短信验证码倒计时
const smsCountdown = ref(0)

// 计算属性
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(smsForm.phone)
})

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果无法返回，则跳转到首页或者个人中心
      uni.switchTab({
        url: '/pages/mine/mine'
      })
    }
  })
}

// 切换登录方式
const switchLoginType = (type) => {
  loginType.value = type
  // 清空表单数据和错误信息
  accountForm.username = ''
  accountForm.password = ''
  accountForm.usernameError = ''
  accountForm.passwordError = ''
  smsForm.phone = ''
  smsForm.code = ''
  smsForm.phoneError = ''
  smsForm.codeError = ''
}

// 表单验证方法
const validateUsername = () => {
  if (!accountForm.username.trim()) {
    accountForm.usernameError = '请输入账号或手机号'
    return false
  }
  accountForm.usernameError = ''
  return true
}

const validatePassword = () => {
  if (!accountForm.password.trim()) {
    accountForm.passwordError = '请输入密码'
    return false
  }
  if (accountForm.password.length < 6) {
    accountForm.passwordError = '密码长度不能少于6位'
    return false
  }
  accountForm.passwordError = ''
  return true
}

const validatePhone = () => {
  if (!smsForm.phone.trim()) {
    smsForm.phoneError = '请输入手机号'
    return false
  }
  if (!isValidPhone.value) {
    smsForm.phoneError = '请输入正确的手机号格式'
    return false
  }
  smsForm.phoneError = ''
  return true
}

const validateSmsCode = () => {
  if (!smsForm.code.trim()) {
    smsForm.codeError = '请输入验证码'
    return false
  }
  if (smsForm.code.length !== 6) {
    smsForm.codeError = '验证码为6位数字'
    return false
  }
  smsForm.codeError = ''
  return true
}

// 清除错误信息的方法
const clearUsernameError = () => {
  if (accountForm.usernameError) {
    accountForm.usernameError = ''
  }
}

const clearPasswordError = () => {
  if (accountForm.passwordError) {
    accountForm.passwordError = ''
  }
}

const clearPhoneError = () => {
  if (smsForm.phoneError) {
    smsForm.phoneError = ''
  }
}

const clearCodeError = () => {
  if (smsForm.codeError) {
    smsForm.codeError = ''
  }
}

// 账号密码登录
const handleAccountLogin = async () => {
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()
  
  if (!isUsernameValid || !isPasswordValid) {
    return
  }

  try {
    isLogging.value = true
    
    const loginResult = await callAccountLoginAPI({
      username: accountForm.username,
      password: accountForm.password
    })
    
    await userInfo.saveLoginInfo(loginResult)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 登录成功后返回上一页或跳转到个人中心
    setTimeout(() => {
      goBack()
    }, 1500)

  } catch (error) {
    console.error('账号登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'error'
    })
  } finally {
    isLogging.value = false
  }
}

// 发送短信验证码
const sendSmsCode = async () => {
  if (!validatePhone()) {
    return
  }

  try {
    smsCountdown.value = 60
    const timer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })

  } catch (error) {
    console.error('发送验证码失败:', error)
    uni.showToast({
      title: error.message || '发送失败，请重试',
      icon: 'error'
    })
  }
}

// 短信验证码登录
const handleSmsLogin = async () => {
  const isPhoneValid = validatePhone()
  const isCodeValid = validateSmsCode()
  
  if (!isPhoneValid || !isCodeValid) {
    return
  }

  try {
    isLogging.value = true
    
    const loginResult = await callSmsLoginAPI({
      phone: smsForm.phone,
      code: smsForm.code
    })
    
    await userInfo.saveLoginInfo(loginResult)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 登录成功后返回上一页或跳转到个人中心
    setTimeout(() => {
      goBack()
    }, 1500)

  } catch (error) {
    console.error('短信登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'error'
    })
  } finally {
    isLogging.value = false
  }
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
  }
}

// 忘记密码
const handleForgotPassword = () => {
  uni.navigateTo({
    url: '/pages/auth/forgot-password'
  })
}

// API调用函数
const callAccountLoginAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/account-login',
      method: 'POST',
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.message || '登录失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

const callSmsLoginAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/sms-login',
      method: 'POST',
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.message || '登录失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

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

// 显示加载提示
const showLoading = (text = '加载中...') => {
  loadingText.value.more = text
  loadingPopup.value?.open()
}

// 隐藏加载提示
const hideLoading = () => {
  loadingPopup.value?.close()
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
  margin-bottom: 20rpx;

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
    margin-bottom: 12rpx;
  }

  .app-slogan {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.login-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 16rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 12rpx;
    transition: all 0.3s ease;
    font-weight: 500;

    &.active {
      background: #fff;
      color: #667eea;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.15);
      font-weight: 600;
    }
  }
}

.login-form {
  .form-item {
    margin-bottom: 32rpx;

    .input-wrapper {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 16rpx;
      padding: 0 24rpx;
      position: relative;
      border: 2rpx solid transparent;
      transition: all 0.3s ease;

      &.error {
        border-color: #ff4757;
        background: rgba(255, 71, 87, 0.05);
      }

      .form-input {
        flex: 1;
        height: 88rpx;
        font-size: 30rpx;
        color: #333;
        margin-left: 16rpx;
      }

      .forgot-password {
        font-size: 26rpx;
        color: #667eea;
        position: absolute;
        right: 24rpx;
      }

      .sms-btn {
        background: #667eea;
        color: #fff;
        border: none;
        border-radius: 12rpx;
        padding: 16rpx 24rpx;
        font-size: 24rpx;
        margin-left: 16rpx;
        
        &:disabled {
          background: #ccc;
        }

        &::after {
          border: none;
        }
      }
    }

    .error-tip {
      display: block;
      color: #ff4757;
      font-size: 24rpx;
      margin-top: 12rpx;
      margin-left: 24rpx;
      animation: shake 0.5s ease-in-out;
    }
  }

  .wechat-info {
    text-align: center;
    padding: 20rpx 0;

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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

// 加载提示样式
.loading-container {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5rpx); }
  75% { transform: translateX(5rpx); }
}

// 响应式适配
@media screen and (max-width: 320px) {
  .login-card {
    margin: 0 20rpx;
    padding: 40rpx 24rpx;
  }
}
</style>