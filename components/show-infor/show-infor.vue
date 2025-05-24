<template>
  <view class="card-container">
    <view class="card">
      <view class="section-header">
              <view class="section-title">
                <view class="title-indicator"></view>
                <text class="title-text">为您推荐</text>
              </view>
              <view v-if="true" class="more-text" @click="handleMore">更多信息 ></view>
    </view>

      <view class="recommend-list">
        <view class="recommend-item" @click="goToPolicy">
          <view class="icon-wrapper policy-icon">
            <image src="/static/policy.png" class="icon-image" mode="aspectFit" />
          </view>
          <text class="label">政府政策</text>
        </view>

        <view class="recommend-item" @click="goToNews">
          <view class="icon-wrapper news-icon">
            <image src="/static/news.png" class="icon-image" mode="aspectFit" />
          </view>
          <text class="label">行业新闻</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>

</script>

<style scoped>
.card-container {
  padding: 30rpx;
  background-color: #f5f5f5;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-indicator {
  width: 8rpx;
  height: 32rpx;
  background-color: #e60012;
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.more-text {
  font-size: 26rpx;
  color: #999;
}
.recommend-list {
  display: flex;
  
	justify-content: flex-start;
  margin-top: 10rpx;
  gap: 60rpx;
}

.recommend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-bottom: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.policy-icon {
  background: linear-gradient(135deg, #ff6f8f, #ff9472);
}

.news-icon {
  background: linear-gradient(135deg, #1fa2ff, #12d8fa);
}

.icon-image {
  width: 64rpx;
  height: 64rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
}
</style>
