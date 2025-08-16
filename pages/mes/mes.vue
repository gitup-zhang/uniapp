<template>
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
            <view class="tab-badge" v-if="totalUnreadCount > 0">{{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}</view>
          </view>
          <view 
            class="filter-tab" 
            :class="{ active: activeTab === 'system' }"
            @tap="switchTab('system')"
          >
            系统消息
            <view class="tab-badge" v-if="systemUnreadCount > 0">{{ systemUnreadCount > 99 ? '99+' : systemUnreadCount }}</view>
          </view>
          <view 
            class="filter-tab" 
            :class="{ active: activeTab === 'group' }"
            @tap="switchTab('group')"
          >
            群组消息
            <view class="tab-badge" v-if="groupUnreadCount > 0">{{ groupUnreadCount > 99 ? '99+' : groupUnreadCount }}</view>
          </view>
        </view>
        
        <!-- 一键已读按钮 -->
        <view 
          class="mark-all-read-btn" 
          @tap="markAllAsRead"
          v-if="getCurrentUnreadCount() > 0"
        >
          <text class="mark-all-icon">✓</text>
          <text class="mark-all-text">全部已读</text>
        </view>
      </view>
      
      <!-- 消息列表 -->
      <scroll-view
        class="message-list"
        :style="{ marginTop: statusBarHeight + 44 + 68 + 'px' }"
        scroll-y="true"
        enable-back-to-top="true"
        :bounces="false"
        @scrolltolower="loadMoreMessages"
        :refresher-enabled="true"
        :refresher-triggered="isRefreshing"
        @refresherrefresh="handleRefresh"
        @refresherrestore="handleRefreshRestore"
      >
        <view class="message-list-content">
          <!-- 加载状态 -->
          <view v-if="isLoading && filteredMessages.length === 0" class="loading-state">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
          </view>
          
          <!-- 使用MessageCard组件 -->
          <MessageCard
            v-for="msg in filteredMessages"
            :key="getMessageKey(msg)"
            :message="msg"
            :loading="isLoading"
            @tap="handleMessageTap"
            @markAsRead="handleMarkAsRead"
          />
          
          <!-- 空状态 -->
          <view v-if="!isLoading && filteredMessages.length === 0" class="empty-state">
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
          
          <!-- 底部加载更多 -->
          <view v-if="isLoadingMore" class="load-more">
            <view class="loading-spinner small"></view>
            <text class="load-more-text">加载更多...</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useInfoStore } from '@/store/Info.js'
import MessageCard from '@/components/MessageCard/MessageCard.vue'
import { useMesstore } from '@/store/mes.js'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'

// 获取状态管理
const userStore = useInfoStore()
const mesStore = useMesstore()

// 响应式数据
const statusBarHeight = ref(0)
const activeTab = ref('all')
const isLoading = ref(false)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const hasLoadedOnce = ref(false)

// 登录状态计算属性
const isLoggedIn = computed(() => userStore.signal)

// 未读数量计算属性
const totalUnreadCount = computed(() => mesStore.totalUnreadCount)
const systemUnreadCount = computed(() => mesStore.systemUnreadCount)
const groupUnreadCount = computed(() => mesStore.groupUnreadCount)

// 格式化消息数据的函数
const formatMessageData = (rawMessage, type) => {
  if (!rawMessage) return null

  // 统一的消息数据格式
  const baseMessage = {
    id: rawMessage.id || `${type}-${Date.now()}`,
    type: type,
    original_data: rawMessage
  }

  if (type === 'system') {
    return {
      ...baseMessage,
      group_name: rawMessage.title || rawMessage.group_name || '系统通知',
      unread_count: rawMessage.unread_count || (rawMessage.is_read === 0 ? 1 : 0),
      is_read: rawMessage.is_read || 0,
      latest_content: rawMessage.content || rawMessage.message || rawMessage.latest_content || '系统消息',
      latest_time: rawMessage.latest_time || rawMessage.created_at || rawMessage.time || new Date().toISOString(),
      created_at: rawMessage.created_at,
      updated_at: rawMessage.updated_at
    }
  } else {
    return {
      ...baseMessage,
      group_name: rawMessage.group_name || rawMessage.event_name || rawMessage.title || '群组消息',
      unread_count: rawMessage.unread_count || (rawMessage.is_read === 0 ? 1 : 0),
      is_read: rawMessage.is_read || 0,
      latest_content: rawMessage.latest_message || rawMessage.content || rawMessage.description || rawMessage.latest_content || '群组消息',
      latest_time: rawMessage.latest_time || rawMessage.last_message_time || rawMessage.updated_at || rawMessage.created_at || new Date().toISOString(),
      created_at: rawMessage.created_at,
      updated_at: rawMessage.updated_at
    }
  }
}

// 格式化所有消息
const allFormattedMessages = computed(() => {
  const systemMessages = (mesStore.systemmes || [])
    .map(msg => formatMessageData(msg, 'system'))
    .filter(Boolean)
  
  const groupMessages = (mesStore.groupmes || [])
    .map(msg => formatMessageData(msg, 'group'))
    .filter(Boolean)
  
  return [...systemMessages, ...groupMessages]
})

// 筛选后的消息数据
const filteredMessages = computed(() => {
  if (!isLoggedIn.value) return []
  
  let filtered = []
  
  if (activeTab.value === 'all') {
    filtered = allFormattedMessages.value
  } else if (activeTab.value === 'system') {
    filtered = allFormattedMessages.value.filter(msg => msg.type === 'system')
  } else if (activeTab.value === 'group') {
    filtered = allFormattedMessages.value.filter(msg => msg.type === 'group')
  }
  
  // 排序：未读消息在前，然后按时间排序
  return filtered.sort((a, b) => {
    // 先按未读状态排序
    const aHasUnread = a.unread_count > 0 || a.is_read === 0
    const bHasUnread = b.unread_count > 0 || b.is_read === 0
    
    if (aHasUnread && !bHasUnread) return -1
    if (!aHasUnread && bHasUnread) return 1
    
    // 再按时间排序（最新的在前）
    const timeA = new Date(a.latest_time || a.updated_at || a.created_at || 0)
    const timeB = new Date(b.latest_time || b.updated_at || b.created_at || 0)
    return timeB - timeA
  })
})

// 生命周期
onMounted(async () => {
  try {
    const sysInfo = uni.getSystemInfoSync()
    statusBarHeight.value = sysInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
    statusBarHeight.value = 20
  }
})

onShow(async () => {
  if (isLoggedIn.value) {
    await loadUserMessages()
  }
})

onLoad(async () => {
  if (isLoggedIn.value) {
    await loadUserMessages()
  }
})

// 下拉刷新
onPullDownRefresh(async () => {
  await handleRefresh()
  uni.stopPullDownRefresh()
})

// 监听登录状态变化
watch(isLoggedIn, async (newVal) => {
  if (newVal && !hasLoadedOnce.value) {
    console.log('用户已登录，加载消息数据')
    await loadUserMessages()
  } else if (!newVal) {
    console.log('用户已登出，清空消息数据')
    mesStore.clearAllMessages()
    hasLoadedOnce.value = false
  }
})

// 获取消息唯一键
const getMessageKey = (msg) => {
  return `${msg.type}-${msg.id || msg.group_name || Date.now()}`
}

// 获取当前标签的未读数量
const getCurrentUnreadCount = () => {
  if (activeTab.value === 'all') {
    return totalUnreadCount.value
  } else if (activeTab.value === 'system') {
    return systemUnreadCount.value
  } else if (activeTab.value === 'group') {
    return groupUnreadCount.value
  }
  return 0
}

// 登录相关方法
const goToLogin = () => {
  uni.switchTab({
    url: '../mymessage/mymessage'
  })
}

// 加载用户消息数据
const loadUserMessages = async (isRefresh = false) => {
  if (!isLoggedIn.value) return
  
  if (isRefresh) {
    isRefreshing.value = true
  } else if (!hasLoadedOnce.value) {
    isLoading.value = true
  }
  
  try {
    console.log('开始加载用户消息数据...')
    const result = await mesStore.getsystem(isRefresh)
    
    if (result && result.success) {
      console.log('消息数据加载成功')
      hasLoadedOnce.value = true
    }
    
    await nextTick()
  } catch (error) {
    console.error('加载消息失败:', error)
    
    // 根据错误类型显示不同提示
    let errorMsg = '加载消息失败'
    if (error.message && error.message.includes('网络')) {
      errorMsg = '网络连接异常，请检查网络设置'
    } else if (error.message && error.message.includes('登录')) {
      errorMsg = '登录状态异常，请重新登录'
    }
    
    uni.showToast({
      title: errorMsg,
      icon: 'error',
      duration: 2000
    })
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

// 处理刷新
const handleRefresh = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    await loadUserMessages(true)
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  } catch (error) {
    console.error('刷新失败:', error)
    uni.showToast({
      title: '刷新失败',
      icon: 'error',
      duration: 1500
    })
  } finally {
    isRefreshing.value = false
  }
}

// 处理刷新恢复
const handleRefreshRestore = () => {
  isRefreshing.value = false
}

// 加载更多消息（上拉加载）
const loadMoreMessages = async () => {
  if (isLoading.value || isRefreshing.value || isLoadingMore.value) return
  
  console.log('触发加载更多消息')
  isLoadingMore.value = true
  
  try {
    // 这里可以实现分页加载逻辑
    // 暂时只是延迟一下，避免频繁触发
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 切换标签页
const switchTab = (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  console.log('切换到标签页:', tab)
}

// 处理消息卡片点击事件
const handleMessageTap = (msg) => {
  if (!isLoggedIn.value || !msg) return
  
  console.log('点击消息:', msg)
  
  try {
    // 根据消息类型跳转到相应的详情页面
    if (msg.type === 'system') {
      // 系统消息详情页
      uni.navigateTo({
        url: `/pages/detail/ChatSystem?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name || '系统消息')}`
      })
    } else if (msg.type === 'group') {
      // 群组消息详情页
      uni.navigateTo({
        url: `/pages/detail/ChatGroup?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name || '群组消息')}`
      })
    }
  } catch (error) {
    console.error('页面跳转失败:', error)
    uni.showToast({
      title: '页面跳转失败',
      icon: 'error',
      duration: 1500
    })
  }
}

// 处理单个消息标记已读
const handleMarkAsRead = async (msg) => {
  if (!msg || (!msg.unread_count && msg.is_read === 1)) return
  
  try {
    console.log('标记消息已读:', msg.group_name)
    
    if (msg.type === 'system') {
      await mesStore.markSystemMessageAsRead(msg.id)
    } else {
      await mesStore.markGroupMessageAsRead(msg.id)
    }
  } catch (error) {
    console.error('标记消息已读失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'error',
      duration: 1500
    })
  }
}

// 获取空状态标题
const getEmptyTitle = () => {
  const titles = {
    all: '暂无消息',
    system: '暂无系统消息',
    group: '暂无群组消息'
  }
  return titles[activeTab.value] || '暂无消息'
}

// 获取空状态描述
const getEmptyDesc = () => {
  const descs = {
    all: '目前还没有任何消息',
    system: '暂时没有系统通知',
    group: '您还未加入任何群组'
  }
  return descs[activeTab.value] || '暂无内容'
}

// 一键标记已读
const markAllAsRead = async () => {
  if (!isLoggedIn.value) return
  
  const currentMessages = filteredMessages.value
  const unreadMessages = currentMessages.filter(msg => 
    msg.unread_count > 0 || msg.is_read === 0
  )
  
  if (unreadMessages.length === 0) {
    uni.showToast({
      title: '已经没有未读消息了',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  try {
    // 显示确认对话框
    const res = await new Promise((resolve) => {
      uni.showModal({
        title: '确认操作',
        content: `确定要将${unreadMessages.length}条未读消息标记为已读吗？`,
        success: resolve
      })
    })
    
    if (!res.confirm) return
    
    // 显示加载提示
    uni.showLoading({
      title: '处理中...',
      mask: true
    })
    
    // 按类型分组处理
    const systemIds = unreadMessages.filter(msg => msg.type === 'system').map(msg => msg.id)
    const groupIds = unreadMessages.filter(msg => msg.type === 'group').map(msg => msg.id)
    
    const promises = []
    
    // 批量标记系统消息
    if (systemIds.length > 0) {
      promises.push(...systemIds.map(id => mesStore.markSystemMessageAsRead(id)))
    }
    
    // 批量标记群组消息
    if (groupIds.length > 0) {
      promises.push(...groupIds.map(id => mesStore.markGroupMessageAsRead(id)))
    }
    
    await Promise.allSettled(promises)
    
    uni.hideLoading()
    uni.showToast({
      title: `已标记${unreadMessages.length}条消息为已读`,
      icon: 'success',
      duration: 2000
    })
    
  } catch (error) {
    console.error('批量标记已读失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '操作失败，请稍后重试',
      icon: 'error',
      duration: 2000
    })
  }
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

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid rgba(102, 126, 234, 0.2);
  border-top: 6rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24rpx;
}

.loading-spinner.small {
  width: 40rpx;
  height: 40rpx;
  border-width: 4rpx;
  margin-bottom: 16rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #9ca3af;
}

/* 加载更多 */
.load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 20rpx;
}

.load-more-text {
  font-size: 24rpx;
  color: #9ca3af;
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