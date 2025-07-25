<template>
  <view class="page">
    <!-- 顶部固定导航栏 -->
    <uni-nav-bar statusBar="true" backgroundColor="#903749" fixed="true">
      <template v-slot:left>
        <view class="navbar-title">政策</view>
      </template>
    </uni-nav-bar>

    <!-- 搜索栏 + 筛选栏 -->
    <view class="fixed-top">
      <uni-search-bar 
        @confirm="search" 
        placeholder="搜索政策或新闻" 
        v-model="searchbar" 
        @cancel="cancel">
      </uni-search-bar>
	  
	  <!-- tab切换 -->
	    <view>
	      <Tabswitch v-model="activeTab" />
	  
	      <view v-if="activeTab === 'policy'">
	        <!-- 政府政策内容 -->
	      </view>
	      <view v-else>
	        <!-- 行业新闻内容 -->
	      </view>
	    </view>
	  

      <view class="filter-wrapper">
        <view class="filter-bar">
          <!-- 领域筛选 -->
          <view class="filter-item" @click="toggleDropdown('domain')">
            {{ selectedDomain.field_name || '全部领域' }}
            <view class="arrow" :class="{ open: currentDropdown === 'domain' }"></view>
          </view>

          <!-- 时间筛选 -->
          <view class="filter-item" @click="toggleDropdown('time')">
            {{ selectedTime }}
            <view class="arrow" :class="{ open: currentDropdown === 'time' }"></view>
          </view>
        </view>

        <!-- 领域下拉 -->
        <view v-if="currentDropdown === 'domain'" class="dropdown-list">
          <view 
            class="dropdown-item" 
            @click="selectOption('domain', null)" 
            :class="{ selected: selectedDomain.field_id === 0 }">
            全部
          </view>
          <view 
            class="dropdown-item" 
            v-for="item in field.fieldlist" 
            :key="item.field_id"
            @click="selectOption('domain', item)" 
            :class="{ selected: selectedDomain.field_id === item.field_id }">
            {{ item.field_name }}
          </view>
        </view>

        <!-- 时间下拉 -->
        <view v-if="currentDropdown === 'time'" class="dropdown-list">
          <view 
            class="dropdown-item" 
            v-for="item in timeList" 
            :key="item"
            @click="selectOption('time', item)" 
            :class="{ selected: selectedTime === item }">
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <!-- 政策列表 -->
	 <view v-if="activeTab === 'policy'">
    <scroll-view class="news-scroll" scroll-y="true" @scrolltolower="loadMore">
      <view>
        <uni-card 
          v-for="item in listarticles.listpolicy" 
          :key="item.article_id"
          :title="item.article_title" 
          :extra="Dataformat(item.release_time)"
          @click="OnClick(item.article_id)">
          <text>{{ item.brief_content }}</text>
        </uni-card>

        <view v-if="listarticles.loading" class="loading">加载中...</view>
        <view v-else-if="!listarticles.hasMore" class="no-more">没有更多内容</view>
      </view>
    </scroll-view>
	</view>
	<!-- 新闻列表 -->
	<view v-else>
	  <scroll-view class="news-scroll" scroll-y="true" @scrolltolower="loadMore">
	    <view>
	      <!-- <uni-card
	        v-for="item in listarticles.listnew"
	        :key="item.article_id"
	        :title="item.article_title"
	        :extra="Dataformat(item.release_time)"
	        :thumbnail="item.cover_image_url"
	        @click="OnClick(item.article_id)">
	        <text class="uni-body">{{ item.brief_content }}</text>
	      </uni-card> -->
		  <ArticleCard 
		        v-for="item in newsList" 
		               :key="item.id"
		               :newsData="item"
		               @click="handleNewsClick"   
			/>
	      <view v-if="listarticles.loading" class="loading">加载中...</view>
	      <view v-else-if="!listarticles.hasMore" class="no-more">没有更多内容</view>
	    </view>
	  </scroll-view>
	  
	</view>
	
	
  </view>
</template>


<script setup>
import { ref, onMounted,watch } from 'vue'
import {useArticlesStore} from '@/store/Articles.js'

import { usefieldstore } from '@/store/field.js'
import { Dataformat } from '../../utils/data'
import { onShow } from '@dcloudio/uni-app'
import Tabswitch from '@/components/Tabswitch/Tabswitch.vue'
import ArticleCard from '@/components/ArticleCard/ArticleCard.vue'

const newsList = ref([
  {
    id: '1',
    title: 'AI技术突破：ChatGPT-5即将发布，性能提升显著',
    summary: '据最新消息，OpenAI即将发布ChatGPT-5，新版本在推理能力、多模态处理和代码生成方面都有显著提升，预计将改变人工智能应用格局。',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    source: '科技日报',
    publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    category: '科技',
    views: 12500,
    likes: 389,
    comments: 67
  },
  {
    id: '2',
    title: '新能源汽车市场持续火热，特斯拉Q4销量创历史新高',
    summary: '特斯拉公布2024年第四季度财报，全球交付量达到48.4万辆，同比增长20%，Model Y成为全球最畅销电动车型。',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    source: '财经时报',
    publishTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
    category: '财经',
    views: 8900,
    likes: 156,
    comments: 34
  },
  {
    id: '3',
    title: '元宇宙概念重新升温，Meta推出全新VR设备',
    summary: 'Meta公司发布了新一代VR头显设备，采用更轻便的设计和更高的分辨率，预计将推动虚拟现实技术普及。',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400',
    source: '虚拟世界',
    publishTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
    category: '数码',
    views: 6700,
    likes: 234,
    comments: 89
  },
  {
    id: '4',
    title: '量子计算领域再获突破，IBM发布1000量子比特处理器',
    summary: 'IBM宣布成功开发出1000量子比特的量子处理器"Condor"，这一突破将为量子计算的商业化应用奠定重要基础。',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    source: '量子科学',
    publishTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    category: '科学',
    views: 4500,
    likes: 178,
    comments: 45
  }
])


const listarticles = useArticlesStore()
const field = usefieldstore()

const activeTab = ref('policy')

// 搜索栏
const searchbar = ref("")

// 当前打开的下拉框
const currentDropdown = ref(null)

// 是否精选
const isselected=ref(0)

// 初始值设为“全部”
const selectedDomain = ref({ field_id: 0, field_name: '全部' })
const selectedTime = ref('发布时间')

// 时间列表
const timeList = ['全部', '最近一周', '最近一月', '最近一年']

// 定义参数查询的结构体
const Params = { 
  field_id: 0,
  page: 0,
  is_selection: 0,
  article_title: "",
  release_time:"",
  article_type:activeTab.value.toUpperCase()
};

// 监视器，监控activeTab的变化
watch(activeTab, (newVal, oldVal) => {
  console.log('Tab 变化:', oldVal, '=>', newVal)
  if (newVal === 'news') {
    listarticles.resetpage(1)
	Params.article_type="NEWS"
  } else if (newVal === 'policy') {
    listarticles.resetpage(1)
	Params.article_type="POLICY"
  }
})

// 搜索
function search() {
	Params.article_title=searchbar.value
	Params.page=1
  listarticles.getlistpolicy(Params)
  console.log("搜索关键词:", searchbar.value)
}

// 取消搜索
function cancel() {
  searchbar.value = ""
  Params.page=1
  Params.article_title=searchbar.value
  listarticles.getlistpolicy(Params)
}

// 加载更多
function loadMore() {
 Params.page=listarticles.page+1
listarticles.getarticlemore(Params)
  console.log("到底了")
}

// 切换下拉框
function toggleDropdown(type) {
  currentDropdown.value = currentDropdown.value === type ? null : type
}

// 选择筛选项
function selectOption(type, value) {
  if (type === 'domain') {
    if (value === null) {
      selectedDomain.value = { field_id: 0, field_name: '全部' }
	  Params.page=1
	  Params.field_id=selectedDomain.value.field_id
      listarticles.getlistpolicy(Params)
    } else {
      selectedDomain.value = value
	  Params.page=1
	  Params.field_id=selectedDomain.value.field_id
      listarticles.getlistpolicy(Params)
    }
  }

  if (type === 'time') {
    selectedTime.value = value
  }

  currentDropdown.value = null
}

// 跳转详情
function OnClick(id) {
	console.log("测试的Id:"+id)
  uni.navigateTo({
    url: `/pages/detail/articledetail?id=${id}`
  })
}
// 在页面显示时判断来源
onShow(() => {
  const source = uni.getStorageSync('tabSource') || 'tabbar'
		field.getfield()
  if (source === 'switchTab') {
    console.log('来源：通过 uni.switchTab() 跳转');
	Params.is_selection=1
	Params.page=1
	listarticles.getlistpolicy(Params)
	Params.article_type="NEWS"
	listarticles.getlistpolicy(Params)
	Params.article_type=activeTab.value.toUpperCase()
  } else {
    console.log('来源：用户点击 tabBar 进入');
	isselected.value=0
	Params.page=1
	listarticles.getlistpolicy(Params)
	Params.article_type="NEWS"
	listarticles.getlistpolicy(Params) 
	Params.article_type=activeTab.value.toUpperCase()
  }

  // 清除标记，避免干扰下一次跳转
  uni.removeStorageSync('tabSource')
})

</script>

<style>
@import url("../../style/new_policy.css");
.dropdown-list {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4rpx;
  margin-top: 10rpx;
}

.dropdown-item {
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.dropdown-item.selected {
  background-color: #f0f0f0;
  font-weight: bold;
}

.filter-item {
  /* padding: 20rpx;
  font-size: 30rpx; */
   padding: 12rpx 20rpx;
   font-size: 30rpx;
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.arrow.open {
  transform: rotate(180deg);
}
.loading,
.no-more {
  text-align: center;
  color: #999;
  padding: 20rpx;
}

</style>