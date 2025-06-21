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
  				<uni-title type="h1" :title="newdetail.detail.new_title"></uni-title>
	</view>
	<uni-section class="mb-10" title="新闻内容"  type="line" titleFontSize="16px"></uni-section>
	<mp-html :content="newdetail.detail.new_content" :container-style="style"/>
  
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref,onMounted} from 'vue'
import { useNewDetailStore } from '../../store/NewDetail'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
// 跳转的新闻id
let id=ref()

// 初始化pinia对象
const newdetail=useNewDetailStore()



// 富文本样式
const style="padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);"

// 界面加载钩子函数
onLoad(async(option)=>{
	id = decodeURIComponent(option.id)
	 console.log('接收到的ID：', id)
	await newdetail.getnewdetail(id)
	
})
	
// 返回逻辑
function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
