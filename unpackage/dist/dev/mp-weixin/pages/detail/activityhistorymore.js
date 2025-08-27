"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_HorizontalActivityCard2 = common_vendor.resolveComponent("HorizontalActivityCard");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_HorizontalActivityCard2 + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_HorizontalActivityCard = () => "../../components/HorizontalActivityCard/HorizontalActivityCard.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_HorizontalActivityCard + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "activityhistorymore",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    const refreshing = common_vendor.ref(false);
    function handleCardClick(eventData) {
      console.log("点击了卡片:", eventData);
      const disable = true;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}`
        // 举例，传递 title 作为参数
      });
    }
    function onBack() {
      common_vendor.index.navigateBack();
    }
    const onReachBottom = async () => {
      console.log("触底了，开始加载更多历史活动");
      if (EventStore.outdateHasMoreData && !EventStore.outdateIsLoading) {
        await EventStore.loadMoreOutdateEvents();
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        await EventStore.refreshOutdateEvents();
      } finally {
        refreshing.value = false;
      }
    };
    common_vendor.onLoad(() => {
      EventStore.getlisoutdate(10);
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
        c: common_vendor.f(common_vendor.unref(EventStore).eventoutdate, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => handleCardClick(item.id), item.id),
            c: "d008db7a-1-" + i0,
            d: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              status: "已结束"
            })
          };
        }),
        d: common_vendor.unref(EventStore).outdateIsLoading && common_vendor.unref(EventStore).eventoutdate.length > 0
      }, common_vendor.unref(EventStore).outdateIsLoading && common_vendor.unref(EventStore).eventoutdate.length > 0 ? {
        e: common_vendor.p({
          status: "loading"
        })
      } : !common_vendor.unref(EventStore).outdateHasMoreData && common_vendor.unref(EventStore).eventoutdate.length > 0 ? {
        g: common_vendor.p({
          status: "noMore"
        })
      } : common_vendor.unref(EventStore).eventoutdate.length === 0 && !common_vendor.unref(EventStore).outdateIsLoading ? {} : {}, {
        f: !common_vendor.unref(EventStore).outdateHasMoreData && common_vendor.unref(EventStore).eventoutdate.length > 0,
        h: common_vendor.unref(EventStore).eventoutdate.length === 0 && !common_vendor.unref(EventStore).outdateIsLoading,
        i: common_vendor.o(onReachBottom),
        j: refreshing.value,
        k: common_vendor.o(onRefresh)
      });
    };
  }
};
wx.createPage(_sfc_main);
