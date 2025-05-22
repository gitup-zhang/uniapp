"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      daysOnline: 112,
      newsViews: 457,
      policyViews: 113
    };
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "gear-filled",
      size: "22",
      color: "#fff"
    }),
    b: common_assets._imports_0,
    c: common_assets._imports_1,
    d: common_vendor.t($data.daysOnline),
    e: common_vendor.t($data.newsViews),
    f: common_vendor.t($data.policyViews)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mymessage/mymessage.js.map
