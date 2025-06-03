<template>  
  <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
    <template v-slot:left>
      <view class="navbar-title">新闻</view>
    </template>
  </uni-nav-bar>

  <uni-search-bar 
    @confirm="search" 
    placeholder="搜索行业新闻" 
    v-model="searchbar" 
    @cancel="cancel">
  </uni-search-bar>

  <uni-segmented-control
    :current="current"
    :values="value"
    @clickItem="onClickItem"
    styleType="text"
    activeColor="#ff0000"
  ></uni-segmented-control>

  <!-- 主容器 -->
  <view class="container">
    <!-- 筛选容器：用于相对定位 -->
    <view class="filter-wrapper">
      <view class="filter-bar">
        <view class="filter-item" @click="toggleDropdown('domain')">
          {{ selectedDomain }}
          <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
        </view>
        <view class="filter-item" @click="toggleDropdown('time')">
          {{ selectedTime }}
          <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
        </view>
      </view>

      <!-- 下拉菜单：政策领域 -->
      <view v-if="currentDropdown === 'domain'" class="dropdown-list">
        <view
          class="dropdown-item"
          v-for="item in domainList"
          :key="item"
          @click="selectOption('domain', item)"
          :class="{ selected: selectedDomain === item }"
        >
          {{ item }}
        </view>
      </view>

      <!-- 下拉菜单：发布时间 -->
      <view v-if="currentDropdown === 'time'" class="dropdown-list">
        <view
          class="dropdown-item"
          v-for="item in timeList"
          :key="item"
          @click="selectOption('time', item)"
          :class="{ selected: selectedTime === item }"
        >
          {{ item }}
        </view>
      </view>
    </view>

    <!-- 新闻卡片列表 -->
<uni-card title="基础卡片" sub-title="副标题" extra="额外信息" thumbnail="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" @click="onClick" v-for="item in 10">
				<text class="uni-body">这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
			</uni-card>
  </view>
</template>
<script setup>
import { ref, computed } from 'vue'

// 搜索栏
const searchbar = ref("")

function search() {
  console.log("搜索关键词:", searchbar.value)
}

function cancel() {
  searchbar.value = ""
}

// 分段器
const current = ref(0)
const classify = [
  { key: "all", value: "全部" },
  { key: "k1", value: "分类1" },
  { key: "k2", value: "分类2" }
]
const value = computed(() => classify.map(item => item.value))
function onClickItem(e) {
  current.value = e.currentIndex
}

// 下拉筛选逻辑
const currentDropdown = ref(null)
const selectedDomain = ref('新闻领域')
const selectedTime = ref('发布时间')

const domainList = ['全部', '教育', '科技', '医疗']
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

function selectOption(type, value) {
  if (type === 'domain') {
    selectedDomain.value = value
  } else if (type === 'time') {
    selectedTime.value = value
  }
  currentDropdown.value = null
}
// 点击新闻跳转
function onClick(){
	//在起始页面跳转到test.vue页面并传递参数
	uni.navigateTo({
		url: '/pages/detail/detailnew'
	});

}
</script>
<style scoped>
/* 导航栏 */
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-align: left;
}

/* 页面容器 */
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 筛选包裹容器：用于相对定位 */
.filter-wrapper {
  position: relative;
  z-index: 1;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

/* 筛选项 */
.filter-item {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-right: 40rpx;
}

/* 下拉箭头 */
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

/* 下拉列表浮动样式 */
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 10rpx 0;
  border-top: 1rpx solid #eee;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* 下拉项 */
.dropdown-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}

/* 选中状态 */
.dropdown-item.selected {
  color: #007aff;
  font-weight: bold;
}
</style>
