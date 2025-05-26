<template>
	<DetailNavbar title="新闻"></DetailNavbar>
	
	<uni-search-bar @confirm="search" placeholder="搜索行业新闻" v-model="searchbar" @cancel="cancel"></uni-search-bar>
	
	 <uni-segmented-control :current="current" :values="value" 
	 @clickItem="onClickItem" styleType="text" activeColor="#ff0000"></uni-segmented-control>
	
	
</template>

<script setup>
	import {ref,computed} from 'vue'
	import DetailNavbarVue from '../../components/DetailNavbar/DetailNavbar.vue';
	//搜索栏绑定值
	let searchbar=ref("")
	// 分段器初始值
	let current=ref(0)
	let classify=[{key:"all",value:"全部"},{key:"k1",value:"分类1"},{key:"k2",value:"分类2"}]
	const value=computed(()=>classify.map(item=>item.value))
	// 搜索栏函数
	function search(){
		console.log(searchbar.value)
	}
	function cancel(){
		searchbar.value=""
		
	}
</script>

<style scoped>

</style>
