<template>
  <view class="container">
    <CustomNavbar />
    
    <!-- 功能导航区域 - 紧凑设计 -->
    <showInforVue title="服务导航">
      <template v-slot:body>
        <view class="service-grid">
          <view class="service-item" @click="handleMorearticle('policy')">
            <view class="service-icon-wrapper policy-icon">
              <image src="/static/icon/policy_index.png" class="service-icon" mode="aspectFit" />
            </view>
            <text class="service-label">政府政策</text>
          </view>

          <view class="service-item" @click="handleMorearticle('news')">
            <view class="service-icon-wrapper news-icon">
              <image src="/static/icon/new_index.png" class="service-icon" mode="aspectFit" />
            </view>
            <text class="service-label">行业新闻</text>
          </view>
          
          <view class="service-item" @click="handleMoreactivity">
            <view class="service-icon-wrapper activity-icon">
              <image src="/static/icon/convention_index.png" class="service-icon" mode="aspectFit" />
            </view>
            <text class="service-label">大会报名</text>
          </view>
        </view>
      </template>
    </showInforVue>
    
    <!-- 统计数据展示 - 紧凑卡片式设计 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-number">{{selected.policytotal}}</text>
          <text class="stats-label">政策</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{selected.newstotal}}</text>
          <text class="stats-label">新闻</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{selected.eventtotal}}</text>
          <text class="stats-label">活动</text>
        </view>
      </view>
    </view>
    
    <!-- 精选内容区域 -->
    <view class="featured-section">
      <view class="featured-card">
        <view class="featured-header">
          <view class="tab-navigation">
            <view class="tab-item" :class="{ active: currentTab === 0 }" @click="switchTab(0)">
              <text class="tab-text">热门活动</text>
            </view>
            <view class="tab-item" :class="{ active: currentTab === 1 }" @click="switchTab(1)">
              <text class="tab-text">精选政策</text>
            </view>
            <view class="tab-item" :class="{ active: currentTab === 2 }" @click="switchTab(2)">
              <text class="tab-text">精选新闻</text>
            </view>
          </view>
          <view class="more-btn" @click="handleMoreClick">
            <text class="more-text">更多</text>
            <text class="more-arrow">→</text>
          </view>
        </view>
        
        <swiper class="content-swiper" :current="currentTab" @change="onSwiperChange">
          <!-- 热门活动 -->
          <swiper-item>
            <scroll-view class="content-scroll" scroll-y="true">
              <view class="content-list">
                <template v-if="firstEight.length > 0">
                  <view class="content-item" v-for="(item,index) in firstEight" :key="item.id" @click="onclickevent(item.id)">
                    <view class="item-left">
                      <view class="item-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
                      <view class="item-content">
                        <text class="item-title">{{ item.title }}</text>
                      </view>
                    </view>
                    <view class="item-badge activity-badge">活动</view>
                  </view>
                </template>
                <template v-else>
                  <view class="empty-state">
                    <view class="empty-icon">📅</view>
                    <text class="empty-title">暂无热门活动</text>
                    <text class="empty-desc">精彩活动即将上线，敬请期待</text>
                  </view>
                </template>
              </view>
            </scroll-view>
          </swiper-item>
          
          <!-- 精选政策 -->
          <swiper-item>
            <scroll-view class="content-scroll" scroll-y="true">
              <view class="content-list">
                <template v-if="selected.policys && selected.policys.length > 0">
                  <view class="content-item" v-for="(item, index) in selected.policys" :key="item.article_id" @click="onclickactivity(item.article_id)">
                    <view class="item-left">
                      <view class="item-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
                      <view class="item-content">
                        <text class="item-title">{{ item.article_title }}</text>
                      </view>
                    </view>
                    <view class="item-badge policy-badge">政策</view>
                  </view>
                </template>
                <template v-else>
                  <view class="empty-state">
                    <view class="empty-icon">📋</view>
                    <text class="empty-title">暂无政策信息</text>
                    <text class="empty-desc">最新政策内容正在整理中</text>
                  </view>
                </template>
              </view>
            </scroll-view>
          </swiper-item>
          
          <!-- 精选新闻 -->
          <swiper-item>
            <scroll-view class="content-scroll" scroll-y="true">
              <view class="content-list">
                <template v-if="selected.news && selected.news.length > 0">
                  <view class="content-item" v-for="(item, index) in selected.news" :key="item.article_id" @click="onclickactivity(item.article_id)">
                    <view class="item-left">
                      <view class="item-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
                      <view class="item-content">
                        <text class="item-title">{{ item.article_title }}</text>
                      </view>
                    </view>
                    <view class="item-badge news-badge">新闻</view>
                  </view>
                </template>
                <template v-else>
                  <view class="empty-state">
                    <view class="empty-icon">📰</view>
                    <text class="empty-title">暂无新闻资讯</text>
                    <text class="empty-desc">更多行业资讯即将发布</text>
                  </view>
                </template>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue'

import { onShow } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
import {useNoticeStore} from '@/store/Notice.js'
import {useSelectedstore} from '@/store/Home.js'
import {useEventstore} from '@/store/Event.js'

// 获得公告对象
// const usenotice=useNoticeStore()
// 获得精选对象
const selected=useSelectedstore()
const firstEight = computed(() => selected.event.slice(0, 8));

// 当前选中的标签页
const currentTab = ref(0)



// 获取更多新闻和政策
function handleMorearticle(params){
	uni.setStorageSync('tabSource', 'switchTab');
	uni.setStorageSync('article',params)
	uni.switchTab({
		url: '../policy/policy'
	});
}

// 获取更多活动
function handleMoreactivity(){
	uni.switchTab({
		url: '../news/news'
	});
}

// 获取精选的政策和新闻信息
function onclickactivity(id){
	console.log(id)
	uni.navigateTo({
	  url: `/pages/detail/articledetail?id=${id}`
	})
}
function onclickevent(id){
	console.log(id)
	const disable = false
	uni.navigateTo({
	  url: `/pages/detail/activitydetail?id=${id}&disable=${disable}`
	})
}

// 切换标签页
function switchTab(index) {
  currentTab.value = index
}

// swiper变化事件
function onSwiperChange(e) {
  currentTab.value = e.detail.current
}

// 更多按钮点击事件
function handleMoreClick() {
 if (currentTab.value === 0) {
   handleMoreactivity() // 活动
 } else if (currentTab.value === 1) {
   handleMorearticle('policy') // 政策和新闻
 } else if (currentTab.value === 2) {
   handleMorearticle('news')
 }

}

// 初始化
onMounted(()=>{
	//usenotice.getnoticestore()
	selected.getselected()
	selected.getevent()
	//EventStore.getlisting(10)
})
onShow(()=>{
	
	//usenotice.getnoticestore()
	selected.getselected()
	selected.getevent()
	//EventStore.getlisting(10)
})

</script>

<style lang='scss'>
.container {
  padding: 0;
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8faff 0%, #f5f7fa 100%);
}

/* 服务导航区域 - 紧凑设计 */
.service-grid {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 16rpx;
}

.service-item {
  background: white;
  border-radius: 16rpx;
  padding: 28rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  flex: 1;
  position: relative;
}

.service-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.08);
}

.service-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin: 0 auto 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.policy-icon {
  background: linear-gradient(135deg, #ff6f8f, #ff9472);
}

.news-icon {
  background: linear-gradient(135deg, #1fa2ff, #12d8fa);
}

.activity-icon {
  background: linear-gradient(135deg, #90EE90, #228B22);
}

.service-icon {
  width: 36rpx;
  height: 36rpx;
}

.service-label {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}

/* 统计数据区域 - 紧凑卡片式设计 */
.stats-section {
  margin: 20rpx 30rpx;
}

.stats-card {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3rpx;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe);
}

.stats-item {
  text-align: center;
  flex: 1;
}

.stats-number {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.stats-label {
  display: block;
  font-size: 24rpx;
  color: #666;
}

/* 精选内容区域 */
.featured-section {
  margin: 20rpx 30rpx 20rpx;
}

.featured-card {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx 16rpx;
  background: linear-gradient(135deg, #f8faff, #f0f4ff);
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-navigation {
  display: flex;
  gap: 32rpx;
}

.tab-item {
  position: relative;
  padding-bottom: 8rpx;
}

.tab-item.active .tab-text {
  color: #667eea;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2rpx;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s ease;
}

.more-btn {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.more-btn:active {
  background: rgba(102, 126, 234, 0.15);
}

.more-text {
  font-size: 24rpx;
  color: #667eea;
  margin-right: 6rpx;
}

.more-arrow {
  font-size: 22rpx;
  color: #667eea;
}

.content-swiper {
  height: 700rpx;
}

.content-scroll {
  height: 100%;
}

.content-list {
  padding: 20rpx 30rpx;
}

.content-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.2s ease;
}

.content-item:active {
  background-color: #f8faff;
  transform: translateX(8rpx);
}

.content-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-rank {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  color: #999;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.item-rank.top-three {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 12rpx;
}

.item-meta {
  display: flex;
  gap: 20rpx;
}

.item-time, .item-views {
  font-size: 24rpx;
  color: #999;
}

.item-badge {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.activity-badge {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.policy-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.news-badge {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
}
</style>