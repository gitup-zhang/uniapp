"use strict";
const utils_request = require("../utils/request.js");
function getPolicyList(params) {
  return utils_request.http.get("/policy/ListPolicy", params);
}
function getPolicyDetail(params) {
  return utils_request.http.get(`/policy/GetPolicyContent/${params}`);
}
function getPolicyField() {
  return utils_request.http.get("/fieldType");
}
exports.getPolicyDetail = getPolicyDetail;
exports.getPolicyField = getPolicyField;
exports.getPolicyList = getPolicyList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/policy.js.map
