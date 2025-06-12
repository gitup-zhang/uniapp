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

<!--  <uni-segmented-control
    :current="current"
    :values="value"
    @clickItem="onClickItem"
    styleType="text"
    activeColor="#ff0000"
  ></uni-segmented-control> -->

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


// 下拉筛选逻辑
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
@import "../../style/new_policy.css";
</style>
