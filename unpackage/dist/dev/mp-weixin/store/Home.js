"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const newApis_events = require("../new-apis/events.js");
const useSelectedstore = common_vendor.defineStore("selected", () => {
  const policys = common_vendor.ref([]);
  const policytotal = common_vendor.ref(0);
  const news = common_vendor.ref([]);
  const newstotal = common_vendor.ref(0);
  const event = common_vendor.ref([]);
  const eventtotal = common_vendor.ref(0);
  const getselected = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res_new = await newApis_articles.getArticleList({ page_size: 8, article_type: "NEWS" });
      news.value = res_new.data;
      newstotal.value = res_new.total;
      const res_policy = await newApis_articles.getArticleList({ page_size: 8, article_type: "POLICY" });
      policys.value = res_policy.data;
      policytotal.value = res_policy.total;
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getevent = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const resing = await newApis_events.getEventList({
        page_size: 8,
        event_status: "InProgress"
      });
      const redbefore = await newApis_events.getEventList({
        page_size: 8,
        event_status: "NotBegun"
      });
      event.value = [...resing.data, ...redbefore.data];
      console.log(event.value);
      eventtotal.value = resing.total + redbefore.total;
    } catch (e) {
      console.log(e);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    news,
    policys,
    getselected,
    policytotal,
    newstotal,
    getevent,
    event,
    eventtotal
  };
});
exports.useSelectedstore = useSelectedstore;
