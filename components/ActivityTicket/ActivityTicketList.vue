<template>
  <view :class="['activity-card', statusClass]">
    <!-- 顶部装饰条 -->
    <view class="card-header">
      <view class="status-badge">
        <text :class="['status-dot', statusClass]"></text>
        <text class="status-text">{{ statusText }}</text>
      </view>
      <!-- 过期状态遮罩 -->
      <view v-if="isExpired" class="expired-overlay">
        <text class="expired-text">已过期</text>
      </view>
    </view>

    <view class="card-content">
      <!-- 左侧内容区 -->
      <view class="content-left">
        <view class="title-section">
          <text class="title">{{ props.activityData.title }}</text>
          <text class="subtitle">{{
            isExpired ? "活动已结束" : "精彩活动等你参与"
          }}</text>
        </view>

        <view class="info-list">
          <view class="info-item">
            <view :class="['icon-wrapper', 'location', statusClass]">
              <text class="icon">📍</text>
            </view>
            <view class="text-content">
              <text class="label">活动地点</text>
              <text class="value">{{ props.activityData.event_address }}</text>
            </view>
          </view>

          <view class="info-item">
            <view :class="['icon-wrapper', 'date', statusClass]">
              <text class="icon">📅</text>
            </view>
            <view class="text-content">
              <text class="label">活动时间</text>
              <text class="value">{{
                formatEventDate(
                  props.activityData.event_start_time,
                  props.activityData.event_end_time
                )
              }}</text>
            </view>
          </view>
        </view>

        <!-- 参与人数信息 -->
        <!-- <view :class="['participants-info', statusClass]">
          <view class="avatars">
            <view :class="['avatar', statusClass]"></view>
            <view :class="['avatar', statusClass]"></view>
            <view :class="['avatar', statusClass]"></view>
            <text class="more">+99</text>
          </view>
          <text class="participants-text">{{ isExpired ? '共102人参与过' : '已有102人参与' }}</text>
        </view> -->
      </view>

      <!-- 右侧按钮区 -->
      <view class="content-right">
        <template v-if="!isExpired">
          <button class="action-btn secondary" @click="handleCancel">
            <text class="btn-icon">✕</text>
            <text class="btn-text">取消报名</text>
          </button>
        </template>
      </view>
    </view>

    <!-- 底部进度条 -->
    <view :class="['progress-section', statusClass]">
      <view class="progress-bar">
        <view
          :class="['progress-fill', statusClass]"
          :style="{ width: activityProgress + '%' }"
        ></view>
      </view>
      <text class="progress-text">
        {{ isExpired ? "活动已完成 100%" : `活动进度 ${activityProgress}%` }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { formatEventDate } from "@/utils/data.js";
import { computed, ref, onMounted, onUnmounted } from "vue";

// Props
const props = defineProps({
  activityData: {
    type: Object,
    default: () => ({
      id: 0,
      title: "",
      event_address: "",
      event_end_time: "",
      event_start_time: "",
    }),
  },
  status: {
    type: String,
    default: "active",
    validator: (value) => ["active", "expired"].includes(value),
  },
});

// Emits
const emit = defineEmits(["cancel"]);

// 响应式数据
const currentTime = ref(new Date());
let timer = null;

// 生命周期
onMounted(() => {
  // 每分钟更新一次当前时间
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 60000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 计算属性
const isExpired = computed(() => props.status === "expired");

const statusClass = computed(() => props.status);

// 时间相关计算
const timeStatus = computed(() => {
  if (isExpired.value) return "expired";

  const now = currentTime.value.getTime();
  const startTime = new Date(props.activityData.event_start_time).getTime();
  const endTime = new Date(props.activityData.event_end_time).getTime();

  if (now < startTime) return "not_started";
  if (now >= startTime && now <= endTime) return "ongoing";
  return "expired";
});

const statusText = computed(() => {
  switch (timeStatus.value) {
    case "not_started":
      return "未开始";
    case "ongoing":
      return "进行中";
    case "expired":
      return "已过期";
    default:
      return "进行中";
  }
});

// 活动进度计算
const activityProgress = computed(() => {
  if (isExpired.value) return 100;

  const now = currentTime.value.getTime();
  const startTime = new Date(props.activityData.event_start_time).getTime();
  const endTime = new Date(props.activityData.event_end_time).getTime();

  if (now < startTime) return 0;
  if (now > endTime) return 100;

  const total = endTime - startTime;
  const elapsed = now - startTime;
  const progress = Math.round((elapsed / total) * 100);

  return Math.max(0, Math.min(100, progress));
});

// 方法
const handleCancel = () => {
  emit("cancel", props.activityData);
};
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
  transition: all 0.3s ease;
}

/* 过期状态整体样式 */
.activity-card.expired {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  opacity: 0.85;
}

/* 顶部装饰和状态 */
.card-header {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 16rpx 24rpx;
  position: relative;
}

.card-header.expired {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.card-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
}

.card-header.active::before {
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.status-dot.ongoing,
.status-dot.active {
  background: #4ade80;
  box-shadow: 0 0 8rpx rgba(74, 222, 128, 0.5);
  animation: pulse 2s infinite;
}

.status-dot.not_started {
  background: #fbbf24;
  box-shadow: 0 0 8rpx rgba(251, 191, 36, 0.5);
  animation: pulse 2s infinite;
}

.status-dot.expired {
  background: #d1d5db;
  box-shadow: 0 0 4rpx rgba(209, 213, 219, 0.3);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.status-text {
  font-size: 22rpx;
  color: white;
  font-weight: 500;
}

/* 过期遮罩 */
.expired-overlay {
  position: absolute;
  top: 50%;
  right: 24rpx;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.2);
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  backdrop-filter: blur(4rpx);
}

.expired-text {
  font-size: 20rpx;
  color: white;
  font-weight: 600;
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

.expired .title {
  color: #6b7280;
}

.subtitle {
  font-size: 22rpx;
  color: #6b7280;
  opacity: 0.8;
}

.expired .subtitle {
  color: #9ca3af;
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

.icon-wrapper.location.active {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
}

.icon-wrapper.date.active {
  background: linear-gradient(135deg, #fed7d7, #f56565);
}

.icon-wrapper.location.expired {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
}

.icon-wrapper.date.expired {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
}

.icon {
  font-size: 24rpx;
  filter: grayscale(0);
}

.expired .icon {
  filter: grayscale(1);
  opacity: 0.7;
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

.expired .label {
  color: #d1d5db;
}

.value {
  font-size: 24rpx;
  color: #374151;
  line-height: 1.4;
  font-weight: 500;
}

.expired .value {
  color: #9ca3af;
}

/* 参与人数信息 */
.participants-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  border: 1rpx solid #fecaca;
}

.participants-info.active {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-color: #fecaca;
}

.participants-info.expired {
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-color: #e5e7eb;
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
  border: 2rpx solid white;
  margin-right: -8rpx;
}

.avatar.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.avatar.active:nth-child(2) {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.avatar.active:nth-child(3) {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.avatar.expired {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.avatar.expired:nth-child(2) {
  background: linear-gradient(135deg, #a1a1aa, #71717a);
}

.avatar.expired:nth-child(3) {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.more {
  font-size: 18rpx;
  color: #6b7280;
  font-weight: 600;
  margin-left: 8rpx;
}

.participants-text {
  font-size: 20rpx;
  font-weight: 500;
}

.participants-info.active .participants-text {
  color: #dc2626;
}

.participants-info.expired .participants-text {
  color: #9ca3af;
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
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.action-btn:active::before {
  left: 100%;
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

/* 过期状态按钮 */
.action-btn.expired {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #6b7280;
  border: 2rpx solid #d1d5db;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
}

.action-btn.expired:active {
  transform: translateY(2rpx);
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  color: #4b5563;
}

.action-btn.archive {
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  color: #92400e;
  border: 2rpx solid #fde68a;
  box-shadow: 0 4rpx 16rpx rgba(251, 191, 36, 0.15);
}

.action-btn.archive:active {
  transform: translateY(2rpx);
  background: linear-gradient(135deg, #fde68a, #fcd34d);
  color: #78350f;
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
  border-top: 1rpx solid #dee2e6;
}

.progress-section.active {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.progress-section.expired {
  background: linear-gradient(135deg, #f1f3f4, #e8eaed);
}

.progress-bar {
  height: 8rpx;
  background: #e9ecef;
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.expired .progress-bar {
  background: #f1f3f4;
}

.progress-fill {
  height: 100%;
  border-radius: 4rpx;
}

.progress-fill.active {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  animation: progressFill 2s ease-in-out;
}

.progress-fill.expired {
  background: linear-gradient(90deg, #9ca3af, #6b7280);
  animation: progressComplete 1s ease-in-out;
}

@keyframes progressFill {
  from {
    width: 0%;
  }
}

@keyframes progressComplete {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.progress-text {
  font-size: 20rpx;
  text-align: center;
  font-weight: 500;
}

.progress-section.active .progress-text {
  color: #6c757d;
}

.progress-section.expired .progress-text {
  color: #9ca3af;
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
/* @media (prefers-color-scheme: dark) {
  .activity-card {
    background: linear-gradient(145deg, #1f2937, #111827);
    border: 1rpx solid rgba(75, 85, 99, 0.3);
  }
  
  .activity-card.expired {
    background: linear-gradient(145deg, #374151, #1f2937);
    border: 1rpx solid rgba(55, 65, 81, 0.5);
  }
  
  .title {
    color: #f9fafb;
  }
  
  .expired .title {
    color: #9ca3af;
  }
  
  .subtitle {
    color: #9ca3af;
  }
  
  .value {
    color: #e5e7eb;
  }
  
  .expired .value {
    color: #6b7280;
  }
  
  .progress-section {
    background: linear-gradient(135deg, #374151, #1f2937);
    border-top: 1rpx solid #4b5563;
  }
} */
</style>
