"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const useArticleDeatilStore = common_vendor.defineStore("articleDetail", () => {
  const detail = common_vendor.ref({});
  const getarticledetail = async (params) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      detail.value = {};
      const res = await newApis_articles.getArticleDetail(params);
      common_vendor.index.__f__("log", "at store/ArticleDetail.js:17", "接口返回成功:", res);
      detail.value = res.data;
      common_vendor.index.__f__("log", "at store/ArticleDetail.js:19", "详情数据已更新:", detail.value);
    } catch (error) {
      common_vendor.index.__f__("error", "at store/ArticleDetail.js:21", "获取详情失败:", error);
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
    getarticledetail
  };
});
exports.useArticleDeatilStore = useArticleDeatilStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/ArticleDetail.js.map
