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
    const refreshing = common_vendor.ref(false);
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
      if (EventStore.hasMoreData && !EventStore.isLoading) {
        await EventStore.loadMoreEvents();
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        await EventStore.refreshEvents();
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
        c: common_vendor.f(common_vendor.unref(EventStore).eventing, (item, k0, i0) => {
          return {
            a: "9df2c92a-3-" + i0 + "," + ("9df2c92a-2-" + i0),
            b: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              isJoined: false,
              fee: item.registration_fee
            }),
            c: item.id,
            d: "9df2c92a-2-" + i0 + ",9df2c92a-1",
            e: common_vendor.p({
              index: item.id
            })
          };
        }),
        d: common_vendor.o(change),
        e: common_vendor.p({
          column: 2,
          highlight: false,
          ["show-border"]: false,
          square: false
        }),
        f: common_vendor.unref(EventStore).isLoading && common_vendor.unref(EventStore).eventing.length > 0
      }, common_vendor.unref(EventStore).isLoading && common_vendor.unref(EventStore).eventing.length > 0 ? {
        g: common_vendor.p({
          status: "loading"
        })
      } : !common_vendor.unref(EventStore).hasMoreData && common_vendor.unref(EventStore).eventing.length > 0 ? {
        i: common_vendor.p({
          status: "noMore"
        })
      } : common_vendor.unref(EventStore).eventing.length === 0 && !common_vendor.unref(EventStore).isLoading ? {} : {}, {
        h: !common_vendor.unref(EventStore).hasMoreData && common_vendor.unref(EventStore).eventing.length > 0,
        j: common_vendor.unref(EventStore).eventing.length === 0 && !common_vendor.unref(EventStore).isLoading,
        k: common_vendor.o(onReachBottom),
        l: refreshing.value,
        m: common_vendor.o(onRefresh)
      });
    };
  }
};
wx.createPage(_sfc_main);
