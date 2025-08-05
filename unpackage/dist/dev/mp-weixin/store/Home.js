"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const useSelectedstore = common_vendor.defineStore("selected", () => {
  const policys = common_vendor.ref([]);
  const news = common_vendor.ref([]);
  const getselected = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res_new = await newApis_articles.getArticleList({ is_selection: 1, page_size: 8, article_type: "NEWS" });
      news.value = res_new.data;
      const res_policy = await newApis_articles.getArticleList({ is_selection: 1, page_size: 8, article_type: "POLICY" });
      policys.value = res_policy.data;
    } catch (error) {
      console.log(error);
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
