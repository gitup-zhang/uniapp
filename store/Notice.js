import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getnotice,getnoticedetail } from '../new-apis/index.js'

export const useNoticeStore=defineStore('notice',()=>{
	const notice=ref([])
	const noticedetail=ref({})
	
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
	const getnoticedetailstore=async(id)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			const res=await getnoticedetail(id)
			noticedetail.value=res.data
		}catch (error) {
		    console.error('获取详情失败:', error)
		    uni.showToast({
		      title: '加载失败',
		      icon: 'none'
		    })
		  } finally {
		    uni.hideLoading()
		  }
		
	}
	
	
	
	return{
		notice,
		getnoticestore,
		getnoticedetailstore,
		noticedetail
		
	}
	
})