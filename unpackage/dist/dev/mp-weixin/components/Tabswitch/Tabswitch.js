"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Tabswitch",
  props: {
    modelValue: {
      type: String,
      default: "policy"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentTab = common_vendor.ref(props.modelValue);
    common_vendor.watch(() => props.modelValue, (val) => {
      currentTab.value = val;
      updateIndicator();
    });
    function changeTab(tab) {
      if (tab !== currentTab.value) {
        currentTab.value = tab;
        emit("update:modelValue", tab);
        updateIndicator();
      }
    }
    const indicatorStyle = common_vendor.ref({});
    function updateIndicator() {
      common_vendor.nextTick$1(() => {
        const id = currentTab.value === "policy" ? "#tab-policy" : "#tab-news";
        common_vendor.index.createSelectorQuery().in(common_vendor.index).select(id).boundingClientRect((rect) => {
          if (rect) {
            indicatorStyle.value = {
              width: rect.width + "px",
              left: rect.left + "px"
            };
          }
        }).exec();
      });
    }
    common_vendor.onMounted(() => {
      updateIndicator();
    });
    return (_ctx, _cache) => {
      return {
        a: currentTab.value === "policy" ? 1 : "",
        b: common_vendor.o(($event) => changeTab("policy")),
        c: currentTab.value === "news" ? 1 : "",
        d: common_vendor.o(($event) => changeTab("news")),
        e: common_vendor.s(indicatorStyle.value)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2539f56a"]]);
wx.createComponent(Component);
