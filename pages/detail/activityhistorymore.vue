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
	<HorizontalActivityCard  v-for="(item,index) in 10"
	  imgSrc="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg"
	  title="中国大模型人才大会"
	  date="3月15日 - 4月10日"
	  location="深圳华侨城创意文化园北区 C2 展厅"
	  status="已结束"
	@click="handleCardClick"
	/>
	
</template>

<script setup>
	// 活动点击逻辑
function handleCardClick(eventData) {
  console.log("点击了卡片:", eventData);
	uni.navigateTo({
	url: `/pages/detail/activitydetail` // 举例，传递 title 作为参数
  });
}
// 返回函数
function onBack() {
  uni.navigateBack();
}
</script>

<style>
@import "../../style/detail.css";
</style>
