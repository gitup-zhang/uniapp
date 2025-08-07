"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  (_easycom_uni_nav_bar2 + _easycom_uni_section2 + _easycom_uni_grid_item2 + _easycom_uni_grid2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_section + ActivityCard + _easycom_uni_grid_item + _easycom_uni_grid + HorizontalActivityCard)();
}
const ActivityCard = () => "../../components/ActivityCard/ActivityCard.js";
const HorizontalActivityCard = () => "../../components/HorizontalActivityCard/HorizontalActivityCard.js";
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    function change(e) {
      const clickedIndex = e.detail.index;
      console.log("点击了第", clickedIndex, "个宫格");
      const disable = false;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
      });
    }
    function handleCardClick(eventData) {
      console.log("点击了卡片:", eventData);
      const disable = true;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}`
        // 举例，传递 title 作为参数
      });
    }
    function goMorehotactivity() {
      console.log("11111111");
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitymore`
      });
    }
    function goMorehistoryactivity() {
      common_vendor.index.navigateTo({
        url: `/pages/detail/activityhistorymore`
      });
    }
    common_vendor.onShow(() => {
      EventStore.getlisting(2);
      EventStore.getlisoutdate(3);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          leftWidth: "150px"
        }),
        b: common_vendor.p({
          title: "热门活动报名中",
          titleFontSize: "20px",
          type: "line"
        }),
        c: common_vendor.o(goMorehotactivity),
        d: common_vendor.f(common_vendor.unref(EventStore).eventing, (item, k0, i0) => {
          return {
            a: "26b1a250-4-" + i0 + "," + ("26b1a250-3-" + i0),
            b: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              isJoined: false,
              fee: item.registration_fee
            }),
            c: item.id,
            d: "26b1a250-3-" + i0 + ",26b1a250-2",
            e: common_vendor.p({
              index: item.id
            })
          };
        }),
        e: common_vendor.o(change),
        f: common_vendor.p({
          column: 2,
          highlight: false,
          ["show-border"]: false,
          square: false
        }),
        g: common_vendor.p({
          title: "历史活动回顾",
          titleFontSize: "20px",
          type: "line"
        }),
        h: common_vendor.o(goMorehistoryactivity),
        i: common_vendor.f(common_vendor.unref(EventStore).eventoutdate, (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => handleCardClick(item.id)),
            b: "26b1a250-6-" + i0,
            c: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              status: "已结束"
            })
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
