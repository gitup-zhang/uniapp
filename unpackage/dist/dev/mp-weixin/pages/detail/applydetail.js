"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const store_Info = require("../../store/Info.js");
const utils_data = require("../../utils/data.js");
const newApis_events = require("../../new-apis/events.js");
const store_field = require("../../store/field.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "applydetail",
  setup(__props) {
    const fieldstore = store_field.usefieldstore();
    const EventStore = store_Event.useEventstore();
    const UserStore = store_Info.useInfoStore();
    let id = common_vendor.ref();
    const isEditing = common_vendor.ref(false);
    const isSubmitted = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      name: "",
      phone: "",
      email: "",
      unit: "",
      sectoral: "",
      industryIndex: -1,
      // 行业选择索引
      career: ""
      // 职业
    });
    function hasUserId(id2) {
      return EventStore.eventdetail.user_info.some((item) => item.code === id2);
    }
    const initFormData = () => {
      const userInfo = UserStore.info || {};
      formData.name = userInfo.name || "";
      formData.phone = userInfo.phone_number || "";
      formData.email = userInfo.email || "";
      formData.unit = userInfo.unit || "";
      formData.sectoral = userInfo.department || "";
      formData.career = userInfo.position || "";
      if (userInfo.industry) {
        console.log("获取到的行业信息：", userInfo.industry);
        const industryIndex = fieldstore.industory.findIndex((option) => option === userInfo.industry);
        console.log("industryIndex:", industryIndex);
        formData.industryIndex = industryIndex !== -1 ? industryIndex : -1;
      }
      isSubmitted.value = !!(userInfo.name && userInfo.phone_number && userInfo.email);
    };
    const validateSaveForm = () => {
      if (hasUserId("name")) {
        if (!formData.name.trim()) {
          common_vendor.index.showToast({ title: "请输入姓名", icon: "none" });
          return false;
        }
        if (formData.name.trim().length < 2) {
          common_vendor.index.showToast({ title: "姓名至少需要2个字符", icon: "none" });
          return false;
        }
      }
      if (hasUserId("email")) {
        if (!formData.email.trim()) {
          common_vendor.index.showToast({ title: "请输入邮箱地址", icon: "none" });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          common_vendor.index.showToast({ title: "请输入正确的邮箱格式", icon: "none" });
          return false;
        }
      }
      if (hasUserId("unit")) {
        if (!formData.unit.trim()) {
          common_vendor.index.showToast({ title: "请输入单位名称", icon: "none" });
          return false;
        }
      }
      if (hasUserId("position")) {
        if (!formData.career.trim()) {
          common_vendor.index.showToast({ title: "请输入职业", icon: "none" });
          return false;
        }
      }
      return true;
    };
    const saveUserInfo = async () => {
      var _a;
      if (!validateSaveForm()) {
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "保存中..." });
        const requestData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          unit: formData.unit.trim(),
          department: formData.sectoral.trim(),
          position: formData.career.trim(),
          industry: formData.industryIndex !== -1 ? fieldstore.industory[formData.industryIndex] : ""
        };
        console.log("提交保存数据:", requestData);
        const response = await UserStore.updateinfo(requestData);
        console.log("保存响应:", response);
        if (response.code === 200) {
          isEditing.value = false;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
        } else {
          throw new Error(((_a = response.data) == null ? void 0 : _a.message) || "保存失败");
        }
      } catch (error) {
        console.error("保存用户信息失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "保存失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const handleEdit = async () => {
      if (!isEditing.value) {
        common_vendor.index.showModal({
          title: "编辑提示",
          content: "表单编辑的内容会同步改变个人信息，是否继续编辑？",
          confirmText: "确认",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              isEditing.value = true;
            }
          }
        });
      } else {
        await saveUserInfo();
      }
    };
    const onIndustryChange = (e) => {
      formData.industryIndex = e.detail.value;
    };
    function onBack() {
      common_vendor.index.navigateBack();
    }
    const validateForm = () => {
      if (hasUserId("name")) {
        if (!formData.name.trim()) {
          common_vendor.index.showToast({ title: "请输入姓名", icon: "none" });
          return false;
        }
        if (formData.name.trim().length < 2) {
          common_vendor.index.showToast({ title: "姓名至少需要2个字符", icon: "none" });
          return false;
        }
      }
      if (hasUserId("phone_number")) {
        if (!formData.phone) {
          common_vendor.index.showToast({ title: "请绑定手机号码", icon: "none" });
          return false;
        }
        if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
          common_vendor.index.showToast({ title: "手机号码格式不正确", icon: "none" });
          return false;
        }
      }
      if (hasUserId("email")) {
        if (!formData.email.trim()) {
          common_vendor.index.showToast({ title: "请输入邮箱地址", icon: "none" });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          common_vendor.index.showToast({ title: "请输入正确的邮箱格式", icon: "none" });
          return false;
        }
      }
      if (hasUserId("unit")) {
        if (!formData.unit.trim()) {
          common_vendor.index.showToast({ title: "请输入单位名称", icon: "none" });
          return false;
        }
      }
      if (hasUserId("position")) {
        if (!formData.career.trim()) {
          common_vendor.index.showToast({ title: "请输入职业", icon: "none" });
          return false;
        }
      }
      return true;
    };
    const handleSubmit = async () => {
      if (isEditing.value) {
        common_vendor.index.showToast({
          title: "请先保存编辑的内容",
          icon: "none"
        });
        return;
      }
      if (!validateForm())
        return;
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        console.log("报名的id:", typeof parseInt(id.value, 10));
        const res = await newApis_events.activityapply({ "event_id": parseInt(id.value, 10) });
        console.log(res);
        if (res.code === 200) {
          console.log("报名成功");
          common_vendor.index.showToast({
            title: "报名成功！",
            icon: "success"
          });
        }
        common_vendor.index.navigateBack();
      } catch (e) {
        common_vendor.index.showToast({
          title: e.data.message,
          icon: "none"
        });
        console.log(e.data.message);
      } finally {
        common_vendor.index.hideLoading();
      }
      isSubmitted.value = true;
    };
    common_vendor.onMounted(async () => {
      await fieldstore.getindustory();
      initFormData();
    });
    common_vendor.onLoad(async (option) => {
      console.log("申请详细option:", option);
      id.value = decodeURIComponent(option.id);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onBack),
        b: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        c: common_vendor.unref(EventStore).eventdetail.cover_image_url,
        d: common_vendor.t(common_vendor.unref(EventStore).eventdetail.title),
        e: common_vendor.t(common_vendor.unref(utils_data.formatEventDate)(common_vendor.unref(EventStore).eventdetail.event_start_time, common_vendor.unref(EventStore).eventdetail.event_end_time)),
        f: common_vendor.t(common_vendor.unref(EventStore).eventdetail.event_address),
        g: common_vendor.t(common_vendor.unref(EventStore).eventdetail.registration_fee),
        h: common_vendor.unref(EventStore).eventdetail.user_info.length > 0
      }, common_vendor.unref(EventStore).eventdetail.user_info.length > 0 ? {
        i: common_vendor.t(isEditing.value ? "✓" : "✎"),
        j: common_vendor.t(isEditing.value ? "保存" : "编辑"),
        k: common_vendor.o(handleEdit),
        l: isEditing.value ? 1 : ""
      } : {}, {
        m: hasUserId("name") || hasUserId("phone_number") || hasUserId("email")
      }, hasUserId("name") || hasUserId("phone_number") || hasUserId("email") ? common_vendor.e({
        n: hasUserId("name")
      }, hasUserId("name") ? {
        o: !isEditing.value,
        p: !isEditing.value ? 1 : "",
        q: isEditing.value ? 1 : "",
        r: formData.name,
        s: common_vendor.o(($event) => formData.name = $event.detail.value)
      } : {}, {
        t: hasUserId("phone_number")
      }, hasUserId("phone_number") ? {
        v: common_vendor.t(formData.phone || "未绑定")
      } : {}, {
        w: hasUserId("email")
      }, hasUserId("email") ? {
        x: !isEditing.value,
        y: !isEditing.value ? 1 : "",
        z: isEditing.value ? 1 : "",
        A: formData.email,
        B: common_vendor.o(($event) => formData.email = $event.detail.value)
      } : {}) : {}, {
        C: hasUserId("unit") || hasUserId("department") || hasUserId("industry") || hasUserId("position")
      }, hasUserId("unit") || hasUserId("department") || hasUserId("industry") || hasUserId("position") ? common_vendor.e({
        D: hasUserId("unit")
      }, hasUserId("unit") ? {
        E: !isEditing.value,
        F: !isEditing.value ? 1 : "",
        G: isEditing.value ? 1 : "",
        H: formData.unit,
        I: common_vendor.o(($event) => formData.unit = $event.detail.value)
      } : {}, {
        J: hasUserId("department")
      }, hasUserId("department") ? {
        K: !isEditing.value,
        L: !isEditing.value ? 1 : "",
        M: isEditing.value ? 1 : "",
        N: formData.sectoral,
        O: common_vendor.o(($event) => formData.sectoral = $event.detail.value)
      } : {}, {
        P: hasUserId("industry")
      }, hasUserId("industry") ? common_vendor.e({
        Q: common_vendor.t(formData.industryIndex === -1 ? "请选择行业" : common_vendor.unref(fieldstore).industory[formData.industryIndex]),
        R: formData.industryIndex === -1 ? 1 : "",
        S: isEditing.value
      }, isEditing.value ? {} : {}, {
        T: !isEditing.value ? 1 : "",
        U: isEditing.value ? 1 : "",
        V: common_vendor.unref(fieldstore).industory,
        W: formData.industryIndex,
        X: common_vendor.o(onIndustryChange),
        Y: !isEditing.value
      }) : {}, {
        Z: hasUserId("position")
      }, hasUserId("position") ? {
        aa: !isEditing.value,
        ab: !isEditing.value ? 1 : "",
        ac: isEditing.value ? 1 : "",
        ad: formData.career,
        ae: common_vendor.o(($event) => formData.career = $event.detail.value)
      } : {}) : {}, {
        af: common_vendor.o(handleSubmit),
        ag: isEditing.value,
        ah: isEditing.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-123ce677"]]);
wx.createPage(MiniProgramPage);
