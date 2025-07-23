<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">政策</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 + 筛选栏 -->
    <view class="fixed-top">
      <uni-search-bar 
        @confirm="search" 
        placeholder="搜索政策或新闻" 
        v-model="searchbar" 
        @cancel="cancel">
      </uni-search-bar>
	  
	  <!-- tab切换 -->
	    <view>
	      <Tabswitch v-model="activeTab" />
	  
	      <view v-if="activeTab === 'policy'">
	        <!-- 政府政策内容 -->
	      </view>
	      <view v-else>
	        <!-- 行业新闻内容 -->
	      </view>
	    </view>
	  

      <view class="filter-wrapper">
        <view class="filter-bar">
          <!-- 领域筛选 -->
          <view class="filter-item" @click="toggleDropdown('domain')">
            {{ selectedDomain.field_name || '全部领域' }}
            <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
          </view>

          <!-- 时间筛选 -->
          <view class="filter-item" @click="toggleDropdown('time')">
            {{ selectedTime }}
            <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
          </view>
        </view>

        <!-- 领域下拉 -->
        <view v-if="currentDropdown === 'domain'" class="dropdown-list">
          <view 
            class="dropdown-item" 
            @click="selectOption('domain', null)" 
            :class="{ selected: selectedDomain.field_id === 0 }">
            全部
          </view>
          <view 
            class="dropdown-item" 
            v-for="item in field.fieldlist" 
            :key="item.field_id"
            @click="selectOption('domain', item)" 
            :class="{ selected: selectedDomain.field_id === item.field_id }">
            {{ item.field_name }}
          </view>
        </view>

        <!-- 时间下拉 -->
        <view v-if="currentDropdown === 'time'" class="dropdown-list">
          <view 
            class="dropdown-item" 
            v-for="item in timeList" 
            :key="item"
            @click="selectOption('time', item)" 
            :class="{ selected: selectedTime === item }">
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <!-- 政策列表 -->
	 <view v-if="activeTab === 'policy'">
    <scroll-view class="news-scroll" scroll-y="true" @scrolltolower="loadMore">
      <view>
        <uni-card 
          v-for="item in listarticles.listpolicy" 
          :key="item.article_id"
          :title="item.article_title" 
          :extra="Dataformat(item.release_time)"
          @click="OnClick(item.article_id)">
          <text>{{ item.brief_content }}</text>
        </uni-card>

        <view v-if="listarticles.loading" class="loading">加载中...</view>
        <view v-else-if="!listarticles.hasMore" class="no-more">没有更多内容</view>
      </view>
    </scroll-view>
	</view>
	<!-- 新闻列表 -->
	<view v-else>
	  <scroll-view class="news-scroll" scroll-y="true" @scrolltolower="loadMore">
	    <view>
	      <uni-card
	        v-for="item in listarticles.listnew"
	        :key="item.article_id"
	        :title="item.article_title"
	        :extra="Dataformat(item.release_time)"
	        :thumbnail="item.list_image_url"
	        @click="OnClick(item.article_id)">
	        <text class="uni-body">{{ item.brief_content }}</text>
	      </uni-card>
	      <view v-if="listarticles.loading" class="loading">加载中...</view>
	      <view v-else-if="!listarticles.hasMore" class="no-more">没有更多内容</view>
	    </view>
	  </scroll-view>
	  
	</view>
	
	
  </view>
</template>


<script setup>
import { ref, onMounted,watch } from 'vue'
import {useArticlesStore} from '@/store/Articles.js'

import { usefieldstore } from '@/store/field.js'
import { Dataformat } from '../../utils/data'
import { onShow } from '@dcloudio/uni-app'
import Tabswitch from '@/components/Tabswitch/Tabswitch.vue'

const listarticles = useArticlesStore()
const field = usefieldstore()

const activeTab = ref('policy')

// 搜索栏
const searchbar = ref("")

// 当前打开的下拉框
const currentDropdown = ref(null)

// 是否精选
const isselected=ref(0)

// 初始值设为“全部”
const selectedDomain = ref({ field_id: 0, field_name: '全部' })
const selectedTime = ref('发布时间')

// 时间列表
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

// 定义参数查询的结构体
const Params = { 
  field_id: 0,
  page: 0,
  is_selection: 0,
  article_title: "",
  release_time:"",
  article_type:activeTab.value.toUpperCase()
};

// 监视器，监控activeTab的变化
watch(activeTab, (newVal, oldVal) => {
  console.log('Tab 变化:', oldVal, '=>', newVal)
  if (newVal === 'news') {
    listarticles.resetpage(1)
	Params.article_type="NEWS"
  } else if (newVal === 'policy') {
    listarticles.resetpage(1)
	Params.article_type="POLICY"
  }
})

// 搜索
function search() {
	Params.article_title=searchbar.value
	Params.page=1
  listarticles.getlistpolicy(Params)
  console.log("搜索关键词:", searchbar.value)
}

// 取消搜索
function cancel() {
  searchbar.value = ""
  Params.page=1
  Params.article_title=searchbar.value
  listarticles.getlistpolicy(Params)
}

// 加载更多
function loadMore() {
 Params.page=listarticles.page+1
listarticles.getarticlemore(Params)
  console.log("到底了")
}

// 切换下拉框
function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

// 选择筛选项
function selectOption(type, value) {
  if (type === 'domain') {
    if (value === null) {
      selectedDomain.value = { field_id: 0, field_name: '全部' }
	  Params.page=1
	  Params.field_id=selectedDomain.value.field_id
      listarticles.getlistpolicy(Params)
    } else {
      selectedDomain.value = value
	  Params.page=1
	  Params.field_id=selectedDomain.value.field_id
      listarticles.getlistpolicy(Params)
    }
  }

  if (type === 'time') {
    selectedTime.value = value
  }

  currentDropdown.value = null
}

// 跳转详情
function OnClick(id) {
	console.log("测试的Id:"+id)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${id}`
  })
}
// 在页面显示时判断来源
onShow(() => {
  const source = uni.getStorageSync('tabSource') || 'tabbar'
		field.getfield()
  if (source === 'switchTab') {
    console.log('来源：通过 uni.switchTab() 跳转');
	Params.is_selection=1
	Params.page=1
	listarticles.getlistpolicy(Params)
	Params.article_type="NEWS"
	listarticles.getlistpolicy(Params)
	Params.article_type=activeTab.value.toUpperCase()
  } else {
    console.log('来源：用户点击 tabBar 进入');
	isselected.value=0
	Params.page=1
	listarticles.getlistpolicy(Params)
	Params.article_type="NEWS"
	listarticles.getlistpolicy(Params) 
	Params.article_type=activeTab.value.toUpperCase()
  }

  // 清除标记，避免干扰下一次跳转
  uni.removeStorageSync('tabSource')
})

</script>

<style>
@import url("../../style/new_policy.css");
.dropdown-list {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4rpx;
  margin-top: 10rpx;
}

.dropdown-item {
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.dropdown-item.selected {
  background-color: #f0f0f0;
  font-weight: bold;
}

.filter-item {
  /* padding: 20rpx;
  font-size: 30rpx; */
   padding: 12rpx 20rpx;
   font-size: 30rpx;
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.arrow.open {
  transform: rotate(180deg);
}
.loading,
.no-more {
  text-align: center;
  color: #999;
  padding: 20rpx;
}

</style>