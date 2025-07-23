"use strict";
const utils_request = require("../utils/request.js");
function getArticleField() {
  return utils_request.http.get("/fieldType");
}
function getArticleDetail(params) {
  return utils_request.http.get(`/articles/${params}`);
}
function getArticleList(params) {
  return utils_request.http.get("/articles", params);
}
exports.getArticleDetail = getArticleDetail;
exports.getArticleField = getArticleField;
exports.getArticleList = getArticleList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/articles.js.map
