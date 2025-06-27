"use strict";
const common_vendor = require("../../common/vendor.js");
const store_NewDetail = require("../../store/NewDetail.js");
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
  (_easycom_uni_nav_bar + _easycom_uni_title + _easycom_uni_section + mpHtml)();
}
const mpHtml = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const style = "padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);";
const _sfc_main = {
  __name: "detailnew",
  setup(__props) {
    let id = common_vendor.ref();
    const newdetail = store_NewDetail.useNewDetailStore();
    common_vendor.onLoad(async (option) => {
      id = decodeURIComponent(option.id);
      common_vendor.index.__f__("log", "at pages/detail/detailnew.vue:44", "接收到的ID：", id);
      await newdetail.getnewdetail(id);
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
          title: common_vendor.unref(newdetail).detail.new_title
        }),
        d: common_vendor.p({
          title: "新闻内容",
          type: "line",
          titleFontSize: "16px"
        }),
        e: common_vendor.p({
          content: common_vendor.unref(newdetail).detail.new_content,
          ["container-style"]: style
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c1c6fe6d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detailnew.js.map
