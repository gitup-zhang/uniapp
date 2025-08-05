"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const useArticlesStore = common_vendor.defineStore("articlelist", () => {
  const listpolicy = common_vendor.ref([]);
  const page = common_vendor.ref(1);
  const listnew = common_vendor.ref([]);
  common_vendor.ref(1);
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const getlistpolicy = async (params) => {
    let signal = params.article_type;
    loading.value = false;
    hasMore.value = true;
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_articles.getArticleList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      if (signal === "POLICY") {
        listpolicy.value = res.data;
      } else {
        listnew.value = res.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getarticlemore = async (params) => {
    let signal = params.article_type;
    if (loading.value || !hasMore.value)
      return;
    try {
      loading.value = true;
      const res = await newApis_articles.getArticleList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      if (signal === "POLICY") {
        listpolicy.value = listpolicy.value.concat(res.data);
      } else {
        listnew.value = listnew.value.concat(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  function resetpage(num) {
    page.value = num;
    loading.value = false;
    hasMore.value = true;
  }
  return {
    listpolicy,
    page,
    loading,
    hasMore,
    getlistpolicy,
    getarticlemore,
    listnew,
    resetpage
  };
});
exports.useArticlesStore = useArticlesStore;
