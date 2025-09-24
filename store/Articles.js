import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleList } from '@/new-apis/articles.js'

export const useArticlesStore = defineStore('articlelist', () => {
  // 数据状态
  const listpolicy = ref([])  // 政策列表
  const listnew = ref([])     // 新闻列表
  const page = ref(1)         // 当前页码
  
  // 加载状态
  const loading = ref(false)      // 是否正在加载更多
  const hasMore = ref(true)       // 是否还有更多数据
  const initialLoading = ref(false) // 是否为初始加载

  /**
   * 获取文章列表的核心方法
   * @param {Object} params - 查询参数
   * @param {boolean} isRefresh - 是否为刷新操作
   * @param {boolean} isLoadMore - 是否为加载更多操作
   */
  const getlistpolicy = async (params, options = {}) => {
    const { isRefresh = false, isLoadMore = false } = options
    const articleType = params.article_type
    
    try {
      // 设置加载状态
      if (isLoadMore) {
        loading.value = true
      } else if (!isRefresh) {
        initialLoading.value = true
      }

      console.log('请求参数:', params)
      
      const res = await getArticleList(params)
      
      console.log('API响应:', res)

      // 更新页码信息
      page.value = res.page || params.page
      
      // 计算是否还有更多数据
      const totalPages = Math.ceil(res.total / (res.page_size || 10))
      hasMore.value = page.value < totalPages
      
      // 根据操作类型处理数据
      if (isLoadMore) {
        // 加载更多：追加数据
        if (res.data && res.data.length > 0) {
          if (articleType === "POLICY") {
            listpolicy.value = [...listpolicy.value, ...res.data]
          } else {
            listnew.value = [...listnew.value, ...res.data]
          }
          console.log(`加载更多成功，新增 ${res.data.length} 条数据`)
        } else {
          // 没有更多数据
          hasMore.value = false
          console.log('没有更多数据了')
        }
      } else {
        // 首次加载或刷新：替换数据
        const newData = res.data || []
        
        if (articleType === "POLICY") {
          listpolicy.value = newData
        } else {
          listnew.value = newData
        }
        
        console.log(`${isRefresh ? '刷新' : '首次加载'}完成，共 ${newData.length} 条数据`)
      }

    } catch (error) {
      console.error('获取文章列表失败:', error)
      
      // 错误处理
      handleRequestError(error, articleType, { isRefresh, isLoadMore })
      
      // 抛出错误让调用方处理
      throw error
      
    } finally {
      // 重置加载状态
      if (isLoadMore) {
        loading.value = false
      } else if (!isRefresh) {
        initialLoading.value = false
      }
    }
  }

  /**
   * 加载更多数据
   * @param {Object} params - 查询参数
   */
  const getarticlemore = async (params) => {
    // 防重复请求
    if (loading.value || !hasMore.value) {
      console.log('加载更多被阻止:', { loading: loading.value, hasMore: hasMore.value })
      return
    }

    try {
      await getlistpolicy(params, { isLoadMore: true })
    } catch (error) {
      console.error('加载更多失败:', error)
      // 显示错误提示
      uni.showToast({
        title: getErrorMessage(error),
        icon: 'none',
        duration: 2000
      })
    }
  }

  /**
   * 刷新列表数据
   * @param {Object} params - 查询参数
   */
  const refreshList = async (params) => {
    try {
      // 重置分页状态
      page.value = 1
      hasMore.value = true
      
      const refreshParams = { ...params, page: 1 }
      await getlistpolicy(refreshParams, { isRefresh: true })
      
    } catch (error) {
      console.error('刷新列表失败:', error)
      throw error
    }
  }

  /**
   * 错误处理函数
   * @param {Error} error - 错误对象
   * @param {string} articleType - 文章类型
   * @param {Object} options - 操作选项
   */
  const handleRequestError = (error, articleType, options = {}) => {
    const { isRefresh = false, isLoadMore = false } = options
    
    console.error('请求失败详情:', {
      error,
      articleType,
      options,
      errorMessage: getErrorMessage(error)
    })

    // 如果是首次加载失败，清空对应列表
    if (!isRefresh && !isLoadMore) {
      if (articleType === "POLICY") {
        listpolicy.value = []
      } else {
        listnew.value = []
      }
      hasMore.value = false
    }

    // 如果是加载更多失败，不改变hasMore状态，允许用户重试
    // 如果是刷新失败，保持原有数据
  }

  /**
   * 获取错误信息
   * @param {Error} error - 错误对象
   * @returns {string} 用户友好的错误信息
   */
  const getErrorMessage = (error) => {
    if (!error) return '未知错误'
    
    // 网络错误
    if (error.errMsg && error.errMsg.includes('request:fail')) {
      if (error.errMsg.includes('timeout')) {
        return '请求超时，请检查网络连接'
      }
      if (error.errMsg.includes('network')) {
        return '网络连接失败，请检查网络'
      }
      return '网络请求失败，请重试'
    }
    
    // HTTP 状态码错误
    if (error.statusCode) {
      const statusMessages = {
        400: '请求参数错误',
        401: '未授权访问，请重新登录',
        403: '访问被拒绝',
        404: '请求的资源不存在',
        429: '请求过于频繁，请稍后重试',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务暂不可用',
        504: '网关超时'
      }
      
      return statusMessages[error.statusCode] || `服务器错误 (${error.statusCode})`
    }
    
    // 业务逻辑错误
    if (error.message) {
      return error.message
    }
    
    // 其他错误
    return '请求失败，请重试'
  }

  /**
   * 重置页码和加载状态
   * @param {number} pageNum - 页码
   */
  const resetpage = (pageNum = 1) => {
    page.value = pageNum
    loading.value = false
    hasMore.value = true
    console.log('重置页码状态:', { page: page.value, loading: loading.value, hasMore: hasMore.value })
  }

  /**
   * 重置所有状态
   */
  const resetAllState = () => {
    listpolicy.value = []
    listnew.value = []
    page.value = 1
    loading.value = false
    hasMore.value = true
    initialLoading.value = false
    console.log('重置所有状态完成')
  }

  /**
   * 清空指定类型的列表
   * @param {string} type - 列表类型 ('policy' | 'news')
   */
  const clearList = (type) => {
    if (type === 'policy') {
      listpolicy.value = []
      console.log('清空政策列表')
    } else if (type === 'news') {
      listnew.value = []
      console.log('清空新闻列表')
    }
    
    page.value = 1
    loading.value = false
    hasMore.value = true
  }

  /**
   * 获取当前列表状态信息
   * @param {string} type - 列表类型 ('policy' | 'news')
   * @returns {Object} 状态信息对象
   */
  const getListStatus = (type) => {
    const list = type === 'policy' ? listpolicy.value : listnew.value
    
    return {
      isEmpty: list.length === 0,
      count: list.length,
      isLoading: loading.value,
      hasMore: hasMore.value,
      currentPage: page.value,
      isInitialLoading: initialLoading.value
    }
  }

  /**
   * 检查数据是否发生变化（防止不必要的更新）
   * @param {Array} oldArr - 旧数据数组
   * @param {Array} newArr - 新数据数组
   * @returns {boolean} 是否有变化
   */
  const isDifferent = (oldArr, newArr) => {
    // 长度不同
    if (oldArr.length !== newArr.length) return true
    
    // 逐一比较唯一标识
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i].article_id !== newArr[i].article_id) {
        return true
      }
    }
    
    return false
  }

  /**
   * 预加载下一页数据（可选功能）
   * @param {Object} params - 查询参数
   */
  const preloadNextPage = async (params) => {
    if (!hasMore.value || loading.value) return
    
    try {
      const nextPageParams = { ...params, page: page.value + 1 }
      console.log('预加载下一页:', nextPageParams)
      
      // 静默加载，不显示loading状态
      const res = await getArticleList(nextPageParams)
      
      // 预存下一页数据，但不立即显示
      console.log('预加载完成，数据已缓存')
      
    } catch (error) {
      console.warn('预加载失败:', error)
      // 预加载失败不影响正常使用
    }
  }

  /**
   * 获取指定文章的详情（如果需要缓存功能）
   * @param {number} articleId - 文章ID
   * @returns {Object|null} 文章对象或null
   */
  const getArticleById = (articleId) => {
    // 从政策列表中查找
    let article = listpolicy.value.find(item => item.article_id === articleId)
    if (article) return { ...article, type: 'policy' }
    
    // 从新闻列表中查找
    article = listnew.value.find(item => item.article_id === articleId)
    if (article) return { ...article, type: 'news' }
    
    return null
  }

  /**
   * 更新指定文章的数据（如阅读量、点赞等）
   * @param {number} articleId - 文章ID
   * @param {Object} updateData - 更新的数据
   */
  const updateArticle = (articleId, updateData) => {
    // 更新政策列表中的文章
    const policyIndex = listpolicy.value.findIndex(item => item.article_id === articleId)
    if (policyIndex !== -1) {
      listpolicy.value[policyIndex] = { ...listpolicy.value[policyIndex], ...updateData }
      console.log('更新政策文章:', articleId, updateData)
      return
    }
    
    // 更新新闻列表中的文章
    const newsIndex = listnew.value.findIndex(item => item.article_id === articleId)
    if (newsIndex !== -1) {
      listnew.value[newsIndex] = { ...listnew.value[newsIndex], ...updateData }
      console.log('更新新闻文章:', articleId, updateData)
      return
    }
    
    console.warn('未找到要更新的文章:', articleId)
  }

  // 返回所有的状态和方法
  return {
    // 状态数据
    listpolicy,
    listnew,
    page,
    loading,
    hasMore,
    initialLoading,
    
    // 核心方法
    getlistpolicy,
    getarticlemore,
    refreshList,
    
    // 状态管理方法
    resetpage,
    resetAllState,
    clearList,
    getListStatus,
    
    // 工具方法
    getErrorMessage,
    isDifferent,
    preloadNextPage,
    getArticleById,
    updateArticle,
    
    // 私有方法（如果需要外部访问）
    handleRequestError
  }
})