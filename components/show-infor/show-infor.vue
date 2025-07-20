<template>
  <view class="card-container">
    <view class="card">
      <view class="section-header">
              <view class="section-title">
                <view class="title-indicator"></view>
                <text class="title-text">{{props.title}}</text>
              </view>
              <!-- <view v-if="props.isshow" class="more-text" @click="handleMore">更多信息 ></view> -->
			  <slot name="more"></slot>
    </view>
		<slot name="body"></slot>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})




</script>

<style scoped>
.card-container {

	padding: 10rpx 30rpx ;/* 左右保留30rpx，去掉上下padding */
 margin-bottom: 10rpx;/* 控制组件间距，视视觉需要可调为10rpx等 */
  background-color: #f5f5f5;


}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
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

</style>
