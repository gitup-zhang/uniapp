<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#dc2626" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">资讯</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 + 筛选栏 -->
    <view class="fixed-top">
      <uni-search-bar 
        @confirm="handleSearch" 
        placeholder="搜索政策或新闻" 
        v-model="searchKeyword" 
        @cancel="handleSearchCancel">
      </uni-search-bar>
      
      <!-- tab切换 -->
      <view>
        <Tabswitch v-model="activeTab" />
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
            @click="handleDomainSelect(null)" 
            :class="{ selected: selectedDomain.field_id === 0 }">
            <text class="item-icon">🌍</text>
            <text class="item-text">全部</text>
            <text v-if="selectedDomain.field_id === 0" class="check-icon">✓</text>
          </view>
          <view 
            class="dropdown-item" 
            v-for="item in field.fieldlist" 
            :key="item.field_id"
            @click="handleDomainSelect(item)" 
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
            @click="handleTimeSelect(item)" 
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
        @scrolltolower="handleLoadMore"
        :refresher-enabled="true"
        @refresherrefresh="handleRefresh"
        :refresher-triggered="refreshTriggered">
        
        <view v-if="!initialLoading">
          <!-- 有数据时显示列表 -->
          <view v-if="currentList.length > 0">
            <ArticlePolicyVue 
              v-for="item in currentList" 
              :key="item.article_id"
              :policyData="item"
              @click="handlePolicyClick" />
          </view>
          
          <!-- 空状态 -->
          <view v-else class="empty-state">
            <view class="empty-icon">📋</view>
            <view class="empty-title">暂无政策信息</view>
            <view class="empty-desc">{{ getEmptyMessage() }}</view>
            <view class="empty-action" @click="handleResetFilters">
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
        <view v-if="!initialLoading && currentList.length > 0" class="load-more-container">
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
        @scrolltolower="handleLoadMore"
        :refresher-enabled="true"
        @refresherrefresh="handleRefresh"
        :refresher-triggered="refreshTriggered">
        
        <view v-if="!initialLoading">
          <!-- 有数据时显示列表 -->
          <view v-if="currentList.length > 0">
            <ArticleCard 
              v-for="item in currentList" 
              :key="item.article_id"
              :newsData="item"
              @click="handleNewsClick" />
          </view>
          
          <!-- 空状态 -->
          <view v-else class="empty-state">
            <view class="empty-icon">📰</view>
            <view class="empty-title">暂无新闻信息</view>
            <view class="empty-desc">{{ getEmptyMessage() }}</view>
            <view class="empty-action" @click="handleResetFilters">
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
        <view v-if="!initialLoading && currentList.length > 0" class="load-more-container">
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
import { ref, onMounted, watch, computed, nextTick, onUnmounted} from 'vue'
import { useArticlesStore } from '@/store/Articles.js'
import { usefieldstore } from '@/store/field.js'
import { Dataformat, formatDate, getLastWeekDate, getLastMonthDate, getLastYearDate } from '../../utils/data'
import { onShow } from '@dcloudio/uni-app'
import Tabswitch from '@/components/Tabswitch/Tabswitch.vue'
import ArticleCard from '@/components/ArticleCard/ArticleCard.vue'
import ArticlePolicyVue from '../../components/ArticleCard/ArticlePolicy.vue'

// Store 实例
const listarticles = useArticlesStore()
const field = usefieldstore()

// 核心状态
const activeTab = ref('policy')
const searchKeyword = ref("")
const currentDropdown = ref(null)
const initialLoading = ref(false)
const refreshTriggered = ref(false)

// 筛选条件
const selectedDomain = ref({ field_id: 0, field_code: "", field_name: '全部' })
const selectedTime = ref('全部')

// 时间选项
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

// 页面初始化标记
const isPageInitialized = ref(false)

// 计算当前显示的列表
const currentList = computed(() => {
  return activeTab.value === 'policy' ? listarticles.listpolicy : listarticles.listnew
})

// 构建查询参数的工具函数
const buildQueryParams = (overrides = {}) => {
  const baseParams = {
    field_type: selectedDomain.value.field_code || "",
    page: 1,
    is_selection: 0,
    article_title: searchKeyword.value || "",
    release_time: getTimeParam(),
    article_type: activeTab.value.toUpperCase(),
    ...overrides
  }
  
  console.log('构建查询参数:', baseParams)
  return baseParams
}

// 获取时间参数
const getTimeParam = () => {
  switch (selectedTime.value) {
    case '最近一周':
      return getLastWeekDate()
    case '最近一月':
      return getLastMonthDate()
    case '最近一年':
      return getLastYearDate()
    default:
      return ""
  }
}

// 统一的数据加载方法
const loadData = async (isRefresh = false, showLoading = true) => {
  try {
    if (!isRefresh && showLoading) {
      initialLoading.value = true
    }
    
    const params = buildQueryParams({ 
      page: 1,
      isRefresh 
    })
    
    console.log('开始加载数据:', { activeTab: activeTab.value, params })
    
    await listarticles.getlistpolicy(params)
    
    console.log('数据加载完成:', {
      type: activeTab.value,
      count: currentList.value.length
    })
    
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    if (!isRefresh && showLoading) {
      initialLoading.value = false
    }
  }
}

// Tab 切换处理
watch(activeTab, async (newTab, oldTab) => {
  if (!isPageInitialized.value) return
  
  console.log('Tab 切换:', oldTab, '=>', newTab)
  
  // 重置页面状态
  listarticles.resetpage(1)
  
  // 等待下一个 tick 确保状态更新完成
  await nextTick()
  
  // 加载新 tab 的数据
  await loadData(false, true)
})

// 搜索处理
const handleSearch = async () => {
  console.log('执行搜索:', searchKeyword.value)
  await loadData(false, true)
}

// 取消搜索
const handleSearchCancel = async () => {
  searchKeyword.value = ""
  await loadData(false, true)
}

// 下拉刷新
const handleRefresh = async () => {
  console.log('下拉刷新')
  refreshTriggered.value = true
  
  try {
    await loadData(true, false)
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    refreshTriggered.value = false
  }
}

// 加载更多
const handleLoadMore = async () => {
  if (listarticles.loading || !listarticles.hasMore) {
    console.log('加载更多被阻止:', { 
      loading: listarticles.loading, 
      hasMore: listarticles.hasMore 
    })
    return
  }
  
  const params = buildQueryParams({ 
    page: listarticles.page + 1 
  })
  
  console.log('加载更多:', params)
  await listarticles.getarticlemore(params)
}

// 领域筛选
const handleDomainSelect = async (domain) => {
  if (domain === null) {
    selectedDomain.value = { field_id: 0, field_code: "", field_name: '全部' }
  } else {
    selectedDomain.value = domain
  }
  
  currentDropdown.value = null
  console.log('选择领域:', selectedDomain.value)
  
  await loadData(false, true)
}

// 时间筛选
const handleTimeSelect = async (time) => {
  selectedTime.value = time
  currentDropdown.value = null
  
  console.log('选择时间:', time)
  await loadData(false, true)
}

// 重置筛选条件
const handleResetFilters = async () => {
  console.log('重置筛选条件')
  
  searchKeyword.value = ""
  selectedDomain.value = { field_id: 0, field_code: "", field_name: '全部' }
  selectedTime.value = '全部'
  
  await loadData(false, true)
}

// 切换下拉框
const toggleDropdown = (type) => {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

// 获取空状态提示文案
const getEmptyMessage = () => {
  if (searchKeyword.value) {
    return `未找到与"${searchKeyword.value}"相关的内容，试试其他关键词吧`
  }
  if (selectedDomain.value.field_id !== 0 || selectedTime.value !== '全部') {
    return '当前筛选条件下暂无内容，试试调整筛选条件'
  }
  return '暂时还没有内容，请稍后再来看看'
}

// 点击事件处理
const handlePolicyClick = (policyItem) => {
  console.log('点击政策:', policyItem)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${policyItem.article_id}`
  })
}

const handleNewsClick = (newsItem) => {
  console.log('点击新闻:', newsItem)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${newsItem.article_id}`
  })
}

// 页面显示时的处理
onShow(async () => {
  try {
    console.log('页面显示 - onShow')
    
    // 获取字段列表
    await field.getfield()
    
    // 判断页面来源
    const source = uni.getStorageSync('tabSource') || 'tabbar'
	const articlesort=uni.getStorageSync('article')||'news'
    console.log('页面来源:', source)
	console.log("文章类型",articlesort)
    
    // 如果是通过 switchTab 跳转来的，设置为精选模式并切换到新闻tab
    if (source === 'switchTab') {
		if(articlesort==='news'){
			activeTab.value = 'news'
			}else{
				activeTab.value = 'policy'
			}
       
	   
      // 这里可以设置精选参数
      // selectedDomain.value = { field_id: 1, field_code: "featured", field_name: '精选' }
    }
    
    // 清除来源标记
    uni.removeStorageSync('tabSource')
	uni.removeStorageSync('article')
    
    // 如果是首次初始化，加载数据
    if (!isPageInitialized.value) {
      console.log('首次初始化页面')
      isPageInitialized.value = true
      await loadData(false, true)
    } else {
      console.log('页面已初始化，跳过数据加载')
    }
    
  } catch (error) {
    console.error('页面初始化失败:', error)
    uni.showToast({
      title: '页面初始化失败',
      icon: 'none'
    })
  }
})

// 组件卸载时清理
onUnmounted(() => {
  console.log('页面卸载')
  isPageInitialized.value = false
})
</script>

<style>
/* 原有样式保持不变 */
.page {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

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

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

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

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 98;
}

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

.load-more-container {
  padding: 20rpx;
}

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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>