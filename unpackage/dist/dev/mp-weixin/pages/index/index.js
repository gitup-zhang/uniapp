"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Notice = require("../../store/Notice.js");
const store_Home = require("../../store/Home.js");
if (!Math) {
  (CustomNavbar + showInforVue)();
}
const CustomNavbar = () => "../../components/CustomNavbar/CustomNavbar.js";
const showInforVue = () => "../../components/show-infor/show-infor.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const usenotice = store_Notice.useNoticeStore();
    const selected = store_Home.useSelectedstore();
    function handleMorearticle() {
      common_vendor.index.setStorageSync("tabSource", "switchTab");
      common_vendor.index.switchTab({
        url: "../policy/policy"
      });
    }
    function handleMoreactivity() {
      common_vendor.index.switchTab({
        url: "../news/news"
      });
    }
    function onclickactivity(id) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:136", id);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${id}`
      });
    }
    common_vendor.onMounted(() => {
      usenotice.getnoticestore();
      selected.getselected();
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(handleMorearticle),
        c: common_assets._imports_1,
        d: common_vendor.o(handleMorearticle),
        e: common_assets._imports_2,
        f: common_vendor.o(handleMoreactivity),
        g: common_vendor.p({
          title: "为您推荐"
        }),
        h: common_vendor.f(common_vendor.unref(usenotice).notice, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.content),
            b: item.id
          };
        }),
        i: common_vendor.o(handleMoreactivity),
        j: common_vendor.f(common_vendor.unref(selected).news, (item, k0, i0) => {
          return common_vendor.e({
            a: item.cover_image_url,
            b: common_vendor.t(item.article_title)
          }, {}, {
            c: item.article_id,
            d: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          });
        }),
        k: common_vendor.p({
          title: "热门活动"
        }),
        l: common_vendor.o(handleMorearticle),
        m: common_vendor.f(common_vendor.unref(selected).policys, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.article_title)
          }, {}, {
            b: item.article_id,
            c: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          });
        }),
        n: common_assets._imports_3,
        o: common_vendor.p({
          title: "精选政策"
        }),
        p: common_vendor.o(handleMorearticle),
        q: common_vendor.f(common_vendor.unref(selected).news, (item, k0, i0) => {
          return common_vendor.e({
            a: item.cover_image_url,
            b: common_vendor.t(item.article_title)
          }, {}, {
            c: common_vendor.o(($event) => onclickactivity(item.article_id), _ctx.article_id)
          });
        }),
        r: _ctx.article_id,
        s: common_vendor.p({
          title: "精选新闻"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
