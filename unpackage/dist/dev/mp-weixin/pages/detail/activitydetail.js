"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "activitydetail",
  setup(__props) {
    const bannerImages = common_vendor.ref([
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      // 替换为实际的图片路径
      "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
      "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
    ]);
    const eventInfo = common_vendor.reactive({
      title: "中国大模型人才大会火热报名中！",
      location: "北京中关村",
      date: "3月15日-4月10日",
      fee: "免费",
      description: '在全球人工智能技术迅猛发展的浪潮下，大模型作为AI领域的核心驱动力，正深刻重塑产业格局与人才需求。为促进技术交流，汇聚精英，共享AI盛宴，2024年中国大模型人才大会将于北京[场馆]隆重举行。本次大会以"智聚未来，共创AI新纪元"为主题，汇聚国内外顶尖学者、企业领袖与技术精英，共同探讨大模型技术前沿、应用落地与人才生态建设，助力中国AI产业高质量发展。',
      attendeeInfo: "大会邀请清华大学、北京大学等高校的AI领军学者，以及来自百度、阿里、字节跳动等企业的技术负责人，分享大模型研发的最新突破与行业实践，活动荣获得主或国家奖得主担任[拟邀请]将发表主旨演讲，探讨AI未来的伦理与方向。",
      deadline: "04/10 12:00"
    });
    function onBack() {
      common_vendor.index.navigateBack();
    }
    const handleRegister = () => {
      common_vendor.index.showToast({
        title: "跳转到报名页面",
        icon: "none"
      });
      common_vendor.index.navigateTo({ url: "/pages/detail/applydetail" });
    };
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
        c: common_vendor.f(bannerImages.value, (image, index, i0) => {
          return {
            a: image,
            b: index
          };
        }),
        d: common_vendor.t(eventInfo.title),
        e: common_vendor.t(eventInfo.location),
        f: common_vendor.t(eventInfo.date),
        g: common_vendor.t(eventInfo.fee),
        h: common_vendor.t(eventInfo.description),
        i: common_vendor.t(eventInfo.attendeeInfo),
        j: common_vendor.o(handleRegister),
        k: common_vendor.t(eventInfo.deadline)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9fc11f58"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/activitydetail.js.map
