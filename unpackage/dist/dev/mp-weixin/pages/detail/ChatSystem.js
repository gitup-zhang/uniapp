"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ChatSystem",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const isLoadingMore = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPage = common_vendor.ref(1);
    const messages = common_vendor.ref([]);
    const CONTENT_CONFIG = {
      SHORT_LIMIT: 80,
      // 短内容限制（字符数）
      MEDIUM_LIMIT: 300,
      // 中等内容限制
      PREVIEW_LENGTH: 120,
      // 预览内容长度
      COLLAPSE_HEIGHT: 3
      // 折叠时显示行数
    };
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      await loadMessages();
    });
    const loadMessages = async (page = 1) => {
      if (page === 1) {
        isLoading.value = true;
      } else {
        isLoadingMore.value = true;
      }
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockMessages = generateMockMessages(page);
        if (page === 1) {
          messages.value = mockMessages.map((msg) => ({
            ...msg,
            expanded: false
          }));
        } else {
          messages.value.push(...mockMessages.map((msg) => ({
            ...msg,
            expanded: false
          })));
        }
        hasMore.value = page < 3;
        currentPage.value = page;
      } catch (error) {
        console.error("加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        isLoading.value = false;
        isLoadingMore.value = false;
      }
    };
    const generateMockMessages = (page) => {
      const messages2 = [];
      const baseId = (page - 1) * 8;
      const messageTemplates = [
        {
          title: "系统维护通知",
          shortContent: "系统将于今晚23:00进行维护升级，预计2小时完成。",
          mediumContent: "尊敬的用户，系统将于今晚23:00-次日01:00进行例行维护升级。维护期间，部分功能可能暂时无法使用，包括登录、支付、数据同步等。我们建议您提前保存工作进度，避免数据丢失。维护完成后，系统性能将得到显著提升，感谢您的理解与支持。如有紧急问题，请联系在线客服。",
          longContent: "尊敬的用户，为了给您提供更优质的服务体验，我们将于今晚23:00至次日01:00进行系统全面维护升级。本次维护涉及服务器硬件升级、数据库性能优化、安全系统更新、新功能模块部署等多个方面。维护期间，以下功能将暂时无法使用：用户登录注册、在线支付交易、文件上传下载、实时消息推送、数据报表生成、第三方接口调用等核心服务。为确保您的数据安全，我们强烈建议您在维护开始前及时保存所有工作进度，备份重要数据，并退出系统。维护完成后，系统将实现以下改进：响应速度提升60%以上、并发处理能力增强3倍、数据安全等级提升至金融级标准、新增智能推荐功能、优化移动端用户体验。预计维护将按时完成，如遇特殊情况需要延长维护时间，我们会第一时间通过短信、邮件等方式通知您。维护期间给您带来的不便，我们深表歉意。如有任何紧急问题或疑问，请通过以下方式联系我们：24小时客服热线400-888-6666、紧急邮箱emergency@example.com、官方微信客服。感谢您一直以来的信任与支持！"
        },
        {
          title: "安全提醒通知",
          shortContent: "检测到您的账户存在异常登录行为，请及时检查。",
          mediumContent: "安全提醒：我们的风控系统检测到您的账户在北京地区有异常登录记录，时间为今日14:30。如果这是您本人操作，请忽略此消息。如果不是您本人操作，请立即修改密码，启用双重验证，并检查账户资金安全。我们建议定期更换密码，使用复杂密码组合，不在公共场所登录账户。",
          longContent: "重要安全提醒：我们的智能风控系统在今日14:30:25检测到您的账户出现异常登录行为。具体信息如下：登录地点：北京市朝阳区（IP:120.244.xxx.xxx）、设备信息：Windows 10专业版Chrome浏览器、登录状态：成功登录并进行了部分操作。系统同时检测到以下异常特征：登录地点与您常用地点不符、设备指纹信息陌生、登录时间段异常、操作行为模式与平时差异较大。如果这是您本人的正常操作，请点击确认安全按钮，系统将记录此次登录为安全行为。如果这不是您本人操作，说明您的账户可能已被他人盗用，请立即采取以下安全措施：1.立即修改账户密码，建议使用包含大小写字母、数字、特殊符号的强密码；2.启用双重验证功能，绑定手机号码和邮箱；3.检查并清除可疑登录设备；4.修改密保问题和答案；5.检查账户资金变动和重要信息修改记录；6.如发现任何损失，请立即联系客服进行处理。为了您的账户安全，我们建议：定期更换密码（建议每3个月一次）、不要在公共网络或设备上登录、开启登录短信提醒功能、定期查看账户安全报告。如需帮助，请联系7×24小时安全专线：400-666-8888。"
        },
        {
          title: "新功能上线公告",
          shortContent: "全新的智能推荐功能已正式上线，快来体验吧！",
          mediumContent: "好消息！经过3个月的精心开发，全新的AI智能推荐系统现已正式上线！新功能基于深度学习算法，能够根据您的使用习惯和偏好，为您推荐最相关的内容和服务。同时，我们还优化了界面设计，提升了系统响应速度，增加了夜间模式等实用功能。赶快更新到最新版本，体验更智能、更便捷的服务吧！",
          longContent: "重大更新公告！经过我们产品团队3个月的潜心研发和精心打磨，基于最新AI技术的智能推荐系统现已正式发布上线！本次更新是我们产品历史上最重要的里程碑之一，将为您带来前所未有的个性化体验。核心功能亮点：1.AI智能推荐引擎：采用先进的深度学习和神经网络算法，通过分析您的浏览历史、操作习惯、兴趣标签等多维度数据，实现99.7%准确率的个性化内容推荐；2.实时学习能力：系统会根据您的每一次点击、停留时间、分享行为等实时调整推荐策略，越用越懂您；3.多场景适配：支持首页推荐、搜索联想、相关推荐、跨品类推荐等多种场景，全方位提升使用体验；4.隐私保护：所有个性化分析均在本地进行，绝不上传个人隐私数据，确保信息安全。界面体验升级：全新Material You设计语言、支持深色/浅色主题自动切换、优化动画效果和交互反馈、提升页面加载速度50%、新增手势操作和快捷键支持。功能增强：新增批量操作、增强搜索功能、支持多格式文件预览、优化移动端适配、增加无障碍支持。立即更新：您可以通过应用商店搜索更新，或在设置中检查版本更新。首次使用时，系统会引导您完成个性化设置，整个过程仅需3分钟。我们相信这次更新将为您带来全新的使用体验，如有任何问题或建议，欢迎通过意见反馈渠道与我们联系。感谢您的支持与信任！"
        }
      ];
      for (let i = 0; i < 8; i++) {
        const template = messageTemplates[i % messageTemplates.length];
        const contentType = i % 3;
        let content = "";
        switch (contentType) {
          case 0:
            content = template.shortContent;
            break;
          case 1:
            content = template.mediumContent;
            break;
          case 2:
            content = template.longContent;
            break;
        }
        messages2.push({
          id: `msg_${baseId + i + 1}`,
          title: template.title,
          content,
          time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1e3).toISOString()
        });
      }
      return messages2;
    };
    const getContentType = (content) => {
      if (!content)
        return "short";
      const length = content.length;
      if (length <= CONTENT_CONFIG.SHORT_LIMIT) {
        return "short";
      } else if (length <= CONTENT_CONFIG.MEDIUM_LIMIT) {
        return "medium";
      } else {
        return "long";
      }
    };
    const getPreviewText = (content) => {
      if (!content)
        return "";
      return content.length > CONTENT_CONFIG.PREVIEW_LENGTH ? content.substring(0, CONTENT_CONFIG.PREVIEW_LENGTH) + "..." : content;
    };
    const toggleContent = (index) => {
      messages.value[index].expanded = !messages.value[index].expanded;
    };
    const viewFullContent = (message) => {
      common_vendor.index.navigateTo({
        url: `/pages/message-detail/index?id=${message.id}&title=${encodeURIComponent(message.title)}`
      });
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const now = /* @__PURE__ */ new Date();
        const diff = now - time;
        if (diff < 6e4) {
          return "刚刚";
        } else if (diff < 36e5) {
          return `${Math.floor(diff / 6e4)}分钟前`;
        } else if (diff < 864e5) {
          return `${Math.floor(diff / 36e5)}小时前`;
        } else if (diff < 6048e5) {
          return `${Math.floor(diff / 864e5)}天前`;
        } else {
          const month = String(time.getMonth() + 1).padStart(2, "0");
          const date = String(time.getDate()).padStart(2, "0");
          const hours = String(time.getHours()).padStart(2, "0");
          const minutes = String(time.getMinutes()).padStart(2, "0");
          if (time.getFullYear() === now.getFullYear()) {
            return `${month}-${date} ${hours}:${minutes}`;
          } else {
            return `${time.getFullYear()}-${month}-${date}`;
          }
        }
      } catch (error) {
        return String(timeStr);
      }
    };
    const handleRefresh = async () => {
      isRefreshing.value = true;
      try {
        await loadMessages(1);
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
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
    const loadMore = async () => {
      if (!hasMore.value || isLoadingMore.value)
        return;
      await loadMessages(currentPage.value + 1);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: messages.value.length > 0
      }, messages.value.length > 0 ? {} : {}, {
        d: isLoading.value && messages.value.length === 0
      }, isLoading.value && messages.value.length === 0 ? {} : common_vendor.e({
        e: common_vendor.f(messages.value, (message, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(message.title),
            b: common_vendor.t(formatTime(message.time)),
            c: getContentType(message.content) === "short"
          }, getContentType(message.content) === "short" ? {
            d: common_vendor.t(message.content)
          } : getContentType(message.content) === "medium" ? common_vendor.e({
            f: common_vendor.t(message.content),
            g: !message.expanded ? 1 : "",
            h: !message.expanded
          }, !message.expanded ? {} : {}, {
            i: common_vendor.t(message.expanded ? "收起" : "展开"),
            j: message.expanded ? 1 : "",
            k: common_vendor.o(($event) => toggleContent(index), message.id)
          }) : {
            l: common_vendor.t(getPreviewText(message.content)),
            m: common_vendor.o(($event) => viewFullContent(message), message.id)
          }, {
            e: getContentType(message.content) === "medium",
            n: message.id,
            o: message.expanded ? 1 : ""
          });
        }),
        f: hasMore.value
      }, hasMore.value ? common_vendor.e({
        g: isLoadingMore.value
      }, isLoadingMore.value ? {} : {
        h: common_vendor.o(loadMore)
      }) : messages.value.length > 0 ? {} : {}, {
        i: messages.value.length > 0
      }), {
        j: !isLoading.value && messages.value.length === 0
      }, !isLoading.value && messages.value.length === 0 ? {} : {}, {
        k: statusBarHeight.value + 48 + "px",
        l: isRefreshing.value,
        m: common_vendor.o(handleRefresh),
        n: common_vendor.o(handleRefreshRestore),
        o: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-82517712"]]);
wx.createPage(MiniProgramPage);
