"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../store/Notice.js");
const store_Home = require("../../store/Home.js");
require("../../store/Event.js");
if (!Math) {
  (CustomNavbar + showInforVue)();
}
const CustomNavbar = () => "../../components/CustomNavbar/CustomNavbar.js";
const showInforVue = () => "../../components/show-infor/show-infor.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const selected = store_Home.useSelectedstore();
    const firstEight = common_vendor.computed(() => selected.event.slice(0, 8));
    const currentTab = common_vendor.ref(0);
    function handleMorearticle(params) {
      common_vendor.index.setStorageSync("tabSource", "switchTab");
      common_vendor.index.setStorageSync("article", params);
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
    function onclickevent(id) {
      console.log(id);
      const disable = false;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${id}&disable=${disable}`
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
      } else if (currentTab.value === 1) {
        handleMorearticle("policy");
      } else if (currentTab.value === 2) {
        handleMorearticle("news");
      }
    }
    common_vendor.onMounted(() => {
      selected.getselected();
      selected.getevent();
    });
    common_vendor.onShow(() => {
      console.log("11111111111");
      selected.getselected();
      selected.getevent();
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => handleMorearticle("policy")),
        c: common_assets._imports_1,
        d: common_vendor.o(($event) => handleMorearticle("news")),
        e: common_assets._imports_2,
        f: common_vendor.o(handleMoreactivity),
        g: common_vendor.p({
          title: "服务导航"
        }),
        h: common_vendor.t(common_vendor.unref(selected).policytotal),
        i: common_vendor.t(common_vendor.unref(selected).newstotal),
        j: common_vendor.t(common_vendor.unref(selected).eventtotal),
        k: currentTab.value === 0 ? 1 : "",
        l: common_vendor.o(($event) => switchTab(0)),
        m: currentTab.value === 1 ? 1 : "",
        n: common_vendor.o(($event) => switchTab(1)),
        o: currentTab.value === 2 ? 1 : "",
        p: common_vendor.o(($event) => switchTab(2)),
        q: common_vendor.o(handleMoreClick),
        r: common_vendor.f(firstEight.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.title),
            d: item.id,
            e: common_vendor.o(($event) => onclickevent(item.id), item.id)
          };
        }),
        s: common_vendor.f(common_vendor.unref(selected).policys, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.article_title),
            d: item.article_id,
            e: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          };
        }),
        t: common_vendor.f(common_vendor.unref(selected).news, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.article_title),
            d: item.article_id,
            e: common_vendor.o(($event) => onclickactivity(item.article_id), item.article_id)
          };
        }),
        v: currentTab.value,
        w: common_vendor.o(onSwiperChange)
      };
    };
  }
};
wx.createPage(_sfc_main);
