"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const useArticlesStore = common_vendor.defineStore("articlelist", () => {
  const listpolicy = common_vendor.ref([]);
  const listnew = common_vendor.ref([]);
  const page = common_vendor.ref(1);
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const initialLoading = common_vendor.ref(false);
  const getlistpolicy = async (params, options = {}) => {
    const { isRefresh = false, isLoadMore = false } = options;
    const articleType = params.article_type;
    try {
      if (isLoadMore) {
        loading.value = true;
      } else if (!isRefresh) {
        initialLoading.value = true;
      }
      console.log("请求参数:", params);
      const res = await newApis_articles.getArticleList(params);
      console.log("API响应:", res);
      page.value = res.page || params.page;
      const totalPages = Math.ceil(res.total / (res.page_size || 10));
      hasMore.value = page.value < totalPages;
      if (isLoadMore) {
        if (res.data && res.data.length > 0) {
          if (articleType === "POLICY") {
            listpolicy.value = [...listpolicy.value, ...res.data];
          } else {
            listnew.value = [...listnew.value, ...res.data];
          }
          console.log(`加载更多成功，新增 ${res.data.length} 条数据`);
        } else {
          hasMore.value = false;
          console.log("没有更多数据了");
        }
      } else {
        const newData = res.data || [];
        if (articleType === "POLICY") {
          listpolicy.value = newData;
        } else {
          listnew.value = newData;
        }
        console.log(`${isRefresh ? "刷新" : "首次加载"}完成，共 ${newData.length} 条数据`);
      }
    } catch (error) {
      console.error("获取文章列表失败:", error);
      handleRequestError(error, articleType, { isRefresh, isLoadMore });
      throw error;
    } finally {
      if (isLoadMore) {
        loading.value = false;
      } else if (!isRefresh) {
        initialLoading.value = false;
      }
    }
  };
  const getarticlemore = async (params) => {
    if (loading.value || !hasMore.value) {
      console.log("加载更多被阻止:", { loading: loading.value, hasMore: hasMore.value });
      return;
    }
    try {
      await getlistpolicy(params, { isLoadMore: true });
    } catch (error) {
      console.error("加载更多失败:", error);
      common_vendor.index.showToast({
        title: getErrorMessage(error),
        icon: "none",
        duration: 2e3
      });
    }
  };
  const refreshList = async (params) => {
    try {
      page.value = 1;
      hasMore.value = true;
      const refreshParams = { ...params, page: 1 };
      await getlistpolicy(refreshParams, { isRefresh: true });
    } catch (error) {
      console.error("刷新列表失败:", error);
      throw error;
    }
  };
  const handleRequestError = (error, articleType, options = {}) => {
    const { isRefresh = false, isLoadMore = false } = options;
    console.error("请求失败详情:", {
      error,
      articleType,
      options,
      errorMessage: getErrorMessage(error)
    });
    if (!isRefresh && !isLoadMore) {
      if (articleType === "POLICY") {
        listpolicy.value = [];
      } else {
        listnew.value = [];
      }
      hasMore.value = false;
    }
  };
  const getErrorMessage = (error) => {
    if (!error)
      return "未知错误";
    if (error.errMsg && error.errMsg.includes("request:fail")) {
      if (error.errMsg.includes("timeout")) {
        return "请求超时，请检查网络连接";
      }
      if (error.errMsg.includes("network")) {
        return "网络连接失败，请检查网络";
      }
      return "网络请求失败，请重试";
    }
    if (error.statusCode) {
      const statusMessages = {
        400: "请求参数错误",
        401: "未授权访问，请重新登录",
        403: "访问被拒绝",
        404: "请求的资源不存在",
        429: "请求过于频繁，请稍后重试",
        500: "服务器内部错误",
        502: "网关错误",
        503: "服务暂不可用",
        504: "网关超时"
      };
      return statusMessages[error.statusCode] || `服务器错误 (${error.statusCode})`;
    }
    if (error.message) {
      return error.message;
    }
    return "请求失败，请重试";
  };
  const resetpage = (pageNum = 1) => {
    page.value = pageNum;
    loading.value = false;
    hasMore.value = true;
    console.log("重置页码状态:", { page: page.value, loading: loading.value, hasMore: hasMore.value });
  };
  const resetAllState = () => {
    listpolicy.value = [];
    listnew.value = [];
    page.value = 1;
    loading.value = false;
    hasMore.value = true;
    initialLoading.value = false;
    console.log("重置所有状态完成");
  };
  const clearList = (type) => {
    if (type === "policy") {
      listpolicy.value = [];
      console.log("清空政策列表");
    } else if (type === "news") {
      listnew.value = [];
      console.log("清空新闻列表");
    }
    page.value = 1;
    loading.value = false;
    hasMore.value = true;
  };
  const getListStatus = (type) => {
    const list = type === "policy" ? listpolicy.value : listnew.value;
    return {
      isEmpty: list.length === 0,
      count: list.length,
      isLoading: loading.value,
      hasMore: hasMore.value,
      currentPage: page.value,
      isInitialLoading: initialLoading.value
    };
  };
  const isDifferent = (oldArr, newArr) => {
    if (oldArr.length !== newArr.length)
      return true;
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i].article_id !== newArr[i].article_id) {
        return true;
      }
    }
    return false;
  };
  const preloadNextPage = async (params) => {
    if (!hasMore.value || loading.value)
      return;
    try {
      const nextPageParams = { ...params, page: page.value + 1 };
      console.log("预加载下一页:", nextPageParams);
      const res = await newApis_articles.getArticleList(nextPageParams);
      console.log("预加载完成，数据已缓存");
    } catch (error) {
      console.warn("预加载失败:", error);
    }
  };
  const getArticleById = (articleId) => {
    let article = listpolicy.value.find((item) => item.article_id === articleId);
    if (article)
      return { ...article, type: "policy" };
    article = listnew.value.find((item) => item.article_id === articleId);
    if (article)
      return { ...article, type: "news" };
    return null;
  };
  const updateArticle = (articleId, updateData) => {
    const policyIndex = listpolicy.value.findIndex((item) => item.article_id === articleId);
    if (policyIndex !== -1) {
      listpolicy.value[policyIndex] = { ...listpolicy.value[policyIndex], ...updateData };
      console.log("更新政策文章:", articleId, updateData);
      return;
    }
    const newsIndex = listnew.value.findIndex((item) => item.article_id === articleId);
    if (newsIndex !== -1) {
      listnew.value[newsIndex] = { ...listnew.value[newsIndex], ...updateData };
      console.log("更新新闻文章:", articleId, updateData);
      return;
    }
    console.warn("未找到要更新的文章:", articleId);
  };
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
  };
});
exports.useArticlesStore = useArticlesStore;
