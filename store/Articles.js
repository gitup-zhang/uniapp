import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getArticleList} from '@/new-apis/articles.js'

export const useArticlesStore=defineStore('articlelist',()=>{
	// 获取到的政策列表
	const listpolicy=ref([])
	const page=ref(1)
	// 获取到的新闻列表
	const listnew=ref([])
	const pagenew=ref(1)
	
	// 加载状态
	const loading = ref(false)
	const hasMore = ref(true)
	

	
	// 获取政策列表
	const getlistpolicy=async(params)=>{
  let signal = params.article_type; 

		 loading.value=false
		 hasMore.value=true
		
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			const res=await getArticleList(params)
			page.value=res.page
			if(res.page*res.page_size<res.total){
					  hasMore.value=true
			}else{
					  hasMore.value=false
			}
			if(signal==="POLICY"){

			listpolicy.value = res.data
			 }
			 else{
			
			listnew.value=res.data
			 }
		}catch(error){
			
			console.log(error)
		}finally{
		
			uni.hideLoading()
		}
		
	}
	const getarticlemore=async(params)=>{
		let signal = params.article_type; 
		
		
		if(loading.value||!hasMore.value) return
		
		
		try{
			
			
				 loading.value=true 
				 
				const res = await getArticleList(params)
				page.value=res.page
				if(res.page*res.page_size<res.total){
						  hasMore.value=true
				}else{
						  hasMore.value=false
				}
				// 拼接新数据
				if(signal==="POLICY"){
					
				listpolicy.value=listpolicy.value.concat(res.data)
				 }
				 else{
					 
				listnew.value=listnew.value.concat(res.data)
				 }
				
		}catch(error){
			console.log(error)
				  
		}finally{
				  loading.value=false
		}
		
	}
	// 重置page页码和加载状态
	function resetpage(num){
		page.value=num
		loading.value=false
		hasMore.value=true
	}
	
	return {
	listpolicy,
	page,
	loading,
	hasMore,
	getlistpolicy,
	getarticlemore,
	listnew,
	resetpage
	}
	
	
})
