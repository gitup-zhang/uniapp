"use strict";
const common_vendor = require("../common/vendor.js");
function Dataformat(timeStr) {
  return common_vendor.dayjs(timeStr).format("YYYY-MM-DD HH:mm:ss");
}
exports.Dataformat = Dataformat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/data.js.map
