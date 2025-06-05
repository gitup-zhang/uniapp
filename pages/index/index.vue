<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue  title="为您推荐" >
		<template v-slot:body>
		<view class="recommend-list">
		  <view class="recommend-item" @click="handleMoremsg">
		    <view class="icon-wrapper policy-icon">
		      <image src="/static/policy.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">政府政策</text>
		  </view>
		
		  <view class="recommend-item" @click="handleMorenew">
		    <view class="icon-wrapper news-icon">
		      <image src="/static/news.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">行业新闻</text>
		  </view>
		</view>
		</template>
	</showInforVue>
	<!-- 公告信息 -->
	 <view class="notice-card-container">
	     <view class="notice-card">
	       <view class="notice-card-left">
	         <text class="notice-card-title">系统</text>
	         <text class="notice-card-title">公告</text>
	       </view>
	       <view class="notice-card-right">
			<swiper class="notice-card-right" autoplay="true" vertical="true" interval="4000" circular="true">
			<swiper-item v-for="item in notice">
	         <text class="notice-card-desc">{{item}}</text>
			 </swiper-item>
			 </swiper>
	       </view>
	     </view>
	   </view>
	<!-- 政策和新闻 -->
	 <showInforVue  title="精选政策" >
		 <template v-slot:more>
			 <view  class="more-text" @click="handleMoremsg">更多信息 ></view>
		 </template>
		 
		<template v-slot:body>
	 <view class="news-item">
	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
	     <view class="news-content">
	       <view class="news-title">精选</view>
	       <view class="news-summary">精选</view>
	       <view v-if="true" class="hot-tag">最热</view>
	     </view>
	   </view>
	   </template> 
  </showInforVue>
  <showInforVue  title="精选新闻" >
	  <template v-slot:more>
		  <view  class="more-text" @click="handleMorenew">更多信息 ></view>
	  </template>
	  <template v-slot:body>
  	 <view class="news-item">
  	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
  	     <view class="news-content">
  	       <view class="news-title">精选</view>
  	       <view class="news-summary">精选</view>
  	       <view v-if="true" class="hot-tag">最热</view>
  	     </view>
  	   </view>
	   </template>
  </showInforVue>
  </view>
 
</template>


<script setup>
import {ref} from 'vue'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
import { getPolicyList , getExampleList} from '@/new-apis/policy.js'


let notice=ref(["公告1.。。。。。。。。。","公告2.。。。。。。。。。。。","公告3.。。。。。。。。。。。。。"])

// 获取更多新闻和政策
function handleMorenew(){
	// uni.switchTab({
	// 	url: '../news/news'
	// });

}
function handleMoremsg(){
	// uni.switchTab({
	// 	url: '../policy/policy'
	// });
	getPolicyList({
	      
	    }).then(res => {
	      console.log('示例数据：', res);
	    });
	getExampleList({
	      
	    }).then(res => {
	      console.log('示例数据：', res);
	    });
}
// 接口测试


    

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
/* 公告布局 */
.notice-card-container {
  padding: 0rpx 30rpx; /* 与其他卡片一致的外部边距 */
  margin-bottom: 40rpx;
  background-color: #f5f5f5;
}

.notice-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.notice-card-left {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.notice-card-title {
  font-weight: bold;
  font-size: 32rpx;
  color: #000;
  line-height: 40rpx;
}

.notice-card-right {
  flex: 1;
  height: 60rpx;
  align-items: center;
  justify-content: center;
  
}

.notice-card-desc {
   color: #666666;
    font-size: 28rpx;
    white-space: nowrap;
    line-height: 60rpx; /* 与swiper高度一致 */
}
</style>