<template> 
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#dc2626" fixed="true" leftWidth="150px">
      <template v-slot:left>
        <view class="navbar-title">热门活动</view>
      </template>
    </uni-nav-bar>
	
    <!-- 热门活动展示区域 -->
    <view class="hot-activities-container">
      <view class="section-header">
        <uni-section title="热门活动报名中" titleFontSize="20px" type="line" />
        <text class="more-link" @click="goMoreActivity" v-if="hotActivities.length > 0">
          更多活动
          <uni-icons type="right" size="14" color="#666"></uni-icons>
        </text>
      </view>
	
      <!-- 热门活动列表 -->
      <view v-if="hotActivities.length > 0" class="hot-activities-grid">
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
        <uni-icons type="calendar" size="80" color="#ddd"></uni-icons>
        <text class="empty-text">暂无热门活动</text>
        <text class="empty-desc">精彩活动即将上线，敬请期待</text>
      </view>
    </view>

    <!-- 历史活动区域 -->
    <view class="history-section">
      <view class="section-header">
        <uni-section title="历史活动回顾" titleFontSize="20px" type="line" />
        <text class="more-link" @click="goMorehistoryactivity" v-if="EventStore.eventoutdate.length > 0">
          查看更多
          <uni-icons type="right" size="14" color="#666"></uni-icons>
        </text>
      </view>
      
      <!-- 历史活动列表 -->
      <view v-if="EventStore.eventoutdate.length > 0" class="history-list">
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
        <uni-icons type="reload" size="80" color="#ddd"></uni-icons>
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

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  padding-bottom: 40rpx;
}

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  letter-spacing: 1rpx;
}

/* 热门活动容器 */
.hot-activities-container {
  background-color: #fff;
  margin: 20rpx 20rpx 30rpx 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.03);
}

/* 区域标题头部 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx 16rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

/* 增大标题字体 */
.section-header :deep(.uni-section__content-title) {
  font-size: 34rpx !important;
  font-weight: 600;
}

.more-link {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 26rpx;
  padding: 8rpx 16rpx;
  border-radius: 30rpx;
  transition: all 0.3s ease;
}

.more-link:active {
  background-color: #f5f5f5;
  color: #dc2626;
}

/* 热门活动网格区域 */
.hot-activities-grid {
  padding: 0 10rpx 20rpx 10rpx;
}

/* 历史活动区域 */
.history-section {
  background-color: #fff;
  margin: 0 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.03);
}

.history-list {
  padding: 0 0 20rpx 0;
}

/* 无数据状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
  background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-top: 30rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #ccc;
  margin-top: 16rpx;
  line-height: 1.6;
  max-width: 400rpx;
}

/* 网格项优化 */
.uni-grid-item {
  padding: 0;
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .hot-activities-container,
  .history-section {
    margin-left: 15rpx;
    margin-right: 15rpx;
    border-radius: 16rpx;
  }
  
  .section-header {
    padding: 20rpx 25rpx 14rpx 25rpx;
  }
  
  .section-header :deep(.uni-section__content-title) {
    font-size: 32rpx !important;
  }
  
  .empty-state {
    padding: 100rpx 30rpx;
  }
  
  .empty-text {
    font-size: 30rpx;
  }
  
  .empty-desc {
    font-size: 24rpx;
  }
}


</style>