"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  mpHtml();
}
const mpHtml = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const _sfc_main = {
  __name: "SystemMesDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const isLoading = common_vendor.ref(true);
    const message = common_vendor.ref({});
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
      try {
        isLoading.value = true;
        message.value = common_vendor.index.getStorageSync("SystemMessage") || null;
        console.log("接收到的 message:", message.value);
      } catch (error) {
        console.error("读取 message 失败", error);
      } finally {
        isLoading.value = false;
      }
    });
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, "0");
        const date = String(time.getDate()).padStart(2, "0");
        const hours = String(time.getHours()).padStart(2, "0");
        const minutes = String(time.getMinutes()).padStart(2, "0");
        const seconds = String(time.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        return String(timeStr);
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: isLoading.value
      }, isLoading.value ? {} : message.value.content ? {
        e: common_vendor.t(message.value.title),
        f: common_vendor.t(formatTime(message.value.send_time)),
        g: common_vendor.p({
          content: message.value.content,
          ["container-style"]: _ctx.style
        })
      } : {
        h: common_vendor.o((...args) => _ctx.loadMessageDetail && _ctx.loadMessageDetail(...args))
      }, {
        d: message.value.content,
        i: statusBarHeight.value + 48 + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a39301fc"]]);
wx.createPage(MiniProgramPage);
