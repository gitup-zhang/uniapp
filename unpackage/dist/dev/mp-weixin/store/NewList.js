"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_new = require("../new-apis/new.js");
const useNewStore = common_vendor.defineStore("newlist", () => {
  const listnew = common_vendor.ref([]);
  const page = common_vendor.ref(1);
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const getlistnew = async (parmas) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      common_vendor.index.__f__("log", "at store/NewList.js:19", listnew);
      const res = await newApis_new.getNewList(parmas);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      common_vendor.index.__f__("log", "at store/NewList.js:27", hasMore.value);
      listnew.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/NewList.js:31", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getmorelist = async (parma) => {
    if (loading.value || !hasMore.value)
      return;
    try {
      loading.value = true;
      const res = await newApis_new.getNewList(parma);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      listnew.value = listnew.value.concat(res.data);
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };
  const searchnewlist = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      common_vendor.index.__f__("log", "at store/NewList.js:72", listnew);
      const res = await newApis_new.getNewList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      listnew.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/NewList.js:83", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    listnew,
    getlistnew,
    searchnewlist,
    getmorelist,
    loading,
    hasMore,
    page
  };
});
exports.useNewStore = useNewStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/NewList.js.map
