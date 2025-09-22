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
    const originalPhone = common_vendor.ref("");
    const needPhoneVerification = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      name: "",
      phone: "",
      verifyCode: "",
      email: "",
      unit: "",
      sectoral: "",
      industryIndex: -1,
      // 行业选择索引
      career: ""
      // 职业改为字符串输入
    });
    const countDown = common_vendor.ref(0);
    const isCountingDown = common_vendor.computed(() => countDown.value > 0);
    const countDownText = common_vendor.computed(() => {
      return isCountingDown.value ? `${countDown.value}s` : "发送验证码";
    });
    const canSendCode = common_vendor.computed(() => {
      return formData.phone && /^1[3-9]\d{9}$/.test(formData.phone);
    });
    common_vendor.computed(() => {
      const today = /* @__PURE__ */ new Date();
      return today.toISOString().split("T")[0];
    });
    const onPhoneInput = () => {
      if (isEditing.value && formData.phone !== originalPhone.value && formData.phone) {
        needPhoneVerification.value = true;
        formData.verifyCode = "";
      } else if (formData.phone === originalPhone.value) {
        needPhoneVerification.value = false;
        formData.verifyCode = "";
      }
    };
    const initFormData = () => {
      const userInfo = UserStore.info || {};
      formData.name = userInfo.name || "";
      formData.phone = userInfo.phone_number || "";
      formData.email = userInfo.email || "";
      formData.unit = userInfo.unit || "";
      formData.sectoral = userInfo.department || "";
      formData.career = userInfo.position || "";
      originalPhone.value = formData.phone;
      if (userInfo.industry) {
        console.log("获取到的行业信息：", userInfo.industry);
        const industryIndex = fieldstore.industory.findIndex((option) => option === userInfo.industry);
        console.log("industryIndex");
        formData.industryIndex = industryIndex !== -1 ? industryIndex : -1;
      }
      isSubmitted.value = !!(userInfo.name && userInfo.phone_number && userInfo.email);
    };
    const saveUserInfo = async () => {
      try {
        common_vendor.index.showLoading({ title: "保存中..." });
        const requestData = {
          name: formData.name.trim(),
          phone_number: formData.phone,
          email: formData.email,
          unit: formData.unit.trim(),
          department: formData.sectoral.trim(),
          position: formData.career.trim(),
          // 职业直接使用输入的字符串
          industry: formData.industryIndex !== -1 ? fieldstore.industory[formData.industryIndex] : ""
        };
        if (needPhoneVerification.value) {
          if (!formData.verifyCode) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "请输入验证码",
              icon: "none"
            });
            return;
          }
          requestData.verify_code = formData.verifyCode;
        }
        const response = await UserStore.updateinfo(requestData);
        console.log("response:", response);
        if (response.code === 200) {
          originalPhone.value = formData.phone;
          needPhoneVerification.value = false;
          formData.verifyCode = "";
          isEditing.value = false;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
        } else {
          throw new Error(response.data.message || "保存失败");
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
        if (validateFormData()) {
          await saveUserInfo();
        }
      }
    };
    const sendVerifyCode = async () => {
      if (!formData.phone) {
        common_vendor.index.showToast({
          title: "请先输入手机号码",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "发送中..." });
        countDown.value = 60;
        const timer = setInterval(() => {
          countDown.value--;
          if (countDown.value <= 0) {
            clearInterval(timer);
          }
        }, 1e3);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发送失败，请重试",
          icon: "none"
        });
      }
    };
    const onIndustryChange = (e) => {
      formData.industryIndex = e.detail.value;
    };
    function onBack() {
      common_vendor.index.navigateBack();
    }
    const validateFormData = () => {
      if (!formData.name.trim()) {
        common_vendor.index.showToast({ title: "请输入姓名", icon: "none" });
        return false;
      }
      if (!formData.phone) {
        common_vendor.index.showToast({ title: "请输入手机号码", icon: "none" });
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return false;
      }
      if (needPhoneVerification.value && !formData.verifyCode) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return false;
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        common_vendor.index.showToast({ title: "请输入正确的邮箱格式", icon: "none" });
        return false;
      }
      return true;
    };
    const validateForm = () => {
      if (!formData.name.trim()) {
        common_vendor.index.showToast({ title: "请输入姓名", icon: "none" });
        return false;
      }
      if (!formData.phone) {
        common_vendor.index.showToast({ title: "请输入手机号码", icon: "none" });
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return false;
      }
      if (!formData.email) {
        common_vendor.index.showToast({ title: "请输入邮箱地址", icon: "none" });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        common_vendor.index.showToast({ title: "请输入正确的邮箱格式", icon: "none" });
        return false;
      }
      if (!formData.unit.trim()) {
        common_vendor.index.showToast({ title: "请输入单位名称", icon: "none" });
        return false;
      }
      if (!formData.career.trim()) {
        common_vendor.index.showToast({ title: "请输入职业", icon: "none" });
        return false;
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
        console.log("报名的id:", typeof parseInt(id, 10));
        const res = await newApis_events.activityapply({ "event_id": parseInt(id, 10) });
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
        console.log(e);
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
      id = decodeURIComponent(option.id);
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
        h: common_vendor.t(isEditing.value ? "✓" : "✎"),
        i: common_vendor.t(isEditing.value ? "保存" : "编辑"),
        j: common_vendor.o(handleEdit),
        k: isEditing.value ? 1 : "",
        l: !isEditing.value,
        m: !isEditing.value ? 1 : "",
        n: isEditing.value ? 1 : "",
        o: formData.name,
        p: common_vendor.o(($event) => formData.name = $event.detail.value),
        q: !isEditing.value,
        r: !isEditing.value ? 1 : "",
        s: isEditing.value ? 1 : "",
        t: common_vendor.o([($event) => formData.phone = $event.detail.value, onPhoneInput]),
        v: formData.phone,
        w: needPhoneVerification.value && isEditing.value
      }, needPhoneVerification.value && isEditing.value ? {
        x: common_vendor.t(countDownText.value),
        y: common_vendor.o(sendVerifyCode),
        z: isCountingDown.value || !canSendCode.value
      } : {}, {
        A: needPhoneVerification.value && isEditing.value
      }, needPhoneVerification.value && isEditing.value ? {
        B: formData.verifyCode,
        C: common_vendor.o(($event) => formData.verifyCode = $event.detail.value)
      } : {}, {
        D: !isEditing.value,
        E: !isEditing.value ? 1 : "",
        F: isEditing.value ? 1 : "",
        G: formData.email,
        H: common_vendor.o(($event) => formData.email = $event.detail.value),
        I: !isEditing.value,
        J: !isEditing.value ? 1 : "",
        K: isEditing.value ? 1 : "",
        L: formData.unit,
        M: common_vendor.o(($event) => formData.unit = $event.detail.value),
        N: !isEditing.value,
        O: !isEditing.value ? 1 : "",
        P: isEditing.value ? 1 : "",
        Q: formData.sectoral,
        R: common_vendor.o(($event) => formData.sectoral = $event.detail.value),
        S: common_vendor.t(formData.industryIndex === -1 ? "请选择行业" : common_vendor.unref(fieldstore).industory[formData.industryIndex]),
        T: formData.industryIndex === -1 ? 1 : "",
        U: isEditing.value
      }, isEditing.value ? {} : {}, {
        V: !isEditing.value ? 1 : "",
        W: isEditing.value ? 1 : "",
        X: common_vendor.unref(fieldstore).industory,
        Y: formData.industryIndex,
        Z: common_vendor.o(onIndustryChange),
        aa: !isEditing.value,
        ab: !isEditing.value,
        ac: !isEditing.value ? 1 : "",
        ad: isEditing.value ? 1 : "",
        ae: formData.career,
        af: common_vendor.o(($event) => formData.career = $event.detail.value),
        ag: common_vendor.o(handleSubmit),
        ah: isEditing.value,
        ai: isEditing.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-123ce677"]]);
wx.createPage(MiniProgramPage);
