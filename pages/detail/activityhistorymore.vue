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

	<HorizontalActivityCard  v-for="item in EventStore.eventoutdate"
	  :imgSrc="item.cover_image_url"
	  :title="item.title"
	  :date="formatEventDate(item.event_start_time,item.event_end_time)"
	  :location="item.event_address"
	  status="已结束"
	@click="handleCardClick(item.id)"
	/>
	
	
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'	
import {formatEventDate} from '@/utils/data.js'

// 初始化pinia
const EventStore=useEventstore()
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
onLoad(()=>{
	
	EventStore.getlisoutdate(10)
})
</script>

<style>
@import "../../style/detail.css";
</style>
