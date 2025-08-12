<template>
  <view class="activity-card">
    <!-- 顶部装饰条 -->
    <view class="card-header">
      <view class="status-badge">
        <text class="status-dot"></text>
        <text class="status-text">进行中</text>
      </view>
    </view>
    
    <view class="card-content">
      <!-- 左侧内容区 -->
      <view class="content-left">
        <view class="title-section">
          <text class="title">{{ props.activityData.title }}</text>
          <text class="subtitle">精彩活动等你参与</text>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <view class="icon-wrapper location">
              <text class="icon">📍</text>
            </view>
            <view class="text-content">
              <text class="label">活动地点</text>
              <text class="value">{{ props.activityData.event_address }}</text>
            </view>
          </view>
          
          <view class="info-item">
            <view class="icon-wrapper date">
              <text class="icon">📅</text>
            </view>
            <view class="text-content">
              <text class="label">活动时间</text>
              <text class="value">{{  formatEventDate(props.activityData.event_start_time,props.activityData.event_end_time) }}</text>
            </view>
          </view>
        </view>
        
        <!-- 参与人数信息 -->
        <view class="participants-info">
          <view class="avatars">
            <view class="avatar"></view>
            <view class="avatar"></view>
            <view class="avatar"></view>
            <text class="more">+99</text>
          </view>
          <text class="participants-text">已有102人参与</text>
        </view>
      </view>
      
      <!-- 右侧按钮区 -->
      <view class="content-right">
        <button class="action-btn primary" @click="handleAction">
          <text class="btn-icon">✓</text>
          <text class="btn-text">签到</text>
        </button>
        <button class="action-btn secondary" @click="handleCancel">
          <text class="btn-icon">✕</text>
          <text class="btn-text">取消报名</text>
        </button>
      </view>
    </view>
    
    <!-- 底部进度条 -->
    <view class="progress-section">
      <view class="progress-bar">
        <view class="progress-fill"></view>
      </view>
      <text class="progress-text">活动进度 65%</text>
    </view>
  </view>
</template>

<script setup>
	import {formatEventDate} from '@/utils/data.js'
// Props
const props = defineProps({
  activityData: {
    type: Object,
    default: () => ({
      id: 0,
      title: '',
      event_address: '',
      event_end_time: "",
      event_start_time: "",
    })
  }
})

// Emits
const emit = defineEmits(['action', 'cancel'])

// 方法
const handleAction = () => {
  emit('action', props.activityData)
}

const handleCancel = () => {
  emit('cancel', props.activityData)
}
</script>

<style scoped>
.activity-card {
  margin: 16rpx 20rpx;
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  position: relative;
}

/* 顶部装饰和状态 */
.card-header {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 16rpx 24rpx;
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8rpx rgba(74, 222, 128, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-text {
  font-size: 22rpx;
  color: white;
  font-weight: 500;
}

/* 主要内容区 */
.card-content {
  display: flex;
  align-items: flex-start;
  padding: 32rpx 24rpx;
  gap: 24rpx;
  min-height: 200rpx;
}

/* 左侧内容区 */
.content-left {
  flex: 1;
  min-width: 0;
}

.title-section {
  margin-bottom: 24rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8rpx;
  line-height: 1.4;
  display: block;
}

.subtitle {
  font-size: 22rpx;
  color: #6b7280;
  opacity: 0.8;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.location {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
}

.icon-wrapper.date {
  background: linear-gradient(135deg, #fed7d7, #f56565);
}

.icon {
  font-size: 24rpx;
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.label {
  font-size: 20rpx;
  color: #9ca3af;
  font-weight: 500;
}

.value {
  font-size: 24rpx;
  color: #374151;
  line-height: 1.4;
  font-weight: 500;
}

/* 参与人数信息 */
.participants-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-radius: 16rpx;
  border: 1rpx solid #fecaca;
}

.avatars {
  display: flex;
  align-items: center;
  gap: -8rpx;
}

.avatar {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: 2rpx solid white;
  margin-right: -8rpx;
}

.avatar:nth-child(2) {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.avatar:nth-child(3) {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.more {
  font-size: 18rpx;
  color: #6b7280;
  font-weight: 600;
  margin-left: 8rpx;
}

.participants-text {
  font-size: 20rpx;
  color: #dc2626;
  font-weight: 500;
}

/* 右侧按钮区 */
.content-right {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 180rpx;
  height: 72rpx;
  border-radius: 36rpx;
  font-size: 24rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:active::before {
  left: 100%;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
}

.action-btn.primary:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  color: #64748b;
  border: 2rpx solid #e2e8f0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.action-btn.secondary:active {
  transform: translateY(2rpx);
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
  color: #475569;
}

.btn-icon {
  font-size: 20rpx;
}

.btn-text {
  font-size: 22rpx;
}

/* 底部进度条 */
.progress-section {
  padding: 20rpx 24rpx 24rpx;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-top: 1rpx solid #dee2e6;
}

.progress-bar {
  height: 8rpx;
  background: #e9ecef;
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  width: 65%;
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #dc2626);
  border-radius: 4rpx;
  animation: progressFill 2s ease-in-out;
}

@keyframes progressFill {
  from { width: 0%; }
  to { width: 65%; }
}

.progress-text {
  font-size: 20rpx;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
}

/* 响应式适配 */
@media (max-width: 375px) {
  .title {
    font-size: 28rpx;
  }
  
  .value {
    font-size: 22rpx;
  }
  
  .action-btn {
    width: 160rpx;
    height: 64rpx;
  }
  
  .btn-text {
    font-size: 20rpx;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .activity-card {
    background: linear-gradient(145deg, #1f2937, #111827);
    border: 1rpx solid rgba(75, 85, 99, 0.3);
  }
  
  .title {
    color: #f9fafb;
  }
  
  .subtitle {
    color: #9ca3af;
  }
  
  .value {
    color: #e5e7eb;
  }
  
  .progress-section {
    background: linear-gradient(135deg, #374151, #1f2937);
    border-top: 1rpx solid #4b5563;
  }
}
</style>