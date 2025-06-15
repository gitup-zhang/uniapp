<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue  title="为您推荐" >
		<template v-slot:body>
		<view class="recommend-list">
		  <view class="recommend-item" @click="handleMoremsg">
		    <view class="icon-wrapper policy-icon">
		      <image src="/static/policy.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">政府政策</text>
		  </view>
		
		  <view class="recommend-item" @click="handleMorenew">
		    <view class="icon-wrapper news-icon">
		      <image src="/static/news.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">行业新闻</text>
		  </view>
		</view>
		</template>
	</showInforVue>
	<!-- 公告信息 -->
	 <view class="notice-card-container">
	     <view class="notice-card">
	       <view class="notice-card-left">
	         <text class="notice-card-title">系统</text>
	         <text class="notice-card-title">公告</text>
	       </view>
	       <view class="notice-card-right">
			<swiper class="notice-card-right" autoplay="true" vertical="true" interval="4000" circular="true">
			<swiper-item v-for="item in notice">
	         <text class="notice-card-desc">{{item}}</text>
			 </swiper-item>
			 </swiper>
	       </view>
	     </view>
	   </view>
	<!-- 政策和新闻 -->
	 <showInforVue  title="精选政策" >
		 <template v-slot:more>
			 <view  class="more-text" @click="handleMoremsg">更多信息 ></view>
		 </template>
		 
		<template v-slot:body>
	 <view class="news-item">
	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
	     <view class="news-content">
	       <view class="news-title">精选</view>
	       <view class="news-summary">精选</view>
	       <view v-if="true" class="hot-tag">最热</view>
	     </view>
	   </view>
	   </template> 
  </showInforVue>
  <showInforVue  title="精选新闻" >
	  <template v-slot:more>
		  <view  class="more-text" @click="handleMorenew">更多信息 ></view>
	  </template>
	  <template v-slot:body>
  	 <view class="news-item">
  	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
  	     <view class="news-content">
  	       <view class="news-title">精选</view>
  	       <view class="news-summary">精选</view>
  	       <view v-if="true" class="hot-tag">最热</view>
  	     </view>
  	   </view>
	   </template>
  </showInforVue>
  </view>
 
</template>


<script setup>
import {ref} from 'vue'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
import { getPolicyList , getExampleList} from '@/new-apis/policy.js'


let notice=ref(["公告1.。。。。。。。。。","公告2.。。。。。。。。。。。","公告3.。。。。。。。。。。。。。"])

// 获取更多新闻和政策
function handleMorenew(){
	uni.switchTab({
		url: '../news/news'
	});

}
function handleMoremsg(){
	uni.switchTab({
		url: '../policy/policy'
	});
	
}



    

</script>

<style lang='scss'>
@import "../../style/index.css";
</style>