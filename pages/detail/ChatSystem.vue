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
          <text class="nav-title">系统消息</text>
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
      :refresher-triggered="MesStore.refreshing"
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
          <!-- 消息项 -->
          <view 
            v-for="(message, index) in MesStore.MessageList" 
            :key="message.id"
            class="message-item"
            :class="{ 'expanded': message.expanded }"
          >
            <!-- 消息卡片 -->
            <view class="message-card" @tap="handleMessageClick(message, index)">
              <!-- 装饰线条 -->
              <view class="decoration-line"></view>
              
              <!-- 消息头部 -->
              <view class="message-header">
                <view class="message-icon">
                  <text class="icon-text">📢</text>
                </view>
                <view class="header-content">
                  <view class="title-line">
                    <text class="message-title">{{ message.title || '系统通知' }}</text>
                    <!-- 时间移到右上角 -->
                    <text class="message-time">{{ formatTime(message.send_time || message.created_at) }}</text>
                  </view>
                  <!-- 发送者信息（如果有） -->
                  <view v-if="message.sender_name" class="sender-info">
                    <text class="sender-name">{{ message.sender_name }}</text>
                  </view>
                </view>
              </view>

              <!-- 消息内容区域 -->
              <view class="message-body">
                <!-- 短内容直接显示 -->
                <view v-if="getContentType(message.content) === 'short'" class="content-wrapper">
                  <text class="content-text">{{ message.content }}</text>
                </view>

                <!-- 中等长度内容可折叠 -->
                <view v-else-if="getContentType(message.content) === 'medium'" class="content-wrapper">
                  <text 
                    class="content-text" 
                    :class="{ 'content-collapsed': !message.expanded }"
                  >
                    {{ message.content }}
                  </text>
                  
                  <!-- 折叠/展开控制 -->
                  <view class="toggle-section">
                    <view class="fade-mask" v-if="!message.expanded"></view>
                    <view class="toggle-btn" @tap.stop="toggleContent(index)">
                      <text class="toggle-text">{{ message.expanded ? '收起' : '展开' }}</text>
                      <view class="toggle-icon" :class="{ 'rotated': message.expanded }">
                        <text class="icon-arrow">▼</text>
                      </view>
                    </view>
                  </view>
                </view>

                <!-- 超长内容显示预览 -->
                <view v-else class="content-wrapper">
                  <text class="content-preview">{{ getPreviewText(message.content) }}</text>
                  
                  <view class="action-section">
                    <view class="detail-btn" @tap.stop="viewFullContent(message)">
                      <view class="btn-content">
                        <text class="btn-text">查看完整内容</text>
                        <view class="btn-arrow">
                          <text class="arrow-icon">→</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>

                <!-- 消息状态栏 -->
                <view class="message-status" v-if="message.priority || message.category">
                  <view v-if="message.priority" class="priority-tag" :class="`priority-${message.priority}`">
                    <text class="priority-text">{{ getPriorityText(message.priority) }}</text>
                  </view>
                  <view v-if="message.category" class="category-tag">
                    <text class="category-text">{{ message.category }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

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
import { ref, onMounted, computed, nextTick } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { useMesstore } from '@/store/mes.js'

// 响应式数据
const statusBarHeight = ref(0)
const pageSize = ref(10)
const loadThrottle = ref(false) // 加载节流

// 初始化pinia
const MesStore = useMesstore()

// 内容长度配置
const CONTENT_CONFIG = {
  SHORT_LIMIT: 80,     // 短内容限制（字符数）
  MEDIUM_LIMIT: 300,   // 中等内容限制
  PREVIEW_LENGTH: 120, // 预览内容长度
  COLLAPSE_HEIGHT: 3   // 折叠时显示行数
}

// 优先级文本映射
const PRIORITY_MAP = {
  'high': '重要',
  'medium': '普通',
  'low': '一般',
  'urgent': '紧急'
}

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
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

// 初始加载消息
const loadInitialMessages = async () => {
  try {
    await MesStore.getMessageList({
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
}

// 优化的触底加载更多
const handleLoadMore = async () => {
  // 防抖处理
  if (loadThrottle.value || MesStore.loadingMore || !MesStore.hasMoreData) {
    console.log('加载条件不满足:', {
      throttle: loadThrottle.value,
      loading: MesStore.loadingMore,
      hasMore: MesStore.hasMoreData
    })
    return
  }

  loadThrottle.value = true
  
  try {
    const result = await MesStore.loadMoreMessages({
      message_type: 'SYSTEM',
      page_size: pageSize.value
    })
    
    if (result.success) {
      console.log(`加载更多成功: 新增${result.data.length}条消息`)
      
      // 如果返回数据少于请求数量，说明已经到底了
      if (result.data.length < pageSize.value) {
        console.log('已加载所有数据')
      }
    }
  } catch (error) {
    console.error('加载更多失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 2000
    })
  } finally {
    // 延迟重置节流状态，避免频繁触发
    setTimeout(() => {
      loadThrottle.value = false
    }, 1000)
  }
}

// 优化的下拉刷新
const handleRefresh = async () => {
  try {
    const result = await MesStore.refreshMessageList({
      message_type: 'SYSTEM',
      page_size: pageSize.value
    })
    
    if (result.success) {
      console.log('刷新成功:', result.data.length, '条消息')
      uni.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      })
    }
  } catch (error) {
    console.error('刷新失败:', error)
    uni.showToast({
      title: '刷新失败',
      icon: 'error',
      duration: 2000
    })
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

// 获取内容类型
const getContentType = (content) => {
  if (!content) return 'short'
  
  const length = content.length
  if (length <= CONTENT_CONFIG.SHORT_LIMIT) {
    return 'short'
  } else if (length <= CONTENT_CONFIG.MEDIUM_LIMIT) {
    return 'medium'
  } else {
    return 'long'
  }
}

// 获取预览文本
const getPreviewText = (content) => {
  if (!content) return ''
  return content.length > CONTENT_CONFIG.PREVIEW_LENGTH 
    ? content.substring(0, CONTENT_CONFIG.PREVIEW_LENGTH) + '...'
    : content
}

// 获取优先级文本
const getPriorityText = (priority) => {
  return PRIORITY_MAP[priority] || priority
}

// 消息点击处理
const handleMessageClick = async (message, index) => {
  // 可以在这里添加其他点击处理逻辑
  console.log('点击消息:', message.title)
}

// 切换内容展开/折叠
const toggleContent = async (index) => {
  const message = MesStore.MessageList[index]
  if (!message) return

  // 切换展开状态
  MesStore.toggleMessageExpanded(message.id)
}

// 查看完整内容
const viewFullContent = async (message) => {
  // 跳转到消息详情页
  uni.navigateTo({
    url: `/pages/detail/SystemMesDetail?id=${message.id}&title=${encodeURIComponent(message.title || '系统消息')}`
  })
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  try {
    const time = new Date(timeStr)
    const now = new Date()
    const diff = now - time
    
    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`
    } else {
      const month = String(time.getMonth() + 1).padStart(2, '0')
      const date = String(time.getDate()).padStart(2, '0')
      const hours = String(time.getHours()).padStart(2, '0')
      const minutes = String(time.getMinutes()).padStart(2, '0')
      
      if (time.getFullYear() === now.getFullYear()) {
        return `${month}-${date} ${hours}:${minutes}`
      } else {
        return `${time.getFullYear()}-${month}-${date}`
      }
    }
  } catch (error) {
    return String(timeStr)
  }
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

/* 消息项 */
.message-item {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30rpx);
}

.message-item:nth-child(1) { animation-delay: 0.1s; }
.message-item:nth-child(2) { animation-delay: 0.2s; }
.message-item:nth-child(3) { animation-delay: 0.3s; }
.message-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息卡片 */
.message-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.08);
  border: 2rpx solid rgba(239, 68, 68, 0.05);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 40rpx rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.1);
}

/* 装饰线条 */
.decoration-line {
  height: 6rpx;
  background: linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: flex-start;
  padding: 32rpx 32rpx 16rpx;
  position: relative;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  border: 3rpx solid rgba(239, 68, 68, 0.1);
  flex-shrink: 0;
}

.icon-text {
  font-size: 32rpx;
}

.header-content {
  flex: 1;
}

.title-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.message-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  letter-spacing: 0.5rpx;
  flex: 1;
}

.message-time {
  font-size: 22rpx;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.sender-info {
  margin-top: 4rpx;
}

.sender-name {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

/* 消息内容 */
.message-body {
  padding: 0 32rpx 32rpx;
}

.content-wrapper {
  position: relative;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  word-break: break-word;
}

/* 折叠状态的内容 */
.content-collapsed {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  position: relative;
}

/* ====== 优化后的展开收起按钮样式 ====== */

/* 切换按钮区域 */
.toggle-section {
  position: relative;
  margin-top: 32rpx;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(239, 68, 68, 0.2);
  padding: 24rpx 32rpx;
  border-radius: 40rpx;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8rpx 24rpx rgba(239, 68, 68, 0.15),
    0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transform: translateZ(0); /* 硬件加速 */
}

/* 悬浮态光效 */
.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(239, 68, 68, 0.1), 
    transparent
  );
  transition: left 0.6s ease;
}

.toggle-btn:active::before {
  left: 100%;
}

/* 点击态效果 */
.toggle-btn:active {
  transform: translateY(2rpx) scale(0.98);
  box-shadow: 
    0 4rpx 12rpx rgba(239, 68, 68, 0.2),
    0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

/* 文字样式 */
.toggle-text {
  font-size: 28rpx;
  color: #ef4444;
  font-weight: 600;
  letter-spacing: 0.5rpx;
  z-index: 2;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-btn:active .toggle-text {
  color: #dc2626;
}

/* 图标容器 */
.toggle-icon {
  width: 44rpx;
  height: 44rpx;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.3);
}

/* 旋转动画 */
.toggle-icon.rotated {
  transform: rotate(180deg);
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

/* 箭头图标 */
.icon-arrow {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  transition: transform 0.3s ease;
  line-height: 1;
}

/* 激活态图标效果 */
.toggle-btn:active .toggle-icon {
  transform: scale(0.9);
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.4);
}

.toggle-btn:active .toggle-icon.rotated {
  transform: rotate(180deg) scale(0.9);
}

/* 微动画增强 */
@keyframes pulse-border {
  0%, 100% {
    border-color: rgba(239, 68, 68, 0.2);
  }
  50% {
    border-color: rgba(239, 68, 68, 0.35);
  }
}

.toggle-btn:hover {
  animation: pulse-border 2s ease-in-out infinite;
}

/* 渐变遮罩优化 */
.fade-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 30%,
    rgba(255, 255, 255, 0.8) 70%,
    white 100%
  );
  pointer-events: none;
  border-radius: 0 0 12rpx 12rpx;
}

/* ====== 原有样式继续 ====== */

/* 预览内容 */
.content-preview {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  margin-bottom: 24rpx;
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: center;
}

.detail-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50rpx;
  padding: 20rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.detail-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.btn-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.detail-btn:active .btn-arrow {
  transform: translateX(4rpx);
}

.arrow-icon {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

/* 消息状态栏 */
.message-status {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.priority-tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.priority-high, .priority-urgent {
  background: #fee2e2;
  color: #dc2626;
  border: 1rpx solid #fecaca;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
  border: 1rpx solid #fed7aa;
}

.priority-low {
  background: #ecfdf5;
  color: #059669;
  border: 1rpx solid #a7f3d0;
}

.category-tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1rpx solid #e5e7eb;
}

.priority-text, .category-text {
  font-size: 22rpx;
  font-weight: 600;
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
  
  .message-header {
    padding: 24rpx 24rpx 12rpx;
  }
  
  .message-body {
    padding: 0 24rpx 24rpx;
  }
  
  .message-icon {
    width: 64rpx;
    height: 64rpx;
    margin-right: 16rpx;
  }
  
  .icon-text {
    font-size: 28rpx;
  }
  
  .message-title {
    font-size: 30rpx;
  }
  
  .content-text, .content-preview {
    font-size: 26rpx;
  }
  
  .empty-circle {
    width: 160rpx;
    height: 160rpx;
  }
  
  .empty-icon {
    font-size: 64rpx;
  }
  
  /* 响应式按钮 */
  .toggle-btn {
    padding: 20rpx 24rpx;
  }
  
  .toggle-text {
    font-size: 26rpx;
  }
  
  .toggle-icon {
    width: 36rpx;
    height: 36rpx;
  }
  
  .icon-arrow {
    font-size: 20rpx;
  }
  
  .fade-mask {
    height: 60rpx;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .system-message-page {
    background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  }
  
  .message-card {
    background: #1f2937;
    border-color: rgba(239, 68, 68, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-title {
    color: #f9fafb;
  }
  
  .content-text, .content-preview {
    color: #d1d5db;
  }
  
  .message-time, .sender-name {
    color: #9ca3af;
  }
  
  .message-icon {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.2);
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
  
  /* 暗黑模式按钮 */
  .toggle-btn {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 
      0 8rpx 24rpx rgba(0, 0, 0, 0.3),
      0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  }
  
  .toggle-btn:active {
    background: linear-gradient(135deg, #3c2626 0%, #4a2c2c 100%);
    border-color: rgba(239, 68, 68, 0.4);
  }
  
  .fade-mask {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(31, 41, 55, 0.3) 30%,
      rgba(31, 41, 55, 0.8) 70%,
      #1f2937 100%
    );
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .message-item,
  .empty-circle,
  .loading-spinner {
    animation: none;
  }
  
  .message-card,
  .detail-btn {
    transition: none;
  }
  
  /* 按钮无障碍 */
  .toggle-btn,
  .toggle-icon,
  .toggle-text,
  .icon-arrow {
    transition: none;
  }
  
  .toggle-btn::before {
    display: none;
  }
  
  .toggle-btn:hover {
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .toggle-btn {
    border-width: 4rpx;
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .toggle-text {
    color: #dc2626;
    font-weight: 700;
  }
}
</style>