"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_popup + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const editPopup = common_vendor.ref(null);
    const loadingPopup = common_vendor.ref(null);
    const isSaving = common_vendor.ref(false);
    const loadingText = common_vendor.ref({ more: "加载中..." });
    const currentField = common_vendor.ref("");
    const editValue = common_vendor.ref("");
    const verifyCode = common_vendor.ref("");
    const codeSending = common_vendor.ref(false);
    const countdown = common_vendor.ref(0);
    const canSendCode = common_vendor.ref(true);
    const industryOptions = [
      "互联网/电商",
      "金融/银行",
      "房地产/建筑",
      "教育/培训",
      "医疗/健康",
      "制造业",
      "服务业",
      "政府/事业单位",
      "媒体/广告",
      "交通/物流",
      "能源/环保",
      "农业/食品",
      "文化/娱乐",
      "咨询/法律",
      "其他"
    ];
    const positionOptions = [
      "总经理/CEO",
      "副总经理/副CEO",
      "总监",
      "副总监",
      "部门经理",
      "副经理",
      "主管/组长",
      "高级工程师",
      "工程师",
      "初级工程师",
      "高级专员",
      "专员",
      "助理专员",
      "销售总监",
      "销售经理",
      "销售代表",
      "市场总监",
      "市场经理",
      "市场专员",
      "产品总监",
      "产品经理",
      "产品专员",
      "技术总监",
      "技术经理",
      "架构师",
      "开发工程师",
      "测试工程师",
      "运维工程师",
      "设计总监",
      "设计经理",
      "UI设计师",
      "平面设计师",
      "人事总监",
      "人事经理",
      "人事专员",
      "财务总监",
      "财务经理",
      "会计",
      "出纳",
      "行政总监",
      "行政经理",
      "行政专员",
      "客服经理",
      "客服专员",
      "其他"
    ];
    const industryIndex = common_vendor.computed(() => {
      return industryOptions.indexOf(editValue.value) >= 0 ? industryOptions.indexOf(editValue.value) : 0;
    });
    const positionIndex = common_vendor.computed(() => {
      return positionOptions.indexOf(editValue.value) >= 0 ? positionOptions.indexOf(editValue.value) : 0;
    });
    common_vendor.onMounted(() => {
      initPage();
    });
    const initPage = () => {
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const formatPhoneNumber = (phone) => {
      if (!phone)
        return "未绑定";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    };
    const getGenderText = (gender) => {
      console.log("获取到的性别：", gender);
      return gender;
    };
    const getFieldLabel = (field) => {
      const labels = {
        "name": "姓名",
        "nickname": "昵称",
        "slogan": "个性签名",
        "gender": "性别",
        "birthday": "生日",
        "unit": "单位",
        "department": "部门",
        "position": "职位",
        "industry": "行业",
        "email": "邮箱",
        "phone": "手机号码"
      };
      return labels[field] || "";
    };
    const getFieldPlaceholder = (field) => {
      const placeholders = {
        "name": "请输入姓名",
        "nickname": "请输入昵称",
        "unit": "请输入单位名称",
        "department": "请输入部门名称",
        "position": "请选择职位",
        "email": "请输入邮箱地址",
        "phone": "请输入新手机号码"
      };
      return placeholders[field] || "";
    };
    const getFieldMaxLength = (field) => {
      const maxLengths = {
        "name": 20,
        "nickname": 20,
        "unit": 50,
        "department": 30,
        "position": 30,
        "email": 50,
        "phone": 11
      };
      return maxLengths[field] || 50;
    };
    const isTextInput = (field) => {
      return ["name", "nickname", "unit", "department", "email", "phone"].includes(field);
    };
    const editField = (field) => {
      var _a;
      currentField.value = field;
      editValue.value = userInfo.info[field] || "";
      verifyCode.value = "";
      (_a = editPopup.value) == null ? void 0 : _a.open();
    };
    const closeEdit = () => {
      var _a;
      (_a = editPopup.value) == null ? void 0 : _a.close();
      currentField.value = "";
      editValue.value = "";
      verifyCode.value = "";
      if (countdown.value > 0) {
        clearInterval(countdownTimer.value);
        countdown.value = 0;
        canSendCode.value = true;
      }
    };
    let countdownTimer = common_vendor.ref(null);
    const sendVerifyCode = async () => {
      if (!editValue.value) {
        common_vendor.index.showToast({
          title: "请先输入手机号",
          icon: "none"
        });
        return;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(editValue.value)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      try {
        codeSending.value = true;
        await sendPhoneVerifyCode(editValue.value);
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "success"
        });
        startCountdown();
      } catch (error) {
        console.error("发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "发送失败，请重试",
          icon: "error"
        });
      } finally {
        codeSending.value = false;
      }
    };
    const startCountdown = () => {
      canSendCode.value = false;
      countdown.value = 60;
      countdownTimer.value = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer.value);
          canSendCode.value = true;
        }
      }, 1e3);
    };
    const getCodeButtonText = () => {
      if (codeSending.value)
        return "发送中...";
      if (countdown.value > 0)
        return `${countdown.value}s`;
      return "发送验证码";
    };
    const sendPhoneVerifyCode = async (phone) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/phone/send-code",
          method: "POST",
          data: { phone },
          header: {
            "Authorization": `Bearer ${userInfo.token}`
          },
          success: (res) => {
            if (res.data.success) {
              resolve(res.data.data);
            } else {
              reject(new Error(res.data.message || "发送失败"));
            }
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    };
    const onDateChange = (e) => {
      editValue.value = e.detail.value;
    };
    const onIndustryChange = (e) => {
      const index = e.detail.value;
      editValue.value = industryOptions[index];
    };
    const onPositionChange = (e) => {
      const index = e.detail.value;
      editValue.value = positionOptions[index];
    };
    const saveField = async () => {
      if (!editValue.value && currentField.value !== "slogan") {
        common_vendor.index.showToast({
          title: `请输入${getFieldLabel(currentField.value)}`,
          icon: "none"
        });
        return;
      }
      if (currentField.value === "phone") {
        if (!verifyCode.value) {
          common_vendor.index.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(editValue.value)) {
          common_vendor.index.showToast({
            title: "手机号格式不正确",
            icon: "none"
          });
          return;
        }
        if (verifyCode.value.length !== 6) {
          common_vendor.index.showToast({
            title: "验证码格式不正确",
            icon: "none"
          });
          return;
        }
      }
      if (currentField.value === "email" && editValue.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editValue.value)) {
          common_vendor.index.showToast({
            title: "邮箱格式不正确",
            icon: "none"
          });
          return;
        }
      }
      try {
        isSaving.value = true;
        const updateData = {
          [currentField.value]: editValue.value
        };
        if (currentField.value === "phone") {
          updateData.verifyCode = verifyCode.value;
        }
        console.log("更新的数据：", updateData);
        await userInfo.updateinfo(updateData);
        await userInfo.getinfo();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        closeEdit();
      } catch (error) {
        console.error("保存失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败，请重试",
          icon: "error"
        });
      } finally {
        isSaving.value = false;
      }
    };
    const changeAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          uploadAvatar(res.tempFilePaths[0]);
        }
      });
    };
    const uploadAvatar = async (filePath) => {
      try {
        showLoading("上传头像中...");
        const res = await userInfo.uploadimage(filePath);
        await userInfo.updateinfo({ "avatar_url": res.data.url });
        await userInfo.getinfo();
        console.log("res:", res);
        common_vendor.index.showToast({
          title: "头像更新成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "头像更新失败",
          icon: "error"
        });
      } finally {
        hideLoading();
      }
    };
    const confirmLogout = () => {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出当前账号吗？",
        confirmColor: "#ff4757",
        success: (res) => {
          if (res.confirm) {
            logout();
          }
        }
      });
    };
    const logout = async () => {
      try {
        showLoading("正在退出...");
        await userInfo.deleteinfo();
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "success"
        });
        common_vendor.index.reLaunch({
          url: "/pages/mymessage/mymessage"
        });
      } catch (error) {
        console.error("退出登录失败:", error);
      } finally {
        hideLoading();
      }
    };
    const showLoading = (text = "加载中...") => {
      var _a;
      loadingText.value.more = text;
      (_a = loadingPopup.value) == null ? void 0 : _a.open();
    };
    const hideLoading = () => {
      var _a;
      (_a = loadingPopup.value) == null ? void 0 : _a.close();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        c: common_vendor.unref(userInfo).info.avatar_url || "/static/icon/empty.png",
        d: common_vendor.p({
          type: "camera",
          size: "24",
          color: "#fff"
        }),
        e: common_vendor.o(changeAvatar),
        f: common_vendor.t(common_vendor.unref(userInfo).info.name || "点击设置姓名"),
        g: common_vendor.o(($event) => editField("name")),
        h: common_vendor.t(common_vendor.unref(userInfo).info.userId || "123456789"),
        i: common_vendor.p({
          type: "person",
          size: "18",
          color: "#fff"
        }),
        j: common_vendor.p({
          type: "person-filled",
          size: "16",
          color: "#666"
        }),
        k: common_vendor.t(common_vendor.unref(userInfo).info.nickname || "点击设置"),
        l: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        m: common_vendor.o(($event) => editField("nickname")),
        n: common_vendor.p({
          type: "flag",
          size: "16",
          color: "#666"
        }),
        o: common_vendor.t(getGenderText(common_vendor.unref(userInfo).info.gender)),
        p: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        q: common_vendor.o(($event) => editField("gender")),
        r: common_vendor.p({
          type: "briefcase",
          size: "18",
          color: "#fff"
        }),
        s: common_vendor.p({
          type: "home",
          size: "16",
          color: "#666"
        }),
        t: common_vendor.t(common_vendor.unref(userInfo).info.unit || "点击设置单位"),
        v: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        w: common_vendor.o(($event) => editField("unit")),
        x: common_vendor.p({
          type: "gear",
          size: "16",
          color: "#666"
        }),
        y: common_vendor.t(common_vendor.unref(userInfo).info.department || "点击设置部门"),
        z: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        A: common_vendor.o(($event) => editField("department")),
        B: common_vendor.p({
          type: "star",
          size: "16",
          color: "#666"
        }),
        C: common_vendor.t(common_vendor.unref(userInfo).info.position || "点击选择职位"),
        D: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        E: common_vendor.o(($event) => editField("position")),
        F: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#666"
        }),
        G: common_vendor.t(common_vendor.unref(userInfo).info.industry || "点击选择行业"),
        H: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        I: common_vendor.o(($event) => editField("industry")),
        J: common_vendor.p({
          type: "phone",
          size: "18",
          color: "#fff"
        }),
        K: common_vendor.p({
          type: "phone-filled",
          size: "16",
          color: "#666"
        }),
        L: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone)),
        M: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        N: common_vendor.o(($event) => editField("phone")),
        O: common_vendor.p({
          type: "email",
          size: "16",
          color: "#666"
        }),
        P: common_vendor.t(common_vendor.unref(userInfo).info.email || "点击绑定邮箱"),
        Q: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        R: common_vendor.o(($event) => editField("email")),
        S: common_vendor.p({
          type: "loop",
          size: "20",
          color: "#ff4757"
        }),
        T: common_vendor.o(confirmLogout),
        U: common_vendor.t(getFieldLabel(currentField.value)),
        V: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        W: common_vendor.o(closeEdit),
        X: isTextInput(currentField.value)
      }, isTextInput(currentField.value) ? {
        Y: getFieldPlaceholder(currentField.value),
        Z: getFieldMaxLength(currentField.value),
        aa: currentField.value === "phone" ? "number" : "text",
        ab: editValue.value,
        ac: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        ad: currentField.value === "phone"
      }, currentField.value === "phone" ? {
        ae: verifyCode.value,
        af: common_vendor.o(($event) => verifyCode.value = $event.detail.value),
        ag: common_vendor.t(getCodeButtonText()),
        ah: common_vendor.o(sendVerifyCode),
        ai: !canSendCode.value || codeSending.value
      } : {}, {
        aj: currentField.value === "slogan"
      }, currentField.value === "slogan" ? {
        ak: editValue.value,
        al: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        am: currentField.value === "gender"
      }, currentField.value === "gender" ? {
        an: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "F" ? "#fff" : "#666"
        }),
        ao: editValue.value === "F" ? 1 : "",
        ap: common_vendor.o(($event) => editValue.value = "F"),
        aq: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "M" ? "#fff" : "#666"
        }),
        ar: editValue.value === "M" ? 1 : "",
        as: common_vendor.o(($event) => editValue.value = "M")
      } : {}, {
        at: currentField.value === "birthday"
      }, currentField.value === "birthday" ? {
        av: common_vendor.t(editValue.value || "请选择生日"),
        aw: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        ax: editValue.value,
        ay: common_vendor.o(onDateChange)
      } : {}, {
        az: currentField.value === "industry"
      }, currentField.value === "industry" ? {
        aA: common_vendor.t(editValue.value || "请选择行业"),
        aB: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        aC: industryIndex.value,
        aD: industryOptions,
        aE: common_vendor.o(onIndustryChange)
      } : {}, {
        aF: currentField.value === "position"
      }, currentField.value === "position" ? {
        aG: common_vendor.t(editValue.value || "请选择职位"),
        aH: common_vendor.p({
          type: "star",
          size: "16",
          color: "#999"
        }),
        aI: positionIndex.value,
        aJ: positionOptions,
        aK: common_vendor.o(onPositionChange)
      } : {}, {
        aL: common_vendor.o(closeEdit),
        aM: common_vendor.t(isSaving.value ? "保存中..." : "保存"),
        aN: common_vendor.o(saveField),
        aO: isSaving.value,
        aP: common_vendor.sr(editPopup, "7b181482-22", {
          "k": "editPopup"
        }),
        aQ: common_vendor.p({
          type: "center",
          ["mask-click"]: false
        }),
        aR: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        aS: common_vendor.sr(loadingPopup, "7b181482-29", {
          "k": "loadingPopup"
        }),
        aT: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7b181482"]]);
wx.createPage(MiniProgramPage);
