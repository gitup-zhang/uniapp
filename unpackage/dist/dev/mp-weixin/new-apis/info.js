"use strict";
const utils_request = require("../utils/request.js");
function getinfologin(params) {
  return utils_request.http.post("/info/login", params);
}
exports.getinfologin = getinfologin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/info.js.map
