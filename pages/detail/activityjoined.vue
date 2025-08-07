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
	      <text class="navbar-title">参加的活动</text>
	    </view>
	  </template>
	</uni-nav-bar>
	
	
</template>

<script setup>
// 返回函数
function onBack() {
  uni.navigateBack();
}
</script>

<style>
@import "../../style/detail.css";
</style>
