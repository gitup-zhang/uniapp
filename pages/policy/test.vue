<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px', height: navbarHeight + 'px' }">
      <image class="navbar-bg" src="/static/Background 4.png" mode="aspectFill" />
      <view class="navbar-title">政府政策与行业新闻助手</view>
    </view>

    <!-- 固定顶部区域（搜索栏 + Tab栏） -->
    <view class="fixed-top">
      <!-- 搜索栏 -->
      <uni-search-bar
        v-model="searchValue"
        placeholder="请输入关键词搜索"
        @confirm="onSearch"
      />

      <!-- Tab 切换栏 -->
      <view class="tab-bar">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'policy' }"
          @click="activeTab = 'policy'"
        >
          政府政策
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'news' }"
          @click="activeTab = 'news'"
        >
          行业新闻
        </view>
        <view
          class="tab-indicator"
          :style="{ left: activeTab === 'policy' ? '0%' : '50%' }"
        ></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view v-if="activeTab === 'policy'">
        <!-- 政策内容示例 -->
        <view v-for="item in policyList" :key="item.id" class="card">
          <view class="title">{{ item.title }}</view>
          <view class="desc">{{ item.description }}</view>
        </view>
      </view>

      <view v-else>
        <!-- 新闻内容示例 -->
        <view v-for="item in newsList" :key="item.id" class="card">
          <view class="title">{{ item.title }}</view>
          <view class="desc">{{ item.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const statusBarHeight = ref(20)
const navbarHeight = ref(70)
const searchValue = ref('')
const activeTab = ref('policy')

// 示例内容列表
const policyList = ref([
  { id: 1, title: '政策1', description: '这是一个关于政府政策的内容。' },
  { id: 2, title: '政策2', description: '另一个政策内容展示。' }
])

const newsList = ref([
  { id: 1, title: '新闻1', description: '这是一个行业新闻。' },
  { id: 2, title: '新闻2', description: '第二条新闻内容。' }
])

const onSearch = () => {
  console.log('搜索关键词：', searchValue.value)
  // 可根据 activeTab.value 调用不同搜索接口
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight
  navbarHeight.value = systemInfo.statusBarHeight + 80
})
</script>

<style scoped>
.container {
  width: 100%;
  overflow: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  z-index: 1000;
  overflow: hidden;
}

.navbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.fixed-top {
  position: fixed;
  top: calc(20px + 80px); /* statusBarHeight + 导航栏高度估值 */
  width: 100%;
  background-color: #fff;
  z-index: 999;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

/* Tab 样式 */
.tab-bar {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-bottom: 2rpx solid #eee;
  padding: 20rpx 0;
}

.tab-item {
  font-size: 32rpx;
  font-weight: bold;
  color: #999;
  padding-bottom: 10rpx;
}

.tab-item.active {
  color: #e60012;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 25%;
  height: 6rpx;
  background-color: #e60012;
  border-radius: 6rpx;
  transition: left 0.3s ease;
}

/* 内容区域样式 */
.content {
  padding-top: calc(20px + 80px + 100px); /* statusBar + navbar + tab-bar 预留空间 */
  padding-bottom: 40rpx;
  background-color: #f8f8f8;
}

/* 卡片样式 */
.card {
  background-color: #fff;
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.card .title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.card .desc {
  font-size: 28rpx;
  color: #666;
}
</style>
