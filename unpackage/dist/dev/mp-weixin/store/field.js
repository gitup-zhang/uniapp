"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_articles = require("../new-apis/articles.js");
const newApis_info = require("../new-apis/info.js");
const usefieldstore = common_vendor.defineStore("field", () => {
  const fieldlist = common_vendor.ref([]);
  const industory = common_vendor.ref([]);
  const getfield = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_articles.getArticleField();
      fieldlist.value = res.data;
      console.log(fieldlist.value);
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getindustory = async () => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_info.getIndustory();
      industory.value = res.data.map((i) => i.industry_name);
      console.log(industory.value);
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    fieldlist,
    getfield,
    getindustory,
    industory
  };
});
exports.usefieldstore = usefieldstore;
