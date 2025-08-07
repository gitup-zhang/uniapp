"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_HorizontalActivityCard2 = common_vendor.resolveComponent("HorizontalActivityCard");
  (_easycom_uni_nav_bar2 + _easycom_HorizontalActivityCard2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_HorizontalActivityCard = () => "../../components/HorizontalActivityCard/HorizontalActivityCard.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_HorizontalActivityCard)();
}
const _sfc_main = {
  __name: "activityhistorymore",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    function handleCardClick(eventData) {
      console.log("点击了卡片:", eventData);
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail`
        // 举例，传递 title 作为参数
      });
    }
    function onBack() {
      common_vendor.index.navigateBack();
    }
    common_vendor.onLoad(() => {
      EventStore.getlisoutdate(10);
    });
    return (_ctx, _cache) => {
      return {
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
            a: "d008db7a-1-" + i0,
            b: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              status: "已结束"
            })
          };
        }),
        d: common_vendor.o(($event) => handleCardClick())
      };
    };
  }
};
wx.createPage(_sfc_main);
