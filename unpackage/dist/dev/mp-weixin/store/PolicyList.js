"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_policy = require("../new-apis/policy.js");
const usePolicyStore = common_vendor.defineStore("policylist", () => {
  const listpolicy = common_vendor.ref([]);
  const page = common_vendor.ref(1);
  const message = common_vendor.ref("");
  const loading = common_vendor.ref(false);
  const hasMore = common_vendor.ref(true);
  const getlistpolicy = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      message.value = "";
      const res = await newApis_policy.getPolicyList(params);
      common_vendor.index.__f__("log", "at store/PolicyList.js:27", "示例数据：", res.data);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      common_vendor.index.__f__("log", "at store/PolicyList.js:34", hasMore.value);
      listpolicy.value = res.data;
    } catch (error) {
      message.value = error.data.error;
      common_vendor.index.__f__("log", "at store/PolicyList.js:40", message.value);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getmorelist = async (parma) => {
    if (loading.value || !hasMore.value)
      return;
    try {
      loading.value = true;
      const res = await newApis_policy.getPolicyList(parma);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      listpolicy.value = listpolicy.value.concat(res.data);
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };
  const searchpolicy = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      message.value = "";
      const res = await newApis_policy.getPolicyList(params);
      page.value = res.page;
      if (res.page * res.page_size < res.total) {
        hasMore.value = true;
      } else {
        hasMore.value = false;
      }
      common_vendor.index.__f__("log", "at store/PolicyList.js:93", "示例数据：", res.data);
      listpolicy.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/PolicyList.js:97", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    getlistpolicy,
    listpolicy,
    message,
    searchpolicy,
    getmorelist,
    loading,
    hasMore,
    page
  };
});
exports.usePolicyStore = usePolicyStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/PolicyList.js.map
