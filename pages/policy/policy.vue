<template>
  <view class="container">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @click="toggleDropdown('domain')">
        政策领域
        <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
      </view>
      <view class="filter-item" @click="toggleDropdown('time')">
        发布时间
        <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
      </view>
    </view>

    <!-- 下拉列表 -->
    <view v-if="currentDropdown === 'domain'" class="dropdown-list">
      <view class="dropdown-item" v-for="item in domainList" :key="item">{{ item }}</view>
    </view>
    <view v-if="currentDropdown === 'time'" class="dropdown-list">
      <view class="dropdown-item" v-for="item in timeList" :key="item">{{ item }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const currentDropdown = ref(null)
const domainList = ['教育', '科技', '医疗']
const timeList = ['最近一周', '最近一月', '最近一年']

function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 筛选栏样式 */
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-right: 40rpx;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 12rpx solid #999;
  margin-left: 10rpx;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.dropdown-list {
  background-color: #fff;
  padding: 10rpx 0;
  border-top: 1rpx solid #eee;
}

.dropdown-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}
</style>
