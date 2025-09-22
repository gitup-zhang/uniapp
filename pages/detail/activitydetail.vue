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
	      <text class="navbar-title">活动详情</text>
	    </view>
	  </template>
	</uni-nav-bar>
  <view class="container">
    <!-- 顶部图片轮播区域 -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
        <swiper-item v-for="image in EventStore.eventdetail.images" :key="image.image_id">
          <image class="banner-image" :src="image.url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 活动信息卡片 -->
    <view class="content-card">
      <!-- 标题 -->
      <view class="title">{{ EventStore.eventdetail.title }}</view>
      
      <!-- 基本信息 -->
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">📍</text>
          <text class="info-text">{{ EventStore.eventdetail.event_address }}</text>
        </view>
      </view>
      
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">📅</text>
          <text class="info-text">{{ formatEventDate(EventStore.eventdetail.event_start_time,EventStore.eventdetail.event_end_time)}}</text>
        </view>
      </view>
      
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">💰</text>
          <text class="info-text">{{EventStore.eventdetail.registration_fee}}</text>
        </view>
      </view>

      <!-- 活动详情标题 -->
      <view class="section-title">活动详情</view>
      
      <!-- 活动描述 -->
      <view class="description" v-html="EventStore.eventdetail.detail">
		
      </view>
      
      <!-- 参会说明 -->
<!--     <view class="attendee-info">
        {{ eventInfo.attendeeInfo }}
      </view> -->

      <!-- 报名按钮 -->
      <view class="register-section">
        <button 
          class="register-btn" 
          :class="{ 'register-btn-disabled': disable }"
          @click="handleRegister" 
          :disabled="disable"
        >
          去报名
        </button>
        <view class="deadline">报名截止 {{ Dataformat(EventStore.eventdetail.registration_end_time) }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>

import { onLoad,onShow,onReady } from '@dcloudio/uni-app'
import {ref,onMounted,reactive} from 'vue'
import {useEventstore} from '@/store/Event.js'
import {useInfoStore} from '@/store/Info.js' 
import {formatEventDate,Dataformat} from '@/utils/data.js'


let id=ref()
const disable=ref(true)
// 标志位，判断是否活动过期，false为无过期，true为过期
const signal=ref(false)
// 初始化pinia
const EventStore=useEventstore()
// 初始化用户store
const UserStore=useInfoStore()
// 按钮名称


onLoad(async(option) => {
	console.log("option:",option)
 id = decodeURIComponent(option.id)
  disable.value = option.disable === 'true' // 转换为布尔值
	signal.value=disable.value
	  EventStore.geteventdetail(id)
 	console.log("接收到的ID：", typeof(id))
 	console.log("按钮是否禁用：", disable.value)
 
})
onShow(async()=>{
	await UserStore.IsRegistered(id)
	console.log("是否已经报名",UserStore.isapply)
	
	if(!UserStore.isapply &&  !signal.value){
		console.log("申请界面没有报名")
		disable.value=false
	}else{
		console.log("申请界面已经报名")
		disable.value=true
	}
	
})



// 轮播图数据
const bannerImages = ref([
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', // 替换为实际的图片路径
  'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
  'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
])

// 活动信息数据
const eventInfo = reactive({
  title: '中国大模型人才大会火热报名中！',
  location: '北京中关村',
  date: '3月15日-4月10日',
  fee: '免费',
  description: '在全球人工智能技术迅猛发展的浪潮下，大模型作为AI领域的核心驱动力，正深刻重塑产业格局与人才需求。为促进技术交流，汇聚精英，共享AI盛宴，2024年中国大模型人才大会将于北京[场馆]隆重举行。本次大会以"智聚未来，共创AI新纪元"为主题，汇聚国内外顶尖学者、企业领袖与技术精英，共同探讨大模型技术前沿、应用落地与人才生态建设，助力中国AI产业高质量发展。',
  attendeeInfo: '大会邀请清华大学、北京大学等高校的AI领军学者，以及来自百度、阿里、字节跳动等企业的技术负责人，分享大模型研发的最新突破与行业实践，活动荣获得主或国家奖得主担任[拟邀请]将发表主旨演讲，探讨AI未来的伦理与方向。',
  deadline: '04/10 12:00'
})

// 返回函数
function onBack() {
  uni.navigateBack();
}

// 报名处理函数
const handleRegister = () => {
  // 如果按钮被禁用，直接返回
  if (disable.value) {
    return;
  }
  
  // 检查用户是否登录
  if (!UserStore.signal) { // 假设你的登录状态字段名为 isLoggedIn
    uni.showModal({
      title: '提示',
      content: '请先登录后再进行报名',
      showCancel: true,
      cancelText: '取消',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，跳转到登录页面
          uni.switchTab({
          	url: '../mymessage/mymessage'
          });
        }
      }
    })
    return;
  }
  
  // 用户已登录，处理报名逻辑
  uni.showToast({
    title: '跳转到报名页面',
    icon: 'none'
  })
  // 跳转到报名页面
  console.log("跳转的id:",id)
  uni.navigateTo({ url: `/pages/detail/applydetail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import "../../style/detail.css";

.container {
  background-color: #f5f5f5;
}

.banner-section {
  width: 100%;
  height: 400rpx;
  
  .banner-swiper {
    width: 100%;
    height: 100%;
    
    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.content-card {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
  line-height: 1.4;
}

.info-row {
  margin-bottom: 20rpx;
  
  .info-item {
    display: flex;
    align-items: center;
    
    .info-icon {
      font-size: 28rpx;
      margin-right: 16rpx;
    }
    
    .info-text {
      font-size: 28rpx;
      color: #666666;
    }
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin: 40rpx 0 20rpx 0;
}

.description {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  text-align: justify;
}

.attendee-info {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 40rpx;
  text-align: justify;
}

.register-section {
  margin-top: 40rpx;
  
  .register-btn {
    width: 100%;
    height: 88rpx;
    background-color: #e53e3e;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 12rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    transition: background-color 0.3s ease; // 添加过渡效果
    
    &:active:not(.register-btn-disabled) {
      background-color: #c53030;
    }
    
    // 禁用状态样式
    &.register-btn-disabled {
      background-color: #cccccc !important;
      color: #999999 !important;
      cursor: not-allowed;
      
      &:active {
        background-color: #cccccc !important; // 禁用时不改变颜色
      }
    }
  }
  
  .deadline {
    text-align: center;
    font-size: 24rpx;
    color: #999999;
  }
}

// 轮播图指示点样式调整
:deep(.uni-swiper-dot) {
  background-color: rgba(255, 255, 255, 0.5);
  width: 12rpx;
  height: 12rpx;
}

:deep(.uni-swiper-dot-active) {
  background-color: #ffffff;
}
</style>