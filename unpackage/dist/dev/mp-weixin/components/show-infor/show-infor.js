"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  return common_vendor.e({
    a: common_vendor.o((...args) => _ctx.handleMore && _ctx.handleMore(...args))
  }, {
    b: common_assets._imports_0$2,
    c: common_vendor.o((...args) => _ctx.goToPolicy && _ctx.goToPolicy(...args)),
    d: common_assets._imports_1$1,
    e: common_vendor.o((...args) => _ctx.goToNews && _ctx.goToNews(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-02a0dac7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/show-infor/show-infor.js.map
