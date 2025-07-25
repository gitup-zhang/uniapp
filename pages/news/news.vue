<template> 
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true" leftWidth="150px">
      <template v-slot:left>
        <view class="navbar-title">活动报名</view>
      </template>
    </uni-nav-bar>
	
    <view class="section-header">
      <uni-section title="热门活动报名中" titleFontSize="20px" type="line" />
       <text class="more-link" @click="goMorehotactivity">更多活动</text>
    </view>
	
	<!-- 热门活动 -->
			<uni-grid :column="2" :highlight="false" :show-border="false" @change="change" :square="false">
				<uni-grid-item v-for="(item, index) in 2" :index="index" :key="index">
<!-- 					<view class="grid-item-box" style="background-color: #fff;" > -->
						  <ActivityCard
						    imgSrc="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg"
						    title="深圳市插画协会、英国插画师协会联合展览"
						    date="3月17日 - 3月30日"
						    location="深圳"
							:isJoined="true"
						  />
<!-- 					</view> -->
				</uni-grid-item>
			</uni-grid>
	<!-- 历史活动 -->
	<view class="section-header">
	  <uni-section title="历史活动回顾" titleFontSize="20px" type="line" />
	   <text class="more-link" @click="goMorehistoryactivity">查看更多</text>
	</view >
	  <HorizontalActivityCard  v-for="(item,index) in 3" 
	    imgSrc="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg"
	    title="中国大模型人才大会"
	    date="3月15日 - 4月10日"
	    location="深圳华侨城创意文化园北区 C2 展厅"
	    status="已结束"
	  />

  </view>
</template>

<script setup>
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'
import HorizontalActivityCard from '@/components/HorizontalActivityCard/HorizontalActivityCard.vue'
// 热门活动点击
function change(e){
	const clickedIndex = e.detail.index
	console.log('点击了第', clickedIndex+1, '个宫格')
	uni.navigateTo({
	  url: `/pages/detail/activitydetail`
	})
}
</script>
<style>
.page {
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 20rpx;
}

.more-link {
  color: #ccc;
  font-size: 30rpx;
  margin-left: 20rpx;
}
</style>
