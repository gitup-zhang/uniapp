<template>
  <view class="ticket-container">
    <view class="ticket">
      <!-- 主要内容区 -->
      <view class="ticket-main">
        <view class="title">{{ props.activityData.title }}</view>
        
        <view class="info-list">
          <view class="info-item">
            <text class="icon">📍</text>
            <text class="text">{{ props.activityData.event_address }}</text>
          </view>
          <view class="info-item">
            <text class="icon">📅</text>
            <text class="text">{{ formatEventDate(props.activityData.event_start_time,props.activityData.event_end_time)}}</text>
          </view>
        </view>
      </view>
      
      <!-- 分割线 -->
      <view class="divider">
        <view class="dashed-line"></view>
        <view class="notch notch-left"></view>
        <view class="notch notch-right"></view>
      </view>
      
      <!-- 按钮区 -->
      <view class="ticket-bottom">
        <button class="action-btn" @click="handleAction">
          签到
        </button>
        <button class="cancel-btn" @click="handleCancel">
          取消报名
        </button>
      </view>
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
.ticket-container {
  padding: 20rpx;
}

.ticket {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
}

/* 主要内容区 */
.ticket-main {
  padding: 40rpx 32rpx 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.4;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon {
  font-size: 24rpx;
  width: 40rpx;
  text-align: center;
}

.text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
  line-height: 1.5;
}

/* 分割线 */
.divider {
  position: relative;
  height: 1rpx;
  margin: 0 20rpx;
}

.dashed-line {
  height: 1rpx;
  background-image: repeating-linear-gradient(
    to right,
    #ddd 0,
    #ddd 8rpx,
    transparent 8rpx,
    transparent 16rpx
  );
}

.notch {
  position: absolute;
  top: -15rpx;
  width: 30rpx;
  height: 30rpx;
  background: #f5f5f5;
  border-radius: 50%;
}

.notch-left {
  left: -35rpx;
}

.notch-right {
  right: -35rpx;
}

/* 按钮区 */
.ticket-bottom {
  padding: 30rpx 32rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(255, 65, 108, 0.3);
  transition: all 0.2s ease;
}

.action-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 15rpx rgba(255, 65, 108, 0.4);
}

.cancel-btn {
  width: 100%;
  height: 80rpx;
  background: #fff;
  color: #999;
  border: 2rpx solid #e5e5e5;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.cancel-btn:active {
  transform: translateY(2rpx);
  background: #f8f8f8;
  border-color: #ddd;
  color: #666;
}
</style>