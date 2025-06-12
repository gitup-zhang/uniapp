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
        <text class="navbar-title">政策</text>
      </view>
    </template>
  </uni-nav-bar>
  <view class="example-body">
  				<uni-title type="h1" title="政策标题"></uni-title>
	</view>
	<uni-section class="mb-10" title="竖线装饰"  type="line" titleFontSize="16px"></uni-section>
	<view v-for="iten in 50">政策详情</view>
  
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref} from 'vue'
// 跳转接受到的政策id
let id=ref()



onLoad((option) => {
 id = decodeURIComponent(option.id)
  console.log('接收到的ID：', id)
})
	
function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
