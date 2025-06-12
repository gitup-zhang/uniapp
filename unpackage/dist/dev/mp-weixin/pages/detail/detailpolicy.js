"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_title2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_title + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "detailpolicy",
  setup(__props) {
    let id = common_vendor.ref();
    common_vendor.onLoad((option) => {
      id = decodeURIComponent(option.id);
      common_vendor.index.__f__("log", "at pages/detail/detailpolicy.vue:35", "接收到的ID：", id);
    });
    function onBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onBack),
        b: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#903749",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        c: common_vendor.p({
          type: "h1",
          title: "政策标题"
        }),
        d: common_vendor.p({
          title: "竖线装饰",
          type: "line",
          titleFontSize: "16px"
        }),
        e: common_vendor.f(50, (iten, k0, i0) => {
          return {};
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fef9ca7d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detailpolicy.js.map
