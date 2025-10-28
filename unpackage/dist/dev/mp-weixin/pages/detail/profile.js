"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
const store_field = require("../../store/field.js");
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
    const fieldstore = store_field.usefieldstore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const editPopup = common_vendor.ref(null);
    const loadingPopup = common_vendor.ref(null);
    const isSaving = common_vendor.ref(false);
    const loadingText = common_vendor.ref({ more: "加载中..." });
    const currentField = common_vendor.ref("");
    const editValue = common_vendor.ref("");
    const industryIndex = common_vendor.computed(() => {
      return fieldstore.industory.indexOf(editValue.value) >= 0 ? fieldstore.industory.indexOf(editValue.value) : 0;
    });
    common_vendor.onMounted(() => {
      initPage();
    });
    const initPage = () => {
      fieldstore.getindustory();
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
        "email": "邮箱"
      };
      return labels[field] || "";
    };
    const getFieldPlaceholder = (field) => {
      const placeholders = {
        "name": "请输入姓名",
        "nickname": "请输入昵称",
        "unit": "请输入单位名称",
        "department": "请输入部门名称",
        "position": "请输入职位",
        "email": "请输入邮箱地址"
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
        "email": 50
      };
      return maxLengths[field] || 50;
    };
    const isTextInput = (field) => {
      return ["name", "nickname", "unit", "department", "position", "email"].includes(field);
    };
    const editField = (field) => {
      var _a;
      currentField.value = field;
      editValue.value = userInfo.info[field] || "";
      (_a = editPopup.value) == null ? void 0 : _a.open();
    };
    const closeEdit = () => {
      var _a;
      (_a = editPopup.value) == null ? void 0 : _a.close();
      currentField.value = "";
      editValue.value = "";
    };
    const onDateChange = (e) => {
      editValue.value = e.detail.value;
    };
    const onIndustryChange = (e) => {
      const index = e.detail.value;
      editValue.value = fieldstore.industory[index];
    };
    const saveField = async () => {
      if (!editValue.value && currentField.value !== "slogan") {
        common_vendor.index.showToast({
          title: `请输入${getFieldLabel(currentField.value)}`,
          icon: "none"
        });
        return;
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
          type: "phone-filled",
          size: "16",
          color: "#666"
        }),
        s: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone_number)),
        t: common_vendor.p({
          type: "email",
          size: "16",
          color: "#666"
        }),
        v: common_vendor.t(common_vendor.unref(userInfo).info.email || "点击绑定邮箱"),
        w: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        x: common_vendor.o(($event) => editField("email")),
        y: common_vendor.p({
          type: "briefcase",
          size: "18",
          color: "#fff"
        }),
        z: common_vendor.p({
          type: "home",
          size: "16",
          color: "#666"
        }),
        A: common_vendor.t(common_vendor.unref(userInfo).info.unit || "点击设置单位"),
        B: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        C: common_vendor.o(($event) => editField("unit")),
        D: common_vendor.p({
          type: "gear",
          size: "16",
          color: "#666"
        }),
        E: common_vendor.t(common_vendor.unref(userInfo).info.department || "点击设置部门"),
        F: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        G: common_vendor.o(($event) => editField("department")),
        H: common_vendor.p({
          type: "star",
          size: "16",
          color: "#666"
        }),
        I: common_vendor.t(common_vendor.unref(userInfo).info.position || "点击设置职位"),
        J: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        K: common_vendor.o(($event) => editField("position")),
        L: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#666"
        }),
        M: common_vendor.t(common_vendor.unref(userInfo).info.industry || "点击选择行业"),
        N: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        O: common_vendor.o(($event) => editField("industry")),
        P: common_vendor.p({
          type: "loop",
          size: "20",
          color: "#ff4757"
        }),
        Q: common_vendor.o(confirmLogout),
        R: common_vendor.t(getFieldLabel(currentField.value)),
        S: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        T: common_vendor.o(closeEdit),
        U: isTextInput(currentField.value)
      }, isTextInput(currentField.value) ? {
        V: getFieldPlaceholder(currentField.value),
        W: getFieldMaxLength(currentField.value),
        X: editValue.value,
        Y: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        Z: currentField.value === "slogan"
      }, currentField.value === "slogan" ? {
        aa: editValue.value,
        ab: common_vendor.o(($event) => editValue.value = $event.detail.value)
      } : {}, {
        ac: currentField.value === "gender"
      }, currentField.value === "gender" ? {
        ad: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "F" ? "#fff" : "#666"
        }),
        ae: editValue.value === "F" ? 1 : "",
        af: common_vendor.o(($event) => editValue.value = "F"),
        ag: common_vendor.p({
          type: "person",
          size: "16",
          color: editValue.value === "M" ? "#fff" : "#666"
        }),
        ah: editValue.value === "M" ? 1 : "",
        ai: common_vendor.o(($event) => editValue.value = "M")
      } : {}, {
        aj: currentField.value === "birthday"
      }, currentField.value === "birthday" ? {
        ak: common_vendor.t(editValue.value || "请选择生日"),
        al: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        am: editValue.value,
        an: common_vendor.o(onDateChange)
      } : {}, {
        ao: currentField.value === "industry"
      }, currentField.value === "industry" ? {
        ap: common_vendor.t(editValue.value || "请选择行业"),
        aq: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        ar: industryIndex.value,
        as: common_vendor.unref(fieldstore).industory,
        at: common_vendor.o(onIndustryChange)
      } : {}, {
        av: common_vendor.o(closeEdit),
        aw: common_vendor.t(isSaving.value ? "保存中..." : "保存"),
        ax: common_vendor.o(saveField),
        ay: isSaving.value,
        az: common_vendor.sr(editPopup, "7b181482-20", {
          "k": "editPopup"
        }),
        aA: common_vendor.p({
          type: "center",
          ["mask-click"]: false
        }),
        aB: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        aC: common_vendor.sr(loadingPopup, "7b181482-26", {
          "k": "loadingPopup"
        }),
        aD: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7b181482"]]);
wx.createPage(MiniProgramPage);
