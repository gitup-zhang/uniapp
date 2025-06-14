import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyDetail } from '@/new-apis/policy.js'

export const usePolicyDetailStore=defineStore('policydetail',()=>{
	// 获取的政策信息
	const detail=ref({})
	
	const getpolicydetail = async (params) => {
	  uni.showLoading({
	    title: '加载中...',
	    mask: true
	  })
	  try {
	    detail.value = {}
	    const res = await getPolicyDetail(params)
	    console.log('接口返回成功:', res)
	    detail.value = res.data
	    console.log('详情数据已更新:', detail.value)
	  } catch (error) {
	    console.error('获取政策详情失败:', error)
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
		getpolicydetail
	}
})