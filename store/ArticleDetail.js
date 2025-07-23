import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleDetail } from '@/new-apis/articles.js'

export const useArticleDeatilStore=defineStore('articleDetail',()=>{
	// 获取到的文章信息
	const detail=ref({})
	
	const getarticledetail=async(params)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try {
		    detail.value = {}
		    const res = await getArticleDetail(params)
		    console.log('接口返回成功:', res)
		    detail.value = res.data
		    console.log('详情数据已更新:', detail.value)
		  } catch (error) {
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
			detail,
			getarticledetail
			
		}
		
		
		
		
	
	
})
