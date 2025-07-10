import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNewList} from '@/new-apis/new.js'
import { getPolicyList } from '@/new-apis/policy.js'

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
				  const res_new=await getNewList({is_selection:1,page_size:1})
				  
				  news.value=res_new.data
				  const res_policy=await getPolicyList({is_selection:1,page_size:1})
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