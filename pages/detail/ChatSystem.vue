<template>
  <view class="system-message-page">
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
          <text class="nav-title">系统消息123</text>
        </view>
        <view class="nav-right">
          <!-- <view class="message-count" v-if="MesStore.MessageList.length > 0">
            <text class="count-text">{{ MesStore.MessageList.length }}</text>
          </view> -->
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-list"
      :style="{ marginTop: statusBarHeight + 48 + 'px' }"
      scroll-y="true"
      :bounces="true"
      :refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="handleRefresh"
      @refresherrestore="handleRefreshRestore"
      @scrolltolower="handleLoadMore"
      :lower-threshold="100"
    >
      <view class="list-wrapper">
        <!-- 初始加载状态 -->
        <view v-if="MesStore.loading && MesStore.MessageList.length === 0" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">正在加载消息...</text>
        </view>

        <!-- 消息列表 -->
        <view v-else class="messages-container">
          <!-- 使用消息卡片组件 -->
          <MessageCard
            v-for="(message, index) in MesStore.MessageList" 
            :key="message.id"
            :message="message"
            :index="index"
            @messageClick="handleMessageClick"
            @toggleExpanded="handleToggleExpanded"
            @viewDetail="handleViewDetail"
          />

          <!-- 加载更多状态 -->
          <view v-if="MesStore.hasMoreData && MesStore.MessageList.length > 0" class="load-more-section">
            <view v-if="MesStore.loadingMore" class="loading-more">
              <view class="loading-spinner small"></view>
              <text class="loading-text">加载更多消息...</text>
            </view>
            <view v-else class="load-more-tip">
              <text class="tip-text">上拉加载更多</text>
            </view>
          </view>

          <!-- 无更多数据 -->
          <view v-else-if="MesStore.MessageList.length > 0 && !MesStore.hasMoreData" class="no-more-section">
            <view class="no-more-line"></view>
            <text class="no-more-text">已显示全部消息</text>
            <view class="no-more-line"></view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="!MesStore.loading && MesStore.MessageList.length === 0" class="empty-state">
          <view class="empty-illustration">
            <view class="empty-circle">
              <text class="empty-icon">📭</text>
            </view>
          </view>
          <text class="empty-title">暂无系统消息</text>
          <text class="empty-desc">系统重要通知会在这里显示</text>
          <view class="retry-btn" v-if="MesStore.error" @tap="handleRetry">
            <text class="retry-text">重新加载</text>
          </view>
        </view>

        <!-- 错误提示 -->
        <view v-if="MesStore.error && MesStore.MessageList.length > 0" class="error-banner">
          <view class="error-content">
            <text class="error-icon">⚠️</text>
            <text class="error-text">{{ MesStore.error }}</text>
            <view class="retry-small-btn" @tap="handleRetry">
              <text class="retry-small-text">重试</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { useMesstore } from '@/store/mes.js'
import MessageCard from '@/components/MessageCardUser/MessageCardUser.vue' // 导入消息卡片组件

// 响应式数据
const statusBarHeight = ref(0)
const pageSize = ref(10)
const loadThrottle = ref(false) // 加载节流

// 初始化pinia
const MesStore = useMesstore()

// 群组信息
const groupId = ref('')

// 刷新状态
const refresherTriggered=ref(false)

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  console.log("跳转到的群组信息：", options)
  groupId.value = options.id || ''
  await loadInitialMessages()
})

onShow(() => {
  // 页面显示时可以做一些操作，比如刷新数据状态检查
  console.log('系统消息页面显示')
})

onHide(() => {
  // 页面隐藏时清除错误状态
  if (MesStore.error) {
    MesStore.error = null
  }
})

// 另外，也要修复 loadInitialMessages 函数中的节流重置
const loadInitialMessages = async () => {
  try {
    await MesStore.getMessageList(groupId.value, {
      message_type: 'SYSTEM',
      page: 1,
      page_size: pageSize.value
    })
  } catch (error) {
    console.error('初始加载消息失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 2000
    })
  }
  // 移除这里的 finally 块，因为它会干扰刷新状态
}

// 优化的下拉刷新
// 修复后的 handleRefresh 函数
const handleRefresh = async () => {
  try {
    refresherTriggered.value = true
    // 等待刷新完成
    await loadInitialMessages()
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
      duration: 2000
    })
  } finally {
    // 确保在异步操作完成后才重置刷新状态
    refresherTriggered.value = false
    console.log("刷新状态重置")
  }
}

const handleRefreshRestore = () => {
  console.log('刷新完成')
}

// 重试加载
const handleRetry = async () => {
  MesStore.error = null
  await loadInitialMessages()
}

// ====== 组件事件处理器 ======

// 消息点击处理
const handleMessageClick = async (message, index) => {
  // 可以在这里添加其他点击处理逻辑
  console.log('点击消息:', message.title)
}

// 切换内容展开/折叠
const handleToggleExpanded = async (messageId, index) => {
  // 切换展开状态
  MesStore.toggleMessageExpanded(messageId)
}

// 查看完整内容
const handleViewDetail = async (message) => {
	// 先把 message 对象存储到本地缓存
	uni.setStorageSync('SystemMessage', message)
  // 跳转到消息详情页
  uni.navigateTo({
    url: `/pages/detail/SystemMesDetail`
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.system-message-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff5f5 0%, #fef2f2 100%);
}

/* 导航栏 */
.custom-navbar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.3);
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}

.nav-left, .nav-right {
  width: 120rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
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
  justify-content: center;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.message-count {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.count-text {
  font-size: 24rpx;
  color: white;
  font-weight: 600;
}

/* 消息列表 */
.message-list {
  flex: 1;
  height: 100vh;
}

.list-wrapper {
  padding: 32rpx 24rpx 140rpx;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  gap: 32rpx;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 4rpx solid rgba(239, 68, 68, 0.1);
  border-left: 4rpx solid #ef4444;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 48rpx;
  height: 48rpx;
  border-width: 3rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
}

/* 消息容器 */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 加载更多区域 */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 48rpx 0;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.load-more-tip {
  padding: 16rpx 32rpx;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 50rpx;
  border: 2rpx solid rgba(239, 68, 68, 0.1);
}

.tip-text {
  font-size: 26rpx;
  color: #9ca3af;
  font-weight: 500;
}

/* 无更多数据 */
.no-more-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 48rpx 0;
}

.no-more-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #fee2e2, transparent);
}

.no-more-text {
  font-size: 26rpx;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
}

/* 错误提示 */
.error-banner {
  background: #fee2e2;
  border: 2rpx solid #fecaca;
  border-radius: 16rpx;
  margin: 24rpx 0;
  overflow: hidden;
}

.error-content {
  display: flex;
  align-items: center;
  padding: 24rpx;
  gap: 16rpx;
}

.error-icon {
  font-size: 32rpx;
}

.error-text {
  flex: 1;
  font-size: 28rpx;
  color: #dc2626;
  font-weight: 500;
}

.retry-small-btn {
  background: #dc2626;
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
}

.retry-small-btn:active {
  transform: scale(0.95);
  background: #b91c1c;
}

.retry-small-text {
  font-size: 24rpx;
  color: white;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 32rpx;
}

.empty-illustration {
  position: relative;
}

.empty-circle {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 16rpx 48rpx rgba(239, 68, 68, 0.15);
}

.empty-circle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(239, 68, 68, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10rpx); }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.1;
  }
}

.empty-icon {
  font-size: 80rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #374151;
  text-align: center;
}

.empty-desc {
  font-size: 28rpx;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  max-width: 400rpx;
}

.retry-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
  margin-top: 16rpx;
}

.retry-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.retry-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .list-wrapper {
    padding: 24rpx 16rpx 140rpx;
  }
  
  .empty-circle {
    width: 160rpx;
    height: 160rpx;
  }
  
  .empty-icon {
    font-size: 64rpx;
  }
}

/* 暗黑模式支持 */
/* @media (prefers-color-scheme: dark) {
  .system-message-page {
    background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  }
  
  .empty-circle {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 50%, #4a2c2c 100%);
  }
  
  .empty-title {
    color: #f9fafb;
  }
  
  .error-banner {
    background: #2d1b1b;
    border-color: #3c2626;
  }
  
  .error-text {
    color: #f87171;
  }
} */

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .empty-circle,
  .loading-spinner {
    animation: none;
  }
  
  .back-btn,
  .detail-btn {
    transition: none;
  }
}
</style>
  
