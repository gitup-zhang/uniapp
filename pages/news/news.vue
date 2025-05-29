<template> 
	<uni-nav-bar  statusBar='true' backgroundColor='#903749' fixed="true">
		
		  <template v-slot:left>
		    <view class="navbar-title">新闻</view>
		  </template>
	</uni-nav-bar>
	

	<uni-search-bar @confirm="search" placeholder="搜索行业新闻" v-model="searchbar" @cancel="cancel"></uni-search-bar>

	<uni-segmented-control
		:current="current"
		:values="value"
		@clickItem="onClickItem"
		styleType="text"
		activeColor="#ff0000"
	></uni-segmented-control>


	<!-- 下拉框 -->
	<view class="container">
	  <!-- 筛选栏 -->
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
	
	  <!-- 下拉列表：政策领域 -->
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
	
	  <!-- 下拉列表：发布时间 -->
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
		<!-- 新闻展示列表 -->
	
	<uni-card title="基础卡片" extra="额外信息" v-for="item in 10">
		<text>这是一个基础卡片示例，此示例展示了一个标题加标题额外信息的标准卡片。</text>
	</uni-card>

	</view>


</template>

<script setup>
import { ref, computed } from 'vue'
import DetailNavbarVue from '../../components/DetailNavbar/DetailNavbar.vue'

// 搜索栏绑定值
const searchbar = ref("")

// 分段器初始值
const current = ref(0)
const classify = [
	{ key: "all", value: "全部" },
	{ key: "k1", value: "分类1" },
	{ key: "k2", value: "分类2" }
]
const value = computed(() => classify.map(item => item.value))

// 搜索栏函数
function search() {
	console.log(searchbar.value)
}
function cancel() {
	searchbar.value = ""
}

// 下拉框
const currentDropdown = ref(null)
const selectedDomain = ref('政策领域')
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

/* 下拉列表 */
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

/* 高亮选中项 */
.dropdown-item.selected {
  color: #007aff;
  font-weight: bold;
}

</style>
