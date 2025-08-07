"use strict";
const common_vendor = require("../../common/vendor.js");
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
    const careerOptions = [
      "学生",
      "教师/教育工作者",
      "工程师",
      "产品经理",
      "设计师",
      "销售",
      "市场营销",
      "人力资源",
      "财务会计",
      "医生/医护人员",
      "律师",
      "咨询顾问",
      "创业者",
      "自由职业者",
      "公务员",
      "其他"
    ];
    const isEditing = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      name: "尹慧",
      phone: "18520658976",
      verifyCode: "",
      email: "",
      unit: "广州华南商贸学院",
      sectoral: "教导处",
      office: "院士",
      careerIndex: -1,
      // 职业选择索引，-1表示未选择
      birthDate: "1997-11-14",
      idCard: ""
    });
    const countDown = common_vendor.ref(0);
    const isCountingDown = common_vendor.computed(() => countDown.value > 0);
    const countDownText = common_vendor.computed(() => {
      return isCountingDown.value ? `${countDown.value}s` : "发送验证码";
    });
    const maxDate = common_vendor.computed(() => {
      const today = /* @__PURE__ */ new Date();
      return today.toISOString().split("T")[0];
    });
    const handleEdit = () => {
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
          isEditing.value = false;
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
        }
      }
    };
    const sendVerifyCode = () => {
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
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
      common_vendor.index.showToast({
        title: "验证码已发送",
        icon: "success"
      });
    };
    const onDateChange = (e) => {
      formData.birthDate = e.detail.value;
    };
    const onCareerChange = (e) => {
      formData.careerIndex = e.detail.value;
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
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        common_vendor.index.showToast({ title: "请输入正确的邮箱格式", icon: "none" });
        return false;
      }
      if (formData.idCard && !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
        common_vendor.index.showToast({ title: "请输入正确的身份证号码", icon: "none" });
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
      if (!formData.verifyCode) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
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
      if (formData.careerIndex === -1) {
        common_vendor.index.showToast({ title: "请选择职业", icon: "none" });
        return false;
      }
      if (!formData.birthDate) {
        common_vendor.index.showToast({ title: "请选择出生日期", icon: "none" });
        return false;
      }
      if (!formData.idCard) {
        common_vendor.index.showToast({ title: "请输入身份证号码", icon: "none" });
        return false;
      }
      if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
        common_vendor.index.showToast({ title: "请输入正确的身份证号码", icon: "none" });
        return false;
      }
      return true;
    };
    const handleSubmit = () => {
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
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "报名成功！",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 2e3);
    };
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
        c: common_vendor.t(isEditing.value ? "保存" : "编辑"),
        d: common_vendor.o(handleEdit),
        e: isEditing.value ? 1 : "",
        f: !isEditing.value,
        g: !isEditing.value ? 1 : "",
        h: formData.name,
        i: common_vendor.o(($event) => formData.name = $event.detail.value),
        j: !isEditing.value,
        k: !isEditing.value ? 1 : "",
        l: formData.phone,
        m: common_vendor.o(($event) => formData.phone = $event.detail.value),
        n: common_vendor.t(countDownText.value),
        o: common_vendor.o(sendVerifyCode),
        p: isCountingDown.value,
        q: !isEditing.value ? 1 : "",
        r: !isEditing.value ? 1 : "",
        s: formData.verifyCode,
        t: common_vendor.o(($event) => formData.verifyCode = $event.detail.value),
        v: !isEditing.value,
        w: !isEditing.value ? 1 : "",
        x: formData.email,
        y: common_vendor.o(($event) => formData.email = $event.detail.value),
        z: !isEditing.value,
        A: !isEditing.value ? 1 : "",
        B: formData.unit,
        C: common_vendor.o(($event) => formData.unit = $event.detail.value),
        D: !isEditing.value,
        E: !isEditing.value ? 1 : "",
        F: formData.sectoral,
        G: common_vendor.o(($event) => formData.sectoral = $event.detail.value),
        H: !isEditing.value,
        I: !isEditing.value ? 1 : "",
        J: formData.office,
        K: common_vendor.o(($event) => formData.office = $event.detail.value),
        L: common_vendor.t(formData.careerIndex === -1 ? "请选择职业" : careerOptions[formData.careerIndex]),
        M: formData.careerIndex === -1 ? 1 : "",
        N: isEditing.value
      }, isEditing.value ? {} : {}, {
        O: !isEditing.value ? 1 : "",
        P: careerOptions,
        Q: formData.careerIndex,
        R: common_vendor.o(onCareerChange),
        S: !isEditing.value,
        T: common_vendor.t(formData.birthDate || "请选择出生日期"),
        U: !formData.birthDate ? 1 : "",
        V: isEditing.value
      }, isEditing.value ? {} : {}, {
        W: !isEditing.value ? 1 : "",
        X: formData.birthDate,
        Y: common_vendor.o(onDateChange),
        Z: maxDate.value,
        aa: !isEditing.value,
        ab: !isEditing.value,
        ac: !isEditing.value ? 1 : "",
        ad: formData.idCard,
        ae: common_vendor.o(($event) => formData.idCard = $event.detail.value),
        af: common_vendor.o(handleSubmit),
        ag: isEditing.value,
        ah: isEditing.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-123ce677"]]);
wx.createPage(MiniProgramPage);
