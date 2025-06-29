"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_policy = require("../new-apis/policy.js");
const usePolicyStore = common_vendor.defineStore("policylist", () => {
  const listpolicy = common_vendor.ref([]);
  const message = common_vendor.ref("");
  const getlistpolicy = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      message.value = "";
      const res = await newApis_policy.getPolicyList({});
      common_vendor.index.__f__("log", "at store/PolicyList.js:23", "示例数据：", res.data);
      listpolicy.value = res.data;
    } catch (error) {
      message.value = error.data.error;
      common_vendor.index.__f__("log", "at store/PolicyList.js:27", message.value);
    } finally {
      common_vendor.index.hideLoading();
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
      common_vendor.index.__f__("log", "at store/PolicyList.js:47", "示例数据：", res.data);
      listpolicy.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/PolicyList.js:51", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    getlistpolicy,
    listpolicy,
    message,
    searchpolicy
  };
});
exports.usePolicyStore = usePolicyStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/PolicyList.js.map
