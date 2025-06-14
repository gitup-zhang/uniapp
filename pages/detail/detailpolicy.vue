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
  				<uni-title type="h1" :title="policydetail.detail.policy_title"></uni-title>
	</view>
	<uni-section class="mb-10" title="新闻详情"  type="line" titleFontSize="16px"></uni-section>
	<mp-html :content="content" :container-style="style"/>
  
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref,onMounted} from 'vue'
import {usePolicyDetailStore} from '@/store/PolicyDetail.js'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'




// 跳转接受到的政策id
let id=ref()
const content=ref("")
// 富文本样式
const style="padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);"

const policydetail=usePolicyDetailStore()


onLoad(async(option) => {
 id = decodeURIComponent(option.id)
  console.log('接收到的ID：', id)
  await policydetail.getpolicydetail(id)
  content.value=policydetail.detail.policy_content
  console.log(111111111111111)
  console.log(content.value)
})

function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
