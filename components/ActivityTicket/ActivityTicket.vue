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
            <text class="text">{{ formatEventDate(props.activityData.event_start_time, props.activityData.event_end_time)}}</text>
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
        <button 
          :class="['action-btn', checkInButtonConfig.class]" 
          :disabled="checkInButtonConfig.disabled"
          @click="handleAction"
        >
          {{ checkInButtonConfig.text }}
        </button>
        <button class="cancel-btn" @click="handleCancel">
          取消报名
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { formatEventDate } from '@/utils/data.js'
import { computed, ref, onMounted, onUnmounted } from 'vue'

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

// 响应式数据
const currentTime = ref(new Date())
let timer = null

// 生命周期
onMounted(() => {
  // 每分钟更新一次当前时间
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 时间状态计算
const timeStatus = computed(() => {
  const now = currentTime.value.getTime()
  const startTime = new Date(props.activityData.event_start_time).getTime()
  const endTime = new Date(props.activityData.event_end_time).getTime()
  
  if (now < startTime) return 'not_started'
  if (now >= startTime && now <= endTime) return 'ongoing'
  return 'expired'
})

// 签到按钮配置
const checkInButtonConfig = computed(() => {
  switch (timeStatus.value) {
    case 'not_started':
      return {
        text: '未开始',
        disabled: true,
        class: 'not-started'
      }
    case 'ongoing':
      return {
        text: '签到',
        disabled: false,
        class: 'active'
      }
    case 'expired':
      return {
        text: '已结束',
        disabled: true,
        class: 'expired'
      }
    default:
      return {
        text: '签到',
        disabled: false,
        class: 'active'
      }
  }
})

// 方法
const handleAction = () => {
  if (!checkInButtonConfig.value.disabled) {
    emit('action', props.activityData)
  }
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
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

/* 活跃状态 - 可以签到 */
.action-btn.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(255, 65, 108, 0.3);
}

.action-btn.active:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 15rpx rgba(255, 65, 108, 0.4);
}

/* 未开始状态 */
.action-btn.not-started {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(251, 191, 36, 0.3);
  opacity: 0.7;
}

/* 已结束状态 */
.action-btn.expired {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(156, 163, 175, 0.3);
  opacity: 0.7;
}

/* 禁用状态 */
.action-btn:disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.action-btn.not-started:active,
.action-btn.expired:active {
  transform: none;
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