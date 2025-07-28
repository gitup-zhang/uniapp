import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getArticleList} from '@/new-apis/articles.js'

export const useSelectedstore=defineStore('selected',()=>{
	// 精选政策
	const policys=ref([])
	// 精选新闻
	const news=ref([])
	
	const getselected=async()=>{
			  
			  uni.showLoading({
			    title: '加载中...',
			    mask: true
			  })
			  try{
				  const res_new=await getArticleList({is_selection:1,page_size:8,article_type:"NEWS"})
				  
				  news.value=res_new.data
				  const res_policy=await getArticleList({is_selection:1,page_size:8,article_type:"POLICY"})
				  policys.value=res_policy.data
				  
			  }catch(error){
				  console.log(error)
			  }finally{
				  uni.hideLoading()
			  }
			  
			  
	}
	return{
				  news,
				  policys,
				 getselected 
			  }
	
})