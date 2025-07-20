<template>
  <view class="tab-bar">
    <view
      id="tab-policy"
      class="tab-item"
      :class="{ active: currentTab === 'policy' }"
      @click="changeTab('policy')"
    >
      政府政策
    </view>
    <view
      id="tab-news"
      class="tab-item"
      :class="{ active: currentTab === 'news' }"
      @click="changeTab('news')"
    >
      行业新闻
    </view>
    <view class="tab-indicator" :style="indicatorStyle"></view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

// props & emits
const props = defineProps({
  modelValue: {
    type: String,
    default: 'policy'
  }
})
const emit = defineEmits(['update:modelValue'])

const currentTab = ref(props.modelValue)
watch(() => props.modelValue, val => {
  currentTab.value = val
  updateIndicator()
})

// 切换 tab 时更新状态并通知父组件
function changeTab(tab) {
  if (tab !== currentTab.value) {
    currentTab.value = tab
    emit('update:modelValue', tab)
    updateIndicator()
  }
}

// 动态滑块样式
const indicatorStyle = ref({})

// 更新滑块位置
function updateIndicator() {
  nextTick(() => {
    const id = currentTab.value === 'policy' ? '#tab-policy' : '#tab-news'
    uni.createSelectorQuery()
      .in(uni)
      .select(id)
      .boundingClientRect(rect => {
        if (rect) {
          indicatorStyle.value = {
            width: rect.width + 'px',
            left: rect.left + 'px'
          }
        }
      })
      .exec()
  })
}

onMounted(() => {
  updateIndicator()
})
</script>

<style scoped>
.tab-bar {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80rpx;
  border-bottom: 1rpx solid #e5e5e5;
  background-color: #ffffff;
  padding-bottom: 10rpx;
}

.tab-item {
  font-size: 30rpx;
  font-weight: bold;
  color: #999999;
  padding: 10rpx 20rpx;
}

.tab-item.active {
  color: #e60012;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 6rpx;
  background-color: #e60012;
  border-radius: 6rpx;
  transition: all 0.3s ease;
}
</style>
