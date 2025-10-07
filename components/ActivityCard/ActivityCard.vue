<template>
  <view class="activity-card">
    <!-- 活动图片 -->
    <image class="cover-img" :src="imgSrc" mode="aspectFill" />
    <!-- 活动信息 -->
    <view class="info-box">
      <view class="tag-title">
        <!-- 显示活动状态标签 -->
        <text
          class="status-tag"
          :class="isStarted ? 'in-progress' : 'upcoming'"
        >
          {{ status }}
        </text>
        <text class="title" :title="title">{{ title }}</text>
      </view>
      <view class="info-line">
        <uni-icons type="calendar" size="16" color="#999" />
        <text class="info-text">{{ date }}</text>
      </view>
      <view class="info-line">
        <uni-icons type="location" size="16" color="#999" />
        <text class="info-text">{{ location }}</text>
      </view>
      <view class="info-line">
        <text class="free-tag">所需费用：{{fee}}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  isJoined: {
    type: Boolean,
    default: false
  },
  fee: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

// 计算属性：根据status判断活动是否已开始
const isStarted = computed(() => {
  return props.status === '进行中'
})
</script>

<style scoped>
.activity-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  margin: 20rpx;
}

.cover-img {
  width: 100%;
  height: 200rpx;
  display: block;
}

.info-box {
  padding: 20rpx;
}

.tag-title {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.status-tag {
  font-size: 20rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
}

/* 进行中状态样式 */
.status-tag.in-progress {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1rpx solid #91d5ff;
}

/* 即将开始状态样式 */
.status-tag.upcoming {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1rpx solid #ffd666;
}

.title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-line {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}

.info-text {
  font-size: 24rpx;
  color: #666;
  margin-left: 8rpx;
}

.free-tag {
  font-size: 22rpx;
  color: #28a745;
  margin-top: 6rpx;
}
</style>