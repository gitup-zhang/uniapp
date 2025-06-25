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
          <!-- 领域筛选 -->
          <view class="filter-item" @click="toggleDropdown('domain')">
            {{ selectedDomain?.field_name || '全部领域' }}
            <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
          </view>

          <!-- 时间筛选 -->
          <view class="filter-item" @click="toggleDropdown('time')">
            {{ selectedTime }}
            <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
          </view>
        </view>

        <!-- 领域下拉菜单 -->
        <view v-if="currentDropdown === 'domain'" class="dropdown-list">
          <!-- 全部选项 -->
          <view 
            class="dropdown-item" 
            @click="selectOption('domain', null)" 
            :class="{ selected: selectedDomain === null }"
          >
            全部
          </view>
          <!-- 具体领域项 -->
          <view 
            class="dropdown-item" 
            v-for="item in field.fieldlist" 
            :key="item.field_id"
            @click="selectOption('domain', item)" 
            :class="{ selected: selectedDomain?.field_id === item.field_id }"
          >
            {{ item.field_name }}
          </view>
        </view>

        <!-- 时间下拉菜单 -->
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
    </view>

    <!-- 新闻列表区域 -->
    <scroll-view class="news-scroll" scroll-y="true">
      <view>
        <uni-card
          v-for="item in listnew.listnew"
          :key="item.id"
          :title="item.new_title"
          :extra="Dataformat(item.release_time)"
          :thumbnail="item.list_image_url"
          @click="onClick(item.id)"
        >
          <text class="uni-body">{{ item.brief_content }}</text>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewStore } from '../../store/NewList'
import { usefieldstore } from '../../store/field.js'
import { Dataformat } from '../../utils/data'

// 从 Pinia 获取 store
const listnew = useNewStore()
const field = usefieldstore()

// 搜索框内容
const searchbar = ref("")

// 当前打开的下拉框类型（'domain' | 'time'）
const currentDropdown = ref(null)

// 当前选中的领域（对象或 null）和时间（字符串）
const selectedDomain = ref(null)
const selectedTime = ref('发布时间')

// 时间列表
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

// 搜索
function search() {
  listnew.searchnewlist({ newTitle: searchbar.value })
  console.log("搜索关键词:", searchbar.value)
}

// 取消搜索
function cancel() {
  searchbar.value = ""
  listnew.getlistnew()
}

// 切换下拉框显示
function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

// 选择选项后处理
function selectOption(type, value) {
  if (type === 'domain') {
    selectedDomain.value = value
    if (value === null) {
      console.log("选中全部领域")
      listnew.getlistnew()
      
    } else {
	listnew.searchnewlist({ 'fieldID': value.field_id})
		
      console.log("选中领域ID:", value.field_id)
      // 可选：根据字段筛选
      // listnew.searchnewlist({ fieldId: value.field_id })
    }
  }

  if (type === 'time') {
    selectedTime.value = value
  }

  currentDropdown.value = null
}

// 点击新闻项跳转详情页
function onClick(id) {
  uni.navigateTo({
    url: `/pages/detail/detailnew?id=${id}`
  })
}

// 页面挂载时加载新闻和领域列表
onMounted(() => {
  listnew.getlistnew()
  field.getfield()
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
</style>
