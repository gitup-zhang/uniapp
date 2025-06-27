"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_new = require("../new-apis/new.js");
const useNewDetailStore = common_vendor.defineStore("newdetail", () => {
  const detail = common_vendor.ref({});
  const getnewdetail = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      detail.value = {};
      const res = await newApis_new.getNewDetail(params);
      detail.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/NewDetail.js:21", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    detail,
    getnewdetail
  };
});
exports.useNewDetailStore = useNewDetailStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/NewDetail.js.map
