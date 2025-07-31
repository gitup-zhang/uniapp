"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_recycle_item = common_vendor.resolveComponent("recycle-item");
  const _component_recycle_view = common_vendor.resolveComponent("recycle-view");
  (_component_recycle_item + _component_recycle_view)();
}
const _sfc_main = {
  __name: "mes",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref("all");
    const messages = common_vendor.ref([
      {
        id: 1,
        type: "system",
        title: "系统通知",
        brief: "您有一条新的系统消息，请及时查收。新功能已上线，快来体验吧！",
        time: "2025-07-30 14:30",
        isRead: false,
        priority: "high"
      },
      {
        id: 2,
        type: "system",
        title: "维护公告",
        brief: "系统将于今晚22:00-23:00进行维护升级，期间可能影响使用。",
        time: "2025-07-30 10:15",
        isRead: true,
        priority: "normal"
      },
      {
        id: 3,
        type: "group",
        title: "前端开发技术分享会报名开始",
        brief: "本次分享会将围绕Vue3最新特性、性能优化技巧以及实战案例进行深入讲解，适合有一定基础的前端开发者参与...",
        avatar: "/static/group1.png",
        groupName: "技术交流",
        memberCount: 128,
        time: "2025-07-30 16:45",
        isRead: false,
        priority: "normal"
      },
      {
        id: 4,
        type: "group",
        title: "Vue.js 3.4版本更新说明",
        brief: "Vue.js团队正式发布了3.4版本，新增了多项重要特性：响应式系统优化、组合式API增强、性能提升等...",
        avatar: "/static/group2.png",
        groupName: "学习讨论",
        memberCount: 56,
        time: "2025-07-30 12:20",
        isRead: true,
        priority: "normal"
      },
      {
        id: 5,
        type: "group",
        title: "新项目技术方案讨论会议通知",
        brief: "关于下一个项目的技术栈选择和架构设计，将在明天上午10点召开讨论会议，请相关同事准时参加...",
        avatar: "/static/group3.png",
        groupName: "工作协作",
        memberCount: 15,
        time: "2025-07-29 18:30",
        isRead: false,
        priority: "high"
      },
      {
        id: 6,
        type: "group",
        title: "前端开发技术分享会报名开始报名开始宿舍还是",
        brief: "本次分享会将围绕Vue3最新特性、性能优化技巧以及实战案例进行深入讲解，适合有一定基础的前端开发者参与...",
        avatar: "/static/group1.png",
        groupName: "技术交流",
        memberCount: 128,
        time: "2025-07-30 16:45",
        isRead: false,
        priority: "normal"
      },
      {
        id: 7,
        type: "group",
        title: "Vue.js 3.4版本更新说明",
        brief: "Vue.js团队正式发布了3.4版本，新增了多项重要特性：响应式系统优化、组合式API增强、性能提升等...",
        avatar: "/static/group2.png",
        groupName: "学习讨论",
        memberCount: 56,
        time: "2025-07-30 12:20",
        isRead: true,
        priority: "normal"
      },
      {
        id: 8,
        type: "group",
        title: "新项目技术方案讨论会议通知新建西安报名手速还使其Iis",
        brief: "关于下一个项目的技术栈选择和架构设计，将在明天上午10点召开讨论会议，请相关同事准时参加...",
        avatar: "/static/group3.png",
        groupName: "工作协作",
        memberCount: 15,
        time: "2025-07-29 18:30",
        isRead: false,
        priority: "high"
      }
    ]);
    const filteredMessages = common_vendor.computed(() => {
      if (activeTab.value === "all") {
        return messages.value;
      }
      return messages.value.filter((msg) => msg.type === activeTab.value);
    });
    const unreadCount = common_vendor.computed(() => {
      return messages.value.filter((msg) => !msg.isRead).length;
    });
    const systemUnreadCount = common_vendor.computed(() => {
      return messages.value.filter((msg) => msg.type === "system" && !msg.isRead).length;
    });
    const groupUnreadCount = common_vendor.computed(() => {
      return messages.value.filter((msg) => msg.type === "group" && !msg.isRead).length;
    });
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight;
    });
    const messageItemClass = (msg) => {
      const classes = [];
      if (msg.type === "system")
        classes.push("system-message");
      if (msg.type === "group")
        classes.push("group-message");
      if (!msg.isRead)
        classes.push("unread");
      return classes.join(" ");
    };
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const handleMessageTap = (msg, index) => {
      if (!msg.isRead) {
        const messageIndex = messages.value.findIndex((m) => m.id === msg.id);
        messages.value[messageIndex].isRead = true;
      }
      if (msg.type === "system") {
        common_vendor.index.navigateTo({
          url: `/pages/system-message/index?id=${msg.id}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/group-chat/index?groupId=${msg.id}`
        });
      }
    };
    const toggleRead = (msg, index) => {
      const messageIndex = messages.value.findIndex((m) => m.id === msg.id);
      messages.value[messageIndex].isRead = !msg.isRead;
    };
    const timeCache = /* @__PURE__ */ new Map();
    const formatTime = (time) => {
      if (timeCache.has(time)) {
        return timeCache.get(time);
      }
      const now = /* @__PURE__ */ new Date();
      const msgTime = new Date(time);
      const diff = now - msgTime;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      let result;
      if (days === 0) {
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor(diff / (1e3 * 60));
          result = minutes <= 0 ? "刚刚" : `${minutes}分钟前`;
        } else {
          result = `${hours}小时前`;
        }
      } else if (days === 1) {
        result = "昨天";
      } else if (days <= 7) {
        result = `${days}天前`;
      } else {
        result = time.split(" ")[0];
      }
      timeCache.set(time, result);
      return result;
    };
    const handleAvatarError = () => {
      common_vendor.index.__f__("log", "at pages/mes/mes.vue:336", "头像加载失败");
    };
    const getEmptyTitle = () => {
      const titles = {
        all: "暂无消息",
        system: "暂无系统消息",
        group: "暂无群组消息"
      };
      return titles[activeTab.value];
    };
    const getEmptyDesc = () => {
      const descs = {
        all: "目前还没有任何消息",
        system: "暂时没有系统通知",
        group: "您还未加入任何群组"
      };
      return descs[activeTab.value];
    };
    const markAllAsRead = () => {
      const currentMessages = activeTab.value === "all" ? messages.value : messages.value.filter((msg) => msg.type === activeTab.value);
      currentMessages.forEach((msg) => {
        if (!msg.isRead) {
          const messageIndex = messages.value.findIndex((m) => m.id === msg.id);
          if (messageIndex !== -1) {
            messages.value[messageIndex].isRead = true;
          }
        }
      });
      common_vendor.index.showToast({
        title: `已标记${currentMessages.filter((msg) => !msg.isRead).length || "所有"}条消息为已读`,
        icon: "success",
        duration: 1500
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        c: common_vendor.t(unreadCount.value > 99 ? "99+" : unreadCount.value)
      } : {}, {
        d: activeTab.value === "all" ? 1 : "",
        e: common_vendor.o(($event) => switchTab("all")),
        f: systemUnreadCount.value > 0
      }, systemUnreadCount.value > 0 ? {
        g: common_vendor.t(systemUnreadCount.value)
      } : {}, {
        h: activeTab.value === "system" ? 1 : "",
        i: common_vendor.o(($event) => switchTab("system")),
        j: groupUnreadCount.value > 0
      }, groupUnreadCount.value > 0 ? {
        k: common_vendor.t(groupUnreadCount.value)
      } : {}, {
        l: activeTab.value === "group" ? 1 : "",
        m: common_vendor.o(($event) => switchTab("group")),
        n: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        o: common_vendor.o(markAllAsRead)
      } : {}, {
        p: statusBarHeight.value + 44 + "px",
        q: common_vendor.f(filteredMessages.value, (msg, index, i0) => {
          return common_vendor.e({
            a: common_vendor.n(msg.type),
            b: msg.type === "group"
          }, msg.type === "group" ? {
            c: msg.avatar,
            d: common_vendor.o(handleAvatarError, `msg-${msg.id}`)
          } : {}, {
            e: !msg.isRead
          }, !msg.isRead ? {} : {}, {
            f: common_vendor.t(msg.title),
            g: msg.priority === "high"
          }, msg.priority === "high" ? {} : {}, {
            h: common_vendor.t(msg.brief),
            i: common_vendor.t(formatTime(msg.time)),
            j: msg.type === "group"
          }, msg.type === "group" ? {
            k: common_vendor.t(msg.memberCount)
          } : {}, {
            l: msg.type === "system"
          }, msg.type === "system" ? {} : {
            m: common_vendor.t(msg.groupName)
          }, {
            n: common_vendor.t(msg.isRead ? "📖" : "👁️"),
            o: common_vendor.o(($event) => toggleRead(msg), `msg-${msg.id}`),
            p: common_vendor.n(messageItemClass(msg)),
            q: common_vendor.o(($event) => handleMessageTap(msg), `msg-${msg.id}`),
            r: `msg-${msg.id}`,
            s: "bb2249ad-1-" + i0 + ",bb2249ad-0"
          });
        }),
        r: filteredMessages.value.length === 0
      }, filteredMessages.value.length === 0 ? {
        s: common_vendor.t(getEmptyTitle()),
        t: common_vendor.t(getEmptyDesc())
      } : {}, {
        v: statusBarHeight.value + 44 + 68 + "px",
        w: common_vendor.p({
          ["enable-back-to-top"]: true,
          bounces: false,
          batch: "8",
          cache: "4"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb2249ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mes/mes.js.map
