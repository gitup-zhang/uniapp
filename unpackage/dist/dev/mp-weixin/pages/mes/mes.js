"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
const store_mes = require("../../store/mes.js");
const newApis_mes = require("../../new-apis/mes.js");
if (!Math) {
  MessageCard();
}
const MessageCard = () => "../../components/MessageCard/MessageCard.js";
const refreshThreshold = 60;
const maxPullDistance = 100;
const _sfc_main = {
  __name: "mes",
  setup(__props) {
    const userStore = store_Info.useInfoStore();
    const mesStore = store_mes.useMesstore();
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref("system");
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const isLoadingMore = common_vendor.ref(false);
    const hasLoadedOnce = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const startY = common_vendor.ref(0);
    const pullDistance = common_vendor.ref(0);
    const isPulling = common_vendor.ref(false);
    const isLoggedIn = common_vendor.computed(() => userStore.signal);
    const systemUnreadCount = common_vendor.computed(() => mesStore.systemUnreadCount);
    const groupUnreadCount = common_vendor.computed(() => mesStore.groupUnreadCount);
    const systemMessages = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return [];
      return mesStore.systemmes || [];
    });
    const groupMessages = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return [];
      return mesStore.groupmes || [];
    });
    const shouldShowEmpty = common_vendor.computed(() => {
      if (activeTab.value === "system") {
        return systemMessages.value.length === 0;
      } else if (activeTab.value === "group") {
        return groupMessages.value.length === 0;
      }
      return false;
    });
    const getCurrentUnreadCount = () => {
      return systemUnreadCount.value + groupUnreadCount.value;
    };
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
      console.log("页面显示，刷新消息列表");
      if (isLoggedIn.value) {
        await loadUserMessages(true);
      }
    });
    common_vendor.onLoad(async () => {
      if (isLoggedIn.value) {
        await loadUserMessages();
      }
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
    const handleScroll = (e) => {
      scrollTop.value = e.detail.scrollTop;
    };
    const handleTouchStart = (e) => {
      if (isRefreshing.value)
        return;
      startY.value = e.touches[0].pageY;
    };
    const handleTouchMove = (e) => {
      if (isRefreshing.value)
        return;
      if (scrollTop.value > 5) {
        pullDistance.value = 0;
        isPulling.value = false;
        return;
      }
      const currentY = e.touches[0].pageY;
      const distance = currentY - startY.value;
      if (distance > 0) {
        const damping = 1;
        const calculatedDistance = Math.pow(distance, 0.8) * damping;
        pullDistance.value = Math.min(calculatedDistance, maxPullDistance);
        isPulling.value = true;
      } else {
        pullDistance.value = 0;
        isPulling.value = false;
      }
    };
    const handleTouchEnd = async () => {
      if (!isPulling.value || isRefreshing.value) {
        pullDistance.value = 0;
        isPulling.value = false;
        return;
      }
      if (pullDistance.value >= refreshThreshold) {
        isRefreshing.value = true;
        pullDistance.value = 50;
        isPulling.value = false;
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
            icon: "none",
            duration: 1500
          });
        } finally {
          setTimeout(() => {
            pullDistance.value = 0;
            isRefreshing.value = false;
          }, 300);
        }
      } else {
        pullDistance.value = 0;
        isPulling.value = false;
      }
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/Login"
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
    const handleMessageTap = (msg, messageType) => {
      if (!isLoggedIn.value || !msg)
        return;
      console.log("点击消息卡片:", msg, "消息类型:", messageType);
      try {
        if (messageType === "system") {
          console.log("系统消息跳转");
          common_vendor.index.navigateTo({
            url: `/pages/detail/ChatSystem?id=${msg.msg_group_id}&groupName=${encodeURIComponent(msg.group_name || "群组消息")}`
          });
        } else if (messageType === "group") {
          console.log("群组消息跳转");
          common_vendor.index.navigateTo({
            url: `/pages/detail/ChatGroup?id=${msg.msg_group_id}&groupName=${encodeURIComponent(msg.group_name || "群组消息")}`
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
    const handleMarkAsRead = async (msg, messageType) => {
      if (!msg || !mesStore.isMessageUnread(msg))
        return;
      try {
        console.log("标记消息已读ID:", msg.event_id, "消息类型:", messageType);
        if (messageType === "system") {
        } else {
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
        system: "暂无系统消息",
        group: "暂无群组消息"
      };
      return titles[activeTab.value] || "暂无消息";
    };
    const getEmptyDesc = () => {
      const descs = {
        system: "暂时没有系统通知",
        group: "您还未加入任何群组"
      };
      return descs[activeTab.value] || "暂无内容";
    };
    const markAllAsRead = async () => {
      if (!isLoggedIn.value)
        return;
      const totalUnread = systemUnreadCount.value + groupUnreadCount.value;
      if (totalUnread === 0) {
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
            content: `确定要将所有${totalUnread}条未读消息标记为已读吗？`,
            success: resolve
          });
        });
        if (!res.confirm)
          return;
        common_vendor.index.showLoading({
          title: "处理中...",
          mask: true
        });
        await newApis_mes.markAllAsReadmes();
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: `已标记${totalUnread}条消息为已读`,
          icon: "success",
          duration: 2e3
        });
        await loadUserMessages(true);
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
        d: systemUnreadCount.value > 0
      }, systemUnreadCount.value > 0 ? {
        e: common_vendor.t(systemUnreadCount.value > 99 ? "99+" : systemUnreadCount.value)
      } : {}, {
        f: activeTab.value === "system" ? 1 : "",
        g: common_vendor.o(($event) => switchTab("system")),
        h: groupUnreadCount.value > 0
      }, groupUnreadCount.value > 0 ? {
        i: common_vendor.t(groupUnreadCount.value > 99 ? "99+" : groupUnreadCount.value)
      } : {}, {
        j: activeTab.value === "group" ? 1 : "",
        k: common_vendor.o(($event) => switchTab("group")),
        l: getCurrentUnreadCount() > 0
      }, getCurrentUnreadCount() > 0 ? {
        m: common_vendor.o(markAllAsRead)
      } : {}, {
        n: statusBarHeight.value + 44 + "px",
        o: isRefreshing.value ? 1 : "",
        p: pullDistance.value + "px",
        q: Math.min(pullDistance.value / 50, 1),
        r: isLoading.value && !hasLoadedOnce.value
      }, isLoading.value && !hasLoadedOnce.value ? {} : {}, {
        s: activeTab.value === "system"
      }, activeTab.value === "system" ? {
        t: common_vendor.f(systemMessages.value, (msg, k0, i0) => {
          return {
            a: msg.event_id,
            b: common_vendor.o(handleMessageTap, msg.event_id),
            c: common_vendor.o(handleMarkAsRead, msg.event_id),
            d: "bb2249ad-0-" + i0,
            e: common_vendor.p({
              message: msg,
              ["message-type"]: "system",
              loading: isLoading.value
            })
          };
        })
      } : {}, {
        v: activeTab.value === "group"
      }, activeTab.value === "group" ? {
        w: common_vendor.f(groupMessages.value, (msg, k0, i0) => {
          return {
            a: msg.event_id,
            b: common_vendor.o(handleMessageTap, msg.event_id),
            c: common_vendor.o(handleMarkAsRead, msg.event_id),
            d: "bb2249ad-1-" + i0,
            e: common_vendor.p({
              message: msg,
              ["message-type"]: "group",
              loading: isLoading.value
            })
          };
        })
      } : {}, {
        x: !isLoading.value && shouldShowEmpty.value
      }, !isLoading.value && shouldShowEmpty.value ? {
        y: common_vendor.t(getEmptyTitle()),
        z: common_vendor.t(getEmptyDesc())
      } : {}, {
        A: isLoadingMore.value
      }, isLoadingMore.value ? {} : {}, {
        B: common_vendor.o(handleScroll),
        C: common_vendor.o(loadMoreMessages),
        D: common_vendor.o(handleTouchStart),
        E: common_vendor.o(handleTouchMove),
        F: common_vendor.o(handleTouchEnd),
        G: statusBarHeight.value + 44 + 56 + "px"
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb2249ad"]]);
wx.createPage(MiniProgramPage);
