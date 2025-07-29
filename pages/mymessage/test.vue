<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 未登录状态 - 优化后的登录界面 -->
    <view v-if="!userInfo.signal" class="login-container">
      <view class="login-background">
        <!-- 动态背景装饰 -->
        <view class="animated-bg">
          <view class="floating-circle circle-1"></view>
          <view class="floating-circle circle-2"></view>
          <view class="floating-circle circle-3"></view>
          <view class="floating-circle circle-4"></view>
          <view class="floating-circle circle-5"></view>
        </view>
        
        <!-- 登录卡片 -->
        <view class="login-card">
          <!-- Logo区域 -->
          <view class="logo-section">
            <view class="logo-wrapper">
              <image class="logo-image" src="/static/icon/logo.png" mode="aspectFit"/>
              <view class="logo-shine"></view>
            </view>
            <text class="app-title">智慧平台</text>
            <text class="app-slogan">连接智慧，创造未来</text>
          </view>
          
          <!-- 特性展示 -->
          <view class="features-showcase">
            <view class="feature-card" v-for="(feature, index) in loginFeatures" :key="index">
              <view class="feature-icon" :class="feature.iconClass">
                <uni-icons :type="feature.icon" size="24" :color="feature.color"/>
              </view>
              <view class="feature-content">
                <text class="feature-title">{{ feature.title }}</text>
                <text class="feature-desc">{{ feature.desc }}</text>
              </view>
            </view>
          </view>
          
          <!-- 登录按钮区域 -->
          <view class="login-section">
            <button 
              class="modern-login-btn" 
              open-type="getPhoneNumber" 
              @getphonenumber="handlePhoneAuth"
              :disabled="isLogging"
            >
              <view class="btn-content">
                <view class="btn-icon" v-if="!isLogging">
                  <uni-icons type="phone-filled" size="20" color="#fff"/>
                </view>
                <uni-load-more v-if="isLogging" status="loading" color="#fff" :content-text="{ contentnomore: '' }"/>
                <text class="btn-text">{{ isLogging ? '正在登录...' : '手机号快速登录' }}</text>
              </view>
              <view class="btn-shine"></view>
            </button>
            
            <view class="privacy-notice">
              <text class="notice-text">登录即表示同意</text>
              <text class="notice-link" @click="showUserAgreement">《用户协议》</text>
              <text class="notice-text">和</text>
              <text class="notice-link" @click="showPrivacyPolicy">《隐私政策》</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 已登录状态 - 优化后的主界面 -->
    <view v-else class="main-container">
      <!-- 简洁的头部区域 -->
      <view class="header">
        <view class="header-content">
          <!-- 用户信息卡片 -->
          <view class="user-card" @click="goToProfile">
            <view class="avatar-section">
              <image 
                class="user-avatar" 
                :src="userInfo.info.Image || '/static/icon/empty.png'" 
                mode="aspectFill"
              />
              <view class="online-indicator">
                <view class="indicator-dot"></view>
              </view>
            </view>
            
            <view class="user-details">
              <text class="user-name">{{ userInfo.info.username || '用户' }}</text>
              <text class="user-phone">{{ formatPhoneNumber(userInfo.info.phone) }}</text>
              <text class="user-signature">{{ userInfo.info.slogan || '点击设置个人签名' }}</text>
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
              <text class="stats-title">我的数据统计</text>
              <text class="stats-subtitle">累计在线 {{ userInfo.info.daysOnline || 0 }} 天</text>
            </view>
          </view>
          
          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.info.newsViews || 0 }}</text>
              <text class="stat-label">新闻阅读</text>
              <view class="stat-trend">
                <uni-icons type="up" size="12" color="#2ed573"/>
                <text class="trend-value">+12</text>
              </view>
            </view>
            
            <view class="stat-divider"></view>
            
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.info.policyViews || 0 }}</text>
              <text class="stat-label">政策查看</text>
              <view class="stat-trend">
                <uni-icons type="up" size="12" color="#2ed573"/>
                <text class="trend-value">+5</text>
              </view>
            </view>
            
            <view class="stat-divider"></view>
            
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.info.field || 3 }}</text>
              <text class="stat-label">关注领域</text>
              <view class="stat-trend">
                <uni-icons type="minus" size="12" color="#ffa726"/>
                <text class="trend-value">0</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 活动区域 -->
        <view class="activity-section">
          <view class="section-header">
            <text class="section-title">我的活动</text>
            <view class="section-more" @click="viewAllActivities">
              <text class="more-text">查看全部</text>
              <uni-icons type="right" size="14" color="#999"/>
            </view>
          </view>
          
          <ActivityTicket 
            :activityData="myActivityData" 
            @check-activity="onCheck"
            @join-group="onJoin"
            @status-action="onStatus"
          />
        </view>

        <!-- 快捷功能 -->
        <!-- <view class="quick-actions">
          <view class="section-header">
            <text class="section-title">快捷功能</text>
          </view>
          <view class="actions-grid">
            <view class="action-item" v-for="(action, index) in quickActions" :key="index" @click="handleQuickAction(action)">
              <view class="action-icon" :style="{ background: action.bgColor }">
                <uni-icons :type="action.icon" size="20" :color="action.iconColor"/>
              </view>
              <text class="action-text">{{ action.text }}</text>
            </view>
          </view>
        </view> -->
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
import { useInfoStore } from '@/store/Info.js'
import ActivityTicket from '../../components/ActivityTicket/ActivityTicket.vue'

// Store 和基础数据
const userInfo = useInfoStore()
const SYSTEMINFO = uni.getSystemInfoSync()
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight)

// 弹窗引用
const loadingPopup = ref(null)

// 加载状态
const isLogging = ref(false)
const loadingText = ref({ more: '加载中...' })

// 登录页面特性展示
const loginFeatures = ref([
  {
    icon: 'locked',
    color: '#2ed573',
    iconClass: 'security-icon',
    title: '安全保障',
    desc: '银行级数据加密保护'
  },
  {
    icon: 'heart',
    color: '#ff4757',
    iconClass: 'personal-icon',
    title: '个性推荐',
    desc: '智能内容个性化推送'
  },
  {
    icon: 'cloud',
    color: '#3742fa',
    iconClass: 'sync-icon',
    title: '云端同步',
    desc: '多设备无缝数据同步'
  }
])

// 快捷功能
const quickActions = ref([
  {
    icon: 'gear',
    text: '账户设置',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconColor: '#fff',
    action: 'settings'
  },
  {
    icon: 'heart',
    text: '我的收藏',
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    iconColor: '#fff',
    action: 'favorites'
  },
  {
    icon: 'chatbubble',
    text: '消息中心',
    bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    iconColor: '#fff',
    action: 'messages'
  },
  {
    icon: 'help',
    text: '帮助中心',
    bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    iconColor: '#fff',
    action: 'help'
  }
])

// 活动数据
const myActivityData = ref({
  title: 'AI前沿研讨会',
  location: '北京中关村科技园',
  date: '8月10日-8月12日',
  checkText: '查看须知',
  joinText: '加入群聊',
  statusText: '点击签到'
})

// 用户授权状态
const authState = ref({
  phoneAuthCode: '',
  encryptedData: '',
  iv: ''
})

// 页面挂载
onMounted(() => {
  initPage()
})

// 初始化页面
const initPage = async () => {
  try {
    await userInfo.checkLoginStatus()
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
    await userInfo.getUserInfo()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 格式化手机号显示
const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 处理手机号授权
const handlePhoneAuth = async (e) => {
  console.log('手机号授权回调:', e)
  
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({
      title: '授权失败，请重试',
      icon: 'error'
    })
    return
  }

  try {
    isLogging.value = true
    
    authState.value = {
      phoneAuthCode: e.detail.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }

    await performLogin()
    
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'error'
    })
  } finally {
    isLogging.value = false
  }
}

// 执行登录逻辑
const performLogin = async () => {
  try {
    const loginRes = await uni.login({
      provider: 'weixin'
    })
    
    if (loginRes[1].errMsg !== 'login:ok') {
      throw new Error('获取登录凭证失败')
    }

    const loginCode = loginRes[1].code
    
    const loginData = {
      code: loginCode,
      phoneCode: authState.value.phoneAuthCode,
      encryptedData: authState.value.encryptedData,
      iv: authState.value.iv
    }

    const loginResult = await callLoginAPI(loginData)
    await userInfo.saveLoginInfo(loginResult)
    await refreshUserData()
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

  } catch (error) {
    console.error('登录过程出错:', error)
    throw error
  }
}

// 调用登录API
const callLoginAPI = async (loginData) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/login',
      method: 'POST',
      data: loginData,
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

// 快捷功能处理
const handleQuickAction = (action) => {
  switch (action.action) {
    case 'settings':
      uni.navigateTo({
        url: '/pages/settings/index'
      })
      break
    case 'favorites':
      uni.navigateTo({
        url: '/pages/favorites/index'
      })
      break
    case 'messages':
      uni.navigateTo({
        url: '/pages/messages/index'
      })
      break
    case 'help':
      uni.navigateTo({
        url: '/pages/help/index'
      })
      break
  }
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

// 活动相关事件处理
const onCheck = (data) => {
  console.log('查看活动:', data)
  uni.navigateTo({
    url: '/pages/activity/detail?id=' + data.id
  })
}

const onJoin = (data) => {
  console.log('加入群聊:', data)
  uni.showToast({
    title: '已加入群聊',
    icon: 'success'
  })
}

const onStatus = async (data) => {
  console.log('状态操作:', data)
  
  try {
    showLoading('正在签到...')
    await performCheckin(data)
    uni.showToast({
      title: '签到成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '签到失败',
      icon: 'error'
    })
  } finally {
    hideLoading()
  }
}

// 执行签到
const performCheckin = async (data) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500)
  })
}

const viewAllActivities = () => {
  uni.navigateTo({
    url: '/pages/activity/list'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
}

.status-bar {
  background: transparent;
}

// 优化后的登录界面样式
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-background {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .floating-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;

    &.circle-1 {
      width: 80rpx;
      height: 80rpx;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 120rpx;
      height: 120rpx;
      top: 60%;
      right: 15%;
      animation-delay: 1s;
    }

    &.circle-3 {
      width: 60rpx;
      height: 60rpx;
      top: 30%;
      right: 20%;
      animation-delay: 2s;
    }

    &.circle-4 {
      width: 100rpx;
      height: 100rpx;
      bottom: 30%;
      left: 20%;
      animation-delay: 3s;
    }

    &.circle-5 {
      width: 40rpx;
      height: 40rpx;
      bottom: 20%;
      right: 30%;
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  margin: 0 40rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;

  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 32rpx;

    .logo-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 24rpx;
    }

    .logo-shine {
      position: absolute;
      top: -4rpx;
      left: -4rpx;
      right: -4rpx;
      bottom: -4rpx;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%);
      border-radius: 28rpx;
      animation: shine 3s infinite;
      pointer-events: none;
    }
  }

  .app-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    margin-bottom: 12rpx;
  }

  .app-slogan {
    display: block;
    font-size: 28rpx;
    color: #666;
    font-weight: 400;
  }
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.features-showcase {
  margin-bottom: 60rpx;

  .feature-card {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .feature-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;

      &.security-icon {
        background: linear-gradient(135deg, #2ed573, #7bed9f);
      }

      &.personal-icon {
        background: linear-gradient(135deg, #ff4757, #ff6b7a);
      }

      &.sync-icon {
        background: linear-gradient(135deg, #3742fa, #5352ed);
      }
    }

    .feature-content {
      flex: 1;

      .feature-title {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 6rpx;
      }

      .feature-desc {
        display: block;
        font-size: 24rpx;
        color: #666;
        line-height: 1.4;
      }
    }
  }
}

.login-section {
  .modern-login-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 44rpx;
    position: relative;
    overflow: hidden;
    margin-bottom: 32rpx;
    box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);

    &:active {
      transform: translateY(2rpx);
    }

    &:disabled {
      opacity: 0.7;
    }

    &::after {
      border: none;
    }

    .btn-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .btn-icon {
        margin-right: 12rpx;
      }

      .btn-text {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }

    &:active .btn-shine {
      left: 100%;
    }
  }

  .privacy-notice {
    text-align: center;

    .notice-text, .notice-link {
      font-size: 24rpx;
      color: #999;
    }
    
    .notice-link {
      color: #667eea;
      font-weight: 500;
    }
  }
}

// 优化后的已登录主界面
.main-container {
  min-height: 100vh;
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

.main-content {
  background: #f8f9fa;
  border-radius: 32rpx 32rpx 0 0;
  min-height: calc(100vh - 400rpx);
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

.quick-actions {
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
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24rpx;

    .action-item {
      background: #fff;
      border-radius: 20rpx;
      padding: 32rpx 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.12);
      }

      .action-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .action-text {
        font-size: 26rpx;
        color: #666;
        font-weight: 500;
        text-align: center;
      }
    }
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
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .action-item {
    background: #2d2d2d;
    
    .action-text {
      color: #ccc;
    }
  }
}
</style>