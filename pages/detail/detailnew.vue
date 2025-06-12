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
        <text class="navbar-title">新闻</text>
      </view>
    </template>
  </uni-nav-bar>
  <view class="example-body">
  				<uni-title type="h1" title="新闻标题"></uni-title>
	</view>
	<uni-section class="mb-10" title="竖线装饰"  type="line" titleFontSize="16px"></uni-section>
	<view v-for="iten in 50">新闻详情</view>
  
</template>

<script setup>
function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
