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
      return {
        a: common_vendor.o(onBack),
        b: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        c: formData.name,
        d: common_vendor.o(($event) => formData.name = $event.detail.value),
        e: formData.phone,
        f: common_vendor.o(($event) => formData.phone = $event.detail.value),
        g: common_vendor.t(countDownText.value),
        h: common_vendor.o(sendVerifyCode),
        i: isCountingDown.value,
        j: formData.verifyCode,
        k: common_vendor.o(($event) => formData.verifyCode = $event.detail.value),
        l: formData.email,
        m: common_vendor.o(($event) => formData.email = $event.detail.value),
        n: formData.unit,
        o: common_vendor.o(($event) => formData.unit = $event.detail.value),
        p: formData.sectoral,
        q: common_vendor.o(($event) => formData.sectoral = $event.detail.value),
        r: formData.office,
        s: common_vendor.o(($event) => formData.office = $event.detail.value),
        t: common_vendor.t(formData.careerIndex === -1 ? "请选择职业" : careerOptions[formData.careerIndex]),
        v: formData.careerIndex === -1 ? 1 : "",
        w: careerOptions,
        x: formData.careerIndex,
        y: common_vendor.o(onCareerChange),
        z: common_vendor.t(formData.birthDate || "请选择出生日期"),
        A: !formData.birthDate ? 1 : "",
        B: formData.birthDate,
        C: common_vendor.o(onDateChange),
        D: maxDate.value,
        E: formData.idCard,
        F: common_vendor.o(($event) => formData.idCard = $event.detail.value),
        G: common_vendor.o(handleSubmit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-123ce677"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/applydetail.js.map
