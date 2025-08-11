"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Event = require("../../store/Event.js");
const store_Info = require("../../store/Info.js");
const utils_data = require("../../utils/data.js");
const newApis_events = require("../../new-apis/events.js");
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
    const EventStore = store_Event.useEventstore();
    const UserStore = store_Info.useInfoStore();
    let id = common_vendor.ref();
    const careerOptions = [
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
      careerIndex: -1
      // 职业选择索引，-1表示未选择
      //birthDate: '',
      //idCard: ''
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
      originalPhone.value = formData.phone;
      if (userInfo.position) {
        const positionIndex = careerOptions.findIndex((option) => option === userInfo.position);
        formData.careerIndex = positionIndex !== -1 ? positionIndex : -1;
      }
      if (userInfo.industry) {
        const industryIndex = industryOptions.findIndex((option) => option === userInfo.industry);
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
          // birth_date: formData.birthDate,
          // id_card: formData.idCard,
          // 将选择索引转换为具体内容
          position: formData.careerIndex !== -1 ? careerOptions[formData.careerIndex] : "",
          industry: formData.industryIndex !== -1 ? industryOptions[formData.industryIndex] : ""
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
    const onCareerChange = (e) => {
      formData.careerIndex = e.detail.value;
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
      if (formData.careerIndex === -1) {
        common_vendor.index.showToast({ title: "请选择职业", icon: "none" });
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
    common_vendor.onMounted(() => {
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
        c: common_vendor.unref(EventStore).eventdetail.images[0],
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
        S: common_vendor.t(formData.industryIndex === -1 ? "请选择行业" : industryOptions[formData.industryIndex]),
        T: formData.industryIndex === -1 ? 1 : "",
        U: isEditing.value
      }, isEditing.value ? {} : {}, {
        V: !isEditing.value ? 1 : "",
        W: isEditing.value ? 1 : "",
        X: industryOptions,
        Y: formData.industryIndex,
        Z: common_vendor.o(onIndustryChange),
        aa: !isEditing.value,
        ab: common_vendor.t(formData.careerIndex === -1 ? "请选择职业" : careerOptions[formData.careerIndex]),
        ac: formData.careerIndex === -1 ? 1 : "",
        ad: isEditing.value
      }, isEditing.value ? {} : {}, {
        ae: !isEditing.value ? 1 : "",
        af: isEditing.value ? 1 : "",
        ag: careerOptions,
        ah: formData.careerIndex,
        ai: common_vendor.o(onCareerChange),
        aj: !isEditing.value,
        ak: common_vendor.o(handleSubmit),
        al: isEditing.value,
        am: isEditing.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-123ce677"]]);
wx.createPage(MiniProgramPage);
