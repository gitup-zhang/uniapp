"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      messages: [
        {
          avatar: "/static/avatar1.png",
          title: "系统通知",
          brief: "您有一条新消息，请及时查收。",
          time: "2025-07-17"
        },
        {
          avatar: "/static/avatar2.png",
          title: "活动提醒",
          brief: "限时优惠已开始，快来参与！",
          time: "2025-07-16"
        }
      ]
    };
  },
  onLoad() {
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: $data.messages.length > 0
  }, $data.messages.length > 0 ? {
    c: common_vendor.f($data.messages, (msg, index, i0) => {
      return {
        a: msg.avatar,
        b: common_vendor.t(msg.title),
        c: common_vendor.t(msg.brief),
        d: common_vendor.t(msg.time),
        e: index
      };
    })
  } : {
    d: common_assets._imports_0$2
  }, {
    e: $data.statusBarHeight + 44 + 12 + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb2249ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mes/mes.js.map
