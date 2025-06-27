"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_policy = require("../new-apis/policy.js");
const usefieldstore = common_vendor.defineStore("field", () => {
  const fieldlist = common_vendor.ref([]);
  const getfield = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_policy.getPolicyField();
      fieldlist.value = res.data;
      common_vendor.index.__f__("log", "at store/field.js:21", fieldlist.value);
    } catch (error) {
      common_vendor.index.__f__("log", "at store/field.js:23", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    fieldlist,
    getfield
  };
});
exports.usefieldstore = usefieldstore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/field.js.map
