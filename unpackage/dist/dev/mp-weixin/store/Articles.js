"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const useArticlesStore = common_vendor.defineStore("articlelist", () => {
  const listpolicy = common_vendor.ref([]);
  const page = common_vendor.ref(1);
  const listnew = common_vendor.ref([]);
  const pagenew = common_vendor.ref(1);
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const initialLoading = common_vendor.ref(false);
  const getlistpolicy = async (params) => {
    let signal = params.article_type;
    loading.value = false;
    hasMore.value = true;
    if (!params.isRefresh) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
    }
    try {
      const res = await newApis_articles.getArticleList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      if (signal === "POLICY") {
        if (isDifferent(listpolicy.value, res.data)) {
          listpolicy.value = res.data;
        }
      } else {
        if (isDifferent(listnew.value, res.data)) {
          listnew.value = res.data;
        }
      }
      if (res.page === 1 && (!res.data || res.data.length === 0)) {
        console.log("当前列表为空");
      }
    } catch (error) {
      console.error("获取文章列表失败:", error);
      const errorMessage = getErrorMessage(error);
      common_vendor.index.showToast({
        title: errorMessage,
        icon: "none",
        duration: 2e3
      });
      if (signal === "POLICY") {
        listpolicy.value = [];
      } else {
        listnew.value = [];
      }
      hasMore.value = false;
    } finally {
      if (!params.isRefresh) {
        common_vendor.index.hideLoading();
      }
    }
  };
  function isDifferent(oldArr, newArr) {
    if (oldArr.length !== newArr.length)
      return true;
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i].article_id !== newArr[i].article_id)
        return true;
    }
    return false;
  }
  const getarticlemore = async (params) => {
    let signal = params.article_type;
    if (loading.value || !hasMore.value) {
      console.log("加载更多被阻止:", { loading: loading.value, hasMore: hasMore.value });
      return;
    }
    try {
      loading.value = true;
      const res = await newApis_articles.getArticleList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      if (res.data && res.data.length > 0) {
        if (signal === "POLICY") {
          listpolicy.value = [...listpolicy.value, ...res.data];
        } else {
          listnew.value = [...listnew.value, ...res.data];
        }
        console.log(`成功加载更多 ${res.data.length} 条数据`);
      } else {
        hasMore.value = false;
        console.log("服务器返回空数据，设置hasMore为false");
      }
    } catch (error) {
      console.error("加载更多失败:", error);
      const errorMessage = getErrorMessage(error);
      common_vendor.index.showToast({
        title: errorMessage,
        icon: "none",
        duration: 2e3
      });
    } finally {
      loading.value = false;
    }
  };
  const getErrorMessage = (error) => {
    if (!error)
      return "未知错误";
    if (error.errMsg && error.errMsg.includes("request:fail")) {
      return "网络连接失败，请检查网络";
    }
    if (error.errMsg && error.errMsg.includes("timeout")) {
      return "请求超时，请重试";
    }
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          return "请求参数错误";
        case 401:
          return "未授权访问";
        case 403:
          return "访问被拒绝";
        case 404:
          return "请求的资源不存在";
        case 500:
          return "服务器内部错误";
        case 502:
          return "网关错误";
        case 503:
          return "服务暂不可用";
        default:
          return `服务器错误 (${error.statusCode})`;
      }
    }
    return error.message || "请求失败，请重试";
  };
  function resetpage(num) {
    page.value = num;
    loading.value = false;
    hasMore.value = true;
  }
  function resetAllState() {
    listpolicy.value = [];
    listnew.value = [];
    page.value = 1;
    pagenew.value = 1;
    loading.value = false;
    hasMore.value = true;
    initialLoading.value = false;
  }
  function clearList(type) {
    if (type === "policy") {
      listpolicy.value = [];
    } else if (type === "news") {
      listnew.value = [];
    }
    page.value = 1;
    loading.value = false;
    hasMore.value = true;
  }
  function getListStatus(type) {
    const list = type === "policy" ? listpolicy.value : listnew.value;
    return {
      isEmpty: list.length === 0,
      count: list.length,
      isLoading: loading.value,
      hasMore: hasMore.value,
      currentPage: page.value
    };
  }
  async function refreshList(params) {
    const refreshParams = { ...params, isRefresh: true, page: 1 };
    page.value = 1;
    loading.value = false;
    hasMore.value = true;
    try {
      await getlistpolicy(refreshParams);
    } catch (error) {
      console.error("刷新列表失败:", error);
      throw error;
    }
  }
  return {
    // 数据
    listpolicy,
    listnew,
    page,
    pagenew,
    loading,
    hasMore,
    initialLoading,
    // 方法
    getlistpolicy,
    getarticlemore,
    resetpage,
    resetAllState,
    clearList,
    getListStatus,
    refreshList,
    getErrorMessage
  };
});
exports.useArticlesStore = useArticlesStore;
