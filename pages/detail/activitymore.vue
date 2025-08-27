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
	      <text class="navbar-title">热门活动</text>
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
		<uni-grid :column="2" :highlight="false" :show-border="false" @change="change" :square="false">
			<uni-grid-item v-for="item in EventStore.eventing" :index="item.id" :key="item.id">
				<ActivityCard
					:imgSrc="item.cover_image_url"
					:title="item.title"
					:date="formatEventDate(item.event_start_time,item.event_end_time)"
					:location="item.event_address"
					:isJoined="false"
					:fee="item.registration_fee"
				/>
			</uni-grid-item>
		</uni-grid>
		
		<!-- 加载状态提示 -->
		<view class="load-more-container">
			<view v-if="EventStore.isLoading && EventStore.eventing.length > 0" class="loading-tip">
				<uni-load-more status="loading" />
			</view>
			<view v-else-if="!EventStore.hasMoreData && EventStore.eventing.length > 0" class="loading-tip">
				<uni-load-more status="noMore" />
			</view>
			<view v-else-if="EventStore.eventing.length === 0 && !EventStore.isLoading" class="empty-tip">
				<text>暂无活动数据</text>
			</view>
		</view>
	</scroll-view>
	
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { onLoad, onReachBottom as uniReachBottom } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'	
import {formatEventDate} from '@/utils/data.js'
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'

// 初始化pinia
const EventStore=useEventstore()

// 下拉刷新状态
const refreshing = ref(false)

function change(e){
	const clickedIndex = e.detail.index
	console.log('点击了第', clickedIndex, '个宫格')
	const disable = false
	uni.navigateTo({
	  url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
	})
}

// 返回函数
function onBack() {
  uni.navigateBack();
}

// 触底加载更多
const onReachBottom = async () => {
	console.log('触底了，开始加载更多')
	if (EventStore.hasMoreData && !EventStore.isLoading) {
		await EventStore.loadMoreEvents()
	}
}

// 下拉刷新
const onRefresh = async () => {
	refreshing.value = true
	try {
		await EventStore.refreshEvents()
	} finally {
		refreshing.value = false
	}
}

onLoad(()=>{
	EventStore.getlisting(10)
})

// 如果你的uni-app版本支持页面级的onReachBottom，可以保留这个
// 但由于我们使用了scroll-view，主要依赖scroll-view的scrolltolower事件
// uniReachBottom(onReachBottom)
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