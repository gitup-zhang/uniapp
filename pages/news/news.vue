<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">新闻</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 -->
    <uni-search-bar 
      @confirm="search" 
      placeholder="搜索行业新闻" 
      v-model="searchbar" 
      @cancel="cancel">
    </uni-search-bar>

    <!-- 主体内容区域 -->
    <view class="container">
      <!-- 筛选区域 -->
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
          <view class="dropdown-item" v-for="item in domainList" :key="item"
            @click="selectOption('domain', item)" :class="{ selected: selectedDomain === item }">
            {{ item }}
          </view>
        </view>

        <!-- 下拉菜单：发布时间 -->
        <view v-if="currentDropdown === 'time'" class="dropdown-list">
          <view class="dropdown-item" v-for="item in timeList" :key="item"
            @click="selectOption('time', item)" :class="{ selected: selectedTime === item }">
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 新闻列表滚动区域 -->
      <scroll-view class="news-scroll" scroll-y="true">
        <view>
 
          		<uni-card
          		  v-for="item in 10"
          		  :key="item"
          		  title="基础卡片"
          		  sub-title="副标题"
          		  extra="额外信息"
          		  thumbnail="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg"
          		  @click="onClick"
          		>
          		  <text class="uni-body">
          		    这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。
          		  </text>
          		</uni-card>
  
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'

const searchbar = ref("")
const currentDropdown = ref(null)
const selectedDomain = ref('新闻领域')
const selectedTime = ref('发布时间')

const domainList = ['全部', '教育', '科技', '医疗']
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

function search() {
  console.log("搜索关键词:", searchbar.value)
}

function cancel() {
  searchbar.value = ""
}

function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

function selectOption(type, value) {
  if (type === 'domain') selectedDomain.value = value
  if (type === 'time') selectedTime.value = value
  currentDropdown.value = null
}

function onClick() {
  uni.navigateTo({
    url: '/pages/detail/detailnew'
  })
}
</script>
<style>
	.page {
	  display: flex;
	  flex-direction: column;
	  height: 100vh;
	  overflow: hidden;
	}
	
	/* 页面主容器 */
	.container {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  overflow: hidden;
	  background-color: #f5f5f5;
	}
	
	/* 滚动区域 */
	.news-scroll {
	  flex: 1;
	  overflow-y: scroll;
	}
	
	/* 导航栏标题 */
	.navbar-title {
	  font-size: 20px;
	  font-weight: bold;
	  color: white;
	  margin-bottom: 10px;
	  text-align: left;
	}
	
	/* 筛选容器 */
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
	
	/* 筛选项样式 */
	.filter-item {
	  display: flex;
	  align-items: center;
	  font-size: 30rpx;
	  color: #333;
	  font-weight: bold;
	  margin-right: 40rpx;
	}
	
	/* 下拉箭头样式 */
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
	
	/* 下拉列表样式 */
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
	
	.dropdown-item.selected {
	  color: #007aff;
	  font-weight: bold;
	}
</style>