"use strict";
const common_vendor = require("../../common/vendor.js");
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
        c: common_vendor.f(10, (item, index, i0) => {
          return {
            a: "d008db7a-1-" + i0
          };
        }),
        d: common_vendor.o(handleCardClick),
        e: common_vendor.p({
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
