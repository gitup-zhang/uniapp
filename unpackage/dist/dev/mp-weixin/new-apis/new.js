"use strict";
const utils_request = require("../utils/request.js");
function getNewList(params) {
  return utils_request.http.get("/news/ListNews", params);
}
function getNewDetail(params) {
  return utils_request.http.get(`/news/GetNewsContent/${params}`);
}
exports.getNewDetail = getNewDetail;
exports.getNewList = getNewList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/new.js.map
