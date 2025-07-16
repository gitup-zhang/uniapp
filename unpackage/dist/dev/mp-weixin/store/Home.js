"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_new = require("../new-apis/new.js");
const newApis_policy = require("../new-apis/policy.js");
const useSelectedstore = common_vendor.defineStore("selected", () => {
  const policys = common_vendor.ref([]);
  const news = common_vendor.ref([]);
  const getselected = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res_new = await newApis_new.getNewList({ is_selection: 1, page_size: 1 });
      news.value = res_new.data;
      const res_policy = await newApis_policy.getPolicyList({ is_selection: 1, page_size: 1 });
      policys.value = res_policy.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/Home.js:26", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    news,
    policys,
    getselected
  };
});
exports.useSelectedstore = useSelectedstore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/Home.js.map
