<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue :isshow="false" title="为您推荐" >
		<view class="recommend-list">
		  <view class="recommend-item" @click="goToPolicy">
		    <view class="icon-wrapper policy-icon">
		      <image src="/static/policy.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">政府政策</text>
		  </view>
		
		  <view class="recommend-item" @click="goToNews">
		    <view class="icon-wrapper news-icon">
		      <image src="/static/news.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">行业新闻</text>
		  </view>
		</view>
	</showInforVue>
	 <showInforVue :isshow="true" title="精选政策" >
	 <view class="news-item">
	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
	     <view class="news-content">
	       <view class="news-title">精选</view>
	       <view class="news-summary">精选</view>
	       <view v-if="true" class="hot-tag">最热</view>
	     </view>
	   </view>
  </showInforVue>
  <showInforVue :isshow="true" title="精选政策" >
  	 <view class="news-item">
  	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
  	     <view class="news-content">
  	       <view class="news-title">精选</view>
  	       <view class="news-summary">精选</view>
  	       <view v-if="true" class="hot-tag">最热</view>
  	     </view>
  	   </view>
  </showInforVue>
  </view>
 
</template>


<script setup>
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';

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
</style>