"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_grid_item2 + _easycom_uni_grid2 + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + ActivityCard + _easycom_uni_grid_item + _easycom_uni_grid + _easycom_uni_load_more)();
}
const ActivityCard = () => "../../components/ActivityCard/ActivityCard.js";
const _sfc_main = {
  __name: "activitymore",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    const currentTab = common_vendor.ref("inProgress");
    const refreshing = common_vendor.ref(false);
    const currentEvents = common_vendor.computed(() => {
      return currentTab.value === "inProgress" ? EventStore.eventing : EventStore.eventnotbegun;
    });
    const currentHasMoreData = common_vendor.computed(() => {
      return currentTab.value === "inProgress" ? EventStore.hasMoreData : EventStore.notbegunHasMoreData;
    });
    const currentIsLoading = common_vendor.computed(() => {
      return currentTab.value === "inProgress" ? EventStore.isLoading : EventStore.notbegunIsLoading;
    });
    const scrollViewStyle = common_vendor.computed(() => {
      return "height: calc(100vh - 100px - 100rpx);";
    });
    const switchTab = async (tab) => {
      if (currentTab.value === tab)
        return;
      currentTab.value = tab;
      if (tab === "inProgress" && EventStore.eventing.length === 0) {
        await EventStore.getlisting(10);
      } else if (tab === "notBegun" && EventStore.eventnotbegun.length === 0) {
        await EventStore.getlistnotbegun(10);
      }
    };
    function change(e) {
      const clickedIndex = e.detail.index;
      console.log("点击了第", clickedIndex, "个宫格");
      const disable = false;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
      });
    }
    function onBack() {
      common_vendor.index.navigateBack();
    }
    const onReachBottom = async () => {
      console.log("触底了，开始加载更多");
      if (currentTab.value === "inProgress") {
        if (EventStore.hasMoreData && !EventStore.isLoading) {
          await EventStore.loadMoreEvents();
        }
      } else {
        if (EventStore.notbegunHasMoreData && !EventStore.notbegunIsLoading) {
          await EventStore.loadMoreNotbegunEvents();
        }
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        if (currentTab.value === "inProgress") {
          await EventStore.refreshEvents();
        } else {
          await EventStore.refreshNotbegunEvents();
        }
      } finally {
        refreshing.value = false;
      }
    };
    common_vendor.onLoad(() => {
      EventStore.getlisting(10);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onBack),
        b: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        c: common_vendor.t(common_vendor.unref(EventStore).eventcount.Eventing),
        d: currentTab.value === "inProgress" ? 1 : "",
        e: currentTab.value === "inProgress" ? 1 : "",
        f: common_vendor.o(($event) => switchTab("inProgress")),
        g: common_vendor.t(common_vendor.unref(EventStore).eventcount.EventNotBegun),
        h: currentTab.value === "notBegun" ? 1 : "",
        i: currentTab.value === "notBegun" ? 1 : "",
        j: common_vendor.o(($event) => switchTab("notBegun")),
        k: common_vendor.f(currentEvents.value, (item, k0, i0) => {
          return {
            a: "9df2c92a-3-" + i0 + "," + ("9df2c92a-2-" + i0),
            b: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              isJoined: false,
              fee: item.registration_fee,
              status: currentTab.value === "inProgress" ? "进行中" : "即将开始"
            }),
            c: item.id,
            d: "9df2c92a-2-" + i0 + ",9df2c92a-1",
            e: common_vendor.p({
              index: item.id
            })
          };
        }),
        l: common_vendor.o(change),
        m: common_vendor.p({
          column: 2,
          highlight: false,
          ["show-border"]: false,
          square: false
        }),
        n: currentIsLoading.value && currentEvents.value.length > 0
      }, currentIsLoading.value && currentEvents.value.length > 0 ? {
        o: common_vendor.p({
          status: "loading"
        })
      } : !currentHasMoreData.value && currentEvents.value.length > 0 ? {
        q: common_vendor.p({
          status: "noMore"
        })
      } : currentEvents.value.length === 0 && !currentIsLoading.value ? {
        s: common_vendor.t(currentTab.value === "inProgress" ? "暂无进行中的活动" : "暂无未开始的活动")
      } : {}, {
        p: !currentHasMoreData.value && currentEvents.value.length > 0,
        r: currentEvents.value.length === 0 && !currentIsLoading.value,
        t: common_vendor.s(scrollViewStyle.value),
        v: common_vendor.o(onReachBottom),
        w: refreshing.value,
        x: common_vendor.o(onRefresh)
      });
    };
  }
};
wx.createPage(_sfc_main);
