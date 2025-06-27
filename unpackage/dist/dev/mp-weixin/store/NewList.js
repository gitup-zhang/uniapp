"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_new = require("../new-apis/new.js");
const useNewStore = common_vendor.defineStore("newlist", () => {
  const listnew = common_vendor.ref([]);
  const getlistnew = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      common_vendor.index.__f__("log", "at store/NewList.js:16", listnew);
      const res = await newApis_new.getNewList({});
      listnew.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/NewList.js:21", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const searchnewlist = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      common_vendor.index.__f__("log", "at store/NewList.js:38", listnew);
      const res = await newApis_new.getNewList(params);
      listnew.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/NewList.js:43", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    listnew,
    getlistnew,
    searchnewlist
  };
});
exports.useNewStore = useNewStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/NewList.js.map
