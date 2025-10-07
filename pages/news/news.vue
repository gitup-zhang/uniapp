<template> 
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#dc2626" fixed="true" leftWidth="150px">
      <template v-slot:left>
        <view class="navbar-title">热门活动</view>
      </template>
    </uni-nav-bar>
	
    <!-- 热门活动展示区域 -->
    <view class="section-header">
      <uni-section title="热门活动报名中" titleFontSize="20px" type="line" />
      <text class="more-link" @click="goMoreActivity" v-if="hotActivities.length > 0">更多活动</text>
    </view>
	
    <!-- 热门活动列表 -->
    <view v-if="hotActivities.length > 0">
      <uni-grid :column="2" :highlight="false" :show-border="false" @change="changeHotActivity" :square="false">
        <uni-grid-item v-for="item in hotActivities" :index="item.id" :key="item.id">
          <ActivityCard
            :imgSrc="item.cover_image_url"
            :title="item.title"
            :date="formatEventDate(item.event_start_time,item.event_end_time)"
            :location="item.event_address"
            :isJoined="false"
            :fee="item.registration_fee"
            :status="item.event_status === 'InProgress' ? '进行中' : '即将开始'"
          />
        </uni-grid-item>
      </uni-grid>
    </view>
    
    <!-- 热门活动无数据状态 -->
    <view v-else class="empty-state">
      <uni-icons type="calendar" size="80" color="#ccc"></uni-icons>
      <text class="empty-text">暂无热门活动</text>
      <text class="empty-desc">精彩活动即将上线，敬请期待</text>
    </view>

    <!-- 历史活动区域 -->
    <view class="history-section">
      <view class="section-header">
        <uni-section title="历史活动回顾" titleFontSize="20px" type="line" />
        <text class="more-link" @click="goMorehistoryactivity" v-if="EventStore.eventoutdate.length > 0">查看更多</text>
      </view>
      
      <!-- 历史活动列表 -->
      <view v-if="EventStore.eventoutdate.length > 0">
        <HorizontalActivityCard v-for="item in EventStore.eventoutdate" 
          :key="item.id"
          :imgSrc="item.cover_image_url"
          :title="item.title"
          :date="formatEventDate(item.event_start_time,item.event_end_time)"
          :location="item.event_address"
          status="已结束"
          @click="handleCardClick(item.id)"
        />
      </view>
      
      <!-- 历史活动无数据状态 -->
      <view v-else class="empty-state">
        <uni-icons type="reload" size="80" color="#ccc"></uni-icons>
        <text class="empty-text">暂无历史活动</text>
        <text class="empty-desc">活动结束后会在这里显示</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import {ref,onMounted,computed} from 'vue'
import { onLoad,onShow } from '@dcloudio/uni-app'
import {useEventstore} from '@/store/Event.js'
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'
import {formatEventDate} from '@/utils/data.js'
import HorizontalActivityCard from '@/components/HorizontalActivityCard/HorizontalActivityCard.vue'

// 初始化pinia
const EventStore=useEventstore()

// 智能展示热门活动：优先展示正在进行的，不足2个时用即将开始的补充
const hotActivities = computed(() => {
  const inProgressEvents = EventStore.eventing.slice(0, 2)
  const needMoreCount = 2 - inProgressEvents.length
  
  if (needMoreCount > 0) {
    const notBegunEvents = EventStore.eventnotbegun.slice(0, needMoreCount)
    // 为即将开始的活动添加状态标识
    const markedNotBegunEvents = notBegunEvents.map(item => ({
      ...item,
      event_status: 'NotBegun'
    }))
    // 为正在进行的活动添加状态标识
    const markedInProgressEvents = inProgressEvents.map(item => ({
      ...item,
      event_status: 'InProgress'
    }))
    return [...markedInProgressEvents, ...markedNotBegunEvents]
  }
  
  // 为正在进行的活动添加状态标识
  return inProgressEvents.map(item => ({
    ...item,
    event_status: 'InProgress'
  }))
})

// 热门活动点击处理
function changeHotActivity(e){
  const clickedIndex = e.detail.index
  console.log('点击了热门活动第', clickedIndex, '个宫格')
  const disable = false
  uni.navigateTo({
    url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
  })
}

// 更多活动（根据当前展示的活动类型智能跳转）
function goMoreActivity(){
  const hasInProgress = EventStore.eventing.length > 0
  if (hasInProgress) {
    console.log("跳转到更多正在进行活动")
    uni.navigateTo({
      url: `/pages/detail/activitymore`
    })
  } else {
    console.log("跳转到更多即将开始活动")
    uni.navigateTo({
      url: `/pages/detail/activitynotbegunmore`
    })
  }
}

// 历史活动点击
function handleCardClick(eventData) {
  console.log("点击了历史活动卡片:", eventData);
  const disable = true
  uni.navigateTo({
    url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}` // 历史活动禁用操作
  });
}

// 更多历史活动
function goMorehistoryactivity(){
  uni.navigateTo({
    url: `/pages/detail/activityhistorymore`
  })
}

// 初始化加载数据
onShow(()=>{
  // 加载正在进行的活动（前2个）
  EventStore.getlisting(2)
  // 加载即将开始的活动（前2个，用于补充）
  EventStore.getlistnotbegun(2)
  // 加载历史活动（前3个）
  EventStore.getlisoutdate(3)
})
</script>

<style>
.page {
  height: 100vh;
  overflow-y: auto;
  position: relative;
  background-color: #f8f9fa;
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
  padding: 20rpx;
}

.more-link {
  color: #666;
  font-size: 30rpx;
}

/* 历史活动区域 */
.history-section {
  margin-top: 20rpx;
  background-color: white;
  border-top: 1rpx solid #f0f0f0;
}

/* 无数据状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-top: 30rpx;
  font-weight: 500;
}

.empty-desc {
  font-size: 28rpx;
  color: #ccc;
  margin-top: 16rpx;
  line-height: 1.4;
}

/* 网格布局优化 */
.uni-grid-item {
  padding: 10rpx;
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .empty-state {
    padding: 80rpx 20rpx;
  }
  
  .empty-text {
    font-size: 30rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
  }
}
</style>