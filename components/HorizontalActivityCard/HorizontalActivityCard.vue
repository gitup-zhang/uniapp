<template>
  <view class="horizontal-card" @click="handleClick">
    <!-- 左侧图片 -->
    <image class="left-img" :src="imgSrc" mode="aspectFill" />

    <!-- 右侧信息 -->
    <view class="right-info">
      <view class="top-row">
        <text class="status-tag tag-ended">已结束</text>
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
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
defineProps({
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
  }
})
// 定义事件
const emit = defineEmits();

// 处理点击事件
function handleClick() {
	console.log('卡片点击事件触发');
  // 触发父组件的事件，传递必要的参数
  emit('click');
}
</script>

<style scoped>
.horizontal-card {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  margin: 20rpx;
  padding: 10rpx;
}

.left-img {
  width: 240rpx;
  height: 160rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.right-info {
  flex: 1;
  padding-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.top-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  flex-wrap: nowrap;
}

.status-tag {
  font-size: 20rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
  white-space: nowrap;
}

.tag-ended {
  background-color: #fef0f0;
  color: #f56c6c;
}

.title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
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
</style>
