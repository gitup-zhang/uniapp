"use strict";
const utils_request = require("../utils/request.js");
function getnotice() {
  return utils_request.http.get("/notice");
}
exports.getnotice = getnotice;
//# sourceMappingURL=../../.sourcemap/mp-weixin/new-apis/index.js.map
