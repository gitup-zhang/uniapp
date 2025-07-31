"use strict";
const utils_request = require("../utils/request.js");
function getnotice() {
  return utils_request.http.get("/notice");
}
function getnoticedetail(params) {
  return utils_request.http.get(`/notice/${params}`);
}
exports.getnotice = getnotice;
exports.getnoticedetail = getnoticedetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/index.js.map
