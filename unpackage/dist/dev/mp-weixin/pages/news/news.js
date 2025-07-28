"use strict";
const common_vendor = require("../../common/vendor.js");
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
    function change(e) {
      const clickedIndex = e.detail.index;
      common_vendor.index.__f__("log", "at pages/news/news.vue:52", "点击了第", clickedIndex + 1, "个宫格");
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail`
      });
    }
    function handleCardClick(eventData) {
      common_vendor.index.__f__("log", "at pages/news/news.vue:60", "点击了卡片:", eventData);
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitydetail`
        // 举例，传递 title 作为参数
      });
    }
    function goMorehotactivity() {
      common_vendor.index.__f__("log", "at pages/news/news.vue:68", "11111111");
      common_vendor.index.navigateTo({
        url: `/pages/detail/activitymore`
      });
    }
    function goMorehistoryactivity() {
      common_vendor.index.navigateTo({
        url: `/pages/detail/activityhistorymore`
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#903749",
          fixed: "true",
          leftWidth: "150px"
        }),
        b: common_vendor.p({
          title: "热门活动报名中",
          titleFontSize: "20px",
          type: "line"
        }),
        c: common_vendor.o(goMorehotactivity),
        d: common_vendor.f(2, (item, index, i0) => {
          return {
            a: "26b1a250-4-" + i0 + "," + ("26b1a250-3-" + i0),
            b: index,
            c: "26b1a250-3-" + i0 + ",26b1a250-2",
            d: common_vendor.p({
              index
            })
          };
        }),
        e: common_vendor.p({
          imgSrc: "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          title: "深圳市插画协会、英国插画师协会联合展览",
          date: "3月17日 - 3月30日",
          location: "深圳",
          isJoined: true
        }),
        f: common_vendor.o(change),
        g: common_vendor.p({
          column: 2,
          highlight: false,
          ["show-border"]: false,
          square: false
        }),
        h: common_vendor.p({
          title: "历史活动回顾",
          titleFontSize: "20px",
          type: "line"
        }),
        i: common_vendor.o(goMorehistoryactivity),
        j: common_vendor.f(3, (item, index, i0) => {
          return {
            a: "26b1a250-6-" + i0
          };
        }),
        k: common_vendor.o(handleCardClick),
        l: common_vendor.p({
          imgSrc: "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          title: "中国大模型人才大会",
          date: "3月15日 - 4月10日",
          location: "深圳华侨城创意文化园北区 C2 展厅",
          status: "已结束"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
