"use strict";
const utils_request = require("../utils/request.js");
function getPolicyList(params) {
  return utils_request.http.get("/policy/ListPolicy", params);
}
exports.getPolicyList = getPolicyList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/policy.js.map
