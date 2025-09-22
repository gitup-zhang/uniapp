"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_data = require("../../utils/data.js");
if (!Math) {
  mpHtml();
}
const mpHtml = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const _sfc_main = {
  __name: "GroupMesDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const message = common_vendor.ref({});
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
      try {
        message.value = common_vendor.index.getStorageSync("currentMessage") || null;
        console.log("接收到的 message:", message.value);
      } catch (error) {
        console.error("读取 message 失败", error);
      }
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: message.value.priority === "high" ? 1 : "",
        d: common_vendor.t(message.value.sender_name || "系统管理员"),
        e: common_vendor.t(common_vendor.unref(utils_data.Dataformat)(message.value.send_time)),
        f: message.value.priority === "high"
      }, message.value.priority === "high" ? {} : {}, {
        g: message.value.title
      }, message.value.title ? {
        h: common_vendor.t(message.value.title)
      } : {}, {
        i: common_vendor.p({
          content: message.value.content,
          ["container-style"]: _ctx.style
        }),
        j: statusBarHeight.value + 48 + "px"
      });
    };
  }
};
wx.createPage(_sfc_main);
