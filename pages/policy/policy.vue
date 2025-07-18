<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">新闻</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 + 筛选栏 -->
    <view class="fixed-top">
      <uni-search-bar 
        @confirm="search" 
        placeholder="搜索行业新闻" 
        v-model="searchbar" 
        @cancel="cancel">
      </uni-search-bar>

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

    <!-- 新闻列表 -->
    <scroll-view class="news-scroll" scroll-y="true" @scrolltolower="loadMore">
      <view>
        <uni-card 
          v-for="item in listpolicy.listpolicy" 
          :key="item.id"
          :title="item.policy_title" 
          :extra="Dataformat(item.release_time)"
          @click="OnClick(item.id)">
          <text>{{ item.brief_content }}</text>
        </uni-card>

        <view v-if="listpolicy.loading" class="loading">加载中...</view>
        <view v-else-if="!listpolicy.hasMore" class="no-more">没有更多内容</view>
      </view>
    </scroll-view>
  </view>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { usePolicyStore } from '@/store/PolicyList.js'
import { usefieldstore } from '@/store/field.js'
import { Dataformat } from '../../utils/data'
import { onShow } from '@dcloudio/uni-app'
const listpolicy = usePolicyStore()
const field = usefieldstore()

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



// 搜索
function search() {
  listpolicy.searchpolicy({ policyTitle: searchbar.value, fieldID: selectedDomain.value.field_id })
  console.log("搜索关键词:", searchbar.value)
}

// 取消搜索
function cancel() {
  searchbar.value = ""
  listpolicy.getlistpolicy({})
}

// 加载更多
function loadMore() {
  listpolicy.getmorelist({
    policyTitle: searchbar.value,
    fieldID: selectedDomain.value.field_id,
    page: listpolicy.page + 1,
	is_selection: isselected.value
  })
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
      listpolicy.getlistpolicy({})
    } else {
      selectedDomain.value = value
      listpolicy.searchpolicy({ fieldID: value.field_id })
    }
  }

  if (type === 'time') {
    selectedTime.value = value
  }

  currentDropdown.value = null
}

// 跳转详情
function OnClick(id) {
  uni.navigateTo({
    url: `/pages/detail/detailpolicy?id=${id}`
  })
}
// 在页面显示时判断来源
onShow(() => {
  const source = uni.getStorageSync('tabSource') || 'tabbar'

  if (source === 'switchTab') {
    console.log('来源：通过 uni.switchTab() 跳转');
	isselected.value=1
	listpolicy.getlistpolicy({is_selection:isselected.value})
    // 可以执行特定逻辑，比如刷新数据
  } else {
    console.log('来源：用户点击 tabBar 进入');
	isselected.value=0
	 listpolicy.getlistpolicy({})
	 field.getfield()
  }

  // 清除标记，避免干扰下一次跳转
  uni.removeStorageSync('tabSource')
})

// onMounted(() => {
//   listpolicy.getlistpolicy({})
//   field.getfield()
// })
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
