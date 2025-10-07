"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_section2 + _easycom_uni_grid_item2 + _easycom_uni_grid2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_section + ActivityCard + _easycom_uni_grid_item + _easycom_uni_grid + _easycom_uni_icons + HorizontalActivityCard)();
}
const ActivityCard = () => "../../components/ActivityCard/ActivityCard.js";
const HorizontalActivityCard = () => "../../components/HorizontalActivityCard/HorizontalActivityCard.js";
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const EventStore = store_Event.useEventstore();
    const hotActivities = common_vendor.computed(() => {
      const inProgressEvents = EventStore.eventing.slice(0, 2);
      const needMoreCount = 2 - inProgressEvents.length;
      if (needMoreCount > 0) {
        const notBegunEvents = EventStore.eventnotbegun.slice(0, needMoreCount);
        const markedNotBegunEvents = notBegunEvents.map((item) => ({
          ...item,
          event_status: "NotBegun"
        }));
        const markedInProgressEvents = inProgressEvents.map((item) => ({
          ...item,
          event_status: "InProgress"
        }));
        return [...markedInProgressEvents, ...markedNotBegunEvents];
      }
      return inProgressEvents.map((item) => ({
        ...item,
        event_status: "InProgress"
      }));
    });
    function changeHotActivity(e) {
      const clickedIndex = e.detail.index;
      console.log("点击了热门活动第", clickedIndex, "个宫格");
      const disable = false;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${clickedIndex}&disable=${disable}`
      });
    }
    function goMoreActivity() {
      const hasInProgress = EventStore.eventing.length > 0;
      if (hasInProgress) {
        console.log("跳转到更多正在进行活动");
        common_vendor.index.navigateTo({
          url: `/pages/detail/activitymore`
        });
      } else {
        console.log("跳转到更多即将开始活动");
        common_vendor.index.navigateTo({
          url: `/pages/detail/activitynotbegunmore`
        });
      }
    }
    function handleCardClick(eventData) {
      console.log("点击了历史活动卡片:", eventData);
      const disable = true;
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail?id=${eventData}&disable=${disable}`
        // 历史活动禁用操作
      });
    }
    function goMorehistoryactivity() {
      common_vendor.index.navigateTo({
        url: `/pages/detail/activityhistorymore`
      });
    }
    common_vendor.onShow(() => {
      EventStore.getlisting(2);
      EventStore.getlistnotbegun(2);
      EventStore.getlisoutdate(3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#dc2626",
          fixed: "true",
          leftWidth: "150px"
        }),
        b: common_vendor.p({
          title: "热门活动报名中",
          titleFontSize: "20px",
          type: "line"
        }),
        c: hotActivities.value.length > 0
      }, hotActivities.value.length > 0 ? {
        d: common_vendor.o(goMoreActivity)
      } : {}, {
        e: hotActivities.value.length > 0
      }, hotActivities.value.length > 0 ? {
        f: common_vendor.f(hotActivities.value, (item, k0, i0) => {
          return {
            a: "26b1a250-4-" + i0 + "," + ("26b1a250-3-" + i0),
            b: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              isJoined: false,
              fee: item.registration_fee,
              status: item.event_status === "InProgress" ? "进行中" : "即将开始"
            }),
            c: item.id,
            d: "26b1a250-3-" + i0 + ",26b1a250-2",
            e: common_vendor.p({
              index: item.id
            })
          };
        }),
        g: common_vendor.o(changeHotActivity),
        h: common_vendor.p({
          column: 2,
          highlight: false,
          ["show-border"]: false,
          square: false
        })
      } : {
        i: common_vendor.p({
          type: "calendar",
          size: "80",
          color: "#ccc"
        })
      }, {
        j: common_vendor.p({
          title: "历史活动回顾",
          titleFontSize: "20px",
          type: "line"
        }),
        k: common_vendor.unref(EventStore).eventoutdate.length > 0
      }, common_vendor.unref(EventStore).eventoutdate.length > 0 ? {
        l: common_vendor.o(goMorehistoryactivity)
      } : {}, {
        m: common_vendor.unref(EventStore).eventoutdate.length > 0
      }, common_vendor.unref(EventStore).eventoutdate.length > 0 ? {
        n: common_vendor.f(common_vendor.unref(EventStore).eventoutdate, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => handleCardClick(item.id), item.id),
            c: "26b1a250-7-" + i0,
            d: common_vendor.p({
              imgSrc: item.cover_image_url,
              title: item.title,
              date: common_vendor.unref(utils_data.formatEventDate)(item.event_start_time, item.event_end_time),
              location: item.event_address,
              status: "已结束"
            })
          };
        })
      } : {
        o: common_vendor.p({
          type: "reload",
          size: "80",
          color: "#ccc"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
