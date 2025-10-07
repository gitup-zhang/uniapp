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
	
	<!-- Tab栏 -->
	<view class="tab-container">
		<view 
			class="tab-item" 
			:class="{ active: currentTab === 'inProgress' }"
			@click="switchTab('inProgress')"
		>
			<text class="tab-text" :class="{ active: currentTab === 'inProgress' }">
				进行中 ({{ EventStore.eventcount.Eventing }})
			</text>
		</view>
		<view 
			class="tab-item" 
			:class="{ active: currentTab === 'notBegun' }"
			@click="switchTab('notBegun')"
		>
			<text class="tab-text" :class="{ active: currentTab === 'notBegun' }">
				未开始 ({{ EventStore.eventcount.EventNotBegun }})
			</text>
		</view>
	</view>
	
	<scroll-view 
		scroll-y="true" 
		:style="scrollViewStyle" 
		@scrolltolower="onReachBottom"
		lower-threshold="50"
		refresher-enabled="true"
		:refresher-triggered="refreshing"
		@refresherrefresh="onRefresh"
		class="scroll-content"
	>
		<uni-grid :column="2" :highlight="false" :show-border="false" @change="change" :square="false">
			<uni-grid-item v-for="item in currentEvents" :index="item.id" :key="item.id">
				<ActivityCard
					:imgSrc="item.cover_image_url"
					:title="item.title"
					:date="formatEventDate(item.event_start_time,item.event_end_time)"
					:location="item.event_address"
					:isJoined="false"
					:fee="item.registration_fee"
					:status="currentTab === 'inProgress' ? '进行中' : '即将开始'"
				/>
			</uni-grid-item>
		</uni-grid>
		
		<!-- 加载状态提示 -->
		<view class="load-more-container">
			<view v-if="currentIsLoading && currentEvents.length > 0" class="loading-tip">
				<uni-load-more status="loading" />
			</view>
			<view v-else-if="!currentHasMoreData && currentEvents.length > 0" class="loading-tip">
				<uni-load-more status="noMore" />
			</view>
			<view v-else-if="currentEvents.length === 0 && !currentIsLoading" class="empty-tip">
				<text>{{ currentTab === 'inProgress' ? '暂无进行中的活动' : '暂无未开始的活动' }}</text>
			</view>
		</view>
	</scroll-view>
	
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { onLoad, onReachBottom as uniReachBottom } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'	
import {formatEventDate} from '@/utils/data.js'
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'

// 初始化pinia
const EventStore = useEventstore()

// 当前选中的tab
const currentTab = ref('inProgress')

// 下拉刷新状态
const refreshing = ref(false)

// 计算属性：当前显示的活动列表
const currentEvents = computed(() => {
	return currentTab.value === 'inProgress' ? EventStore.eventing : EventStore.eventnotbegun
})

// 计算属性：当前是否有更多数据
const currentHasMoreData = computed(() => {
	return currentTab.value === 'inProgress' ? EventStore.hasMoreData : EventStore.notbegunHasMoreData
})

// 计算属性：当前是否正在加载
const currentIsLoading = computed(() => {
	return currentTab.value === 'inProgress' ? EventStore.isLoading : EventStore.notbegunIsLoading
})

// 计算属性：scroll-view高度（考虑tab栏高度）
const scrollViewStyle = computed(() => {
	return 'height: calc(100vh - 100px - 100rpx);' // 44px导航栏 + 100rpx tab栏
})

// 切换tab
const switchTab = async (tab) => {
	if (currentTab.value === tab) return
	
	currentTab.value = tab
	
	// 切换tab时，如果对应的数据还没加载过，就先加载
	if (tab === 'inProgress' && EventStore.eventing.length === 0) {
		await EventStore.getlisting(10)
	} else if (tab === 'notBegun' && EventStore.eventnotbegun.length === 0) {
		await EventStore.getlistnotbegun(10)
	}
}

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
	
	if (currentTab.value === 'inProgress') {
		if (EventStore.hasMoreData && !EventStore.isLoading) {
			await EventStore.loadMoreEvents()
		}
	} else {
		if (EventStore.notbegunHasMoreData && !EventStore.notbegunIsLoading) {
			await EventStore.loadMoreNotbegunEvents()
		}
	}
}

// 下拉刷新
const onRefresh = async () => {
	refreshing.value = true
	try {
		if (currentTab.value === 'inProgress') {
			await EventStore.refreshEvents()
		} else {
			await EventStore.refreshNotbegunEvents()
		}
	} finally {
		refreshing.value = false
	}
}

onLoad(() => {
	// 默认加载进行中的活动
	EventStore.getlisting(10)
})
</script>

<style>
	.navbar-title {
	  font-size: 20px;
	  font-weight: bold;
	  color: white;
	  margin-bottom: 10px;
	}
	
	.navbar-center {
	  position: absolute;
	  left: 0;
	  right: 0;
	  top: 0;
	  bottom: 0;
	  display: flex;
	  justify-content: center;
	  align-items: flex-end;
	  padding-bottom: 10px;
	  pointer-events: none;
	  transform: translateY(10px);
	}
	
	/* Tab栏样式 - 固定定位 */
	.tab-container {
		display: flex;
		background: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		position: fixed;
		top: 100px; /* 导航栏高度 */
		left: 0;
		right: 0;
		z-index: 999;
		height: 100rpx;
	}
	
	.tab-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 20rpx 0;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 6rpx;
		background: #ff4757;
		border-radius: 3rpx;
	}
	
	.tab-text {
		font-size: 28rpx;
		color: #666;
		font-weight: 400;
		transition: all 0.3s;
	}
	
	.tab-text.active {
		color: #ff4757;
		font-weight: 600;
	}
	
	/* 滚动内容区域 */
	.scroll-content {
		position: absolute;
		top: calc(100px + 100rpx); /* 导航栏高度 + tab栏高度 */
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.example-body {
		display: block;
		padding: 10px;
	}
	
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