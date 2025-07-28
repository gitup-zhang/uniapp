<template>
  <view class="ticket-container">
    <view class="ticket">
      <!-- 主要内容区 -->
      <view class="ticket-main">
        <view class="title">{{ props.activityData.title }}</view>
        
        <view class="info-list">
          <view class="info-item">
            <text class="icon">📍</text>
            <text class="text">{{ props.activityData.location }}</text>
          </view>
          <view class="info-item">
            <text class="icon">📅</text>
            <text class="text">{{ props.activityData.date }}</text>
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
          {{ props.activityData.statusText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
// Props
const props = defineProps({
  activityData: {
    type: Object,
    default: () => ({
      title: '中国大模型大会',
      location: '深圳华侨城创意文化园北区 C2 展厅',
      date: '3月15日-4月10日',
      statusText: '位置签到'
    })
  }
})

// Emits
const emit = defineEmits(['action'])

// 方法
const handleAction = () => {
  emit('action', props.activityData)
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
</style>