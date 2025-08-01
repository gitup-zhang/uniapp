"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ArticleCard",
  props: {
    newsData: {
      type: Object,
      default: () => ({
        article_id: "",
        article_title: "新闻标题",
        brief_content: "新闻内容摘要，这里展示新闻的主要内容概述...",
        cover_image_url: "/static/images/default-news.jpg",
        source: "新闻来源",
        release_time: /* @__PURE__ */ new Date(),
        field_name: "科技"
        // views: 1234,
        // likes: 89,
        // comments: 23
      })
    }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClick = () => {
      emit("click", props.newsData);
    };
    const handleImageError = () => {
      common_vendor.index.__f__("log", "at components/ArticleCard/ArticleCard.vue:83", "图片加载失败");
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const now = /* @__PURE__ */ new Date();
      const publishTime = new Date(time);
      const diff = now - publishTime;
      const minutes = Math.floor(diff / (1e3 * 60));
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return publishTime.toLocaleDateString();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.newsData.cover_image_url,
        b: common_vendor.o(handleImageError),
        c: __props.newsData.field_name
      }, __props.newsData.field_name ? {
        d: common_vendor.t(__props.newsData.field_name)
      } : {}, {
        e: common_vendor.t(__props.newsData.source || "新闻来源"),
        f: common_vendor.t(formatTime(__props.newsData.release_time)),
        g: common_vendor.t(__props.newsData.article_title),
        h: common_vendor.t(__props.newsData.brief_content),
        i: common_vendor.o(handleClick)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-67a517e8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ArticleCard/ArticleCard.js.map
