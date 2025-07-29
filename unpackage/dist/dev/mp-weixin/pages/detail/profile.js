"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
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
    const industryIndex = common_vendor.computed(() => {
      return industryOptions.indexOf(editValue.value) >= 0 ? industryOptions.indexOf(editValue.value) : 0;
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
      const genderMap = {
        "male": "男",
        "female": "女"
      };
      return genderMap[gender] || "点击设置性别";
    };
    const getFieldLabel = (field) => {
      const labels = {
        "username": "昵称",
        "slogan": "个性签名",
        "gender": "性别",
        "birthday": "生日",
        "company": "单位",
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
        "username": "请输入昵称",
        "company": "请输入单位名称",
        "department": "请输入部门名称",
        "position": "请输入职位名称",
        "email": "请输入邮箱地址",
        "phone": "请输入新手机号码"
      };
      return placeholders[field] || "";
    };
    const getFieldMaxLength = (field) => {
      const maxLengths = {
        "username": 20,
        "company": 50,
        "department": 30,
        "position": 30,
        "email": 50,
        "phone": 11
      };
      return maxLengths[field] || 50;
    };
    const isTextInput = (field) => {
      return ["username", "company", "department", "position", "email", "phone"].includes(field);
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
        common_vendor.index.__f__("error", "at pages/detail/profile.vue:578", "发送验证码失败:", error);
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
        await saveUserProfile(updateData);
        userInfo.updateUserInfo(updateData);
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        closeEdit();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/profile.vue:720", "保存失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败，请重试",
          icon: "error"
        });
      } finally {
        isSaving.value = false;
      }
    };
    const saveUserProfile = async (formData) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/profile/update",
          method: "POST",
          data: formData,
          header: {
            "Authorization": `Bearer ${userInfo.token}`
          },
          success: (res) => {
            if (res.data.success) {
              resolve(res.data.data);
            } else {
              reject(new Error(res.data.message || "保存失败"));
            }
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
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
        await new Promise((resolve) => setTimeout(resolve, 2e3));
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
        await userInfo.logout();
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "success"
        });
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/profile.vue:834", "退出登录失败:", error);
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
        a: statusBarHeight.value + "px",
        b: common_vendor.p({
          type: "left",
          size: "20",
          color: "#fff"
        }),
        c: common_vendor.o(goBack),
        d: common_vendor.unref(userInfo).info.Image || "/static/icon/empty.png",
        e: common_vendor.p({
          type: "camera",
          size: "24",
          color: "#fff"
        }),
        f: common_vendor.o(changeAvatar),
        g: common_vendor.t(common_vendor.unref(userInfo).info.username || "用户"),
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
        k: common_vendor.t(common_vendor.unref(userInfo).info.username || "点击设置"),
        l: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        m: common_vendor.o(($event) => editField("username")),
        n: common_vendor.p({
          type: "chatbubble",
          size: "16",
          color: "#666"
        }),
        o: common_vendor.t(common_vendor.unref(userInfo).info.slogan || "点击设置个性签名"),
        p: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        q: common_vendor.o(($event) => editField("slogan")),
        r: common_vendor.p({
          type: "flag",
          size: "16",
          color: "#666"
        }),
        s: common_vendor.t(getGenderText(common_vendor.unref(userInfo).info.gender)),
        t: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        v: common_vendor.o(($event) => editField("gender")),
        w: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#666"
        }),
        x: common_vendor.t(common_vendor.unref(userInfo).info.birthday || "点击设置生日"),
        y: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        z: common_vendor.o(($event) => editField("birthday")),
        A: common_vendor.p({
          type: "briefcase",
          size: "18",
          color: "#fff"
        }),
        B: common_vendor.p({
          type: "home",
          size: "16",
          color: "#666"
        }),
        C: common_vendor.t(common_vendor.unref(userInfo).info.company || "点击设置单位"),
        D: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        E: common_vendor.o(($event) => editField("company")),
        F: common_vendor.p({
          type: "gear",
          size: "16",
          color: "#666"
        }),
        G: common_vendor.t(common_vendor.unref(userInfo).info.department || "点击设置部门"),
        H: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        I: common_vendor.o(($event) => editField("department")),
        J: common_vendor.p({
          type: "star",
          size: "16",
          color: "#666"
        }),
        K: common_vendor.t(common_vendor.unref(userInfo).info.position || "点击设置职位"),
        L: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        M: common_vendor.o(($event) => editField("position")),
        N: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#666"
        }),
        O: common_vendor.t(common_vendor.unref(userInfo).info.industry || "点击选择行业"),
        P: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        Q: common_vendor.o(($event) => editField("industry")),
        R: common_vendor.p({
          type: "phone",
          size: "18",
          color: "#fff"
        }),
        S: common_vendor.p({
          type: "phone-filled",
          size: "16",
          color: "#666"
        }),
        T: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone)),
        U: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        V: common_vendor.o(($event) => editField("phone")),
        W: common_vendor.p({
          type: "email",
          size: "16",
          color: "#666"
        }),
        X: common_vendor.t(common_vendor.unref(userInfo).info.email || "点击绑定邮箱"),
        Y: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        Z: common_vendor.o(($event) => editField("email")),
        aa: common_vendor.p({
          type: "loop",
          size: "20",
          color: "#ff4757"
        }),
        ab: common_vendor.o(confirmLogout),
        ac: common_vendor.t(getFieldLabel(currentField.value)),
        ad: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        ae: common_vendor.o(closeEdit),
        af: isTextInput(currentField.value)
      }, isTextInput(currentField.value) ? {
        ag: getFieldPlaceholder(currentField.value),
        ah: getFieldMaxLength(currentField.value),
        ai: currentField.value === "phone" ? "number" : "text",
        aj: editValue.value,
        ak: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        al: currentField.value === "phone"
      }, currentField.value === "phone" ? {
        am: verifyCode.value,
        an: common_vendor.o(($event) => verifyCode.value = $event.detail.value),
        ao: common_vendor.t(getCodeButtonText()),
        ap: common_vendor.o(sendVerifyCode),
        aq: !canSendCode.value || codeSending.value
      } : {}, {
        ar: currentField.value === "slogan"
      }, currentField.value === "slogan" ? {
        as: editValue.value,
        at: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        av: currentField.value === "gender"
      }, currentField.value === "gender" ? {
        aw: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "male" ? "#fff" : "#666"
        }),
        ax: editValue.value === "male" ? 1 : "",
        ay: common_vendor.o(($event) => editValue.value = "male"),
        az: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "female" ? "#fff" : "#666"
        }),
        aA: editValue.value === "female" ? 1 : "",
        aB: common_vendor.o(($event) => editValue.value = "female")
      } : {}, {
        aC: currentField.value === "birthday"
      }, currentField.value === "birthday" ? {
        aD: common_vendor.t(editValue.value || "请选择生日"),
        aE: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        aF: editValue.value,
        aG: common_vendor.o(onDateChange)
      } : {}, {
        aH: currentField.value === "industry"
      }, currentField.value === "industry" ? {
        aI: common_vendor.t(editValue.value || "请选择行业"),
        aJ: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        aK: industryIndex.value,
        aL: industryOptions,
        aM: common_vendor.o(onIndustryChange)
      } : {}, {
        aN: common_vendor.o(closeEdit),
        aO: common_vendor.t(isSaving.value ? "保存中..." : "保存"),
        aP: common_vendor.o(saveField),
        aQ: isSaving.value,
        aR: common_vendor.sr(editPopup, "7b181482-26", {
          "k": "editPopup"
        }),
        aS: common_vendor.p({
          type: "center",
          ["mask-click"]: false
        }),
        aT: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        aU: common_vendor.sr(loadingPopup, "7b181482-32", {
          "k": "loadingPopup"
        }),
        aV: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7b181482"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/profile.js.map
