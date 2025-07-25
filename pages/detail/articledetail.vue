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
        <text class="navbar-title">{{articledetail.detail.article_type }}</text>
      </view>
    </template>
  </uni-nav-bar>
  <view class="example-body">
  				<uni-title type="h1" :title="articledetail.detail.article_title"></uni-title>
	</view>
	<uni-section class="mb-10" title="文章详情"  type="line" titleFontSize="16px"></uni-section>
	
	
	<mp-html :content="content" :container-style="style"/>
		<!-- <tinymce v-model="content"></tinymce> -->
  
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref,onMounted} from 'vue'
import {useArticleDeatilStore} from '@/store/ArticleDetail.js'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
import tinymce from '@/components/Tinymce/index.vue'




// 跳转接受到的政策id
let id=ref()
const content=ref("")
// 富文本样式
const style="padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);"
// 获得pinia对象
const articledetail=useArticleDeatilStore()


onLoad(async(option) => {
 id = decodeURIComponent(option.id)
  console.log('接收到的ID：', id)
  await articledetail.getarticledetail(id)
  content.value=articledetail.detail.article_content
  
  console.log(content.value)
})

function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
@import "../../style/detail.css";

</style>
