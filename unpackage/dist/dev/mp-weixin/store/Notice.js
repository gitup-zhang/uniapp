"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_index = require("../new-apis/index.js");
const useNoticeStore = common_vendor.defineStore("notice", () => {
  const notice = common_vendor.ref([]);
  const noticedetail = common_vendor.ref({});
  const getnoticestore = async () => {
    common_vendor.index.showLoading({
      title: "加载中",
      mask: true
    });
    try {
      const res = await newApis_index.getnotice();
      notice.value = res.data;
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getnoticedetailstore = async (id) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_index.getnoticedetail(id);
      noticedetail.value = res.data;
    } catch (error) {
      console.error("获取详情失败:", error);
      common_vendor.index.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    notice,
    getnoticestore,
    getnoticedetailstore,
    noticedetail
  };
});
exports.useNoticeStore = useNoticeStore;
