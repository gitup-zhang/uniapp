"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_index = require("../new-apis/index.js");
const useNoticeStore = common_vendor.defineStore("notice", () => {
  const notice = common_vendor.ref([]);
  const getnoticestore = async () => {
    common_vendor.index.showLoading({
      title: "加载中",
      mask: true
    });
    try {
      const res = await newApis_index.getnotice();
      notice.value = res.data;
    } catch (error) {
      common_vendor.index.__f__("log", "at store/Notice.js:18", error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    notice,
    getnoticestore
  };
});
exports.useNoticeStore = useNoticeStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/Notice.js.map
