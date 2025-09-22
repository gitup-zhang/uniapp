<template>
  <view class="message-detail-page">
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
          <text class="nav-title">消息详情</text>
          <text class="nav-subtitle">管理员通知</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 消息详情内容 -->
    <scroll-view 
      class="detail-scroll"
      :style="{ marginTop: statusBarHeight + 48 + 'px' }"
      scroll-y="true"
    >
      <view class="detail-content">
        <!-- 管理员信息头部 -->
        <view class="admin-header">
          <view class="admin-avatar" :class="{ important: message.priority === 'high' }">
            <text class="avatar-text">管</text>
          </view>
          <view class="admin-info">
            <view class="name-row">
              <text class="admin-name">{{ message.sender_name || '系统管理员' }}</text>
              <view class="admin-badge">
                <text class="badge-text">管理员</text>
              </view>
            </view>
            <text class="send-time">{{ Dataformat(message.send_time) }}</text>
          </view>
          <view v-if="message.priority === 'high'" class="priority-indicator">
            <text class="priority-text">重要</text>
          </view>
        </view>

        <!-- 消息主体卡片 -->
        <view class="message-card">
          <!-- 消息标题 -->
          <view v-if="message.title" class="message-title-section">
            <text class="message-title">{{ message.title }}</text>
          </view>

          <!-- 消息类型标签 -->
       <!--   <view v-if="message.type && message.type !== 'normal'" class="message-type-section">
            <view class="type-tag" :class="`tag-${message.type}`">
              <text class="type-text">{{ getTypeLabel(message.type) }}</text>
            </view>
          </view> -->

          <!-- 消息内容 -->
          <view class="message-body">
            <!-- 文本内容 -->
            <view  class="text-section">
              <!-- <view class="content-text" v-html="message.content"/> -->
			  <mp-html :content="message.content" :container-style="style"/>
            </view>

            <!-- 媒体内容 -->
            
              
            
          </view>
        </view>

        <!-- 底部间距 -->
        <view class="bottom-spacing"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted,nextTick  } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {Dataformat} from '@/utils/data.js'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'

// 页面状态
const statusBarHeight = ref(0)

// 消息数据
const message = ref({})

// 解析消息内容
// const { textContent, mediaItems } = parseMessageContent(message.value.content || '')

// 生命周期
onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
   try {
      // 直接从缓存获取整个对象
      message.value = uni.getStorageSync('currentMessage') || null
      console.log('接收到的 message:', message.value)
    } catch (error) {
      console.error('读取 message 失败', error)
    }
	  
})



// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style >
.message-detail-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 - 与父组件保持一致 */
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

/* 详情内容 */
.detail-scroll {
  flex: 1;
  background: #f8fafc;
}

.detail-content {
  padding: 32rpx 24rpx;
}

/* 管理员信息头部 */
.admin-header {
  background: white;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 24rpx;
  position: relative;
}

.admin-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(245, 158, 11, 0.3);
  flex-shrink: 0;
}

.admin-avatar.important {
  animation: pulse 2s infinite;
}

.avatar-text {
  font-size: 30rpx;
  font-weight: 700;
  color: white;
}

.admin-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.admin-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}

.admin-badge {
  background: #f59e0b;
  color: white;
  font-size: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.2);
}

.badge-text {
  font-size: 20rpx;
  font-weight: 600;
  color: white;
}

.send-time {
  font-size: 24rpx;
  color: #64748b;
}

.priority-indicator {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.3);
}

.priority-text {
  font-size: 20rpx;
  font-weight: 600;
  color: white;
}

/* 消息卡片 */
.message-card {
  background: white;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 消息标题 */
.message-title-section {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #f1f5f9;
}

.message-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

/* 消息类型 */
.message-type-section {
  margin-bottom: 24rpx;
}

.type-tag {
  display: inline-block;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
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

.type-text {
  font-size: 24rpx;
  font-weight: 600;
}

/* 消息主体 */
.message-body {
  line-height: 1.6;
}

/* 文本内容 */
.text-section {
  margin-bottom: 24rpx
  }
.content-text  img{
  width: 50%;
  max-width: 50%;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.content-text{
  font-size: 30rpx;
  line-height: 1.7;
  color: #334155;
  word-break: break-word;
  white-space: pre-wrap;
}

/* 媒体内容 */
.media-section {
  margin-top: 24rpx;
}

.media-item {
  margin-bottom: 24rpx;
}

.media-item:last-child {
  margin-bottom: 0;
}

/* 图片容器 */
.image-container {
  border-radius: 16rpx;
  overflow: hidden;
  background: #f8fafc;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.image-container:active {
  transform: scale(0.98);
}

.media-image {
  width: 100%;
  display: block;
  border-radius: 16rpx;
}

/* 视频容器 */
.video-container {
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.media-video {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  background: #000;
}

/* 底部间距 */
.bottom-spacing {
  height: 60rpx;
}

/* 头像闪烁动画 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4rpx 16rpx rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 4rpx 24rpx rgba(245, 158, 11, 0.6);
  }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .detail-content {
    padding: 24rpx 16rpx;
  }
  
  .admin-header {
    padding: 24rpx;
  }
  
  .message-card {
    padding: 24rpx;
  }
  
  .media-video {
    height: 320rpx;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .message-detail-page {
    background: #0f172a;
  }
  
  .detail-scroll {
    background: #0f172a;
  }
  
  .admin-header, .message-card {
    background: #1e293b;
    border-color: #334155;
  }
  
  .admin-name {
    color: #f1f5f9;
  }
  
  .message-title {
    color: #f1f5f9;
  }
  
  .content-text {
    color: #cbd5e1;
  }
  
  .send-time {
    color: #94a3b8;
  }
  
  .message-title-section {
    border-bottom-color: #334155;
  }
}
</style>