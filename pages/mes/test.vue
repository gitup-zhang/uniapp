<template>
</template>

<script>
</script>

<style>
</style><template>
  <view class="container">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="login-required">
      <view class="login-card">
        <view class="login-icon">🔐</view>
        <text class="login-title">请先登录</text>
        <text class="login-desc">登录后即可查看和管理您的消息</text>
        <button class="login-btn" @tap="goToLogin">
          <text class="login-btn-text">立即登录</text>
        </button>
      </view>
    </view>

    <!-- 已登录状态 - 显示消息界面 -->
    <view v-else class="message-container">
      <!-- 自定义导航栏 -->
      <view class="custom-navbar">
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        <view class="nav-content">
          <text class="nav-title">消息</text>
        </view>
      </view>
      
      <!-- 固定筛选标签 -->
      <view class="filter-tabs-fixed" :style="{ top: statusBarHeight + 44 + 'px' }">
        <view class="tabs-container">
          <view 
            class="filter-tab" 
            :class="{ active: activeTab === 'all' }"
            @tap="switchTab('all')"
          >
            全部
            <view class="tab-badge" v-if="unreadCount > 0">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
          </view>
          <view 
            class="filter-tab" 
            :class="{ active: activeTab === 'system' }"
            @tap="switchTab('system')"
          >
            系统消息
            <view class="tab-badge" v-if="systemUnreadCount > 0">{{ systemUnreadCount }}</view>
          </view>
          <view 
            class="filter-tab" 
            :class="{ active: activeTab === 'group' }"
            @tap="switchTab('group')"
          >
            群组消息
            <view class="tab-badge" v-if="groupUnreadCount > 0">{{ groupUnreadCount }}</view>
          </view>
        </view>
        
        <!-- 一键已读按钮 -->
        <view 
          class="mark-all-read-btn" 
          @tap="markAllAsRead"
          v-if="unreadCount > 0"
        >
          <text class="mark-all-icon">✓</text>
          <text class="mark-all-text">全部已读</text>
        </view>
      </view>
      
      <!-- 消息列表 - 使用新的MessageCard组件 -->
      <scroll-view
        class="message-list"
        :style="{ marginTop: statusBarHeight + 44 + 68 + 'px' }"
        scroll-y="true"
        enable-back-to-top="true"
        :bounces="false"
      >
        <view class="message-list-content">
          <!-- 使用MessageCard组件 -->
          <MessageCard
            v-for="msg in filteredMessages"
            :key="`msg-${msg.group_name}`"
            :message="msg"
            @tap="handleMessageTap"
          />
          
          <!-- 空状态 -->
          <view v-if="filteredMessages.length === 0" class="empty-state">
            <view class="empty-animation">
              <view class="empty-icon">💬</view>
              <view class="empty-waves">
                <view class="wave wave1"></view>
                <view class="wave wave2"></view>
                <view class="wave wave3"></view>
              </view>
            </view>
            <text class="empty-title">{{ getEmptyTitle() }}</text>
            <text class="empty-desc">{{ getEmptyDesc() }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useInfoStore } from '@/store/Info.js' // 请根据你的实际路径调整
import MessageCard from '@/components/MessageCard/MessageCard.vue' // 引入消息卡片组件
import { useMesstore } from '@/store/mes.js'
import { onLoad,onShow } from '@dcloudio/uni-app'

// 获取用户状态管理
const userStore = useInfoStore()
const useMes=useMesstore()

// 响应式数据
const statusBarHeight = ref(0)
const activeTab = ref('all')

// 登录状态计算属性
const isLoggedIn = computed(() => userStore.signal)

// 消息数据 - 使用新的数据格式
const messages = ref([
  {
    group_name: "系统通知",
    unread_count: 3,
    latest_content: "系统将于今晚22:00-23:00进行维护升级，期间可能影响使用。",
    latest_time: "2025-08-16 14:30:00",
    type: 'system'
  },
  {
    group_name: "维护公告",
    unread_count: 0,
    latest_content: "系统维护已完成，所有功能恢复正常，感谢您的耐心等待。",
    latest_time: "2025-08-16 10:15:00",
    type: 'system'
  },
  {
    group_name: "技术交流群",
    unread_count: 12,
    latest_content: "Vue.js团队正式发布了3.4版本，新增了多项重要特性：响应式系统优化、组合式API增强、性能提升等...",
    latest_time: "2025-08-16 16:45:00",
    type: 'group'
  },
  {
    group_name: "学习讨论组",
    unread_count: 0,
    latest_content: "今天的分享会很精彩，大家对Vue3的新特性都有了更深入的理解，下次继续讨论性能优化相关话题...",
    latest_time: "2025-08-16 12:20:00",
    type: 'group'
  },
  {
    group_name: "工作协作群",
    unread_count: 5,
    latest_content: "关于下一个项目的技术栈选择和架构设计，将在明天上午10点召开讨论会议，请相关同事准时参加...",
    latest_time: "2025-08-15 18:30:00",
    type: 'group'
  }
])

// 计算属性
const filteredMessages = computed(() => {
  if (!isLoggedIn.value) return []
  if (activeTab.value === 'all') {
    return messages.value.sort((a, b) => {
      // 先按未读数量排序（有未读的排在前面）
      if (a.unread_count > 0 && b.unread_count === 0) return -1
      if (a.unread_count === 0 && b.unread_count > 0) return 1
      // 然后按最新时间排序
      return new Date(b.latest_time) - new Date(a.latest_time)
    })
  }
  return messages.value
    .filter(msg => msg.type === activeTab.value)
    .sort((a, b) => {
      if (a.unread_count > 0 && b.unread_count === 0) return -1
      if (a.unread_count === 0 && b.unread_count > 0) return 1
      return new Date(b.latest_time) - new Date(a.latest_time)
    })
})

const unreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return messages.value.reduce((sum, msg) => sum + msg.unread_count, 0)
})

const systemUnreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return messages.value
    .filter(msg => msg.type === 'system')
    .reduce((sum, msg) => sum + msg.unread_count, 0)
})

const groupUnreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return messages.value
    .filter(msg => msg.type === 'group')
    .reduce((sum, msg) => sum + msg.unread_count, 0)
})

// 生命周期
onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight
})
onShow(async()=>{
	if (!isLoggedIn.value) return
	loadUserMessages()
})

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    console.log('用户已登录，加载消息数据')
    loadUserMessages()
  } else {
    console.log('用户已登出，清空消息数据')
  }
})

// 登录相关方法
const goToLogin = () => {
  uni.switchTab({
    url: '../mymessage/mymessage'
  });
}

// 加载用户消息数据的方法
const loadUserMessages = async () => {
  try {
    console.log('加载用户消息数据')
	useMes.getsystem()
    // 这里调用你的API获取消息分组数据
    // const response = await api.getMessageGroups()
    // messages.value = response.data
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载消息失败',
      icon: 'error'
    })
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
}

// 处理消息卡片点击事件
const handleMessageTap = (msg) => {
  if (!isLoggedIn.value) return
  
  console.log('点击消息分组:', msg.group_name)
  
  // 跳转到相应的详情页面
  if (msg.type === 'system') {
    uni.navigateTo({
      url: `/pages/system-message/index?groupName=${encodeURIComponent(msg.group_name)}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/group-chat/index?groupName=${encodeURIComponent(msg.group_name)}`
    })
  }
}

const getEmptyTitle = () => {
  const titles = {
    all: '暂无消息',
    system: '暂无系统消息',
    group: '暂无群组消息'
  }
  return titles[activeTab.value]
}

const getEmptyDesc = () => {
  const descs = {
    all: '目前还没有任何消息',
    system: '暂时没有系统通知',
    group: '您还未加入任何群组'
  }
  return descs[activeTab.value]
}

const markAllAsRead = () => {
  if (!isLoggedIn.value) return
  
  const currentMessages = activeTab.value === 'all' 
    ? messages.value 
    : messages.value.filter(msg => msg.type === activeTab.value)
  
  const totalUnread = currentMessages.reduce((sum, msg) => sum + msg.unread_count, 0)
  
  if (totalUnread === 0) {
    uni.showToast({
      title: '已经没有未读消息了',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  // 标记为已读
  currentMessages.forEach(msg => {
    const messageIndex = messages.value.findIndex(m => m.group_name === msg.group_name)
    if (messageIndex !== -1) {
      messages.value[messageIndex].unread_count = 0
    }
  })
  
  uni.showToast({
    title: `已标记${totalUnread}条消息为已读`,
    icon: 'success',
    duration: 1500
  })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 登录提示样式 */
.login-required {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
  background: linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%);
}

.login-card {
  background: white;
  border-radius: 32rpx;
  padding: 80rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 640rpx;
  backdrop-filter: blur(20rpx);
}

.login-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10rpx); }
}

.login-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 20rpx;
}

.login-desc {
  font-size: 28rpx;
  color: #718096;
  margin-bottom: 60rpx;
  line-height: 1.6;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 60rpx;
  padding: 32rpx 80rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 16rpx 40rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(4rpx);
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.4);
}

.login-btn-text {
  color: white;
}

/* 消息容器 */
.message-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* 自定义导航栏 */
.custom-navbar {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
}

.status-bar {
  width: 100%;
}

.nav-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

/* 固定筛选标签 */
.filter-tabs-fixed {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 998;
  background: #f8fafc;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid rgba(0,0,0,0.05);
  backdrop-filter: blur(20rpx);
}

.tabs-container {
  display: flex;
  gap: 16rpx;
}

.filter-tab {
  padding: 16rpx 32rpx;
  background: white;
  border-radius: 32rpx;
  font-size: 28rpx;
  color: #4a5568;
  border: 3rpx solid transparent;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  position: relative;
  font-weight: 600;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  transform: translateY(-2rpx);
}

.tab-badge {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: white;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 4rpx solid white;
  box-shadow: 0 4rpx 12rpx rgba(255, 71, 87, 0.4);
}

/* 一键已读按钮 */
.mark-all-read-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.3);
  color: white;
  font-size: 26rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mark-all-read-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.4);
}

.mark-all-icon {
  font-size: 28rpx;
  font-weight: bold;
}

.mark-all-text {
  font-size: 24rpx;
}

/* 消息列表 */
.message-list {
  flex: 1;
  background: #f8fafc;
}

.message-list-content {
  padding: 32rpx;
  padding-bottom: 40rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.empty-animation {
  position: relative;
  margin-bottom: 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

.empty-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 200rpx;
}

.wave {
  position: absolute;
  border: 4rpx solid rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: wave-pulse 2s ease-out infinite;
}

.wave1 { animation-delay: 0s; }
.wave2 { animation-delay: 0.5s; }
.wave3 { animation-delay: 1s; }

@keyframes wave-pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.5;
}
</style>