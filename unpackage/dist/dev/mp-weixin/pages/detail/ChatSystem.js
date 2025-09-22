"use strict";
const common_vendor = require("../../common/vendor.js");
const store_mes = require("../../store/mes.js");
if (!Math) {
  MessageCard();
}
const MessageCard = () => "../../components/MessageCardUser/MessageCardUser.js";
const _sfc_main = {
  __name: "ChatSystem",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const pageSize = common_vendor.ref(10);
    common_vendor.ref(false);
    const MesStore = store_mes.useMesstore();
    const groupId = common_vendor.ref("");
    const refresherTriggered = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      console.log("跳转到的群组信息：", options);
      groupId.value = options.id || "";
      await loadInitialMessages();
    });
    common_vendor.onShow(() => {
      console.log("系统消息页面显示");
    });
    common_vendor.onHide(() => {
      if (MesStore.error) {
        MesStore.error = null;
      }
    });
    const loadInitialMessages = async () => {
      try {
        await MesStore.getMessageList(groupId.value, {
          message_type: "SYSTEM",
          page: 1,
          page_size: pageSize.value
        });
      } catch (error) {
        console.error("初始加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const handleRefresh = async () => {
      try {
        refresherTriggered.value = true;
        await loadInitialMessages();
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        console.error("刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error",
          duration: 2e3
        });
      } finally {
        refresherTriggered.value = false;
        console.log("刷新状态重置");
      }
    };
    const handleRefreshRestore = () => {
      console.log("刷新完成");
    };
    const handleRetry = async () => {
      MesStore.error = null;
      await loadInitialMessages();
    };
    const handleMessageClick = async (message, index) => {
      console.log("点击消息:", message.title);
    };
    const handleToggleExpanded = async (messageId, index) => {
      MesStore.toggleMessageExpanded(messageId);
    };
    const handleViewDetail = async (message) => {
      common_vendor.index.setStorageSync("SystemMessage", message);
      common_vendor.index.navigateTo({
        url: `/pages/detail/SystemMesDetail`
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0
      }, common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0 ? {} : common_vendor.e({
        d: common_vendor.f(common_vendor.unref(MesStore).MessageList, (message, index, i0) => {
          return {
            a: message.id,
            b: common_vendor.o(handleMessageClick, message.id),
            c: common_vendor.o(handleToggleExpanded, message.id),
            d: common_vendor.o(handleViewDetail, message.id),
            e: "82517712-0-" + i0,
            f: common_vendor.p({
              message,
              index
            })
          };
        }),
        e: common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0
      }, common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0 ? common_vendor.e({
        f: common_vendor.unref(MesStore).loadingMore
      }, common_vendor.unref(MesStore).loadingMore ? {} : {}) : common_vendor.unref(MesStore).MessageList.length > 0 && !common_vendor.unref(MesStore).hasMoreData ? {} : {}, {
        g: common_vendor.unref(MesStore).MessageList.length > 0 && !common_vendor.unref(MesStore).hasMoreData
      }), {
        h: !common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0
      }, !common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0 ? common_vendor.e({
        i: common_vendor.unref(MesStore).error
      }, common_vendor.unref(MesStore).error ? {
        j: common_vendor.o(handleRetry)
      } : {}) : {}, {
        k: common_vendor.unref(MesStore).error && common_vendor.unref(MesStore).MessageList.length > 0
      }, common_vendor.unref(MesStore).error && common_vendor.unref(MesStore).MessageList.length > 0 ? {
        l: common_vendor.t(common_vendor.unref(MesStore).error),
        m: common_vendor.o(handleRetry)
      } : {}, {
        n: statusBarHeight.value + 48 + "px",
        o: refresherTriggered.value,
        p: common_vendor.o(handleRefresh),
        q: common_vendor.o(handleRefreshRestore),
        r: common_vendor.o((...args) => _ctx.handleLoadMore && _ctx.handleLoadMore(...args))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-82517712"]]);
wx.createPage(MiniProgramPage);
