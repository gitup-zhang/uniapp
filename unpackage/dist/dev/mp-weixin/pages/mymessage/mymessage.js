"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "mymessage",
  setup(__props) {
    let SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    let statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:61", statusBarHeight);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(statusBarHeight) + "px",
        b: common_vendor.p({
          type: "gear-filled",
          size: "22",
          color: "#fff"
        }),
        c: common_assets._imports_0$1,
        d: common_assets._imports_1$1,
        e: common_vendor.t(_ctx.daysOnline),
        f: common_vendor.t(_ctx.newsViews),
        g: common_vendor.t(_ctx.policyViews)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mymessage/mymessage.js.map
