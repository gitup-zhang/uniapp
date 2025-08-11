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
	<uni-grid :column="2" :highlight="false" :show-border="false" @change="change" :square="false">
					<uni-grid-item v-for="item in EventStore.eventing" :index="item.id" :key="item.id">
					<!-- 					<view class="grid-item-box" style="background-color: #fff;" > -->
					  <ActivityCard
						:imgSrc="item.cover_image_url"
						:title="item.title"
						:date="formatEventDate(item.event_start_time,item.event_end_time)"
						:location="item.event_address"
						:isJoined="false"
						:fee="item.registration_fee"
					  />
					<!-- 					</view> -->
					</uni-grid-item>
	</uni-grid>
	
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'	
import {formatEventDate} from '@/utils/data.js'
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'

// 初始化pinia
const EventStore=useEventstore()


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
onLoad(()=>{
	EventStore.getlisting(10)
	
})
</script>

<style>
	@import "../../style/detail.css";
</style>
