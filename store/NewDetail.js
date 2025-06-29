import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNewDetail} from '@/new-apis/new.js'


export const useNewDetailStore=defineStore('newdetail',()=>{
	// 获取的新闻信息
	const detail=ref({})
	
	const getnewdetail=async(params)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			 detail.value = {}
			 const res=await getNewDetail(params)
			 detail.value=res.data
			
		}catch(error){
			console.log(error)
		}finally{
			
			uni.hideLoading()
		}
	}
	return{
		detail,
		getnewdetail
	}
})