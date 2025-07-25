<template>
	<uni-nav-bar
	  statusBar="true"
	  backgroundColor="#903749"
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
        <swiper-item v-for="(image, index) in bannerImages" :key="index">
          <image class="banner-image" :src="image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 活动信息卡片 -->
    <view class="content-card">
      <!-- 标题 -->
      <view class="title">{{ eventInfo.title }}</view>
      
      <!-- 基本信息 -->
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">📍</text>
          <text class="info-text">{{ eventInfo.location }}</text>
        </view>
      </view>
      
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">📅</text>
          <text class="info-text">{{ eventInfo.date }}</text>
        </view>
      </view>
      
      <view class="info-row">
        <view class="info-item">
          <text class="info-icon">💰</text>
          <text class="info-text">{{ eventInfo.fee }}</text>
        </view>
      </view>

      <!-- 活动详情标题 -->
      <view class="section-title">活动详情</view>
      
      <!-- 活动描述 -->
      <view class="description">
        {{ eventInfo.description }}
      </view>
      
      <!-- 参会说明 -->
      <view class="attendee-info">
        {{ eventInfo.attendeeInfo }}
      </view>

      <!-- 报名按钮 -->
      <view class="register-section">
        <button class="register-btn" @click="handleRegister">去报名</button>
        <view class="deadline">报名截止 {{ eventInfo.deadline }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

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
  // 处理报名逻辑
  uni.showToast({
    title: '跳转到报名页面',
    icon: 'none'
  })
  // 这里可以添加跳转到报名页面的逻辑
  uni.navigateTo({ url: '/pages/detail/applydetail' })
}
</script>

<style lang="scss" scoped>
@import "../../style/detail.css";
.container {
  min-height: 100vh;
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
    
    &:active {
      background-color: #c53030;
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