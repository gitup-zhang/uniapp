"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  AdminMessage();
}
const AdminMessage = () => "../../components/AdminMessage/AdminMessage.js";
const _sfc_main = {
  __name: "ChatGroup",
  props: {
    id: String,
    groupName: String
  },
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const isLoading = common_vendor.ref(false);
    const scrollIntoView = common_vendor.ref("");
    const groupId = common_vendor.ref("");
    const groupName = common_vendor.ref("管理员通知");
    const messages = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      groupId.value = options.id || "";
      groupName.value = decodeURIComponent(options.groupName || "管理员通知");
      await loadMessages();
    });
    common_vendor.onShow(() => {
      scrollToTop();
    });
    const groupedMessages = common_vendor.computed(() => {
      const grouped = {};
      messages.value.forEach((message) => {
        const date = new Date(message.created_at);
        const today = /* @__PURE__ */ new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let dateKey = "";
        if (isSameDay(date, today)) {
          dateKey = "今天";
        } else if (isSameDay(date, yesterday)) {
          dateKey = "昨天";
        } else if (date.getFullYear() === today.getFullYear()) {
          dateKey = `${date.getMonth() + 1}月${date.getDate()}日`;
        } else {
          dateKey = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        }
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(message);
      });
      return grouped;
    });
    const isSameDay = (date1, date2) => {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };
    const loadMessages = async () => {
      isLoading.value = true;
      try {
        const mockMessages = generateMockAdminMessagesWithMedia();
        messages.value = mockMessages;
      } catch (error) {
        console.error("加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载消息失败",
          icon: "error"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const generateMockAdminMessagesWithMedia = () => {
      const mockMessages = [];
      mockMessages.push({
        id: "msg_1",
        title: "系统维护完成",
        content: "系统维护已完成，感谢您的耐心等待。",
        type: "maintenance",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 30).toISOString(),
        sender_name: "系统管理员",
        read_status: "read"
      });
      mockMessages.push({
        id: "msg_2",
        title: "新功能上线通知",
        content: `亲爱的用户，我们很高兴地宣布，经过团队的不懈努力，新版本已正式上线！本次更新包含以下重要功能：

1. 全新的用户界面设计，提升用户体验
2. 增加了智能推荐功能
3. 优化了系统性能和稳定性
4. 修复了已知问题

请及时更新到最新版本，体验全新功能！`,
        type: "update",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 2).toISOString(),
        sender_name: "系统管理员",
        read_status: "unread"
      });
      mockMessages.push({
        id: "msg_3",
        title: "重要安全公告",
        content: `各位用户：

近期我们监测到网络上出现了一些针对我们平台的钓鱼网站和虚假信息，为了保护您的账户安全和个人信息，请务必注意以下几点：

一、官方渠道识别
1. 请认准我们的官方域名：example.com
2. 官方客服电话：400-123-4567
3. 官方微信公众号：ExampleApp
4. 官方QQ群：123456789

二、安全防护措施
1. 定期修改密码，建议使用强密码
2. 开启两步验证功能
3. 不要在公共网络环境下登录账户
4. 及时更新APP到最新版本

三、诈骗识别指南
1. 我们不会通过短信或邮件要求您提供密码
2. 任何要求转账或充值的信息都是诈骗
3. 官方客服不会主动联系要求提供验证码
4. 请勿点击来源不明的链接

四、紧急联系方式
如果您发现账户异常或遇到安全问题，请立即通过以下方式联系我们：
- 客服热线：400-123-4567（24小时服务）
- 在线客服：APP内"帮助与反馈"
- 官方邮箱：security@example.com

我们会持续加强安全防护措施，但也需要您的配合。请提高警惕，保护好自己的账户安全。如果您发现可疑活动，请及时举报。

感谢您的理解与支持！`,
        type: "security",
        priority: "high",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 5).toISOString(),
        sender_name: "安全团队",
        read_status: "unread",
        actions: [
          { id: "view_detail", type: "primary", label: "查看详情", url: "/pages/security/detail" },
          { id: "mark_read", type: "secondary", label: "标记已读" }
        ]
      });
      mockMessages.push({
        id: "msg_4",
        title: "活动海报发布",
        content: `双十一购物狂欢节即将开始！查看活动详情：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
活动时间：11月1日-11月11日
优惠力度：全场5折起！`,
        type: "event",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 8).toISOString(),
        sender_name: "运营团队",
        read_status: "read"
      });
      mockMessages.push({
        id: "msg_5",
        title: "新功能演示视频",
        content: `我们为大家准备了新功能的详细演示视频，快来看看吧：
[video:http://vjs.zencdn.net/v/oceans.mp4]
视频时长：3分钟，建议在WiFi环境下观看。`,
        type: "update",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 12).toISOString(),
        sender_name: "产品团队",
        read_status: "unread"
      });
      mockMessages.push({
        id: "msg_6",
        title: "用户反馈处理结果",
        content: `感谢大家的反馈！我们已经完成了界面优化：
更新前：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
更新后：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
主要改进：界面更加简洁美观，操作更加便捷。`,
        type: "update",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 24).toISOString(),
        sender_name: "设计团队",
        read_status: "read"
      });
      mockMessages.push({
        id: "msg_7",
        content: `[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]`,
        type: "announcement",
        priority: "normal",
        created_at: new Date(Date.now() - 1e3 * 60 * 60 * 30).toISOString(),
        sender_name: "系统管理员",
        read_status: "read"
      });
      return mockMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };
    const scrollToTop = () => {
      common_vendor.nextTick$1(() => {
        if (messages.value.length > 0) {
          scrollIntoView.value = `msg-${messages.value[0].id}`;
        }
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const handleMessageClick = (message) => {
      common_vendor.index.navigateTo({
        url: `/pages/admin-message/detail?id=${message.id}&title=${encodeURIComponent(message.title || "管理员通知")}`
      });
    };
    const handleActionClick = (action, message) => {
      switch (action.type) {
        case "primary":
          if (action.url) {
            common_vendor.index.navigateTo({
              url: `${action.url}?id=${message.id}`
            });
          }
          break;
        case "secondary":
          if (action.id === "mark_read") {
            markAsRead(message);
          }
          break;
        default:
          common_vendor.index.showToast({
            title: "操作成功",
            icon: "success"
          });
      }
    };
    const handleMarkRead = (message) => {
      markAsRead(message);
    };
    const markAsRead = async (message) => {
      try {
        const messageIndex = messages.value.findIndex((msg) => msg.id === message.id);
        if (messageIndex !== -1) {
          messages.value[messageIndex].read_status = "read";
        }
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: common_vendor.t(groupName.value),
        d: common_vendor.f(groupedMessages.value, (group, dateKey, i0) => {
          return {
            a: common_vendor.t(dateKey),
            b: common_vendor.f(group, (message, k1, i1) => {
              return {
                a: message.id,
                b: common_vendor.o(handleMessageClick, message.id),
                c: common_vendor.o(handleActionClick, message.id),
                d: common_vendor.o(handleMarkRead, message.id),
                e: "6f6e3c6b-0-" + i0 + "-" + i1,
                f: common_vendor.p({
                  message
                })
              };
            }),
            c: dateKey
          };
        }),
        e: messages.value.length === 0 && !isLoading.value
      }, messages.value.length === 0 && !isLoading.value ? {} : {}, {
        f: statusBarHeight.value + 38 + "px",
        g: scrollIntoView.value,
        h: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6f6e3c6b"]]);
wx.createPage(MiniProgramPage);
