import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNewList} from '@/new-apis/new.js'

export const useNewStore=defineStore('newlist',()=>{
	// 获取的列表
	const listnew=ref([])
	
	
	const getlistnew=async()=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			const res=await getNewList({})
			listnew.value=res.data
			
		}catch(error){
			console.log(error)
		}finally{
			
			uni.hideLoading()
		}
		
		
		
	}
	
	return{
		listnew,
		getlistnew
		
	}
})
