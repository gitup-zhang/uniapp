import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getnotice } from '../new-apis/index.js'

export const useNoticeStore=defineStore('notice',()=>{
	const notice=ref([])
	
	const getnoticestore=async()=>{
		uni.showLoading({
			title:'加载中',
			mask:true
		})
		try{
			const res=await getnotice()
			notice.value=res.data
			
		}catch(error){
			console.log(error)
		}finally{
			uni.hideLoading()
		}
		
		
		
	}
	return{
		notice,
		getnoticestore
		
	}
	
})