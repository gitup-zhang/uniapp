<template>
  <view 
    class="message-card" 
    :class="{ 
      'has-unread': hasUnreadMessages,
      'loading': loading 
    }"
    @tap="handleCardTap"
  >
    <!-- 头像区域 -->
    <view class="avatar-wrapper">
      <!-- 分组头像 - 使用分组名首字符 -->
      <view class="group-avatar" :style="getAvatarStyle()">
        <text class="avatar-text">{{ getAvatarText() }}</text>
      </view>
      
      <!-- 未读消息数量徽章 -->
      <view v-if="hasUnreadMessages" class="unread-badge">
        {{ displayUnreadCount }}
      </view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-wrapper">
      <!-- 分组名和时间行 -->
      <view class="header-row">
        <text class="group-name">{{ message.group_name || '未知群组' }}</text>
        <text class="time-text">{{ formattedTime }}</text>
      </view>
      
      <!-- 最新消息内容 -->
      <text class="latest-content">{{ displayContent }}</text>
    </view>

    <!-- 右侧箭头 -->
    <view class="arrow-wrapper">
      <text class="arrow-icon">›</text>
    </view>
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
  return content || '暂无内容'
})

const formattedTime = computed(() => {
  return formatTime(props.message.latest_time || props.message.created_at || props.message.updated_at)
})

// 获取头像文本（分组名首字符）
const getAvatarText = () => {
  const name = props.message.group_name || '未知'
  // 处理中文、英文和数字
  const firstChar = name.charAt(0)
  return firstChar.toUpperCase()
}

// 获取头像样式（根据群组名生成颜色）
const getAvatarStyle = () => {
  const name = props.message.group_name || 'default'
  // 简单的哈希函数生成颜色
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  ]
  
  const colorIndex = Math.abs(hash) % colors.length
  return {
    background: colors[colorIndex]
  }
}

// 处理卡片点击
const handleCardTap = () => {
  if (props.loading) return
  
  emit('tap', props.message)
  
  // 如果有未读消息，触发标记已读事件
  if (hasUnreadMessages.value) {
    emit('markAsRead', props.message)
  }
}

// 时间格式化
const formatTime = (time) => {
  if (!time) return ''
  
  try {
    const now = new Date()
    let msgTime
    
    // 处理不同的时间格式
    if (typeof time === 'string') {
      // 处理 ISO 8601 格式，如 "2025-08-12T03:14:21+08:00"
      msgTime = new Date(time)
    } else if (time instanceof Date) {
      msgTime = time
    } else if (typeof time === 'number') {
      // 时间戳
      msgTime = new Date(time)
    } else {
      return String(time)
    }
    
    // 检查日期是否有效
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
      // 返回具体日期
      const month = msgTime.getMonth() + 1
      const date = msgTime.getDate()
      
      // 如果是今年，不显示年份
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
.message-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-left: 4rpx solid transparent;
}

.message-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: all 0.3s ease;
  pointer-events: none;
}

.message-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.message-card.has-unread {
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-left-color: #3b82f6;
  box-shadow: 0 2rpx 16rpx rgba(59, 130, 246, 0.15);
}

.message-card.has-unread::before {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.02) 0%, transparent 100%);
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.group-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.25);
  position: relative;
  overflow: hidden;
}

.group-avatar::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  transform: rotate(45deg);
  transition: all 0.6s ease;
}

.message-card:active .group-avatar::before {
  transform: rotate(45deg) translate(20%, 20%);
}

.avatar-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
}

.unread-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
  padding: 6rpx 12rpx;
  border-radius: 24rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.4);
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* 分组名和时间行 */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.group-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.has-unread .group-name {
  color: #1e40af;
  font-weight: 700;
}

.time-text {
  font-size: 24rpx;
  color: #9ca3af;
  flex-shrink: 0;
  font-weight: 500;
}

.has-unread .time-text {
  color: #3b82f6;
  font-weight: 600;
}

/* 最新消息内容 */
.latest-content {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.has-unread .latest-content {
  color: #374151;
  font-weight: 500;
}

/* 右侧箭头 */
.arrow-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 8rpx;
}

.arrow-icon {
  font-size: 32rpx;
  color: #d1d5db;
  font-weight: 300;
  transition: all 0.3s ease;
}

.has-unread .arrow-icon {
  color: #3b82f6;
  font-weight: 400;
}

.message-card:active .arrow-icon {
  transform: translateX(4rpx);
  color: #1d4ed8;
}

/* 加载状态 */
.message-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.message-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .message-card {
    background: #1f2937;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-card.has-unread {
    background: linear-gradient(135deg, #1f2937 0%, #1e3a8a 100%);
  }
  
  .group-name {
    color: #f9fafb;
  }
  
  .latest-content {
    color: #d1d5db;
  }
  
  .time-text {
    color: #9ca3af;
  }
  
  .arrow-icon {
    color: #6b7280;
  }
  
  .has-unread .group-name {
    color: #60a5fa;
  }
  
  .has-unread .latest-content {
    color: #e5e7eb;
  }
  
  .has-unread .time-text {
    color: #60a5fa;
  }
  
  .has-unread .arrow-icon {
    color: #60a5fa;
  }
}
</style>