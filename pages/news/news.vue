<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">新闻</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 + 筛选栏固定区域 -->
    <view class="fixed-top">
      <uni-search-bar 
        @confirm="search" 
        placeholder="搜索行业新闻" 
        v-model="searchbar" 
        @cancel="cancel">
      </uni-search-bar>

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

        <!-- 下拉菜单 -->
        <view v-if="currentDropdown === 'domain'" class="dropdown-list">
          <view class="dropdown-item" v-for="item in domainList" :key="item"
            @click="selectOption('domain', item)" :class="{ selected: selectedDomain === item }">
            {{ item }}
          </view>
        </view>

        <view v-if="currentDropdown === 'time'" class="dropdown-list">
          <view class="dropdown-item" v-for="item in timeList" :key="item"
            @click="selectOption('time', item)" :class="{ selected: selectedTime === item }">
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <!-- 新闻列表区域 -->
    <scroll-view class="news-scroll" scroll-y="true">
      <view>
        <uni-card
          v-for="item in listnew.listnew"
          :key="item.id"
          :title="item.new_title"
          :extra="Dataformat(item.release_time)"
          
          thumbnail="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg"
          @click="onClick(item.id)"
        >
          <text class="uni-body">{{item.brief_content}}</text>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>


<script setup>
import { ref ,onMounted} from 'vue'
import { useNewStore } from '../../store/NewList'
import { Dataformat } from '../../utils/data'
// 从pinia中获取对象
const listnew=useNewStore()


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

function onClick(id) {
  uni.navigateTo({
    url: `/pages/detail/detailnew?id=${id}`
  })
}

// 钩子函数
onMounted(()=>{
	listnew.getlistnew()
	
})
</script>

<style>
@import url("../../style/new_policy.css");

</style>
