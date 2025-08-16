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
        @scrolltolower="loadMoreMessages"
      >
        <view class="message-list-content">
          <!-- 加载状态 -->
          <view v-if="isLoading" class="loading-state">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
          </view>
          
          <!-- 使用MessageCard组件 -->
          <MessageCard
            v-for="msg in filteredMessages"
            :key="`msg-${msg.group_name || msg.title || msg.id}`"
            :message="msg"
            @tap="handleMessageTap"
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

// 登录状态计算属性
const isLoggedIn = computed(() => userStore.signal)

// 格式化时间函数
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  
  try {
    // 处理不同的时间格式
    let date
    if (typeof dateStr === 'string') {
      // 处理 ISO 8601 格式，如 "2025-08-12T03:14:21+08:00"
      date = new Date(dateStr)
    } else if (dateStr instanceof Date) {
      date = dateStr
    } else {
      return String(dateStr)
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('无效的日期格式:', dateStr)
      return String(dateStr)
    }
    
    const now = new Date()
    const diff = now - date
    
    // 小于1分钟
    if (diff < 60 * 1000) {
      return '刚刚'
    }
    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`
    }
    // 小于24小时
    if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
    }
    // 小于7天
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
    }
    // 大于7天，显示具体日期和时间
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    // 如果是今年，不显示年份
    if (date.getFullYear() === now.getFullYear()) {
      return `${month}-${day} ${hours}:${minutes}`
    } else {
      return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`
    }
  } catch (error) {
    console.error('时间格式化错误:', error, '原始时间:', dateStr)
    return String(dateStr)
  }
}

// 处理系统消息数据格式化
const formatSystemMessages = (messages) => {
  if (!Array.isArray(messages)) return []
  
  return messages.map(msg => {
    // 如果数据已经包含所需字段，直接使用
    if (msg.group_name && msg.latest_content && msg.latest_time) {
      return {
        id: msg.id,
        group_name: msg.group_name,
        unread_count: msg.unread_count || 0,
        latest_content: msg.latest_content,
        latest_time: formatTime(msg.latest_time),
        raw_time: msg.latest_time,
        type: 'system',
        original_data: msg
      }
    }
    
    // 否则进行格式化处理
    return {
      id: msg.id,
      group_name: msg.title || msg.group_name || '系统通知',
      unread_count: msg.unread_count || (msg.is_read === 0 ? 1 : 0),
      latest_content: msg.content || msg.message || msg.latest_content || '',
      latest_time: formatTime(msg.latest_time || msg.created_at || msg.time),
      raw_time: msg.latest_time || msg.created_at || msg.time,
      type: 'system',
      original_data: msg
    }
  })
}

// 处理群组消息数据格式化
const formatGroupMessages = (messages) => {
  if (!Array.isArray(messages)) return []
  
  return messages.map(msg => {
    // 如果数据已经包含所需字段，直接使用
    if (msg.group_name && msg.latest_content && msg.latest_time) {
      return {
        id: msg.id,
        group_name: msg.group_name,
        unread_count: msg.unread_count || 0,
        latest_content: msg.latest_content,
        latest_time: formatTime(msg.latest_time),
        raw_time: msg.latest_time,
        type: 'group',
        original_data: msg
      }
    }
    
    // 否则进行格式化处理
    return {
      id: msg.id,
      group_name: msg.group_name || msg.event_name || msg.title || '群组消息',
      unread_count: msg.unread_count || (msg.is_read === 0 ? 1 : 0),
      latest_content: msg.latest_message || msg.content || msg.description || msg.latest_content || '',
      latest_time: formatTime(msg.latest_time || msg.last_message_time || msg.updated_at || msg.created_at),
      raw_time: msg.latest_time || msg.last_message_time || msg.updated_at || msg.created_at,
      type: 'group',
      original_data: msg
    }
  })
}

// 格式化后的消息数据计算属性
const formattedMessages = computed(() => {
  console.log('原始系统消息数据:', mesStore.systemmes)
  console.log('原始群组消息数据:', mesStore.groupmes)
  
  const systemMessages = formatSystemMessages(mesStore.systemmes || [])
  const groupMessages = formatGroupMessages(mesStore.groupmes || [])
  
  console.log('格式化后的系统消息:', systemMessages)
  console.log('格式化后的群组消息:', groupMessages)
  
  const allMessages = [...systemMessages, ...groupMessages]
  console.log('所有消息:', allMessages)
  
  return allMessages
})

// 筛选后的消息数据
const filteredMessages = computed(() => {
  if (!isLoggedIn.value || isLoading.value) return []
  
  let filtered = []
  
  if (activeTab.value === 'all') {
    filtered = formattedMessages.value
  } else {
    filtered = formattedMessages.value.filter(msg => msg.type === activeTab.value)
  }
  
  // 排序：未读消息在前，然后按时间排序
  return filtered.sort((a, b) => {
    // 先按未读数量排序
    if (a.unread_count > 0 && b.unread_count === 0) return -1
    if (a.unread_count === 0 && b.unread_count > 0) return 1
    
    // 再按时间排序
    const timeA = new Date(a.raw_time || a.latest_time)
    const timeB = new Date(b.raw_time || b.latest_time)
    return timeB - timeA
  })
})

// 未读消息数量计算
const unreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return formattedMessages.value.reduce((sum, msg) => sum + msg.unread_count, 0)
})

const systemUnreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return formattedMessages.value
    .filter(msg => msg.type === 'system')
    .reduce((sum, msg) => sum + msg.unread_count, 0)
})

const groupUnreadCount = computed(() => {
  if (!isLoggedIn.value) return 0
  return formattedMessages.value
    .filter(msg => msg.type === 'group')
    .reduce((sum, msg) => sum + msg.unread_count, 0)
})

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight
})

onShow(async () => {
  if (!isLoggedIn.value) return
  await loadUserMessages()
})

onLoad(async () => {
  if (isLoggedIn.value) {
    await loadUserMessages()
  }
})

// 下拉刷新
onPullDownRefresh(async () => {
  if (!isLoggedIn.value) {
    uni.stopPullDownRefresh()
    return
  }
  
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
    uni.stopPullDownRefresh()
  }
})

// 监听登录状态变化
watch(isLoggedIn, async (newVal) => {
  if (newVal) {
    console.log('用户已登录，加载消息数据')
    await loadUserMessages()
  } else {
    console.log('用户已登出，清空消息数据')
  }
})

// 登录相关方法
const goToLogin = () => {
  uni.switchTab({
    url: '../mymessage/mymessage'
  })
}

// 加载用户消息数据
const loadUserMessages = async (isRefresh = false) => {
  if (isRefresh) {
    isRefreshing.value = true
  } else {
    isLoading.value = true
  }
  
  try {
    console.log('开始加载用户消息数据...')
    await mesStore.getsystem()
    console.log('消息数据加载完成')
    
    // 确保数据更新后再停止loading状态
    await nextTick()
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载消息失败',
      icon: 'error',
      duration: 2000
    })
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

// 加载更多消息（上拉加载）
const loadMoreMessages = async () => {
  if (isLoading.value || isRefreshing.value) return
  
  console.log('触发加载更多消息')
  // 这里可以实现分页加载逻辑
  // await loadUserMessages()
}

// 切换标签页
const switchTab = (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  console.log('切换到标签页:', tab)
}

// 处理消息卡片点击事件
const handleMessageTap = (msg) => {
  if (!isLoggedIn.value) return
  
  console.log('点击消息:', msg)
  
  // 跳转到相应的详情页面
  if (msg.type === 'system') {
    // 系统消息详情页
    uni.navigateTo({
      url: `/pages/system-message/index?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name)}`
    })
  } else {
    // 群组消息详情页
    uni.navigateTo({
      url: `/pages/group-chat/index?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name)}`
    })
  }
  
  // 如果消息未读，标记为已读
  if (msg.unread_count > 0) {
    markMessageAsRead(msg)
  }
}

// 标记单个消息为已读
const markMessageAsRead = async (msg) => {
  try {
    // 这里应该调用API标记消息为已读
    // await api.markMessageAsRead(msg.id)
    
    // 临时更新本地状态
    const messages = msg.type === 'system' ? mesStore.systemmes : mesStore.groupmes
    const index = messages.findIndex(m => m.id === msg.id)
    if (index !== -1) {
      messages[index].is_read = 1
      if (messages[index].unread_count) {
        messages[index].unread_count = 0
      }
    }
    
    console.log('消息已标记为已读:', msg.group_name)
  } catch (error) {
    console.error('标记消息已读失败:', error)
  }
}

// 获取空状态标题
const getEmptyTitle = () => {
  const titles = {
    all: '暂无消息',
    system: '暂无系统消息',
    group: '暂无群组消息'
  }
  return titles[activeTab.value]
}

// 获取空状态描述
const getEmptyDesc = () => {
  const descs = {
    all: '目前还没有任何消息',
    system: '暂时没有系统通知',
    group: '您还未加入任何群组'
  }
  return descs[activeTab.value]
}

// 一键标记已读
const markAllAsRead = async () => {
  if (!isLoggedIn.value) return
  
  const currentMessages = activeTab.value === 'all' 
    ? formattedMessages.value 
    : formattedMessages.value.filter(msg => msg.type === activeTab.value)
  
  const totalUnread = currentMessages.reduce((sum, msg) => sum + msg.unread_count, 0)
  
  if (totalUnread === 0) {
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
        content: `确定要将${totalUnread}条未读消息标记为已读吗？`,
        success: resolve
      })
    })
    
    if (!res.confirm) return
    
    // 这里应该调用API批量标记消息为已读
    // const messageIds = currentMessages
    //   .filter(msg => msg.unread_count > 0)
    //   .map(msg => msg.id)
    // await api.markMessagesAsRead(messageIds)
    
    // 临时更新本地状态
    currentMessages.forEach(msg => {
      if (msg.unread_count > 0) {
        if (msg.type === 'system') {
          const index = mesStore.systemmes.findIndex(m => m.id === msg.id)
          if (index !== -1) {
            mesStore.systemmes[index].is_read = 1
          }
        } else {
          const index = mesStore.groupmes.findIndex(m => m.id === msg.id)
          if (index !== -1) {
            mesStore.groupmes[index].is_read = 1
            if (mesStore.groupmes[index].unread_count) {
              mesStore.groupmes[index].unread_count = 0
            }
          }
        }
      }
    })
    
    uni.showToast({
      title: `已标记${totalUnread}条消息为已读`,
      icon: 'success',
      duration: 2000
    })
    
  } catch (error) {
    console.error('批量标记已读失败:', error)
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
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