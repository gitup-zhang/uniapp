<template> 
	<DetailNavbar title="新闻"></DetailNavbar>
	

	<uni-search-bar @confirm="search" placeholder="搜索行业新闻" v-model="searchbar" @cancel="cancel"></uni-search-bar>

	<uni-segmented-control
		:current="current"
		:values="value"
		@clickItem="onClickItem"
		styleType="text"
		activeColor="#ff0000"
	></uni-segmented-control>


	<!-- 下拉框 -->
	<view class="filter-container">
	  <uni-data-select
	    class="filter-item"
	    v-model="selectedBrand"
	    :localdata="brandOptions"
	    placeholder="品牌"
	  />
	  <uni-data-select
	    class="filter-item"
	    v-model="selectedType"
	    :localdata="typeOptions"
	    placeholder="类型"
	  />
	</view>

</template>

<script setup>
import { ref, computed } from 'vue'
import DetailNavbarVue from '../../components/DetailNavbar/DetailNavbar.vue'

// 搜索栏绑定值
const searchbar = ref("")

// 分段器初始值
const current = ref(0)
const classify = [
	{ key: "all", value: "全部" },
	{ key: "k1", value: "分类1" },
	{ key: "k2", value: "分类2" }
]
const value = computed(() => classify.map(item => item.value))

// 搜索栏函数
function search() {
	console.log(searchbar.value)
}
function cancel() {
	searchbar.value = ""
}

// 下拉框
const brandOptions = [
  { value: 0, text: '苹果' },
  { value: 1, text: '华为' },
  { value: 2, text: '小米' }
]

const typeOptions = [
  { value: 0, text: '保护壳' },
  { value: 1, text: '贴膜' },
  { value: 2, text: '充电器' }
]

const phoneOptions = [
  { value: 0, text: 'iPhone 13' },
  { value: 1, text: 'Mate 40' },
  { value: 2, text: '小米 11' }
]

// 绑定的变量
const selectedBrand = ref(null)
const selectedType = ref(null)
const selectedPhone = ref(null)
</script>


<style scoped>

.filter-container {
  display: flex;
  justify-content: flex-start;
  padding: 10rpx 20rpx;
  background-color: #ffffff;
}

.filter-item {
  width: 200rpx; /* 你可以根据实际设计需求调整 */
  margin-right: 20rpx;
  background-color: #ffffff;
  border-radius: 50rpx;
  padding: 10rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  text-align: center;
}


.filter-item:last-child {
  margin-right: 0;
}

</style>
