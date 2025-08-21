<template>
  <view class="admin-message-item">
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
          <text class="sender-name">{{ message.sender_name || '系统管理员' }}</text>
          <text class="message-time">{{ formatMessageTime(message.send_time) }}</text>
        </view>

        <!-- 消息气泡 -->
        <view 
          class="message-bubble" 
          :class="{ 
            'clickable': contentLevel === 'long'
          }"
          @tap="handleMessageTap"
        >
          <!-- 消息标题 -->
          <view v-if="message.title" class="message-title">
            <text class="title-text">{{ message.title }}</text>
            <!-- <view v-if="message.priority === 'high'" class="priority-badge">
              <text class="priority-text">重要</text>
            </view> -->
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 文本内容 -->
            <view v-if="textContent" class="text-content">
              <text 
                class="content-text" 
                :class="{ 
                  'expanded': isExpanded,
                  'collapsed': contentLevel === 'medium' && !isExpanded
                }"
              >{{ getDisplayText() }}</text>
            </view>
            
            <!-- 媒体内容 -->
            <view v-if="mediaItems.length > 0" class="media-content">
              <view 
                v-for="(media, index) in mediaItems" 
                :key="index"
                class="media-item"
                :class="`media-${media.type}`"
              >
                <!-- 图片 -->
                <image 
                  v-if="media.type === 'image'"
                  :src="media.url"
                  class="media-image"
                  mode="aspectFit"
                  @tap="previewImage(media.url, getAllImageUrls())"
                />
                
                <!-- 视频 -->
                <video 
                  v-if="media.type === 'video'"
                  :src="media.url"
                  :poster="media.poster"
                  class="media-video"
                  controls
                  :show-center-play-btn="true"
                  :show-play-btn="true"
                  object-fit="contain"
                />
              </view>
            </view>
            
            <!-- 展开/收起按钮（中等长度内容） -->
            <view 
              v-if="contentLevel === 'medium'" 
              class="expand-btn"
              @tap.stop="toggleExpand"
            >
              <text class="expand-text">
                {{ isExpanded ? '收起' : '查看全部' }}
              </text>
              <text class="expand-icon" :class="{ 'rotated': isExpanded }">
                ▼
              </text>
            </view>
          </view>

          <!-- 消息类型标签 -->
         <!-- <view v-if="message.type && message.type !== 'normal'" class="message-tags">
            <view class="tag-item" :class="`tag-${message.type}`">
              <text class="tag-text">{{ getTypeLabel(message.type) }}</text>
            </view>
          </view> -->

          <!-- 点击查看详情提示（长内容） -->
          <view v-if="contentLevel === 'long'" class="view-detail-hint">
            <text class="hint-text">点击查看详情</text>
            <text class="hint-arrow">›</text>
          </view>
        </view>

        <!-- 消息操作 -->
        <!-- <view v-if="message.actions && message.actions.length > 0" class="message-actions">
          <view 
            v-for="action in message.actions" 
            :key="action.id"
            class="action-btn"
            :class="`action-${action.type}`"
            @tap="handleAction(action)"
          >
            <text class="action-text">{{ action.label }}</text>
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['messageClick', 'actionClick', 'markRead'])

// 组件状态
const isExpanded = ref(false)

// 内容长度阈值
const SHORT_LIMIT = 50    // 短内容阈值
const MEDIUM_LIMIT = 200  // 中等内容阈值

// 解析消息内容
const { textContent, mediaItems } = parseMessageContent(props.message.content || '')

// 计算内容级别
const contentLevel = computed(() => {
  const textLength = textContent.length
  
  if (textLength <= SHORT_LIMIT && mediaItems.length === 0) {
    return 'short'  // 短内容
  } else if (textLength <= MEDIUM_LIMIT) {
    return 'medium' // 中等内容
  } else {
    return 'long'   // 长内容
  }
})

// 解析消息内容，分离文本和媒体
function parseMessageContent(content) {
  if (!content) return { textContent: '', mediaItems: [] }
  
  const mediaItems = []
  let textContent = content
  
  // 匹配图片 [img:url] 或 [image:url]
  const imageRegex = /\[(?:img|image):([^\]]+)\]/g
  textContent = textContent.replace(imageRegex, (match, url) => {
    mediaItems.push({
      type: 'image',
      url: url.trim()
    })
    return '' // 从文本中移除
  })
  
  // 匹配视频 [video:url] 或 [vid:url]
  const videoRegex = /\[(?:video|vid):([^\]]+)(?:\|poster:([^\]]+))?\]/g
  textContent = textContent.replace(videoRegex, (match, url, poster) => {
    mediaItems.push({
      type: 'video',
      url: url.trim(),
      poster: poster ? poster.trim() : ''
    })
    return '' // 从文本中移除
  })
  
  // 清理多余的空行和空格
  textContent = textContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim()
  
  return { textContent, mediaItems }
}

// 获取显示的文本内容
const getDisplayText = () => {
  if (!textContent) return ''
  
  if (contentLevel.value === 'medium' && !isExpanded.value) {
    return textContent.substring(0, MEDIUM_LIMIT) + '...'
  }
  
  if (contentLevel.value === 'long') {
    return textContent.substring(0, SHORT_LIMIT) + '...'
  }
  
  return textContent
}

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 格式化消息时间
const formatMessageTime = (timeStr) => {
  if (!timeStr) return ''
  
  const time = new Date(timeStr)
  const now = new Date()
  
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }
  
  if (isSameDay(time, now)) {
    return `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  } else {
    return `${time.getMonth() + 1}-${time.getDate()} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  }
}

// 获取类型标签
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

// 获取所有图片URL
const getAllImageUrls = () => {
  return mediaItems.filter(item => item.type === 'image').map(item => item.url)
}

// 预览图片
const previewImage = (current, urls) => {
  uni.previewImage({
    current,
    urls
  })
}

// 处理消息点击
const handleMessageTap = () => {
  // 对于长内容，直接跳转到详情页
  if (contentLevel.value === 'long') {
    emit('messageClick', props.message)
    return
  }
  
  // 短内容和中等长度内容不做任何操作，中等长度内容通过专门的展开/收起按钮处理
}

// 处理操作按钮点击
const handleAction = (action) => {
  emit('actionClick', action, props.message)
}
</script>

<style scoped>
.admin-message-item {
  margin-bottom: 24rpx;
  animation: fadeInUp 0.4s ease-out;
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
  transition: all 0.3s ease;
}

.message-bubble.clickable {
  cursor: pointer;
}

.message-bubble.clickable:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.message-bubble.clickable:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
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

/* 文本内容 */
.text-content {
  margin-bottom: 16rpx;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #334155;
  word-break: break-word;
  white-space: pre-wrap;
}

.content-text.collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.content-text.expanded {
  display: block;
}

/* 媒体内容 */
.media-content {
  margin-top: 16rpx;
}

.media-item {
  margin-bottom: 16rpx;
}

.media-item:last-child {
  margin-bottom: 0;
}

/* 图片样式 */
.media-image {
  width: 100%;
  max-width: 400rpx;
  max-height: 300rpx;
  border-radius: 12rpx;
  background: #f8fafc;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.media-image:active {
  transform: scale(0.98);
}

/* 视频样式 */
.media-video {
  width: 100%;
  max-width: 500rpx;
  height: 280rpx;
  border-radius: 12rpx;
  background: #000;
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

.expand-btn:active {
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

.expand-icon.rotated {
  transform: rotate(180deg);
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
  animation: slideInRight 0.3s ease-out;
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

.action-btn:active {
  transform: scale(0.95);
}

.action-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.action-secondary {
  background: white;
  color: #64748b;
  border-color: #e2e8f0;
}

.action-text {
  font-size: 26rpx;
  font-weight: 500;
}

/* 消息未读状态样式已移除 */

/* 头像闪烁动画（重要消息） */
.admin-avatar.important {
  animation: pulse 2s infinite;
}

/* 动画定义 */
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

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 4rpx 20rpx rgba(245, 158, 11, 0.6);
  }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
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
  
  .media-video {
    height: 200rpx;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .message-bubble {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
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
  
  .media-image {
    background: #334155;
  }
}
</style>