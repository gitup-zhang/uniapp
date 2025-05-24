"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  (CustomNavbar + showInforVue)();
}
const CustomNavbar = () => "../../components/CustomNavbar/CustomNavbar.js";
const showInforVue = () => "../../components/show-infor/show-infor.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o((...args) => _ctx.goToPolicy && _ctx.goToPolicy(...args)),
        c: common_assets._imports_1,
        d: common_vendor.o((...args) => _ctx.goToNews && _ctx.goToNews(...args)),
        e: common_vendor.p({
          isshow: false,
          title: "为您推荐"
        }),
        f: common_assets._imports_2
      }, {}, {
        g: common_vendor.p({
          isshow: true,
          title: "精选政策"
        }),
        h: common_assets._imports_2
      }, {}, {
        i: common_vendor.p({
          isshow: true,
          title: "精选政策"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
