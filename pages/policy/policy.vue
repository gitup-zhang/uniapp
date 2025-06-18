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
          <view class="dropdown-item" v-for="item in listpolicy.policyfieldlist" :key="item"
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
                        :title="item.policy_title" 
                        :extra="Dataformat(item.release_time)" 
                        v-for="item in listpolicy.listpolicy" 
                        :key="item.id"
                  	  @click="OnClick(item.id)"
                      >
                        <text>{{item.brief_content}}</text>
                      </uni-card>
      </view>
    </scroll-view>
  </view>
</template>


<script setup>
import { ref, computed ,onMounted} from 'vue'
import {usePolicyStore} from '@/store/PolicyList.js'
import dayjs from 'dayjs'
// 从pinia中获得对象
const listpolicy = usePolicyStore()

// 搜索栏
const searchbar = ref("")

// 下拉筛选逻辑
const currentDropdown = ref(null)
const selectedDomain = ref('政策领域')
const selectedTime = ref('发布时间')

// const domainList = ['全部', '教育', '科技', '医疗']
const timeList = ['全部', '最近一周', '最近一月', '最近一年']


onMounted(()=>{
	listpolicy.getlistpolicy()
	listpolicy.policyfield()
})

// 搜索栏函数
function search() {
 listpolicy.searchpolicy({'policyTitle':searchbar.value})
  console.log("搜索关键词:", searchbar.value)
}

function cancel() {
  searchbar.value = ""
}



// 下拉菜单函数
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
// 获取详细政策
function OnClick(id){
	uni.navigateTo({
		url: `/pages/detail/detailpolicy?id=${id}`
	});
}
// 时间格式化函数
function Dataformat(timeStr){
	return dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style>
@import url("../../style/new_policy.css");

</style>
