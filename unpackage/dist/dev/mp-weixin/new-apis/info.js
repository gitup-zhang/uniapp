"use strict";
const utils_request = require("../utils/request.js");
function getinfologin(params) {
  return utils_request.http.post("/user/login", params);
}
function getinfoprofile(params) {
  return utils_request.http.post("/user/decrypt", params);
}
exports.getinfologin = getinfologin;
exports.getinfoprofile = getinfoprofile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/info.js.map
