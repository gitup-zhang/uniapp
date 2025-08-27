<template>
	<uni-nav-bar
	  statusBar="true"
	  backgroundColor="#ff4757"
	  fixed="true"
	  :border="false"
	  leftIcon="left"
	  @clickLeft="onBack"
	>
	  <!-- 居中标题插槽 -->
	  <template v-slot:default>
	    <view class="navbar-center">
	      <text class="navbar-title">历史活动</text>
	    </view>
	  </template>
	</uni-nav-bar>

	<scroll-view 
		scroll-y="true" 
		style="height: calc(100vh - 44px);" 
		@scrolltolower="onReachBottom"
		lower-threshold="50"
		refresher-enabled="true"
		:refresher-triggered="refreshing"
		@refresherrefresh="onRefresh"
	>
		<HorizontalActivityCard  
			v-for="item in EventStore.eventoutdate"
			:key="item.id"
			:imgSrc="item.cover_image_url"
			:title="item.title"
			:date="formatEventDate(item.event_start_time,item.event_end_time)"
			:location="item.event_address"
			status="已结束"
			@click="handleCardClick(item.id)"
		/>
		
		<!-- 加载状态提示 -->
		<view class="load-more-container">
			<view v-if="EventStore.outdateIsLoading && EventStore.eventoutdate.length > 0" class="loading-tip">
				<uni-load-more status="loading" />
			</view>
			<view v-else-if="!EventStore.outdateHasMoreData && EventStore.eventoutdate.length > 0" class="loading-tip">
				<uni-load-more status="noMore" />
			</view>
			<view v-else-if="EventStore.eventoutdate.length === 0 && !EventStore.outdateIsLoading" class="empty-tip">
				<text>暂无历史活动数据</text>
			</view>
		</view>
	</scroll-view>
	
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'	
import {formatEventDate} from '@/utils/data.js'

// 初始化pinia
const EventStore=useEventstore()

// 下拉刷新状态
const refreshing = ref(false)

// 活动点击逻辑
function handleCardClick(eventData) {
  console.log("点击了卡片:", eventData);
  const disable = true
  	uni.navigateTo({
  	url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}` // 举例，传递 title 作为参数
  });
}

// 返回函数
function onBack() {
  uni.navigateBack();
}

// 触底加载更多
const onReachBottom = async () => {
	console.log('触底了，开始加载更多历史活动')
	if (EventStore.outdateHasMoreData && !EventStore.outdateIsLoading) {
		await EventStore.loadMoreOutdateEvents()
	}
}

// 下拉刷新
const onRefresh = async () => {
	refreshing.value = true
	try {
		await EventStore.refreshOutdateEvents()
	} finally {
		refreshing.value = false
	}
}

onLoad(()=>{
	EventStore.getlisoutdate(10)
})
</script>

<style>
@import "../../style/detail.css";

.load-more-container {
	padding: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.loading-tip {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx 0;
}

.empty-tip {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
	font-size: 28rpx;
}
</style>