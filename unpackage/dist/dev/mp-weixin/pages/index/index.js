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
    let notice = common_vendor.ref(["公告1.。。。。。。。。。", "公告2.。。。。。。。。。。。", "公告3.。。。。。。。。。。。。。"]);
    function handleMorenew() {
      common_vendor.index.switchTab({
        url: "../news/news"
      });
    }
    function handleMoremsg() {
      common_vendor.index.switchTab({
        url: "../policy/policy"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(handleMoremsg),
        c: common_assets._imports_1,
        d: common_vendor.o(handleMorenew),
        e: common_vendor.p({
          title: "为您推荐"
        }),
        f: common_vendor.f(common_vendor.unref(notice), (item, k0, i0) => {
          return {
            a: common_vendor.t(item)
          };
        }),
        g: common_vendor.o(handleMoremsg),
        h: common_assets._imports_2
      }, {}, {
        i: common_vendor.p({
          title: "精选政策"
        }),
        j: common_vendor.o(handleMorenew),
        k: common_assets._imports_2
      }, {}, {
        l: common_vendor.p({
          title: "精选新闻"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
