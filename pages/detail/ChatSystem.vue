<template>
  <view class="system-message-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="nav-center">
          <text class="nav-title">系统消息</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 消息内容区域 -->
    <scroll-view
      class="message-content"
      :style="{ marginTop: statusBarHeight + 88 + 'px' }"
      scroll-y="true"
      :bounces="false"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
      @refresherrestore="handleRefreshRestore"
    >
      <view class="content-wrapper">
        <!-- 加载状态 -->
        <view v-if="isLoading" class="loading-state">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 消息详情 -->
        <view v-else-if="messageDetail" class="message-detail">
          <!-- 消息头部 -->
          <view class="message-header">
            <view class="system-icon">
              <text class="icon-text">🔔</text>
            </view>
            <view class="header-info">
              <text class="message-title">{{ messageDetail.title || '系统通知' }}</text>
              <text class="message-time">{{ formatTime(messageDetail.created_at) }}</text>
            </view>
            <view class="message-status" v-if="messageDetail.is_read === 0">
              <view class="unread-dot"></view>
            </view>
          </view>

          <!-- 消息内容 -->
          <view class="message-body">
            <view class="content-section">
              <text class="content-text">{{ messageDetail.content || messageDetail.message || '暂无内容' }}</text>
            </view>

            <!-- 附加信息 -->
            <view v-if="messageDetail.extra_data" class="extra-info">
              <view class="extra-title">详细信息</view>
              <view class="extra-content">
                <text class="extra-text">{{ formatExtraData(messageDetail.extra_data) }}</text>
              </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-buttons">
              <view 
                v-if="messageDetail.action_url" 
                class="action-btn primary-btn" 
                @tap="handleAction"
              >
                <text class="btn-text">查看详情</text>
              </view>
              <view 
                v-if="messageDetail.is_read === 0" 
                class="action-btn secondary-btn" 
                @tap="markAsRead"
              >
                <text class="btn-text">标记已读</text>
              </view>
            </view>
          </view>

          <!-- 相关消息 -->
          <view v-if="relatedMessages.length > 0" class="related-messages">
            <view class="related-header">
              <text class="related-title">相关消息</text>
            </view>
            <view class="related-list">
              <view 
                v-for="related in relatedMessages" 
                :key="related.id"
                class="related-item"
                @tap="viewRelatedMessage(related)"
              >
                <view class="related-content">
                  <text class="related-text">{{ related.title || related.content }}</text>
                  <text class="related-time">{{ formatTime(related.created_at) }}</text>
                </view>
                <view class="related-arrow">
                  <text class="arrow-icon">›</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 错误状态 -->
        <view v-else class="error-state">
          <view class="error-icon">❌</view>
          <text class="error-title">加载失败</text>
          <text class="error-desc">无法获取消息详情，请稍后重试</text>
          <view class="retry-btn" @tap="loadMessageDetail">
            <text class="retry-text">重新加载</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useMesstore } from '@/store/mes.js'

// 页面参数
const props = defineProps({
  id: String,
  groupName: String
})

// 状态管理
const mesStore = useMesstore()

// 响应式数据
const statusBarHeight = ref(0)
const isLoading = ref(false)
const isRefreshing = ref(false)
const messageDetail = ref(null)
const relatedMessages = ref([])

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  const messageId = options.id || ''
  const groupName = decodeURIComponent(options.groupName || '系统消息')
  
  await loadMessageDetail(messageId)
})

onShow(() => {
  // 页面显示时标记消息为已读
  if (messageDetail.value && messageDetail.value.is_read === 0) {
    markAsRead()
  }
})

// 方法定义
const loadMessageDetail = async (messageId) => {
  if (!messageId && !props.id) {
    uni.showToast({
      title: '消息ID不存在',
      icon: 'error'
    })
    return
  }
  
  const id = messageId || props.id
  isLoading.value = true
  
  try {
    // 先从store中查找消息
    let message = mesStore.getSystemMessageById(id)
    
    if (!message) {
      // 如果store中没有，调用API获取详情
      // message = await getSystemMessageDetail(id)
      
      // 模拟API调用
      message = generateMockSystemMessage(id)
    }
    
    if (message) {
      messageDetail.value = message
      
      // 加载相关消息
      await loadRelatedMessages()
    } else {
      messageDetail.value = null
    }
    
  } catch (error) {
    console.error('加载系统消息详情失败:', error)
    messageDetail.value = null
    
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const generateMockSystemMessage = (id) => {
  const mockTypes = [
    {
      title: '系统维护通知',
      content: '系统将于今晚23:00-次日02:00进行例行维护，届时部分功能可能暂时无法使用，请您提前做好相关准备。维护期间给您带来的不便，敬请谅解。',
      type: 'maintenance'
    },
    {
      title: '新功能上线',
      content: '我们很高兴地宣布，全新的消息推送功能现已上线！您可以在设置中自定义消息提醒方式，获得更好的使用体验。',
      type: 'feature'
    },
    {
      title: '安全提醒',
      content: '检测到您的账户在异地登录，如非本人操作，请及时修改密码并启用双重验证以保障账户安全。',
      type: 'security'
    }
  ]
  
  const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)]
  
  return {
    id: id,
    title: randomType.title,
    content: randomType.content,
    message: randomType.content,
    type: randomType.type,
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_read: Math.random() > 0.5 ? 1 : 0,
    action_url: Math.random() > 0.7 ? 'https://example.com/detail' : null,
    extra_data: Math.random() > 0.6 ? {
      priority: 'high',
      category: randomType.type,
      source: 'system'
    } : null
  }
}

const loadRelatedMessages = async () => {
  try {
    // 这里应该调用API获取相关消息
    // const related = await getRelatedSystemMessages(messageDetail.value.id)
    
    // 模拟相关消息
    const mockRelated = []
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      mockRelated.push({
        id: `related_${Date.now()}_${i}`,
        title: `相关通知 ${i + 1}`,
        content: `这是与当前消息相关的通知内容 ${i + 1}`,
        created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
      })
    }
    
    relatedMessages.value = mockRelated
    
  } catch (error) {
    console.error('加载相关消息失败:', error)
    relatedMessages.value = []
  }
}

const handleRefresh = async () => {
  isRefreshing.value = true
  
  try {
    await loadMessageDetail(messageDetail.value?.id)
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  } catch (error) {
    console.error('刷新失败:', error)
    uni.showToast({
      title: '刷新失败',
      icon: 'error'
    })
  } finally {
    isRefreshing.value = false
  }
}

const handleRefreshRestore = () => {
  isRefreshing.value = false
}

const goBack = () => {
  uni.navigateBack()
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  try {
    const time = new Date(timeStr)
    const now = new Date()
    
    const year = time.getFullYear()
    const month = String(time.getMonth() + 1).padStart(2, '0')
    const date = String(time.getDate()).padStart(2, '0')
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    
    // 如果是今年，不显示年份
    if (year === now.getFullYear()) {
      return `${month}-${date} ${hours}:${minutes}`
    } else {
      return `${year}-${month}-${date} ${hours}:${minutes}`
    }
  } catch (error) {
    console.error('时间格式化错误:', error)
    return String(timeStr)
  }
}

const formatExtraData = (extraData) => {
  if (!extraData || typeof extraData !== 'object') return ''
  
  try {
    return Object.entries(extraData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  } catch (error) {
    return String(extraData)
  }
}

const markAsRead = async () => {
  if (!messageDetail.value || messageDetail.value.is_read === 1) return
  
  try {
    // 调用store方法标记已读
    await mesStore.markSystemMessageAsRead(messageDetail.value.id)
    
    // 更新本地状态
    messageDetail.value.is_read = 1
    
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

const handleAction = () => {
  if (!messageDetail.value?.action_url) return
  
  // 这里可以处理不同类型的操作
  uni.showModal({
    title: '跳转确认',
    content: '是否要打开相关链接？',
    success: (res) => {
      if (res.confirm) {
        // 可以跳转到内部页面或外部链接
        uni.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(messageDetail.value.action_url)}`
        })
      }
    }
  })
}

const viewRelatedMessage = (relatedMessage) => {
  // 跳转到相关消息详情
  uni.navigateTo({
    url: `/pages/system-message/index?id=${relatedMessage.id}&groupName=${encodeURIComponent('系统消息')}`
  })
}
</script>

<style scoped>
.system-message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

/* 导航栏样式 */
.custom-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.nav-left:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  font-size: 36rpx;
  font-weight: 300;
  color: white;
  line-height: 1;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
  text-align: center;
}

.nav-right {
  width: 60rpx;
}

/* 消息内容区域 */
.message-content {
  flex: 1;
  height: 100vh;
}

.content-wrapper {
  padding: 32rpx 24rpx 100rpx;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  gap: 24rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #e5e7eb;
  border-top: 6rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #6b7280;
}

/* 消息详情 */
.message-detail {
  background: white;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 32rpx;
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  padding: 32rpx 24rpx;
  border-bottom: 2rpx solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.system-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.icon-text {
  font-size: 36rpx;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.message-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.message-time {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.2;
}

.message-status {
  display: flex;
  align-items: center;
}

.unread-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 12rpx rgba(239, 68, 68, 0.4);
}

/* 消息内容 */
.message-body {
  padding: 32rpx 24rpx;
}

.content-section {
  margin-bottom: 32rpx;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
}

/* 附加信息 */
.extra-info {
  margin-bottom: 32rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 24rpx;
  border-left: 8rpx solid #667eea;
}

.extra-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 16rpx;
}

.extra-content {
  background: white;
  border-radius: 12rpx;
  padding: 20rpx;
}

.extra-text {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6b7280;
  white-space: pre-line;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 200rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.primary-btn:hover {
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  transform: translateY(-2rpx);
}

.secondary-btn {
  background: white;
  border: 2rpx solid #e5e7eb;
  color: #6b7280;
}

.secondary-btn:hover {
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.2);
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 相关消息 */
.related-messages {
  background: white;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 32rpx;
}

.related-header {
  padding: 32rpx 24rpx 16rpx;
  border-bottom: 2rpx solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.related-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2937;
}

.related-list {
  padding: 0;
}

.related-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 2rpx solid #f9fafb;
  transition: background-color 0.2s ease;
}

.related-item:last-child {
  border-bottom: none;
}

.related-item:hover {
  background-color: #f8fafc;
}

.related-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-right: 16rpx;
}

.related-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-time {
  font-size: 22rpx;
  color: #9ca3af;
}

.related-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #f3f4f6;
  transition: all 0.2s ease;
}

.related-item:hover .related-arrow {
  background: #667eea;
}

.arrow-icon {
  font-size: 24rpx;
  color: #6b7280;
  transition: color 0.2s ease;
}

.related-item:hover .arrow-icon {
  color: white;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  gap: 24rpx;
  padding: 32rpx;
}

.error-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.error-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.error-desc {
  font-size: 26rpx;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16rpx;
  padding: 20rpx 40rpx;
  transition: all 0.2s ease;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.retry-btn:hover {
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  transform: translateY(-2rpx);
}

.retry-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .content-wrapper {
    padding: 24rpx 16rpx 100rpx;
  }
  
  .message-header {
    padding: 24rpx 20rpx;
  }
  
  .message-body {
    padding: 24rpx 20rpx;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
    width: 100%;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .system-message-container {
    background: #111827;
  }
  
  .message-detail,
  .related-messages {
    background: #1f2937;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-header,
  .related-header {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    border-bottom-color: #374151;
  }
  
  .message-title {
    color: #f9fafb;
  }
  
  .content-text {
    color: #d1d5db;
  }
  
  .extra-info {
    background: #374151;
  }
  
  .extra-content {
    background: #1f2937;
  }
  
  .related-item {
    border-bottom-color: #374151;
  }
  
  .related-item:hover {
    background-color: #374151;
  }
  
  .related-text {
    color: #d1d5db;
  }
  
  .secondary-btn {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
}

/* 动画效果 */
.message-detail,
.related-messages {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8rpx;
}

::-webkit-scrollbar-track {
  background: #f1f3f4;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb {
  background: #c1c4c7;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8abaf;
}
</style>