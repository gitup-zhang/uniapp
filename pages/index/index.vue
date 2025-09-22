<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue  title="为您推荐" >
		<template v-slot:body>
		<view class="recommend-list">
		  <view class="recommend-item" @click="handleMorearticle">
		    <view class="icon-wrapper policy-icon">
		      <image src="/static/icon/policy_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">政府政策</text>
		  </view>
		
		  <view class="recommend-item" @click="handleMorearticle">
		    <view class="icon-wrapper news-icon">
		      <image src="/static/icon/new_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">行业新闻</text>
		  </view>
		  
		  <view class="recommend-item" @click="handleMoreactivity">
		    <view class="icon-wrapper activity-icon">
		      <image src="/static/icon/convention_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">大会报名</text>
		  </view>
		</view>
		</template>
	</showInforVue>
	
	<!-- 优化后的公告信息 -->
	<view class="notice-section">
	  <view class="notice-card">
	    <view class="notice-header">
	      <view class="notice-icon">
	        <text class="icon-text">📢</text>
	      </view>
	      <text class="notice-title">系统公告</text>
	      <view class="notice-badge">重要</view>
	    </view>
	    <view class="notice-content">
	      <swiper class="notice-swiper" autoplay="true" vertical="true" interval="4000" circular="true">
	        <swiper-item v-for="item in usenotice.notice" :key="item.id">
	          <text class="notice-text" @click="noticeclick(item.id)">{{item.title}}</text>
	        </swiper-item>
	      </swiper>
	    </view>
	  </view>
	</view>
	   
	<!-- 可滑动的热搜卡片 -->
	<view class="hot-search-section">
	  <view class="hot-search-card">
	    <view class="hot-search-header">
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
	        <text class="more-arrow">></text>
	      </view>
	    </view>
	    
	    <swiper class="content-swiper" :current="currentTab" @change="onSwiperChange">
	      <!-- 热门活动 -->
	      <swiper-item>
	        <view class="hot-list">
	          <view class="hot-item" v-for="(item, index) in selected.news" :key="item.article_id" @click="onclickactivity(item.article_id)">
	            <view class="hot-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
	            <text class="hot-title">{{ item.article_title }}</text>
	            <view class="hot-badge activity-badge">活动</view>
	          </view>
	        </view>
	      </swiper-item>
	      
	      <!-- 精选政策 -->
	      <swiper-item>
	        <view class="hot-list">
	          <view class="hot-item" v-for="(item, index) in selected.policys" :key="item.article_id" @click="onclickactivity(item.article_id)">
	            <view class="hot-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
	            <text class="hot-title">{{ item.article_title }}</text>
	            <view class="hot-badge policy-badge">政策</view>
	          </view>
	        </view>
	      </swiper-item>
	      
	      <!-- 精选新闻 -->
	      <swiper-item>
	        <view class="hot-list">
	          <view class="hot-item" v-for="(item, index) in selected.news" :key="item.article_id" @click="onclickactivity(item.article_id)">
	            <view class="hot-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</view>
	            <text class="hot-title">{{ item.article_title }}</text>
	            <view class="hot-badge news-badge">新闻</view>
	          </view>
	        </view>
	      </swiper-item>
	    </swiper>
	  </view>
	</view>
  
  </view>
 
</template>


<script setup>
import {ref,onMounted} from 'vue'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
import {useNoticeStore} from '@/store/Notice.js'
import {useSelectedstore} from '@/store/Home.js'

// 获得公告对象
const usenotice=useNoticeStore()
// 获得精选对象
const selected=useSelectedstore()

// 当前选中的标签页
const currentTab = ref(0)


// 获取更多新闻和政策
function handleMorearticle(){
	uni.setStorageSync('tabSource', 'switchTab');
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
  } else {
    handleMorearticle() // 政策和新闻
  }
}
function noticeclick(id){
	uni.navigateTo({
		 url: `/pages/detail/noticedetail?id=${id}`
	})
}


// 初始化
onMounted(()=>{
	usenotice.getnoticestore()
	selected.getselected()
})
    

</script>

<style lang='scss'>
.container {
  padding: 0;
  margin: 0;
  
  min-height: 100vh;
 background-color:#f5f5f5 ;
}
/* 为您推荐 */
.recommend-list {
  display: flex;
  
	justify-content: flex-start;
  margin-top: 10rpx;
  gap: 60rpx;
  
}
.recommend-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}


.icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-bottom: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.policy-icon {
  background: linear-gradient(135deg, #ff6f8f, #ff9472);
}

.news-icon {
  background: linear-gradient(135deg, #1fa2ff, #12d8fa);
}
.activity-icon{
	background: linear-gradient(135deg, #90EE90, #228B22);
	
}

.icon-image {
  width: 64rpx;
  height: 64rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
}
/* 精选政策新闻 */
.news-item {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx; /* 增加底部间距，使新闻条目之间有更多空间 */
}

.news-item:last-child {
  margin-bottom: 0; /* 最后一个新闻条目不设置底部间距 */
}

.news-image {
  width: 240rpx; /* 增大图片宽度 */
  height: 180rpx; /* 增大图片高度 */
  border-radius: 10rpx;
  margin-right: 40rpx; /* 增大图片与文字内容的间距 */
  flex-shrink: 0; /* 防止图片被压缩 */
  background-color: #f0f0f0; /* 图片加载前的占位背景色 */
}

.news-content {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 36rpx; /* 增大标题字体大小 */
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx; /* 增大标题与简介的间距 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制标题显示两行 */
  -webkit-box-orient: vertical;
}

.news-summary {
  font-size: 30rpx; /* 增大简介字体大小 */
  color: #666;
  margin-bottom: 15rpx; /* 增大简介与标签的间距 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制简介显示两行 */
  -webkit-box-orient: vertical;
}

.hot-tag {
  background-color: #e60012; /* 红色背景 */
  color: #fff; /* 白色字体 */
  font-size: 26rpx; /* 增大标签字体大小 */
  padding: 6rpx 16rpx; /* 增大内边距 */
  border-radius: 10rpx; /* 增大圆角 */
  align-self: flex-start; /* 标签靠左对齐 */
  line-height: 1; /* 确保文字垂直居中 */
}

/* 优化后的公告布局 */
.notice-section {
  padding: 0rpx 30rpx;
  margin-bottom: 10rpx;
  background-color: #f5f5f5;
}

.notice-card {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-left: 6rpx solid #667eea;
  position: relative;
  overflow: hidden;
}

.notice-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  transform: translate(50%, -50%);
  opacity: 0.1;
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.notice-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.icon-text {
  font-size: 24rpx;
}

.notice-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d3748;
  flex: 1;
}

.notice-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  font-size: 20rpx;
  font-weight: bold;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
}

.notice-content {
  height: 60rpx;
  position: relative;
}

.notice-swiper {
  height: 100%;
}

.notice-text {
  font-size: 28rpx;
  color: #4a5568;
  line-height: 60rpx;
  padding-right: 20rpx;
}

.more-text {
  font-size: 26rpx;
  color: #999;
}

/* 热搜卡片样式 */
.hot-search-section {
  padding: 0rpx 30rpx;
  margin-bottom: 20rpx;
}

.hot-search-card {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.hot-search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.tab-navigation {
  display: flex;
  gap: 32rpx;
}

.tab-item {
  position: relative;
  padding-bottom: 16rpx;
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
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2rpx;
}

.tab-text {
  font-size: 30rpx;
  color: #666;
  transition: all 0.3s ease;
}

.more-btn {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16rpx;
}

.more-btn .more-text {
  font-size: 24rpx;
  color: #667eea;
  margin-right: 4rpx;
}

.more-arrow {
  font-size: 20rpx;
  color: #667eea;
}

.content-swiper {
  height: 680rpx;
}

.hot-list {
  padding: 24rpx;
  height: 100%;
  overflow-y: auto;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
  transition: background-color 0.2s ease;
}

.hot-item:hover {
  background-color: #f8f9ff;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-rank {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  background: #e2e8f0;
  color: #718096;
  font-size: 26rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.hot-rank.top-three {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
}

.hot-title {
  flex: 1;
  font-size: 28rpx;
  color: #2d3748;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-right: 16rpx;
}

.hot-badge {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
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
</style>