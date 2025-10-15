"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "ArticlePolicy",
  props: {
    policyData: {
      type: Object,
      default: () => ({
        article_id: "",
        article_title: "政策文件标题",
        article_source: "发文机关",
        // documentNumber: '文件编号',
        release_time: /* @__PURE__ */ new Date(),
        // effectiveDate: null,
        brief_content: "政策文件摘要内容...",
        // level: '国家级',
        // status: '现行有效',
        tags: ["经济发展", "税收政策"]
        // pageCount: 10,
        // views: 1234,
        // downloads: 567
      })
    }
  },
  emits: ["click", "preview", "download"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClick = () => {
      emit("click", props.policyData);
    };
    const formatDate = (date) => {
      if (!date)
        return "";
      const d = new Date(date);
      return d.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.policyData.article_title),
        b: common_vendor.t(__props.policyData.article_source),
        c: common_vendor.t(formatDate(__props.policyData.release_time)),
        d: common_vendor.t(__props.policyData.brief_content),
        e: __props.policyData.tags && __props.policyData.tags.length
      }, __props.policyData.tags && __props.policyData.tags.length ? {
        f: common_vendor.f(__props.policyData.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag
          };
        })
      } : {}, {
        g: common_vendor.o(handleClick)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f8dda5f"]]);
exports.MiniProgramPage = MiniProgramPage;
