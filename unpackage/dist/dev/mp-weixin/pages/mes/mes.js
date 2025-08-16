"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
const store_mes = require("../../store/mes.js");
if (!Math) {
  MessageCard();
}
const MessageCard = () => "../../components/MessageCard/MessageCard.js";
const _sfc_main = {
  __name: "mes",
  setup(__props) {
    const userStore = store_Info.useInfoStore();
    const mesStore = store_mes.useMesstore();
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref("all");
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const isLoadingMore = common_vendor.ref(false);
    const hasLoadedOnce = common_vendor.ref(false);
    const isLoggedIn = common_vendor.computed(() => userStore.signal);
    const totalUnreadCount = common_vendor.computed(() => mesStore.totalUnreadCount);
    const systemUnreadCount = common_vendor.computed(() => mesStore.systemUnreadCount);
    const groupUnreadCount = common_vendor.computed(() => mesStore.groupUnreadCount);
    const formatMessageData = (rawMessage, type) => {
      if (!rawMessage)
        return null;
      const baseMessage = {
        id: rawMessage.id || `${type}-${Date.now()}`,
        type,
        original_data: rawMessage
      };
      if (type === "system") {
        return {
          ...baseMessage,
          group_name: rawMessage.title || rawMessage.group_name || "系统通知",
          unread_count: rawMessage.unread_count || (rawMessage.is_read === 0 ? 1 : 0),
          is_read: rawMessage.is_read || 0,
          latest_content: rawMessage.content || rawMessage.message || rawMessage.latest_content || "系统消息",
          latest_time: rawMessage.latest_time || rawMessage.created_at || rawMessage.time || (/* @__PURE__ */ new Date()).toISOString(),
          created_at: rawMessage.created_at,
          updated_at: rawMessage.updated_at
        };
      } else {
        return {
          ...baseMessage,
          group_name: rawMessage.group_name || rawMessage.event_name || rawMessage.title || "群组消息",
          unread_count: rawMessage.unread_count || (rawMessage.is_read === 0 ? 1 : 0),
          is_read: rawMessage.is_read || 0,
          latest_content: rawMessage.latest_message || rawMessage.content || rawMessage.description || rawMessage.latest_content || "群组消息",
          latest_time: rawMessage.latest_time || rawMessage.last_message_time || rawMessage.updated_at || rawMessage.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          created_at: rawMessage.created_at,
          updated_at: rawMessage.updated_at
        };
      }
    };
    const allFormattedMessages = common_vendor.computed(() => {
      const systemMessages = (mesStore.systemmes || []).map((msg) => formatMessageData(msg, "system")).filter(Boolean);
      const groupMessages = (mesStore.groupmes || []).map((msg) => formatMessageData(msg, "group")).filter(Boolean);
      return [...systemMessages, ...groupMessages];
    });
    const filteredMessages = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return [];
      let filtered = [];
      if (activeTab.value === "all") {
        filtered = allFormattedMessages.value;
      } else if (activeTab.value === "system") {
        filtered = allFormattedMessages.value.filter((msg) => msg.type === "system");
      } else if (activeTab.value === "group") {
        filtered = allFormattedMessages.value.filter((msg) => msg.type === "group");
      }
      return filtered.sort((a, b) => {
        const aHasUnread = a.unread_count > 0 || a.is_read === 0;
        const bHasUnread = b.unread_count > 0 || b.is_read === 0;
        if (aHasUnread && !bHasUnread)
          return -1;
        if (!aHasUnread && bHasUnread)
          return 1;
        const timeA = new Date(a.latest_time || a.updated_at || a.created_at || 0);
        const timeB = new Date(b.latest_time || b.updated_at || b.created_at || 0);
        return timeB - timeA;
      });
    });
    common_vendor.onMounted(async () => {
      try {
        const sysInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = sysInfo.statusBarHeight || 0;
      } catch (error) {
        console.error("获取系统信息失败:", error);
        statusBarHeight.value = 20;
      }
    });
    common_vendor.onShow(async () => {
      if (isLoggedIn.value) {
        await loadUserMessages();
      }
    });
    common_vendor.onLoad(async () => {
      if (isLoggedIn.value) {
        await loadUserMessages();
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      await handleRefresh();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.watch(isLoggedIn, async (newVal) => {
      if (newVal && !hasLoadedOnce.value) {
        console.log("用户已登录，加载消息数据");
        await loadUserMessages();
      } else if (!newVal) {
        console.log("用户已登出，清空消息数据");
        mesStore.clearAllMessages();
        hasLoadedOnce.value = false;
      }
    });
    const getMessageKey = (msg) => {
      return `${msg.type}-${msg.id || msg.group_name || Date.now()}`;
    };
    const getCurrentUnreadCount = () => {
      if (activeTab.value === "all") {
        return totalUnreadCount.value;
      } else if (activeTab.value === "system") {
        return systemUnreadCount.value;
      } else if (activeTab.value === "group") {
        return groupUnreadCount.value;
      }
      return 0;
    };
    const goToLogin = () => {
      common_vendor.index.switchTab({
        url: "../mymessage/mymessage"
      });
    };
    const loadUserMessages = async (isRefresh = false) => {
      if (!isLoggedIn.value)
        return;
      if (isRefresh) {
        isRefreshing.value = true;
      } else if (!hasLoadedOnce.value) {
        isLoading.value = true;
      }
      try {
        console.log("开始加载用户消息数据...");
        const result = await mesStore.getsystem(isRefresh);
        if (result && result.success) {
          console.log("消息数据加载成功");
          hasLoadedOnce.value = true;
        }
        await common_vendor.nextTick$1();
      } catch (error) {
        console.error("加载消息失败:", error);
        let errorMsg = "加载消息失败";
        if (error.message && error.message.includes("网络")) {
          errorMsg = "网络连接异常，请检查网络设置";
        } else if (error.message && error.message.includes("登录")) {
          errorMsg = "登录状态异常，请重新登录";
        }
        common_vendor.index.showToast({
          title: errorMsg,
          icon: "error",
          duration: 2e3
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const handleRefresh = async () => {
      if (isRefreshing.value)
        return;
      isRefreshing.value = true;
      try {
        await loadUserMessages(true);
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
          duration: 1500
        });
      } finally {
        isRefreshing.value = false;
      }
    };
    const handleRefreshRestore = () => {
      isRefreshing.value = false;
    };
    const loadMoreMessages = async () => {
      if (isLoading.value || isRefreshing.value || isLoadingMore.value)
        return;
      console.log("触发加载更多消息");
      isLoadingMore.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      } catch (error) {
        console.error("加载更多失败:", error);
      } finally {
        isLoadingMore.value = false;
      }
    };
    const switchTab = (tab) => {
      if (activeTab.value === tab)
        return;
      activeTab.value = tab;
      console.log("切换到标签页:", tab);
    };
    const handleMessageTap = (msg) => {
      if (!isLoggedIn.value || !msg)
        return;
      console.log("点击消息:", msg);
      try {
        if (msg.type === "system") {
          common_vendor.index.navigateTo({
            url: `/pages/detail/ChatSystem?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name || "系统消息")}`
          });
        } else if (msg.type === "group") {
          common_vendor.index.navigateTo({
            url: `/pages/detail/ChatGroup?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name || "群组消息")}`
          });
        }
      } catch (error) {
        console.error("页面跳转失败:", error);
        common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "error",
          duration: 1500
        });
      }
    };
    const handleMarkAsRead = async (msg) => {
      if (!msg || !msg.unread_count && msg.is_read === 1)
        return;
      try {
        console.log("标记消息已读:", msg.group_name);
        if (msg.type === "system") {
          await mesStore.markSystemMessageAsRead(msg.id);
        } else {
          await mesStore.markGroupMessageAsRead(msg.id);
        }
      } catch (error) {
        console.error("标记消息已读失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "error",
          duration: 1500
        });
      }
    };
    const getEmptyTitle = () => {
      const titles = {
        all: "暂无消息",
        system: "暂无系统消息",
        group: "暂无群组消息"
      };
      return titles[activeTab.value] || "暂无消息";
    };
    const getEmptyDesc = () => {
      const descs = {
        all: "目前还没有任何消息",
        system: "暂时没有系统通知",
        group: "您还未加入任何群组"
      };
      return descs[activeTab.value] || "暂无内容";
    };
    const markAllAsRead = async () => {
      if (!isLoggedIn.value)
        return;
      const currentMessages = filteredMessages.value;
      const unreadMessages = currentMessages.filter(
        (msg) => msg.unread_count > 0 || msg.is_read === 0
      );
      if (unreadMessages.length === 0) {
        common_vendor.index.showToast({
          title: "已经没有未读消息了",
          icon: "none",
          duration: 1500
        });
        return;
      }
      try {
        const res = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "确认操作",
            content: `确定要将${unreadMessages.length}条未读消息标记为已读吗？`,
            success: resolve
          });
        });
        if (!res.confirm)
          return;
        common_vendor.index.showLoading({
          title: "处理中...",
          mask: true
        });
        const systemIds = unreadMessages.filter((msg) => msg.type === "system").map((msg) => msg.id);
        const groupIds = unreadMessages.filter((msg) => msg.type === "group").map((msg) => msg.id);
        const promises = [];
        if (systemIds.length > 0) {
          promises.push(...systemIds.map((id) => mesStore.markSystemMessageAsRead(id)));
        }
        if (groupIds.length > 0) {
          promises.push(...groupIds.map((id) => mesStore.markGroupMessageAsRead(id)));
        }
        await Promise.allSettled(promises);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: `已标记${unreadMessages.length}条消息为已读`,
          icon: "success",
          duration: 2e3
        });
      } catch (error) {
        console.error("批量标记已读失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "操作失败，请稍后重试",
          icon: "error",
          duration: 2e3
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        b: common_vendor.o(goToLogin)
      } : common_vendor.e({
        c: statusBarHeight.value + "px",
        d: totalUnreadCount.value > 0
      }, totalUnreadCount.value > 0 ? {
        e: common_vendor.t(totalUnreadCount.value > 99 ? "99+" : totalUnreadCount.value)
      } : {}, {
        f: activeTab.value === "all" ? 1 : "",
        g: common_vendor.o(($event) => switchTab("all")),
        h: systemUnreadCount.value > 0
      }, systemUnreadCount.value > 0 ? {
        i: common_vendor.t(systemUnreadCount.value > 99 ? "99+" : systemUnreadCount.value)
      } : {}, {
        j: activeTab.value === "system" ? 1 : "",
        k: common_vendor.o(($event) => switchTab("system")),
        l: groupUnreadCount.value > 0
      }, groupUnreadCount.value > 0 ? {
        m: common_vendor.t(groupUnreadCount.value > 99 ? "99+" : groupUnreadCount.value)
      } : {}, {
        n: activeTab.value === "group" ? 1 : "",
        o: common_vendor.o(($event) => switchTab("group")),
        p: getCurrentUnreadCount() > 0
      }, getCurrentUnreadCount() > 0 ? {
        q: common_vendor.o(markAllAsRead)
      } : {}, {
        r: statusBarHeight.value + 44 + "px",
        s: isLoading.value && filteredMessages.value.length === 0
      }, isLoading.value && filteredMessages.value.length === 0 ? {} : {}, {
        t: common_vendor.f(filteredMessages.value, (msg, k0, i0) => {
          return {
            a: getMessageKey(msg),
            b: common_vendor.o(handleMessageTap, getMessageKey(msg)),
            c: common_vendor.o(handleMarkAsRead, getMessageKey(msg)),
            d: "bb2249ad-0-" + i0,
            e: common_vendor.p({
              message: msg,
              loading: isLoading.value
            })
          };
        }),
        v: !isLoading.value && filteredMessages.value.length === 0
      }, !isLoading.value && filteredMessages.value.length === 0 ? {
        w: common_vendor.t(getEmptyTitle()),
        x: common_vendor.t(getEmptyDesc())
      } : {}, {
        y: isLoadingMore.value
      }, isLoadingMore.value ? {} : {}, {
        z: statusBarHeight.value + 44 + 68 + "px",
        A: common_vendor.o(loadMoreMessages),
        B: isRefreshing.value,
        C: common_vendor.o(handleRefresh),
        D: common_vendor.o(handleRefreshRestore)
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb2249ad"]]);
wx.createPage(MiniProgramPage);
