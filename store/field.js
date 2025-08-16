import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleField } from '../new-apis/articles.js'
import {getIndustory} from '@/new-apis/info.js'


export const usefieldstore=defineStore('field',()=>{
	// 政策领域
	const fieldlist=ref([])
	// 行业列表
	const industory=ref([])
	
	// 政策领域列表
	  const getfield=async()=>{
		  
		  uni.showLoading({
		    title: '加载中...',
		    mask: true
		  })
		  try{
			  const res=await getArticleField()
			  // fieldlist.value=['全部', ...res.data.map(item => item.field_name).sort()];

			   fieldlist.value=res.data
			  console.log(fieldlist.value)
		  }catch(error){
			  console.log(error)
		  }finally{
			  uni.hideLoading()
		  }
		  
	  }
	  // 行业列表
	  const getindustory=async()=>{
		 uni.showLoading({
		   title: '加载中...',
		   mask: true
		 })
		 try{
		 			  const res=await getIndustory()

		 			  industory.value=res.data.map(i => i.industry_name);
		 			  console.log(industory.value)
		 }catch(error){
		 			  console.log(error)
		 }finally{
		 			  uni.hideLoading()
		 } 
	  }
	  
	return{
		fieldlist,
		getfield,
		getindustory,
		industory
	}
	
})