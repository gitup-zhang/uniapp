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
	      <text class="navbar-title">热门活动</text>
	    </view>
	  </template>
	</uni-nav-bar>
	<uni-grid :column="2" :highlight="false" :show-border="false" @change="change" :square="false">
					<uni-grid-item v-for="(item, index) in 10" :index="index" :key="index">
	<!-- 					<view class="grid-item-box" style="background-color: #fff;" > -->
							  <ActivityCard
							    imgSrc="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg"
							    title="深圳市插画协会、英国插画师协会联合展览"
							    date="3月17日 - 3月30日"
							    location="深圳"
								:isJoined="true"
							  />
	<!-- 					</view> -->
					</uni-grid-item>
	</uni-grid>
	
</template>

<script setup>
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue'

function change(e){
	const clickedIndex = e.detail.index
	console.log('点击了第', clickedIndex+1, '个宫格')
	uni.navigateTo({
	  url: `/pages/detail/activitydetail`
	})
}
// 返回函数
function onBack() {
  uni.navigateBack();
}
</script>

<style>
	@import "../../style/detail.css";
</style>
