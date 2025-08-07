"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  (_easycom_uni_nav_bar2 + _easycom_uni_grid_item2 + _easycom_uni_grid2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
if (!Math) {
  (_easycom_uni_nav_bar + ActivityCard + _easycom_uni_grid_item + _easycom_uni_grid)();
}
const ActivityCard = () => "../../components/ActivityCard/ActivityCard.js";
const _sfc_main = {
  __name: "activitymore",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    function change(e) {
      const clickedIndex = e.detail.index;
      console.log("点击了第", clickedIndex + 1, "个宫格");
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail`
      });
    }
    function onBack() {
      common_vendor.index.navigateBack();
    }
    common_vendor.onLoad(() => {
      EventStore.getlisting(10);
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
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
