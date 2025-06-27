"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_policy = require("../new-apis/policy.js");
const usePolicyDetailStore = common_vendor.defineStore("policydetail", () => {
  const detail = common_vendor.ref({});
  const getpolicydetail = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      detail.value = {};
      const res = await newApis_policy.getPolicyDetail(params);
      common_vendor.index.__f__("log", "at store/PolicyDetail.js:17", "接口返回成功:", res);
      detail.value = res.data;
      common_vendor.index.__f__("log", "at store/PolicyDetail.js:19", "详情数据已更新:", detail.value);
    } catch (error) {
      common_vendor.index.__f__("error", "at store/PolicyDetail.js:21", "获取政策详情失败:", error);
      common_vendor.index.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    detail,
    getpolicydetail
  };
});
exports.usePolicyDetailStore = usePolicyDetailStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/PolicyDetail.js.map
