import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyList } from '@/new-apis/policy.js'

export const usePolicyStore = defineStore('policylist', () => {
  const listpolicy = ref([])

  const getlistpolicy = async () => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
      const res = await getPolicyList({})  // 正确使用 await
      console.log('示例数据：', res.data)
      listpolicy.value = res.data           // 正常赋值
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      uni.hideLoading()
    }
  }

  return {
    getlistpolicy,
    listpolicy
  }
})
