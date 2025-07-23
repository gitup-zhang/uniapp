"use strict";
const utils_request = require("../utils/request.js");
function getPolicyDetail(params) {
  return utils_request.http.get(`/policy/GetPolicyContent/${params}`);
}
exports.getPolicyDetail = getPolicyDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/policy.js.map
