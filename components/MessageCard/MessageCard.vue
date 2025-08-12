<template>
  <view 
    class="message-card" 
    :class="{ 'unread': !message.isRead }"
    @tap="handleCardTap"
  >
    <!-- 头像区域 -->
    <view class="avatar-wrapper">
      <!-- 系统消息图标 -->
      <view v-if="message.type === 'system'" class="system-avatar">
        <text class="system-icon">🔔</text>
      </view>
      
      <!-- 群组头像 -->
      <image 
        v-else
        :src="message.avatar || '/static/default-group.png'" 
        class="group-avatar"
        mode="aspectFill"
        :lazy-load="true"
        @error="handleAvatarError"
      />
      
      <!-- 未读红点 -->
      <view v-if="!message.isRead" class="unread-dot"></view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-wrapper">
      <!-- 标题和时间行 -->
      <view class="header-row">
        <view class="title-section">
          <text class="message-title">{{ message.title }}</text>
          <view v-if="message.priority === 'high'" class="priority-badge">重要</view>
        </view>
        <text class="time-text">{{ formatTime(message.time) }}</text>
      </view>
      
      <!-- 消息内容 -->
      <text class="message-content">{{ message.brief }}</text>
      
      <!-- 底部来源信息 -->
      <view class="meta-info">
        <view class="source-tag">
          <text class="source-text">{{ getSourceText() }}</text>
          <text v-if="message.type === 'group'" class="member-count">{{ message.memberCount }}人</text>
        </view>
      </view>
    </view>

    <!-- 右侧操作区域 -->
    <view class="action-wrapper">
      <view class="read-status" @tap.stop="toggleRead">
        <view class="status-indicator" :class="{ 'read': message.isRead }"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

// Props定义
const props = defineProps({
  message: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Emits定义
const emit = defineEmits(['tap', 'toggleRead'])

// 获取来源文本
const getSourceText = () => {
  if (props.message.type === 'system') {
    return '系统消息'
  }
  return props.message.groupName || '群组消息'
}

// 处理卡片点击
const handleCardTap = () => {
  emit('tap', props.message)
}

// 切换已读状态
const toggleRead = () => {
  emit('toggleRead', props.message)
}

// 头像错误处理
const handleAvatarError = () => {
  console.log('头像加载失败')
}

// 时间格式化
const formatTime = (time) => {
  const now = new Date()
  const msgTime = new Date(time)
  const diff = now - msgTime
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
    } else {
      return `${hours}小时前`
    }
  } else if (days === 1) {
    return '昨天'
  } else if (days <= 7) {
    return `${days}天前`
  } else {
    return time.split(' ')[0]
  }
}
</script>

<style scoped>
.message-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.message-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4rpx;
  height: 100%;
  background: transparent;
  transition: all 0.3s ease;
}

.message-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.message-card.unread {
  background: linear-gradient(135deg, #fff 0%, #f8faff 100%);
  box-shadow: 0 2rpx 12rpx rgba(24, 144, 255, 0.1);
}

.message-card.unread::before {
  background: linear-gradient(180deg, #1890ff 0%, #40a9ff 100%);
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.system-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.system-icon {
  font-size: 36rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.group-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.unread-dot {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 20rpx;
  height: 20rpx;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border-radius: 50%;
  border: 3rpx solid #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(255, 77, 79, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
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

/* 标题和时间行 */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
}

.message-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.unread .message-title {
  font-weight: 600;
  color: #1890ff;
}

.priority-badge {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  color: #ffffff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-weight: 500;
  box-shadow: 0 2rpx 6rpx rgba(250, 140, 22, 0.3);
  flex-shrink: 0;
}

.time-text {
  font-size: 24rpx;
  color: #8c8c8c;
  flex-shrink: 0;
}

.unread .time-text {
  color: #1890ff;
  font-weight: 500;
}

/* 消息内容 */
.message-content {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 8rpx 0;
}

.unread .message-content {
  color: #434343;
}

/* 底部元信息 */
.meta-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.source-tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 12rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
}

.unread .source-tag {
  background: rgba(24, 144, 255, 0.1);
}

.source-text {
  font-size: 22rpx;
  color: #8c8c8c;
}

.unread .source-text {
  color: #1890ff;
}

.member-count {
  font-size: 20rpx;
  color: #bfbfbf;
  background: #ffffff;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.unread .member-count {
  color: #1890ff;
  background: rgba(255, 255, 255, 0.8);
}

/* 右侧操作区域 */
.action-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.read-status {
  padding: 12rpx;
  border-radius: 12rpx;
  transition: all 0.2s ease;
}

.read-status:active {
  background: rgba(24, 144, 255, 0.1);
}

.status-indicator {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #1890ff;
  transition: all 0.3s ease;
}

.status-indicator.read {
  background: #d9d9d9;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .message-card {
    background: #1f1f1f;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-card.unread {
    background: linear-gradient(135deg, #1f1f1f 0%, #1a1a2e 100%);
  }
  
  .message-title {
    color: #ffffff;
  }
  
  .message-content {
    color: #cccccc;
  }
  
  .time-text {
    color: #999999;
  }
  
  .source-tag {
    background: #333333;
  }
  
  .source-text {
    color: #999999;
  }
}
</style>