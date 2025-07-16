import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNewList} from '@/new-apis/new.js'

export const useNewStore=defineStore('newlist',()=>{
	// 获取的列表
	const listnew=ref([])
	const page =ref(1)
	// 加载状态
	const loading = ref(false)
	const hasMore = ref(true)
	
	const getlistnew=async(parmas)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			console.log(listnew)
			const res=await getNewList(parmas)
			page.value=res.page
			if(res.page*res.page_size<res.total){
					  hasMore.value=true
			}else{
					  hasMore.value=false
			}
			console.log(hasMore.value)
			listnew.value=res.data
			
		}catch(error){
			console.log(error)
		}finally{
			
			uni.hideLoading()
		}
		
		
		
	}
	// 加载更多
	const getmorelist=async(parma)=>{
		if(loading.value||!hasMore.value) return
		try{
				 loading.value=true 
				 
				const res = await getNewList(parma)
				page.value=res.page
				if(res.page*res.page_size<res.total){
						  hasMore.value=true
				}else{
						  hasMore.value=false
				}
				// 拼接新数据
				listnew.value=listnew.value.concat(res.data)
		}catch(error){
				  
		}finally{
				  loading.value=false
		}
		
	}
	
	
	// 搜索功能
	const searchnewlist=async(params)=>{
		
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			console.log(listnew)
			const res=await getNewList(params)
			page.value=res.page
			if(res.page*res.page_size<res.total){
					  hasMore.value=true
			}else{
					  hasMore.value=false
			}
			listnew.value=res.data
			
		}catch(error){
			console.log(error)
		}finally{
			
			uni.hideLoading()
		}
		
	}
	
	return{
		listnew,
		getlistnew,
		searchnewlist,
		getmorelist,
		loading,
		hasMore,
		page
		
	}
})
