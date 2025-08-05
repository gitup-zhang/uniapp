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
    const currentTab = common_vendor.ref(0);
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
      console.log(id);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${id}`
      });
    }
    function switchTab(index) {
      currentTab.value = index;
    }
    function onSwiperChange(e) {
      currentTab.value = e.detail.current;
    }
    function handleMoreClick() {
      if (currentTab.value === 0) {
        handleMoreactivity();
      } else {
        handleMorearticle();
      }
    }
    function noticeclick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/noticedetail?id=${id}`
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
            b: common_vendor.o(($event) => noticeclick(item.id), item.id),
            c: item.id
          };
        }),
        i: currentTab.value === 0 ? 1 : "",
        j: common_vendor.o(($event) => switchTab(0)),
        k: currentTab.value === 1 ? 1 : "",
        l: common_vendor.o(($event) => switchTab(1)),
        m: currentTab.value === 2 ? 1 : "",
        n: common_vendor.o(($event) => switchTab(2)),
        o: common_vendor.o(handleMoreClick),
        p: common_vendor.f(common_vendor.unref(selected).news, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.article_title),
            d: item.article_id,
            e: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          };
        }),
        q: common_vendor.f(common_vendor.unref(selected).policys, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.article_title),
            d: item.article_id,
            e: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          };
        }),
        r: common_vendor.f(common_vendor.unref(selected).news, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.article_title),
            d: item.article_id,
            e: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          };
        }),
        s: currentTab.value,
        t: common_vendor.o(onSwiperChange)
      };
    };
  }
};
wx.createPage(_sfc_main);
