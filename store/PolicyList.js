import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyList } from '@/new-apis/policy.js'

export const usePolicyStore = defineStore('policylist', () => {
	// 获取的列表
  const listpolicy = ref([])
  // 是否正确返回信息标志位与信息
  const message=ref("")
  

  const getlistpolicy = async () => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
		message.value=""
	
      const res = await getPolicyList({})  // 正确使用 await
      console.log('示例数据：', res.data)
      listpolicy.value = res.data           // 正常赋值
    } catch (error) {
		message.value=error.data.error
      console.log(message.value)
    } finally {
      uni.hideLoading()
    }
  }

  return {
    getlistpolicy,
    listpolicy,
	message
  }
})
