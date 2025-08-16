<template>
  <view class="admin-message-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <text class="back-icon">‹</text>
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
      :style="{ marginTop: statusBarHeight + 38 + 'px' }"
      scroll-y="true"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      :bounces="false"
    >
      <!-- 消息列表 -->
      <view class="message-list-content">
        <!-- 日期分隔线 -->
        <template v-for="(group, dateKey) in groupedMessages" :key="dateKey">
          <view class="date-divider">
            <view class="date-line"></view>
            <text class="date-text">{{ dateKey }}</text>
            <view class="date-line"></view>
          </view>

          <!-- 该日期下的消息 -->
          <view
            v-for="message in group"
            :key="message.id"
            :id="`msg-${message.id}`"
            class="message-item"
          >
            <!-- 管理员消息 -->
            <view class="admin-message">
              <!-- 管理员头像 -->
              <view class="avatar-wrapper">
                <view class="admin-avatar">
                  <text class="avatar-text">管</text>
                </view>
                <view class="admin-badge">
                  <text class="badge-text">管理员</text>
                </view>
              </view>

              <!-- 消息内容区域 -->
              <view class="message-content-wrapper">
                <!-- 消息头部 -->
                <view class="message-header">
                  <text class="sender-name">系统管理员</text>
                  <text class="message-time">{{ formatMessageTime(message.created_at) }}</text>
                </view>

                <!-- 消息气泡 -->
                <view class="message-bubble" @tap="handleMessageTap(message)">
                  <!-- 消息标题 -->
                  <view v-if="message.title" class="message-title">
                    <text class="title-text">{{ message.title }}</text>
                    <view v-if="message.priority === 'high'" class="priority-badge">
                      <text class="priority-text">重要</text>
                    </view>
                  </view>

                  <!-- 消息内容 -->
                  <view class="message-content">
                    <text 
                      class="content-text" 
                      :class="{ 'expanded': expandedMessages[message.id] }"
                    >{{ getDisplayContent(message) }}</text>
                    
                    <!-- 展开/收起按钮 -->
                    <view 
                      v-if="isLongContent(message.content)" 
                      class="expand-btn"
                      @tap.stop="toggleExpand(message.id)"
                    >
                      <text class="expand-text">
                        {{ expandedMessages[message.id] ? '收起' : '查看全部' }}
                      </text>
                      <text class="expand-icon">
                        {{ expandedMessages[message.id] ? '▲' : '▼' }}
                      </text>
                    </view>
                  </view>

                  <!-- 消息类型标签 -->
                  <view v-if="message.type && message.type !== 'normal'" class="message-tags">
                    <view class="tag-item" :class="`tag-${message.type}`">
                      <text class="tag-text">{{ getTypeLabel(message.type) }}</text>
                    </view>
                  </view>

                  <!-- 点击查看详情提示 -->
                  <view v-if="hasMoreContent(message)" class="view-detail-hint">
                    <text class="hint-text">点击查看详情</text>
                    <text class="hint-arrow">›</text>
                  </view>
                </view>

                <!-- 消息操作 -->
                <view v-if="message.actions && message.actions.length > 0" class="message-actions">
                  <view 
                    v-for="action in message.actions" 
                    :key="action.id"
                    class="action-btn"
                    :class="`action-${action.type}`"
                    @tap="handleAction(action, message)"
                  >
                    <text class="action-text">{{ action.label }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 没有消息提示 -->
        <view v-if="messages.length === 0 && !isLoading" class="empty-state">
          <view class="empty-icon">📢</view>
          <text class="empty-title">暂无管理员消息</text>
          <text class="empty-desc">管理员发布的通知消息将在这里显示</text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载遮罩 -->
    <view v-if="isLoading" class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 页面参数
const props = defineProps({
  id: String,
  groupName: String
})

// 页面状态
const statusBarHeight = ref(0)
const isLoading = ref(false)
const scrollIntoView = ref('')

// 群组信息
const groupId = ref('')
const groupName = ref('管理员通知')

// 消息相关
const messages = ref([])
const expandedMessages = ref({})

// 内容截断长度
const CONTENT_LIMIT = 100

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  groupId.value = options.id || ''
  groupName.value = decodeURIComponent(options.groupName || '管理员通知')
  
  await loadMessages()
})

onShow(() => {
  // 页面显示时滚动到顶部
  scrollToTop()
})

// 计算属性
// 按日期分组的消息
const groupedMessages = computed(() => {
  const grouped = {}
  
  messages.value.forEach(message => {
    const date = new Date(message.created_at)
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
  
  return grouped
})

// 方法定义
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const loadMessages = async () => {
  isLoading.value = true
  
  try {
    // 这里应该调用API获取管理员消息列表
    // const response = await getAdminMessages(groupId.value)
    
    // 模拟管理员消息数据
    const mockMessages = generateMockAdminMessages()
    messages.value = mockMessages
    
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载消息失败',
      icon: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const generateMockAdminMessages = () => {
  const messageTypes = [
    { type: 'announcement', label: '公告' },
    { type: 'maintenance', label: '维护' },
    { type: 'event', label: '活动' },
    { type: 'security', label: '安全' },
    { type: 'update', label: '更新' }
  ]
  
  const mockMessages = []
  
  for (let i = 0; i < 15; i++) {
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)]
    const isLongContent = Math.random() > 0.6
    const hasTitle = Math.random() > 0.3
    const priority = Math.random() > 0.8 ? 'high' : 'normal'
    
    let title = ''
    let content = ''
    
    if (hasTitle) {
      switch (messageType.type) {
        case 'announcement':
          title = `重要公告：关于${['系统升级', '政策调整', '功能更新', '服务优化'][Math.floor(Math.random() * 4)]}的通知`
          break
        case 'maintenance':
          title = '系统维护通知'
          break
        case 'event':
          title = `活动通知：${['双十一大促', '新年活动', '周年庆典', '限时优惠'][Math.floor(Math.random() * 4)]}`
          break
        case 'security':
          title = '安全提醒'
          break
        case 'update':
          title = '版本更新说明'
          break
      }
    }
    
    if (isLongContent) {
      content = `这是一条较长的管理员通知消息，包含了详细的说明和要求。消息内容较多，需要用户点击查看完整内容。本次通知涉及以下几个重要方面：\n\n1. 系统功能优化和改进\n2. 用户体验提升措施\n3. 安全性能增强\n4. 新功能介绍和使用指南\n\n请各位用户仔细阅读相关内容，如有疑问请及时联系客服。感谢您的配合与支持！\n\n详细内容请点击查看完整通知。`
    } else {
      content = `这是第${i + 1}条管理员通知，内容相对简短，可以直接在列表中完整显示。`
    }
    
    const message = {
      id: `admin_msg_${Date.now()}_${i}`,
      title: hasTitle ? title : '',
      content: content,
      type: messageType.type,
      priority: priority,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      sender_type: 'admin',
      sender_name: '系统管理员',
      read_status: Math.random() > 0.3 ? 'read' : 'unread',
      actions: Math.random() > 0.7 ? [
        { id: 'view_detail', type: 'primary', label: '查看详情', url: '/pages/notice/detail' },
        { id: 'mark_read', type: 'secondary', label: '标记已读' }
      ] : []
    }
    
    mockMessages.push(message)
  }
  
  return mockMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

const scrollToTop = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollIntoView.value = `msg-${messages.value[0].id}`
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}

const formatMessageTime = (timeStr) => {
  if (!timeStr) return ''
  
  const time = new Date(timeStr)
  const now = new Date()
  
  if (isSameDay(time, now)) {
    return `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  } else {
    return `${time.getMonth() + 1}-${time.getDate()} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  }
}

const getTypeLabel = (type) => {
  const labels = {
    'announcement': '公告',
    'maintenance': '维护',
    'event': '活动',
    'security': '安全',
    'update': '更新',
    'normal': '通知'
  }
  return labels[type] || '通知'
}

// 内容展开/收起相关
const isLongContent = (content) => {
  return content && content.length > CONTENT_LIMIT
}

const getDisplayContent = (message) => {
  if (!message.content) return ''
  
  const isExpanded = expandedMessages.value[message.id]
  if (isExpanded || !isLongContent(message.content)) {
    return message.content
  }
  
  return message.content.substring(0, CONTENT_LIMIT) + '...'
}

const toggleExpand = (messageId) => {
  expandedMessages.value[messageId] = !expandedMessages.value[messageId]
}

const hasMoreContent = (message) => {
  return message.title || message.actions?.length > 0 || isLongContent(message.content)
}

// 消息点击处理
const handleMessageTap = (message) => {
  // 如果是长内容且未展开，先展开
  if (isLongContent(message.content) && !expandedMessages.value[message.id]) {
    toggleExpand(message.id)
    return
  }
  
  // 跳转到消息详情页面
  uni.navigateTo({
    url: `/pages/admin-message/detail?id=${message.id}&title=${encodeURIComponent(message.title || '管理员通知')}`
  })
}

// 消息操作处理
const handleAction = (action, message) => {
  switch (action.type) {
    case 'primary':
      // 主要操作，通常是查看详情
      uni.navigateTo({
        url: `${action.url}?id=${message.id}`
      })
      break
    case 'secondary':
      // 次要操作，如标记已读
      if (action.id === 'mark_read') {
        markAsRead(message)
      }
      break
    default:
      uni.showToast({
        title: '操作成功',
        icon: 'success'
      })
  }
}

const markAsRead = async (message) => {
  try {
    // 这里调用API标记消息为已读
    // await markMessageAsRead(message.id)
    
    // 更新本地状态
    const messageIndex = messages.value.findIndex(msg => msg.id === message.id)
    if (messageIndex !== -1) {
      messages.value[messageIndex].read_status = 'read'
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
</script>

<style scoped>
.admin-message-container {
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
  font-size: 48rpx;
  font-weight: 300;
  color: white;
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
}

.message-list-content {
  padding: 32rpx 24rpx 100rpx;
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

/* 消息项样式 */
.message-item {
  margin-bottom: 24rpx;
}

/* 管理员消息样式 */
.admin-message {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

/* 管理员头像 */
.avatar-wrapper {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.admin-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
}

.avatar-text {
  font-size: 28rpx;
  font-weight: 700;
  color: white;
}

.admin-badge {
  background: #f59e0b;
  color: white;
  font-size: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.2);
}

.badge-text {
  font-size: 18rpx;
  font-weight: 600;
  color: white;
}

/* 消息内容包装器 */
.message-content-wrapper {
  flex: 1;
  max-width: calc(100% - 120rpx);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.sender-name {
  font-size: 26rpx;
  color: #334155;
  font-weight: 600;
}

.message-time {
  font-size: 22rpx;
  color: #94a3b8;
}

/* 消息气泡 */
.message-bubble {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid #f1f5f9;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-bubble:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

/* 消息标题 */
.message-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f1f5f9;
}

.title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
}

.priority-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.3);
}

.priority-text {
  font-size: 20rpx;
  font-weight: 600;
  color: white;
}

/* 消息内容 */
.message-content {
  margin-bottom: 16rpx;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #334155;
  word-break: break-word;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-text.expanded {
  display: block;
  -webkit-line-clamp: none;
}

/* 展开按钮 */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 16rpx;
  padding: 12rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  border: 2rpx solid #e2e8f0;
  transition: all 0.2s ease;
}

.expand-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.expand-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.expand-icon {
  font-size: 20rpx;
  color: #667eea;
  transition: transform 0.2s ease;
}

/* 消息类型标签 */
.message-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.tag-item {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.tag-announcement {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 2rpx solid rgba(239, 68, 68, 0.2);
}

.tag-maintenance {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 2rpx solid rgba(245, 158, 11, 0.2);
}

.tag-event {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 2rpx solid rgba(16, 185, 129, 0.2);
}

.tag-security {
  background: rgba(139, 69, 19, 0.1);
  color: #a16207;
  border: 2rpx solid rgba(139, 69, 19, 0.2);
}

.tag-update {
  background: rgba(102, 126, 234, 0.1);
  color: #4f46e5;
  border: 2rpx solid rgba(102, 126, 234, 0.2);
}

.tag-text {
  font-size: 22rpx;
  font-weight: 600;
}

/* 查看详情提示 */
.view-detail-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12rpx;
  margin-top: 16rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.hint-arrow {
  font-size: 20rpx;
  color: #667eea;
}

/* 消息操作 */
.message-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f1f5f9;
}

.action-btn {
  flex: 1;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  text-align: center;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 2rpx solid transparent;
}

.action-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.action-primary:hover {
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  transform: translateY(-2rpx);
}

.action-secondary {
  background: white;
  color: #64748b;
  border-color: #e2e8f0;
}

.action-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.action-text {
  font-size: 26rpx;
  font-weight: 500;
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
.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #e2e8f0;
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
  color: #64748b;
  margin-top: 16rpx;
}

/* 加载遮罩 */
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

/* 响应式设计 */
@media (max-width: 750rpx) {
  .message-list-content {
    padding: 24rpx 16rpx 80rpx;
  }
  
  .admin-message {
    gap: 16rpx;
  }
  
  .message-bubble {
    padding: 20rpx;
  }
  
  .message-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .admin-message-container {
    background: #0f172a;
  }
  
  .message-list {
    background: #0f172a;
  }
  
  .date-text {
    background: #0f172a;
    color: #64748b;
  }
  
  .date-line {
    background: #334155;
  }
  
  .message-bubble {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }
  
  .message-bubble:hover {
    border-color: #475569;
  }
  
  .title-text {
    color: #f1f5f9;
  }
  
  .content-text {
    color: #cbd5e1;
  }
  
  .sender-name {
    color: #f1f5f9;
  }
  
  .expand-btn {
    background: #334155;
    border-color: #475569;
  }
  
  .expand-btn:hover {
    background: #475569;
    border-color: #64748b;
  }
  
  .view-detail-hint {
    background: rgba(102, 126, 234, 0.1);
  }
  
  .message-actions {
    border-top-color: #334155;
  }
  
  .action-secondary {
    background: #334155;
    color: #cbd5e1;
    border-color: #475569;
  }
  
  .action-secondary:hover {
    background: #475569;
    border-color: #64748b;
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
}

/* 动画效果 */
.message-item {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息未读状态 */
.message-bubble[data-unread="true"] {
  border-left: 8rpx solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.message-bubble[data-unread="true"]:before {
  content: '';
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 12rpx rgba(239, 68, 68, 0.4);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8rpx;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 消息气泡点击动画 */
.message-bubble:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* 优化长文本显示 */
.content-text:not(.expanded) {
  -webkit-line-clamp: 4;
  line-clamp: 4;
}

/* 标签动画 */
.tag-item {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(20rpx);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 操作按钮点击效果 */
.action-btn:active {
  transform: scale(0.95);
}

/* 头像闪烁动画（用于重要消息） */
.admin-avatar.important {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 4rpx 20rpx rgba(245, 158, 11, 0.6);
  }
}

/* 提升无障碍访问 */
.message-bubble:focus {
  outline: 4rpx solid rgba(102, 126, 234, 0.3);
  outline-offset: 2rpx;
}

.action-btn:focus {
  outline: 4rpx solid rgba(102, 126, 234, 0.3);
  outline-offset: 2rpx;
}

/* 打印样式 */
@media print {
  .custom-navbar,
  .loading-overlay {
    display: none;
  }
  
  .message-list {
    margin-top: 0 !important;
  }
  
  .message-bubble {
    break-inside: avoid;
    box-shadow: none;
    border: 2rpx solid #e2e8f0;
  }
}
</style>