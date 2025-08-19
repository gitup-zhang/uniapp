<template>
  <view 
    class="message-card" 
    :class="{ 
      'has-unread': hasUnreadMessages,
      'loading': loading,
      'system-message': messageType === 'system',
      'group-message': messageType === 'group'
    }"
    @tap="handleCardTap"
  >
    <!-- 卡片背景装饰 -->
    <view class="card-decoration"></view>
    
    <!-- 主要内容区 -->
    <view class="card-body">
      <!-- 顶部信息行 -->
      <view class="top-section">
        <!-- 左侧：头像和标题 -->
        <view class="info-section">
          <view class="avatar" :style="getAvatarStyle()">
            <text v-if="messageType === 'system'" class="avatar-icon">🔔</text>
            <text v-else class="avatar-text">{{ getAvatarText() }}</text>
          </view>
          <view class="title-section">
            <text class="title">{{ message.group_name || getDefaultGroupName() }}</text>
            <view class="meta-info">
              <text class="type-tag">{{ messageType === 'system' ? '系统' : '群聊' }}</text>
              <text class="timestamp">{{ formattedTime }}</text>
            </view>
          </view>
        </view>
        
        <!-- 右侧：状态指示器 -->
        <view class="status-section">
          <view v-if="hasUnreadMessages" class="unread-indicator">
            <text class="unread-count">{{ displayUnreadCount }}</text>
          </view>
          <view class="arrow-icon">
            <text class="arrow">→</text>
          </view>
        </view>
      </view>
      
      <!-- 消息内容区 -->
      <view class="content-section">
        <text class="message-preview">{{ displayContent }}</text>
      </view>
    </view>
    
    <!-- 未读消息强调条 -->
    <view v-if="hasUnreadMessages" class="unread-accent"></view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props定义
const props = defineProps({
  message: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      group_name: '',
      unread_count: 0,
      is_read: 1,
      latest_content: '',
      latest_time: '',
      type: 'group'
    })
  },
  messageType: {
    type: String,
    default: 'group',
    validator: (value) => ['system', 'group'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['tap', 'markAsRead'])

// 计算属性
const hasUnreadMessages = computed(() => {
  return props.message.unread_count > 0 || props.message.is_read === 0
})

const displayUnreadCount = computed(() => {
  const count = props.message.unread_count || (props.message.is_read === 0 ? 1 : 0)
  return count > 99 ? '99+' : count.toString()
})

const displayContent = computed(() => {
  const content = props.message.latest_content || props.message.content || props.message.message || ''
  return content || (props.messageType === 'system' ? '系统通知消息' : '暂无消息内容')
})

const formattedTime = computed(() => {
  return formatTime(props.message.latest_time || props.message.created_at || props.message.updated_at)
})

// 获取默认群组名
const getDefaultGroupName = () => {
  return props.messageType === 'system' ? '系统通知' : '未知群组'
}

// 获取头像文字
const getAvatarText = () => {
  const name = props.message.group_name || '未知'
  const firstChar = name.charAt(0)
  return firstChar.toUpperCase()
}

// 获取头像样式
const getAvatarStyle = () => {
  if (props.messageType === 'system') {
    return {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff'
    }
  }
  
  const name = props.message.group_name || 'default'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  ]
  
  const colorIndex = Math.abs(hash) % gradients.length
  return {
    background: gradients[colorIndex],
    color: '#ffffff'
  }
}

// 处理卡片点击
const handleCardTap = () => {
  if (props.loading) return
  
  emit('tap', props.message, props.messageType)
  
  if (hasUnreadMessages.value) {
    emit('markAsRead', props.message, props.messageType)
  }
}

// 时间格式化
const formatTime = (time) => {
  if (!time) return ''
  
  try {
    const now = new Date()
    let msgTime
    
    if (typeof time === 'string') {
      msgTime = new Date(time)
    } else if (time instanceof Date) {
      msgTime = time
    } else if (typeof time === 'number') {
      msgTime = new Date(time)
    } else {
      return String(time)
    }
    
    if (isNaN(msgTime.getTime())) {
      console.warn('无效的日期格式:', time)
      return String(time)
    }
    
    const diff = now - msgTime
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) {
      return '刚刚'
    } else if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days === 1) {
      return '昨天'
    } else if (days <= 7) {
      return `${days}天前`
    } else {
      const month = msgTime.getMonth() + 1
      const date = msgTime.getDate()
      
      if (msgTime.getFullYear() === now.getFullYear()) {
        return `${month}月${date}日`
      } else {
        return `${msgTime.getFullYear()}年${month}月${date}日`
      }
    }
  } catch (error) {
    console.error('时间格式化错误:', error, '原始时间:', time)
    return String(time)
  }
}
</script>

<style scoped>
/* 主卡片容器 */
.message-card {
  position: relative;
  background: #ffffff;
  border-radius: 24rpx;
  margin: 0 0 24rpx 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 4rpx 20rpx rgba(0, 0, 0, 0.04),
    0 1rpx 3rpx rgba(0, 0, 0, 0.08);
}

.message-card:active {
  transform: translateY(-4rpx) scale(0.996);
  box-shadow: 
    0 12rpx 40rpx rgba(0, 0, 0, 0.08),
    0 4rpx 8rpx rgba(0, 0, 0, 0.12);
}

/* 背景装饰 */
.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(40rpx, -40rpx);
}

.system-message .card-decoration {
  background: radial-gradient(circle, rgba(255, 107, 107, 0.08) 0%, transparent 70%);
}

/* 未读消息装饰 */
.has-unread .card-decoration {
  background: radial-gradient(circle, rgba(255, 107, 107, 0.12) 0%, transparent 70%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 卡片主体 */
.card-body {
  padding: 32rpx 28rpx;
  position: relative;
  z-index: 2;
}

/* 顶部信息区 */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.info-section {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  flex: 1;
  min-width: 0;
}

/* 头像样式 */
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  border: 3rpx solid rgba(255, 255, 255, 0.9);
}

.avatar-text {
  font-size: 32rpx;
  color: inherit;
  font-weight: 700;
}

.avatar-icon {
  font-size: 32rpx;
}

/* 标题区域 */
.title-section {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.3;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.5rpx;
}

.system-message .title {
  color: #2d3748;
}

.has-unread .title {
  color: #2b6cb0;
}

.system-message.has-unread .title {
  color: #c53030;
}

/* 元信息 */
.meta-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.type-tag {
  font-size: 22rpx;
  font-weight: 600;
  color: #718096;
  background: #f7fafc;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1rpx solid #e2e8f0;
}

.system-message .type-tag {
  background: #fed7d7;
  color: #c53030;
  border-color: #feb2b2;
}

.group-message .type-tag {
  background: #bee3f8;
  color: #2b6cb0;
  border-color: #90cdf4;
}

.timestamp {
  font-size: 24rpx;
  color: #a0aec0;
  font-weight: 500;
}

.has-unread .timestamp {
  color: #4299e1;
  font-weight: 600;
}

/* 状态区域 */
.status-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

/* 未读指示器 */
.unread-indicator {
  position: relative;
}

.unread-count {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 800;
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4rpx 12rpx rgba(66, 153, 225, 0.4),
    0 2rpx 4rpx rgba(66, 153, 225, 0.3);
  animation: bounce 0.6s ease-in-out;
}

.system-message .unread-count {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  box-shadow: 
    0 4rpx 12rpx rgba(245, 101, 101, 0.4),
    0 2rpx 4rpx rgba(245, 101, 101, 0.3);
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-8rpx,0); }
  70% { transform: translate3d(0,-4rpx,0); }
}

/* 箭头图标 */
.arrow-icon {
  padding: 12rpx;
  border-radius: 50%;
  background: rgba(113, 128, 150, 0.1);
  transition: all 0.3s ease;
}

.arrow {
  font-size: 28rpx;
  color: #718096;
  font-weight: 300;
}

.has-unread .arrow-icon {
  background: rgba(66, 153, 225, 0.15);
}

.has-unread .arrow {
  color: #4299e1;
}

.system-message.has-unread .arrow-icon {
  background: rgba(245, 101, 101, 0.15);
}

.system-message.has-unread .arrow {
  color: #f56565;
}

.message-card:active .arrow {
  transform: translateX(4rpx);
}

/* 内容区域 */
.content-section {
  padding-left: 104rpx;
}

.message-preview {
  font-size: 30rpx;
  color: #4a5568;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  font-weight: 400;
  letter-spacing: 0.5rpx;
}

.system-message .message-preview {
  color: #2d3748;
}

.has-unread .message-preview {
  color: #2d3748;
  font-weight: 500;
}

/* 未读强调条 */
.unread-accent {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 60rpx;
  background: linear-gradient(to bottom, #4299e1, #3182ce);
  border-radius: 0 8rpx 8rpx 0;
  box-shadow: 2rpx 0 8rpx rgba(66, 153, 225, 0.3);
}

.system-message .unread-accent {
  background: linear-gradient(to bottom, #f56565, #e53e3e);
  box-shadow: 2rpx 0 8rpx rgba(245, 101, 101, 0.3);
}

/* 加载状态 */
.message-card.loading {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}

.message-card.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.6), 
    transparent
  );
  animation: shimmer 2s infinite;
  z-index: 10;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 特殊卡片样式 */
.has-unread {
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  border: 1rpx solid rgba(66, 153, 225, 0.1);
}

.system-message.has-unread {
  background: linear-gradient(135deg, #ffffff 0%, #fffafa 100%);
  border: 1rpx solid rgba(245, 101, 101, 0.1);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .message-card {
    background: #2d3748;
    box-shadow: 
      0 4rpx 20rpx rgba(0, 0, 0, 0.2),
      0 1rpx 3rpx rgba(0, 0, 0, 0.3);
  }
  
  .title {
    color: #f7fafc;
  }
  
  .system-message .title {
    color: #fed7d7;
  }
  
  .has-unread .title {
    color: #90cdf4;
  }
  
  .system-message.has-unread .title {
    color: #feb2b2;
  }
  
  .type-tag {
    background: #4a5568;
    color: #cbd5e0;
    border-color: #718096;
  }
  
  .message-preview {
    color: #cbd5e0;
  }
  
  .timestamp {
    color: #718096;
  }
  
  .arrow {
    color: #a0aec0;
  }
  
  .has-unread {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    border-color: rgba(66, 153, 225, 0.2);
  }
  
  .system-message.has-unread {
    background: linear-gradient(135deg, #2d3748 0%, #2c1810 100%);
    border-color: rgba(245, 101, 101, 0.2);
  }
}
</style>