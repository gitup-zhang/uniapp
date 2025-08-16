<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#ff4757" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">咨询</view>
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
            <view class="filter-content">
              <text class="filter-icon">🏷️</text>
              <text class="filter-text">{{ selectedDomain.field_name || '全部领域' }}</text>
              <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
            </view>
          </view>

          <!-- 时间筛选 -->
          <view class="filter-item" @click="toggleDropdown('time')">
            <view class="filter-content">
              <text class="filter-icon">📅</text>
              <text class="filter-text">{{ selectedTime }}</text>
              <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
            </view>
          </view>
        </view>

        <!-- 下拉遮罩 -->
        <view v-if="currentDropdown" class="dropdown-overlay" @click="currentDropdown = null"></view>

        <!-- 领域下拉 -->
        <view v-if="currentDropdown === 'domain'" class="dropdown-list">
          <view class="dropdown-header">选择领域</view>
          <view 
            class="dropdown-item" 
            @click="selectOption('domain', null)" 
            :class="{ selected: selectedDomain.field_id === 0 }">
            <text class="item-icon">🌍</text>
            <text class="item-text">全部</text>
            <text v-if="selectedDomain.field_id === 0" class="check-icon">✓</text>
          </view>
          <view 
            class="dropdown-item" 
            v-for="item in field.fieldlist" 
            :key="item.field_id"
            @click="selectOption('domain', item)" 
            :class="{ selected: selectedDomain.field_id === item.field_id }">
            <text class="item-icon">📋</text>
            <text class="item-text">{{ item.field_name }}</text>
            <text v-if="selectedDomain.field_id === item.field_id" class="check-icon">✓</text>
          </view>
        </view>

        <!-- 时间下拉 -->
        <view v-if="currentDropdown === 'time'" class="dropdown-list">
          <view class="dropdown-header">选择时间</view>
          <view 
            class="dropdown-item" 
            v-for="item in timeList" 
            :key="item"
            @click="selectOption('time', item)" 
            :class="{ selected: selectedTime === item }">
            <text class="item-icon">⏰</text>
            <text class="item-text">{{ item }}</text>
            <text v-if="selectedTime === item" class="check-icon">✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 政策列表 -->
	 <view v-if="activeTab === 'policy'">
      <scroll-view 
        class="news-scroll" 
        scroll-y="true" 
        @scrolltolower="loadMore"
        :refresher-enabled="true"
        @refresherrefresh="onRefresh"
        :refresher-triggered="refreshTriggered">
        
        <view v-if="!initialLoading">
          <!-- 有数据时显示列表 -->
          <view v-if="listarticles.listpolicy.length > 0">
            <ArticlePolicyVue 
              v-for="item in listarticles.listpolicy" 
              :key="item.article_id"
              :policyData="item"
              @click="handlePolicyClick" />
          </view>
          
          <!-- 空状态 -->
          <view v-else class="empty-state">
            <view class="empty-icon">📋</view>
            <view class="empty-title">暂无政策信息</view>
            <view class="empty-desc">{{ getEmptyMessage() }}</view>
            <view class="empty-action" @click="resetFilters">
              <text>重置筛选</text>
            </view>
          </view>
        </view>

        <!-- 初始加载状态 -->
        <view v-if="initialLoading" class="initial-loading">
          <view class="loading-spinner"></view>
          <view class="loading-text">加载中...</view>
        </view>

        <!-- 底部加载更多状态 -->
        <view v-if="!initialLoading && listarticles.listpolicy.length > 0" class="load-more-container">
          <view v-if="listarticles.loading" class="loading-more">
            <view class="loading-spinner-small"></view>
            <text>加载更多...</text>
          </view>
          <view v-else-if="!listarticles.hasMore" class="no-more">
            <view class="no-more-line"></view>
            <text>已加载全部内容</text>
            <view class="no-more-line"></view>
          </view>
        </view>
      </scroll-view>
	</view>

	<!-- 新闻列表 -->
	<view v-else>
	  <scroll-view 
      class="news-scroll" 
      scroll-y="true" 
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshTriggered">
      
      <view v-if="!initialLoading">
        <!-- 有数据时显示列表 -->
        <view v-if="listarticles.listnew.length > 0">
          <ArticleCard 
            v-for="item in listarticles.listnew" 
            :key="item.article_id"
            :newsData="item"
            @click="handleNewsClick" />
        </view>
        
        <!-- 空状态 -->
        <view v-else class="empty-state">
          <view class="empty-icon">📰</view>
          <view class="empty-title">暂无新闻信息</view>
          <view class="empty-desc">{{ getEmptyMessage() }}</view>
          <view class="empty-action" @click="resetFilters">
            <text>重置筛选</text>
          </view>
        </view>
      </view>

      <!-- 初始加载状态 -->
      <view v-if="initialLoading" class="initial-loading">
        <view class="loading-spinner"></view>
        <view class="loading-text">加载中...</view>
      </view>

      <!-- 底部加载更多状态 -->
      <view v-if="!initialLoading && listarticles.listnew.length > 0" class="load-more-container">
        <view v-if="listarticles.loading" class="loading-more">
          <view class="loading-spinner-small"></view>
          <text>加载更多...</text>
        </view>
        <view v-else-if="!listarticles.hasMore" class="no-more">
          <view class="no-more-line"></view>
          <text>已加载全部内容</text>
          <view class="no-more-line"></view>
        </view>
      </view>
    </scroll-view>
	</view>
  </view>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import {useArticlesStore} from '@/store/Articles.js'
import { usefieldstore } from '@/store/field.js'
import { Dataformat,formatDate,getLastWeekDate,getLastMonthDate,getLastYearDate } from '../../utils/data'
import { onShow } from '@dcloudio/uni-app'
import Tabswitch from '@/components/Tabswitch/Tabswitch.vue'
import ArticleCard from '@/components/ArticleCard/ArticleCard.vue'
import ArticlePolicyVue from '../../components/ArticleCard/ArticlePolicy.vue'

const listarticles = useArticlesStore()
const field = usefieldstore()

const activeTab = ref('policy')

// 搜索栏
const searchbar = ref("")

// 当前打开的下拉框
const currentDropdown = ref(null)

// 是否精选
const isselected=ref(0)

// 初始加载状态
const initialLoading = ref(false)

// 下拉刷新状态
const refreshTriggered = ref(false)

// 初始值设为"全部"
const selectedDomain = ref({ field_id: 0,field_code: "", field_name: '全部' })
const selectedTime = ref('发布时间')

// 时间列表
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

// 定义参数查询的结构体
const Params = { 
  field_type: "",
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
	resetFilters()
	Params.article_type="NEWS"
  } else if (newVal === 'policy') {
    listarticles.resetpage(1)
	resetFilters()
	Params.article_type="POLICY"
  }
})

// 获取空状态提示文案
function getEmptyMessage() {
  if (searchbar.value) {
    return `未找到与"${searchbar.value}"相关的内容，试试其他关键词吧`
  }
  if (selectedDomain.value.field_id !== 0 || selectedTime.value !== '全部') {
    return '当前筛选条件下暂无内容，试试调整筛选条件'
  }
  return '暂时还没有内容，请稍后再来看看'
}

// 重置筛选条件
function resetFilters() {
  searchbar.value = ""
  selectedDomain.value = { field_id: 0,field_code: "", field_name: '全部' }
  selectedTime.value = '全部'
  
  // 重置参数
  Params.article_title = ""
  Params.field_type = ""
  Params.release_time = ""
  Params.page = 1
  
  // 重新加载数据
  loadData()
}

// 下拉刷新
async function onRefresh() {
  refreshTriggered.value = true
  Params.page = 1
  
  try {
    await listarticles.getlistpolicy(Params)
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    refreshTriggered.value = false
  }
}

// 统一的数据加载方法
async function loadData() {
  initialLoading.value = true
  try {
    await listarticles.getlistpolicy(Params)
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    initialLoading.value = false
  }
}

// 搜索
function search() {
	Params.article_title=searchbar.value
	Params.page=1
  loadData()
  console.log("搜索关键词:", searchbar.value)
}

// 取消搜索
function cancel() {
  searchbar.value = ""
  Params.page=1
  Params.article_title=searchbar.value
  loadData()
}

// 加载更多
function loadMore() {
  if (listarticles.loading || !listarticles.hasMore) {
    return
  }
  
  Params.page = listarticles.page + 1
  listarticles.getarticlemore(Params)
  console.log("加载更多，当前页码:", Params.page)
}

// 切换下拉框
function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

// 选择筛选项
function selectOption(type, value) {
  if (type === 'domain') {
    if (value === null) {
      selectedDomain.value = { field_id: 0,field_code: "", field_name: '全部' }
	  Params.page=1
	  Params.field_type=selectedDomain.value.field_code
      loadData()
    } else {
		console.log("value值：",value)
      selectedDomain.value = value
	  Params.page=1
	  Params.field_type=selectedDomain.value.field_code
	  console.log("params:",Params)
      loadData()
    }
  }

  if (type === 'time') {
	  console.log(value)
    selectedTime.value = value
	if (value === '最近一周') {
	      Params.release_time = getLastWeekDate();
	    } else if (value === '最近一月') {
	      Params.release_time = getLastMonthDate();
	    } else if (value === '最近一年') {
	      Params.release_time = getLastYearDate();
	    } else {
	      Params.release_time = '';
	    }
	
	    Params.page = 1;
	    loadData()
  }

  currentDropdown.value = null
}

// 处理政策点击
const handlePolicyClick = (policyItem) => {
  console.log('点击了政策:', policyItem)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${policyItem.article_id}`
  })
}

// 处理新闻点击
const handleNewsClick = (newsItem) => {
  console.log('点击了新闻:', newsItem.article_id)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${newsItem.article_id}`
  })
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
	loadData()
	Params.article_type="NEWS"
	loadData()
	Params.article_type=activeTab.value.toUpperCase()
  } else {
    console.log('来源：用户点击 tabBar 进入');
	isselected.value=0
	Params.page=1
	loadData()
	Params.article_type="NEWS"
	loadData()
	Params.article_type=activeTab.value.toUpperCase()
  }

  // 清除标记，避免干扰下一次跳转
  uni.removeStorageSync('tabSource')
})

</script>

<style>
.page {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 固定顶部区域（搜索 + 筛选） */
.fixed-top {
  position: fixed;
  top: 178rpx;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #ffffff;
  padding-bottom: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 滚动区域 */
.news-scroll {
  position: fixed;
  top: calc(178rpx + 260rpx);
  bottom: var(--window-bottom);
  left: 0;
  right: 0;
  overflow-y: scroll;
  padding: 5rpx;
  background-color: #f5f5f5;
}

/* 导航栏标题 */
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

/* 筛选区域 */
.filter-wrapper {
  position: relative;
  z-index: 1;
}

.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: #fff;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 16rpx;
  border: 2rpx solid #e8e8ff;
  transition: all 0.3s ease;
}

.filter-item.active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #f0f2ff 0%, #e8e8ff 100%);
}

.filter-content {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  gap: 12rpx;
}

.filter-content .filter-icon {
  font-size: 28rpx;
}

.filter-content .filter-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 10rpx solid #666;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* 下拉遮罩 */
.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 98;
}

/* 下拉列表 */
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 20rpx;
  right: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  z-index: 99;
  max-height: 600rpx;
  overflow-y: auto;
}

.dropdown-list .dropdown-header {
  padding: 20rpx 24rpx 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
  border-bottom: 1rpx solid #f0f0f0;
}

.dropdown-list .dropdown-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  gap: 16rpx;
  transition: background-color 0.2s ease;
}

.dropdown-list .dropdown-item:active {
  background: #f5f5f5;
}

.dropdown-list .dropdown-item.selected {
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
}

.dropdown-list .dropdown-item.selected .item-text {
  color: #667eea;
  font-weight: 600;
}

.dropdown-list .dropdown-item .item-icon {
  font-size: 24rpx;
}

.dropdown-list .dropdown-item .item-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.dropdown-list .dropdown-item .check-icon {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 700;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
  text-align: center;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 40rpx;
}

.empty-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.empty-action:active {
  transform: scale(0.95);
}

/* 初始加载状态 */
.initial-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
  text-align: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
  margin-top: 20rpx;
}

/* 底部加载更多容器 */
.load-more-container {
  padding: 20rpx;
}

/* 加载更多状态 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 20rpx;
  color: #666;
  font-size: 28rpx;
}

.loading-spinner-small {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #f3f3f3;
  border-top: 2rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 没有更多内容 */
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}

.no-more-line {
  flex: 1;
  height: 1rpx;
  background: #e5e5e5;
  max-width: 120rpx;
}

/* 旋转动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>