"use strict";
const common_vendor = require("../../common/vendor.js");
const store_mes = require("../../store/mes.js");
const _sfc_main = {
  __name: "ChatSystem",
  props: {
    id: String,
    groupName: String
  },
  setup(__props) {
    const props = __props;
    const mesStore = store_mes.useMesstore();
    const statusBarHeight = common_vendor.ref(0);
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const messageDetail = common_vendor.ref(null);
    const relatedMessages = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      const messageId = options.id || "";
      decodeURIComponent(options.groupName || "系统消息");
      await loadMessageDetail(messageId);
    });
    common_vendor.onShow(() => {
      if (messageDetail.value && messageDetail.value.is_read === 0) {
        markAsRead();
      }
    });
    const loadMessageDetail = async (messageId) => {
      if (!messageId && !props.id) {
        common_vendor.index.showToast({
          title: "消息ID不存在",
          icon: "error"
        });
        return;
      }
      const id = messageId || props.id;
      isLoading.value = true;
      try {
        let message = mesStore.getSystemMessageById(id);
        if (!message) {
          message = generateMockSystemMessage(id);
        }
        if (message) {
          messageDetail.value = message;
          await loadRelatedMessages();
        } else {
          messageDetail.value = null;
        }
      } catch (error) {
        console.error("加载系统消息详情失败:", error);
        messageDetail.value = null;
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const generateMockSystemMessage = (id) => {
      const mockTypes = [
        {
          title: "系统维护通知",
          content: "系统将于今晚23:00-次日02:00进行例行维护，届时部分功能可能暂时无法使用，请您提前做好相关准备。维护期间给您带来的不便，敬请谅解。",
          type: "maintenance"
        },
        {
          title: "新功能上线",
          content: "我们很高兴地宣布，全新的消息推送功能现已上线！您可以在设置中自定义消息提醒方式，获得更好的使用体验。",
          type: "feature"
        },
        {
          title: "安全提醒",
          content: "检测到您的账户在异地登录，如非本人操作，请及时修改密码并启用双重验证以保障账户安全。",
          type: "security"
        }
      ];
      const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      return {
        id,
        title: randomType.title,
        content: randomType.content,
        message: randomType.content,
        type: randomType.type,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        is_read: Math.random() > 0.5 ? 1 : 0,
        action_url: Math.random() > 0.7 ? "https://example.com/detail" : null,
        extra_data: Math.random() > 0.6 ? {
          priority: "high",
          category: randomType.type,
          source: "system"
        } : null
      };
    };
    const loadRelatedMessages = async () => {
      try {
        const mockRelated = [];
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          mockRelated.push({
            id: `related_${Date.now()}_${i}`,
            title: `相关通知 ${i + 1}`,
            content: `这是与当前消息相关的通知内容 ${i + 1}`,
            created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1e3).toISOString()
          });
        }
        relatedMessages.value = mockRelated;
      } catch (error) {
        console.error("加载相关消息失败:", error);
        relatedMessages.value = [];
      }
    };
    const handleRefresh = async () => {
      var _a;
      isRefreshing.value = true;
      try {
        await loadMessageDetail((_a = messageDetail.value) == null ? void 0 : _a.id);
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        console.error("刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error"
        });
      } finally {
        isRefreshing.value = false;
      }
    };
    const handleRefreshRestore = () => {
      isRefreshing.value = false;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const now = /* @__PURE__ */ new Date();
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, "0");
        const date = String(time.getDate()).padStart(2, "0");
        const hours = String(time.getHours()).padStart(2, "0");
        const minutes = String(time.getMinutes()).padStart(2, "0");
        if (year === now.getFullYear()) {
          return `${month}-${date} ${hours}:${minutes}`;
        } else {
          return `${year}-${month}-${date} ${hours}:${minutes}`;
        }
      } catch (error) {
        console.error("时间格式化错误:", error);
        return String(timeStr);
      }
    };
    const formatExtraData = (extraData) => {
      if (!extraData || typeof extraData !== "object")
        return "";
      try {
        return Object.entries(extraData).map(([key, value]) => `${key}: ${value}`).join("\n");
      } catch (error) {
        return String(extraData);
      }
    };
    const markAsRead = async () => {
      if (!messageDetail.value || messageDetail.value.is_read === 1)
        return;
      try {
        await mesStore.markSystemMessageAsRead(messageDetail.value.id);
        messageDetail.value.is_read = 1;
        common_vendor.index.showToast({
          title: "已标记为已读",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        console.error("标记已读失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "error"
        });
      }
    };
    const handleAction = () => {
      var _a;
      if (!((_a = messageDetail.value) == null ? void 0 : _a.action_url))
        return;
      common_vendor.index.showModal({
        title: "跳转确认",
        content: "是否要打开相关链接？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({
              url: `/pages/webview/index?url=${encodeURIComponent(messageDetail.value.action_url)}`
            });
          }
        }
      });
    };
    const viewRelatedMessage = (relatedMessage) => {
      common_vendor.index.navigateTo({
        url: `/pages/system-message/index?id=${relatedMessage.id}&groupName=${encodeURIComponent("系统消息")}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: isLoading.value
      }, isLoading.value ? {} : messageDetail.value ? common_vendor.e({
        e: common_vendor.t(messageDetail.value.title || "系统通知"),
        f: common_vendor.t(formatTime(messageDetail.value.created_at)),
        g: messageDetail.value.is_read === 0
      }, messageDetail.value.is_read === 0 ? {} : {}, {
        h: common_vendor.t(messageDetail.value.content || messageDetail.value.message || "暂无内容"),
        i: messageDetail.value.extra_data
      }, messageDetail.value.extra_data ? {
        j: common_vendor.t(formatExtraData(messageDetail.value.extra_data))
      } : {}, {
        k: messageDetail.value.action_url
      }, messageDetail.value.action_url ? {
        l: common_vendor.o(handleAction)
      } : {}, {
        m: messageDetail.value.is_read === 0
      }, messageDetail.value.is_read === 0 ? {
        n: common_vendor.o(markAsRead)
      } : {}, {
        o: relatedMessages.value.length > 0
      }, relatedMessages.value.length > 0 ? {
        p: common_vendor.f(relatedMessages.value, (related, k0, i0) => {
          return {
            a: common_vendor.t(related.title || related.content),
            b: common_vendor.t(formatTime(related.created_at)),
            c: related.id,
            d: common_vendor.o(($event) => viewRelatedMessage(related), related.id)
          };
        })
      } : {}) : {
        q: common_vendor.o(loadMessageDetail)
      }, {
        d: messageDetail.value,
        r: statusBarHeight.value + 88 + "px",
        s: isRefreshing.value,
        t: common_vendor.o(handleRefresh),
        v: common_vendor.o(handleRefreshRestore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-82517712"]]);
wx.createPage(MiniProgramPage);
