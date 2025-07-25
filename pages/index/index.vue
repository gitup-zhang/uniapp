<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue  title="为您推荐" >
		<template v-slot:body>
		<view class="recommend-list">
		  <view class="recommend-item" @click="handleMorearticle">
		    <view class="icon-wrapper policy-icon">
		      <image src="/static/icon/policy_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">政府政策</text>
		  </view>
		
		  <view class="recommend-item" @click="handleMorearticle">
		    <view class="icon-wrapper news-icon">
		      <image src="/static/icon/new_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">行业新闻</text>
		  </view>
		  
		  <view class="recommend-item" @click="handleMoreactivity">
		    <view class="icon-wrapper activity-icon">
		      <image src="/static/icon/convention_index.png" class="icon-image" mode="aspectFit" />
		    </view>
		    <text class="label">大会报名</text>
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
			<swiper-item v-for="item in usenotice.notice" :key="item.id">
	         <text class="notice-card-desc">{{item.content}}</text>
			 </swiper-item>
			 </swiper>
	       </view>
	     </view>
	   </view>
	   
	   <!-- 热门活动 -->
	   <showInforVue  title="热门活动" >
	   	  <template v-slot:more>
	   		  <view  class="more-text" @click="handleMoreactivity">更多信息 ></view>
	   	  </template>
	   	  <template v-slot:body>
	   	 <view class="news-item" v-for="item in selected.news" :key="item.article_id" @click="onclickactivity(item.article_id)">
	   	     <image class="news-image" :src="item.cover_image_url" mode="aspectFill"></image>
	   	     <view class="news-content">
	   	       <view class="news-title">{{item.article_title}}</view>
	   	       <view class="news-summary">精选</view>
	   	       <view v-if="true" class="hot-tag">最热</view>
	   	     </view>
	   	   </view>
	   	   </template>
	   </showInforVue>
	<!-- 政策和新闻 -->
	 <showInforVue  title="精选政策" >
		 <template v-slot:more>
			 <view  class="more-text" @click="handleMorearticle">更多信息 ></view>
		 </template>
		 
		<template v-slot:body>
	 <view class="news-item" v-for="item in selected.policys" :key="item.article_id" @click="onclickactivity(item.article_id)">
	     <image class="news-image" src="/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg" mode="aspectFill"></image>
	     <view class="news-content">
	       <view class="news-title">{{item.article_title}}</view>
	       <view class="news-summary">精选</view>
	       <view v-if="true" class="hot-tag">最热</view>
	     </view>
	   </view>
	   </template> 
  </showInforVue>
  <showInforVue  title="精选新闻" >
	  <template v-slot:more>
		  <view  class="more-text" @click="handleMorearticle">更多信息 ></view>
	  </template>
	  <template v-slot:body>
  	 <view class="news-item" v-for="item in selected.news" :key="article_id" @click="onclickactivity(item.article_id)">
  	     <image class="news-image" :src="item.cover_image_url" mode="aspectFill"></image>
  	     <view class="news-content">
  	       <view class="news-title">{{item.article_title}}</view>
  	       <view class="news-summary">精选</view>
  	       <view v-if="true" class="hot-tag">最热</view>
  	     </view>
  	   </view>
	   </template>
  </showInforVue>
  
  </view>
 
</template>


<script setup>
import {ref,onMounted} from 'vue'
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
import {useNoticeStore} from '@/store/Notice.js'
import {useSelectedstore} from '@/store/Home.js'

// 获得公告对象
const usenotice=useNoticeStore()
// 获得精选对象
const selected=useSelectedstore()


// 获取更多新闻和政策
function handleMorearticle(){
	uni.setStorageSync('tabSource', 'switchTab');
	uni.switchTab({
		url: '../policy/policy'
	});

}
// 获取更多活动
function handleMoreactivity(){
	uni.switchTab({
		url: '../news/news'
	});
	
	
}


// 获取精选的政策和新闻信息

function onclickactivity(id){
	console.log(id)
	uni.navigateTo({
	  url: `/pages/detail/articledetail?id=${id}`
	})
}


// 初始化
onMounted(()=>{
	usenotice.getnoticestore()
	selected.getselected()
})
    

</script>

<style lang='scss'>
@import "../../style/index.css";
</style>