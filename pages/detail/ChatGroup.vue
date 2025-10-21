<template>
  <view class="admin-message-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <view class="back-btn">
            <text class="back-icon">‹</text>
          </view>
        </view>
        <view class="nav-center">
          <text class="nav-title">{{ groupName }}</text>
          <text class="nav-subtitle">管理员通知</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 消息列表区域 -->
    <scroll-view
      class="message-list"
      :style="{ marginTop: statusBarHeight + 8 + 'px' }"
      scroll-y="true"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      @scrolltolower="onScrollToLower"
      
      
      :refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      refresher-background="#f8fafc"
      @refresherrefresh="onRefresherRefresh"
      @refresherrestore="onRefresherRestore"
    >
      <!-- 自定义下拉刷新提示 -->
      <!-- <view slot="refresher" class="custom-refresher">
        <view class="refresher-content">
          <view class="refresher-icon" :class="{ 'refresher-rotating': refresherTriggered }">
            <text class="refresh-symbol">↻</text>
          </view>
          <text class="refresher-text">{{ refresherText }}</text>
        </view>
      </view> -->

      <view class="message-list-content">
        <!-- 按日期分组显示消息 -->
        <template v-for="(group, dateKey) in groupedMessages" :key="dateKey">
          <view class="date-divider" v-if="Object.keys(groupedMessages).length > 1">
            <view class="date-line"></view>
            <text class="date-text">{{ dateKey }}</text>
            <view class="date-line"></view>
          </view>

          <!-- 使用管理员消息组件 -->
          <AdminMessage
            v-for="message in group"
            :key="message.id"
            :message="message"
            @messageClick="handleMessageClick"
            @actionClick="handleActionClick"
            @markRead="handleMarkRead"
          />
        </template>

        <!-- 加载更多提示 -->
        <view v-if="MesStore.loadingMore" class="loading-more">
          <view class="loading-spinner-small"></view>
          <text class="loading-more-text">加载更多...</text>
        </view>

        <!-- 没有更多数据提示 -->
        <view v-if="!MesStore.hasMoreData && MesStore.MessageList.length > 0" class="no-more-data">
          <text class="no-more-text">没有更多消息了</text>
        </view>

        <!-- 没有消息提示 -->
        <view v-if="MesStore.MessageList.length === 0 && !MesStore.loading" class="empty-state">
          <view class="empty-icon">📢</view>
          <text class="empty-title">暂无管理员消息</text>
          <text class="empty-desc">管理员发布的通知消息将在这里显示</text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载遮罩 -->
    <view v-if="MesStore.loading && MesStore.MessageList.length === 0" class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>

    <!-- 错误提示 -->
    <view v-if="MesStore.error && !MesStore.loading" class="error-overlay">
      <view class="error-content">
        <view class="error-icon">⚠️</view>
        <text class="error-title">加载失败</text>
        <text class="error-desc">{{ MesStore.error }}</text>
        <view class="error-actions">
          <view class="error-btn" @tap="handleRetry">
            <text class="error-btn-text">重试</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import AdminMessage from '@/components/AdminMessage/AdminMessage.vue'
import { useMesstore } from '@/store/mes.js'

// 页面参数
const props = defineProps({
  id: String,
  groupName: String
})

// 初始化pinia
const MesStore = useMesstore()

// 页面状态
const statusBarHeight = ref(0)
const scrollIntoView = ref('')
const isFirstLoad = ref(true)

// 群组信息
const groupId = ref('')
const groupName = ref('管理员通知')

// 防抖控制
const loadMoreTimer = ref(null)

// 下拉刷新相关状态
const refresherTriggered = ref(false)
const refresherText = ref('下拉刷新')

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  console.log("跳转到的群组信息：", options)
  groupId.value = options.id || ''
  groupName.value = decodeURIComponent(options.groupName || '管理员通知')
  
  MesStore.clearMessageList()
  await loadInitialMessages()
})

onShow(() => {
  isFirstLoad.value = false
})

onReachBottom(() => {
  onScrollToLower()
})

// 计算属性
const groupedMessages = computed(() => {
  const grouped = {}
  
  if (!MesStore.MessageList || !Array.isArray(MesStore.MessageList)) {
    return grouped
  }
  
  MesStore.MessageList.forEach(message => {
    const date = new Date(message.created_at || message.send_time || message.updated_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let dateKey = ''
    if (isSameDay(date, today)) {
      dateKey = '今天'
    } else if (isSameDay(date, yesterday)) {
      dateKey = '昨天'
    } else if (date.getFullYear() === today.getFullYear()) {
      dateKey = `${date.getMonth() + 1}月${date.getDate()}日`
    } else {
      dateKey = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(message)
  })
  
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey].sort((a, b) => {
      const timeA = new Date(a.created_at || a.send_time || a.updated_at)
      const timeB = new Date(b.created_at || b.send_time || b.updated_at)
      return timeB - timeA
    })
  })
  
  return grouped
})

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const loadInitialMessages = async () => {
  try {
    const params = {
      message_type: 'EVENT',
      event_id: groupId.value,
      page: 1,
      page_size: 20
    }
    
    await MesStore.getMessageList(groupId.value,params)
    
    if (MesStore.MessageList.length > 0) {
      setTimeout(() => {
        scrollToTop()
      }, 100)
    }
    
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载消息失败',
      icon: 'error',
      duration: 2000
    })
  }
}

// 下拉刷新处理
const onRefresherRefresh = async () => {
  console.log('开始下拉刷新')
  refresherTriggered.value = true
  refresherText.value = '正在刷新...'
  
  try {
    // 清空现有消息列表
    // MesStore.clearMessageList()
    
    // 重新加载第一页数据
    const params = {
      message_type: 'EVENT',
      event_id: groupId.value,
      page: 1,
      page_size: 20
    }
    
    await MesStore.getMessageList(groupId.value,params)
    
    // 显示刷新成功提示
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
    
    // 滚动到顶部
    setTimeout(() => {
      scrollToTop()
    }, 100)
    
  } catch (error) {
    console.error('刷新失败:', error)
    uni.showToast({
      title: '刷新失败',
      icon: 'error',
      duration: 2000
    })
  } finally {
    // 结束刷新状态
    setTimeout(() => {
      refresherTriggered.value = false
      refresherText.value = '下拉刷新'
    }, 500)
  }
}

// 刷新恢复处理
const onRefresherRestore = () => {
  console.log('刷新恢复')
  refresherText.value = '下拉刷新'
}

const onScrollToLower = () => {
  if (loadMoreTimer.value) {
    clearTimeout(loadMoreTimer.value)
  }
  
  if (!MesStore.hasMoreData || MesStore.loadingMore || MesStore.loading) {
    return
  }
  
  loadMoreTimer.value = setTimeout(async () => {
    try {
      const params = {
        message_type: 'EVENT',
        event_id: groupId.value,
        page_size: 20
      }
      
      const result = await MesStore.loadMoreMessages(params)
      
      if (result && result.success && result.data && result.data.length === 0) {
        uni.showToast({
          title: '没有更多数据',
          icon: 'none',
          duration: 1500
        })
      }
      
    } catch (error) {
      console.error('加载更多失败:', error)
    }
  }, 300)
}

const handleRetry = async () => {
  await loadInitialMessages()
}

const scrollToTop = () => {
  nextTick(() => {
    try {
      if (MesStore.MessageList && MesStore.MessageList.length > 0) {
        scrollIntoView.value = `msg-${MesStore.MessageList[0].id}`
        
        setTimeout(() => {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 300
          })
        }, 100)
      }
    } catch (error) {
      console.error('滚动到顶部失败:', error)
    }
  })
}

const goBack = () => {
  if (loadMoreTimer.value) {
    clearTimeout(loadMoreTimer.value)
  }
  
  uni.navigateBack()
}

// 事件处理方法
const handleMessageClick = (message) => {
  try {
    // 先把 message 对象存储到本地缓存
    uni.setStorageSync('currentMessage', message)
    uni.navigateTo({
      url: '/pages/detail/GroupMesDetail'
    })
  } catch (error) {
    console.error('跳转详情页失败:', error)
    uni.showToast({
      title: '跳转失败',
      icon: 'error'
    })
  }
}



const handleActionClick = async (action, message) => {
  try {
    switch (action.type) {
      case 'primary':
        if (action.url) {
          uni.navigateTo({
            url: `${action.url}?id=${message.id}`
          })
        }
        break
      case 'secondary':
        if (action.id === 'mark_read') {
          await markAsRead(message)
        }
        break
      default:
        uni.showToast({
          title: '操作成功',
          icon: 'success'
        })
    }
  } catch (error) {
    console.error('操作失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'error'
    })
  }
}

const handleMarkRead = async (message) => {
  await markAsRead(message)
}

const markAsRead = async (message) => {
  try {
    if (message.message_type === 'SYSTEM') {
      await MesStore.markSystemMessageAsRead(message.id)
    } else {
      await MesStore.markGroupMessageAsRead(message.id)
    }
    
    uni.showToast({
      title: '已标记为已读',
      icon: 'success',
      duration: 1500
    })
    
  } catch (error) {
    console.error('标记已读失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'error'
    })
  }
}

// 组件销毁时清理
onUnmounted(() => {
  if (loadMoreTimer.value) {
    clearTimeout(loadMoreTimer.value)
  }
})
</script>

<style scoped>
.admin-message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

/* 导航栏样式 */
.custom-navbar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2rpx 16rpx rgba(102, 126, 234, 0.3);
}

.status-bar {
  width: 100%;
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  position: relative;
}

.nav-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.nav-left:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.back-icon {
  font-size: 44rpx;
  color: white;
  font-weight: 300;
  margin-left: -4rpx;
}

.nav-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.nav-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.nav-right {
  width: 60rpx;
}

/* 消息列表样式 */
.message-list {
  flex: 1;
  background: #f8fafc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.message-list-content {
  padding-top: calc(8rpx + var(--status-bar-height, 44px) + 40rpx);
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: 100rpx;
  min-height: calc(100vh + 120rpx);
}

/* 自定义下拉刷新样式 */
.custom-refresher {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  background: #f8fafc;
}

.refresher-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.refresher-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.refresher-rotating {
  animation: refresher-rotate 1s linear infinite;
}

.refresh-symbol {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

.refresher-text {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

@keyframes refresher-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 日期分隔线 */
.date-divider {
  display: flex;
  align-items: center;
  margin: 40rpx 0 32rpx;
}

.date-line {
  flex: 1;
  height: 2rpx;
  background: #e2e8f0;
}

.date-text {
  font-size: 24rpx;
  color: #64748b;
  padding: 0 24rpx;
  background: #f8fafc;
}

/* 加载更多样式 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  gap: 16rpx;
}

.loading-spinner-small {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid #e2e8f0;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-more-text {
  font-size: 26rpx;
  color: #64748b;
}

/* 没有更多数据 */
.no-more-data {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  gap: 24rpx;
}

.empty-icon {
  font-size: 120rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #334155;
}

.empty-desc {
  font-size: 26rpx;
  color: #64748b;
  text-align: center;
  line-height: 1.6;
}

/* 加载样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #64748b;
  margin-top: 16rpx;
}

/* 错误提示 */
.error-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.error-content {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
  min-width: 400rpx;
}

.error-icon {
  font-size: 80rpx;
}

.error-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ef4444;
}

.error-desc {
  font-size: 26rpx;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.error-btn {
  padding: 16rpx 32rpx;
  background: #667eea;
  border-radius: 48rpx;
  transition: all 0.3s ease;
}

.error-btn:active {
  background: #5a67d8;
  transform: scale(0.95);
}

.error-btn-text {
  font-size: 26rpx;
  color: white;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .message-list-content {
    padding-top: calc(88rpx + var(--status-bar-height, 44px) + 30rpx);
    padding-left: 16rpx;
    padding-right: 16rpx;
    padding-bottom: 80rpx;
  }
  
  .empty-state {
    padding: 80rpx 32rpx;
  }
}

/* 暗黑模式适配 */
/* @media (prefers-color-scheme: dark) {
  .admin-message-container {
    background: #0f172a;
  }
  
  .message-list {
    background: #0f172a;
  }
  
  .custom-refresher {
    background: #0f172a;
  }
  
  .date-text {
    background: #0f172a;
    color: #64748b;
  }
  
  .date-line {
    background: #334155;
  }
  
  .empty-title {
    color: #f1f5f9;
  }
  
  .empty-desc {
    color: #94a3b8;
  }
  
  .loading-content {
    background: #1e293b;
  }
  
  .error-content {
    background: #1e293b;
  }
  
  .loading-more-text {
    color: #94a3b8;
  }
  
  .no-more-text {
    color: #64748b;
  }
} */
</style>