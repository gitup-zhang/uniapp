<template> 
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#dc2626" fixed="true" leftWidth="150px">
      <template v-slot:left>
        <view class="navbar-title">热门活动</view>
      </template>
    </uni-nav-bar>
	
    <view class="section-header">
      <uni-section title="热门活动报名中" titleFontSize="20px" type="line" />
       <text class="more-link" @click="goMorehotactivity">更多活动</text>
    </view>
	
	<!-- 热门活动 -->
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
	<!-- 历史活动 -->
	<view class="section-header">
	  <uni-section title="历史活动回顾" titleFontSize="20px" type="line" />
	   <text class="more-link" @click="goMorehistoryactivity">查看更多</text>
	</view >
	  <HorizontalActivityCard  v-for="item in EventStore.eventoutdate" 
	    :imgSrc="item.cover_image_url"
	    :title="item.title"
	    :date="formatEventDate(item.event_start_time,item.event_end_time)"
	    :location="item.event_address"
	    status="已结束"
		@click="handleCardClick(item.id)"
	  />

  </view>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { onLoad,onShow } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'
import {formatEventDate} from '@/utils/data.js'
import HorizontalActivityCard from '@/components/HorizontalActivityCard/HorizontalActivityCard.vue'

// 初始化pinia
const EventStore=useEventstore()


// 热门活动点击
function change(e){
	// console.log(e)
	const clickedIndex = e.detail.index
	console.log('点击了第', clickedIndex, '个宫格')
	const disable = false
	uni.navigateTo({
	  url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
	})
}
// 历史活动点击
function handleCardClick(eventData) {
  console.log("点击了卡片:", eventData);
  const disable = true
	uni.navigateTo({
	url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}` // 举例，传递 title 作为参数
  });
}

// 更多热门活动
function goMorehotactivity(){
	console.log("11111111")
	uni.navigateTo({
	  url: `/pages/detail/activitymore`
	})
}
// 更多历史活动
function goMorehistoryactivity(){
	uni.navigateTo({
	  url: `/pages/detail/activityhistorymore`
	})
}
// 初始化
onShow(()=>{
	EventStore.getlisting(2)
	EventStore.getlisoutdate(3)
})
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
