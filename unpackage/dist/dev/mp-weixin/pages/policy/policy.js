"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_DetailNavbar2 = common_vendor.resolveComponent("DetailNavbar");
  _easycom_DetailNavbar2();
}
const _easycom_DetailNavbar = () => "../../components/DetailNavbar/DetailNavbar.js";
if (!Math) {
  _easycom_DetailNavbar();
}
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "政策"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
