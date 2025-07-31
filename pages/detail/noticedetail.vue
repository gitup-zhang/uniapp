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
        <text class="navbar-title">公告</text>
      </view>
    </template>
  </uni-nav-bar>
  <view class="example-body">
  				<uni-title type="h1" :title="notice.noticedetail.title"></uni-title>
	</view>
	<uni-section class="mb-10" title="公告详情"  type="line" titleFontSize="16px"></uni-section>
	
	
	<mp-html :content="content" :container-style="style"/>
		<!-- <tinymce v-model="content"></tinymce> -->
  
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref,onMounted} from 'vue'
import {useNoticeStore} from '@/store/Notice.js'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
import tinymce from '@/components/Tinymce/index.vue'




// 跳转接受到的公告id
let id=ref()
const content=ref("")
// 富文本样式
const style="padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);"
// 获得pinia对象
const notice=useNoticeStore()


onLoad(async(option) => {
 id = decodeURIComponent(option.id)
  console.log('接收到的ID：', id)
  await notice.getnoticedetailstore(id)
  content.value=notice.noticedetail.content
  
  console.log(content.value)
})

function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
