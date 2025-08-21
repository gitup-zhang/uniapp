<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">个人信息</text>
      <view class="nav-right"></view>
    </view>
    
    <!-- 未登录状态 - 简约登录界面 -->
    <view v-if="!userInfo.signal" class="login-container">
      <view class="login-card">
        <!-- Logo区域 -->
        <view class="logo-section">
          <image class="logo-image" src="/static/icon/logo.png" mode="aspectFit"/>
          <text class="app-title">智慧平台</text>
          <text class="app-slogan">欢迎登录</text>
        </view>
        
        <!-- 登录方式切换 -->
        <view class="login-tabs">
          <view 
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
          </view>
          <view 
            class="tab-item" 
            :class="{ active: loginType === 'wechat' }"
            @click="switchLoginType('wechat')"
          >
            微信登录
          </view>
        </view>
        
        <!-- 账号密码登录 -->
        <view v-if="loginType === 'account'" class="login-form">
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
        </view>
        
        <!-- 短信验证码登录 -->
        <view v-if="loginType === 'sms'" class="login-form">
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
        </view>
        
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
            <uni-load-more v-if="isLogging" status="loading" color="#fff" :content-text="{ contentnomore: '' }"/>
            <view v-else class="btn-content">
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

    <!-- 已登录状态 -->
    <view v-else class="main-container">
      <!-- 简洁的头部区域 -->
      <view class="header">
        <view class="header-content">
          <!-- 用户信息卡片 -->
          <view class="user-card" @click="goToProfile">
            <view class="avatar-section">
              <image 
                class="user-avatar" 
                :src="userInfo.info.avatar_url || '/static/icon/empty.png'" 
                mode="aspectFill"
              />
              <view class="online-indicator">
                <view class="indicator-dot"></view>
              </view>
            </view>
            
            <view class="user-details">
              <text class="user-name">{{ userInfo.info.nickname || '用户' }}</text>
              <text class="user-phone">{{ formatPhoneNumber(userInfo.info.phone) }}</text>
            </view>
            
            <view class="profile-enter">
              <uni-icons type="right" size="18" color="rgba(255,255,255,0.8)"/>
            </view>
          </view>
        </view>
        
        <!-- 头部装饰 -->
        <view class="header-decoration">
          <view class="deco-circle deco-1"></view>
          <view class="deco-circle deco-2"></view>
        </view>
      </view>

      <!-- 主要内容区域 -->
      <view class="main-content">
        <!-- 数据统计卡片 -->
        <view class="stats-overview">
          <view class="stats-header">
            <view class="stats-icon-wrapper">
              <image class="stats-icon" src="/static/icon/fire.png" mode="aspectFit"/>
            </view>
           <view class="stats-info">
              <text class="stats-title">我的活动信息</text>
            </view>
          </view>
          
          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.eventcount.Eventbefore || 0 }}</text>
              <text class="stat-label">未开始</text>
            </view>
            
            <view class="stat-divider"></view>
            
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.eventcount.Eventing || 0 }}</text>
              <text class="stat-label">进行中</text>
            </view>
            
            <view class="stat-divider"></view>
            
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.eventcount.Evented || 0 }}</text>
              <text class="stat-label">已过期</text>
            </view>
          </view>
        </view>

        <!-- 活动区域 - 新增空状态处理 -->
        <view class="activity-section">
          <view class="section-header">
            <text class="section-title">我的活动</text>
            <view class="section-more" @click="viewAllActivities" >
              <text class="more-text">查看全部</text>
              <uni-icons type="right" size="14" color="#999"/>
            </view>
          </view>
          
          <!-- 有活动时显示活动卡片 -->
          <ActivityTicket
            v-if="hasActivities"
            :activityData="myActivityData"
            @action="onAction"
            @cancel="onCancel"
          />
          
          <!-- 没有活动时显示空状态 -->
          <view v-else class="empty-activity">
            <view class="empty-card">
              <!-- 空状态图标 -->
              <!-- <view class="empty-icon">
                <image class="empty-image" src="/static/icon/empty-activity.png" mode="aspectFit"/>
              </view> -->
              
              <!-- 空状态文案 -->
              <view class="empty-content">
                <text class="empty-title">暂无活动</text>
                <text class="empty-desc">您还没有参加任何活动，快去发现精彩活动吧！</text>
              </view>
              
              <!-- 操作按钮 -->
              <view class="empty-actions">
                <button class="discover-btn" @click="discoverActivities">
                  <uni-icons type="search" size="16" color="#fff"/>
                  <text>发现活动</text>
                </button>
                <button class="refresh-btn" @click="refreshActivities">
                  <uni-icons type="refresh" size="16" color="#667eea"/>
                  <text>刷新</text>
                </button>
              </view>
              
              <!-- 装饰元素 -->
              <view class="empty-decoration">
                <view class="deco-dot deco-1"></view>
                <view class="deco-dot deco-2"></view>
                <view class="deco-dot deco-3"></view>
              </view>
            </view>
          </view>
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
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { onLoad,onShow } from '@dcloudio/uni-app'
import { useInfoStore } from '@/store/Info.js'
import ActivityTicket from '../../components/ActivityTicket/ActivityTicket.vue'
import {cancelapply} from '@/new-apis/events.js'
import {useEventstore} from '@/store/Event.js'

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
const loginType = ref('account') // account, sms, wechat

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

// 活动数据和状态
const myActivityData = ref(null) // 改为 null 表示没有活动

const hasActivities = computed(() => {
  return myActivityData.value && Object.keys(myActivityData.value).length > 0
})



// 页面挂载
onMounted(() => {
  initPage()
})
onShow(async()=>{
	console.log("已加载")
	initPage()
})

// 初始化页面
const initPage = async () => {
  try {
    if (userInfo.signal) {
      await refreshUserData()
    }
  } catch (error) {
    console.error('页面初始化失败:', error)
  }
}

// 刷新用户数据
const refreshUserData = async () => {
  try {
    await userInfo.getinfo()
	await userInfo.userapply()
    // 这里可以添加获取活动数据的逻辑
    await loadUserActivities()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 加载用户活动数据
const loadUserActivities = async () => {
  try {
    // 这里模拟从API获取活动数据
    // const activities = await fetchUserActivities()
    // myActivityData.value = userInfo.applyactivity.length > 0 ? userInfo.applyactivity[0] : null
	myActivityData.value = (userInfo.applyactivity?.length > 0) 
	  ? userInfo.applyactivity[0] 
	  : null;

    
  } catch (error) {
    console.error('获取活动数据失败:', error)
    myActivityData.value = null
  }
}

// 格式化手机号显示
const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
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
    await refreshUserData()
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

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
    await refreshUserData()
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

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

const wechatlogin = async () => {
  try{
    await userInfo.loginWithWeChat()
    initPage()
  } catch(e) {
    console.log(e)
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

const callSendSmsAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/send-sms',
      method: 'POST',
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.message || '发送失败'))
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

// 跳转到个人资料页面
const goToProfile = () => {
  uni.navigateTo({
    url: '/pages/detail/profile'
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

// 空状态相关方法
const discoverActivities = () => {
 uni.switchTab({
 	url: '../news/news'
 });
}

const refreshActivities = async () => {
  try {
    // showLoading('刷新中...')
    initPage()
    
    uni.showToast({
      title: '刷新完成',
      icon: 'success'
    })
  } catch (error) {
    console.error('刷新活动失败:', error)
    uni.showToast({
      title: '刷新失败',
      icon: 'error'
    })
  } finally {
    hideLoading()
  }
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

// 活动相关事件处理
const onAction = (data) => {
  console.log('活动操作:', data)
}

const onCancel = async(data) => {
	
	uni.showModal({
	  title: '确认取消',
	  content: `确定要取消报名"${data.title}"吗？`,
	  success: (res) => {
	    if (res.confirm) {
			cancelSignUp(data)
	    }
	  }
	})
}
// 取消报名的具体实现
const cancelSignUp = async (activityData) => {
  try {
    await cancelapply(activityData.id)
    initPage()
    
    uni.showToast({
      title: '取消报名成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('取消报名失败:', error)
    uni.showToast({
      title: '取消失败',
      icon: 'error'
    })
  }
}


const viewAllActivities = () => {
  uni.navigateTo({
    url: '/pages/detail/activityjoined'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: relative;
  z-index: 10;

  .nav-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
  }

  .nav-right {
    width: 64rpx;
  }
}

.status-bar {
  background: transparent;
}

// 简约登录界面样式
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
  margin-bottom: 60rpx;

  .logo-image {
    width: 120rpx;
    height: 120rpx;
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
    padding: 60rpx 0;

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

// 已登录状态样式保持原有
.main-container {
  min-height: 80vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
}

.header {
  position: relative;
  padding: 32rpx;
  overflow: hidden;

  .header-content {
    position: relative;
    z-index: 2;
  }

  .user-card {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 24rpx;
    padding: 32rpx;
    display: flex;
    align-items: center;
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.2);
    }

    .avatar-section {
      position: relative;
      margin-right: 24rpx;

      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
      }

      .online-indicator {
        position: absolute;
        bottom: 4rpx;
        right: 4rpx;
        width: 24rpx;
        height: 24rpx;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .indicator-dot {
          width: 12rpx;
          height: 12rpx;
          background: #2ed573;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }
    }

    .user-details {
      flex: 1;
      color: #fff;

      .user-name {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 6rpx;
      }

      .user-phone {
        display: block;
        font-size: 24rpx;
        opacity: 0.8;
        margin-bottom: 6rpx;
      }

      .user-signature {
        display: block;
        font-size: 26rpx;
        opacity: 0.9;
        line-height: 1.3;
      }
    }

    .profile-enter {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }
  }

  .header-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);

      &.deco-1 {
        width: 160rpx;
        height: 160rpx;
        top: -80rpx;
        right: -40rpx;
      }

      &.deco-2 {
        width: 100rpx;
        height: 100rpx;
        bottom: -50rpx;
        right: 60rpx;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5rpx); }
  75% { transform: translateX(5rpx); }
}

.main-content {
  background: #f8f9fa;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  margin-top: -16rpx;
  position: relative;
  z-index: 1;
}

.stats-overview {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 71, 87, 0.1);

  .stats-header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .stats-icon-wrapper {
      width: 64rpx;
      height: 64rpx;
      margin-right: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .stats-icon {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .stats-info {
      flex: 1;

      .stats-title {
        display: block;
        font-size: 32rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 4rpx;
      }

      .stats-subtitle {
        display: block;
        font-size: 26rpx;
        color: #ff4757;
        font-weight: 500;
      }
    }
  }

  .stats-grid {
    display: flex;
    align-items: center;

    .stat-item {
      flex: 1;
      text-align: center;

      .stat-number {
        display: block;
        font-size: 48rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 8rpx;
      }

      .stat-label {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .stat-trend {
        display: flex;
        align-items: center;
        justify-content: center;

        .trend-value {
          font-size: 22rpx;
          color: #2ed573;
          margin-left: 4rpx;
          font-weight: 600;
        }
      }
    }

    .stat-divider {
      width: 2rpx;
      height: 80rpx;
      background: #f0f0f0;
      margin: 0 24rpx;
    }
  }
}

.activity-section {
  margin-bottom: 32rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #333;
    }

    .section-more {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      transition: all 0.3s ease;

      &:active {
        background: rgba(255, 71, 87, 0.1);
      }

      .more-text {
        font-size: 26rpx;
        color: #999;
        margin-right: 8rpx;
      }
    }
  }
}

// 空状态样式
.empty-activity {
  .empty-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8rpx 32rpx rgba(255, 71, 87, 0.1);

    .empty-icon {
      margin-bottom: 32rpx;

      .empty-image {
        width: 200rpx;
        height: 160rpx;
        opacity: 0.8;
      }
    }

    .empty-content {
      margin-bottom: 40rpx;

      .empty-title {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 16rpx;
      }

      .empty-desc {
        display: block;
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
        max-width: 480rpx;
        margin: 0 auto;
      }
    }

    .empty-actions {
      display: flex;
      justify-content: center;
      gap: 24rpx;

      .discover-btn, .refresh-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24rpx 32rpx;
        border-radius: 16rpx;
        font-size: 28rpx;
        font-weight: 600;
        border: none;
        transition: all 0.3s ease;

        &::after {
          border: none;
        }

        text {
          margin-left: 8rpx;
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .discover-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
      }

      .refresh-btn {
        background: #f8f9fa;
        color: #667eea;
        border: 2rpx solid #667eea;

        &:active {
          background: rgba(102, 126, 234, 0.1);
        }
      }
    }

    .empty-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;

      .deco-dot {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        animation: float 6s ease-in-out infinite;

        &.deco-1 {
          width: 80rpx;
          height: 80rpx;
          top: 40rpx;
          right: 60rpx;
          animation-delay: -2s;
        }

        &.deco-2 {
          width: 60rpx;
          height: 60rpx;
          bottom: 80rpx;
          left: 40rpx;
          animation-delay: -4s;
        }

        &.deco-3 {
          width: 40rpx;
          height: 40rpx;
          top: 50%;
          left: 80rpx;
          animation-delay: -1s;
        }
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20rpx) rotate(180deg);
    opacity: 0.6;
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

// 响应式适配
@media screen and (max-width: 320px) {
  .login-card {
    margin: 0 20rpx;
    padding: 40rpx 24rpx;
  }
  
  .header {
    padding: 24rpx;
  }
  
  .main-content {
    padding: 24rpx;
  }

  .empty-card {
    padding: 40rpx 24rpx;

    .empty-actions {
      flex-direction: column;
      gap: 16rpx;

      .discover-btn, .refresh-btn {
        width: 100%;
      }
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .main-content {
    background: #1a1a1a;
  }
  
  .stats-overview {
    background: #2d2d2d;
    
    .stats-title {
      color: #fff;
    }
    
    .stat-number {
      color: #fff;
    }
    
    .stat-label {
      color: #ccc;
    }
  }
  
  .section-title {
    color: #fff;
  }

  .empty-card {
    background: #2d2d2d;

    .empty-title {
      color: #fff;
    }

    .empty-desc {
      color: #ccc;
    }

    .refresh-btn {
      background: #3d3d3d;
      color: #667eea;
      border-color: #667eea;
    }
  }
}
</style>