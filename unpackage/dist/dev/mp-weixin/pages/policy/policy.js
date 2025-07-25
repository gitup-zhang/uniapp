"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Articles = require("../../store/Articles.js");
const store_field = require("../../store/field.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + Tabswitch + _easycom_uni_card + ArticleCard)();
}
const Tabswitch = () => "../../components/Tabswitch/Tabswitch.js";
const ArticleCard = () => "../../components/ArticleCard/ArticleCard.js";
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    const newsList = common_vendor.ref([
      {
        id: "1",
        title: "AI技术突破：ChatGPT-5即将发布，性能提升显著",
        summary: "据最新消息，OpenAI即将发布ChatGPT-5，新版本在推理能力、多模态处理和代码生成方面都有显著提升，预计将改变人工智能应用格局。",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
        source: "科技日报",
        publishTime: new Date(Date.now() - 2 * 60 * 60 * 1e3),
        // 2小时前
        category: "科技",
        views: 12500,
        likes: 389,
        comments: 67
      },
      {
        id: "2",
        title: "新能源汽车市场持续火热，特斯拉Q4销量创历史新高",
        summary: "特斯拉公布2024年第四季度财报，全球交付量达到48.4万辆，同比增长20%，Model Y成为全球最畅销电动车型。",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
        source: "财经时报",
        publishTime: new Date(Date.now() - 5 * 60 * 60 * 1e3),
        // 5小时前
        category: "财经",
        views: 8900,
        likes: 156,
        comments: 34
      },
      {
        id: "3",
        title: "元宇宙概念重新升温，Meta推出全新VR设备",
        summary: "Meta公司发布了新一代VR头显设备，采用更轻便的设计和更高的分辨率，预计将推动虚拟现实技术普及。",
        image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400",
        source: "虚拟世界",
        publishTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3),
        // 1天前
        category: "数码",
        views: 6700,
        likes: 234,
        comments: 89
      },
      {
        id: "4",
        title: "量子计算领域再获突破，IBM发布1000量子比特处理器",
        summary: 'IBM宣布成功开发出1000量子比特的量子处理器"Condor"，这一突破将为量子计算的商业化应用奠定重要基础。',
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
        source: "量子科学",
        publishTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
        // 3天前
        category: "科学",
        views: 4500,
        likes: 178,
        comments: 45
      }
    ]);
    const listarticles = store_Articles.useArticlesStore();
    const field = store_field.usefieldstore();
    const activeTab = common_vendor.ref("policy");
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const isselected = common_vendor.ref(0);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_name: "全部" });
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const Params = {
      field_id: 0,
      page: 0,
      is_selection: 0,
      article_title: "",
      release_time: "",
      article_type: activeTab.value.toUpperCase()
    };
    common_vendor.watch(activeTab, (newVal, oldVal) => {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:223", "Tab 变化:", oldVal, "=>", newVal);
      if (newVal === "news") {
        listarticles.resetpage(1);
        Params.article_type = "NEWS";
      } else if (newVal === "policy") {
        listarticles.resetpage(1);
        Params.article_type = "POLICY";
      }
    });
    function search() {
      Params.article_title = searchbar.value;
      Params.page = 1;
      listarticles.getlistpolicy(Params);
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:238", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
      Params.page = 1;
      Params.article_title = searchbar.value;
      listarticles.getlistpolicy(Params);
    }
    function loadMore() {
      Params.page = listarticles.page + 1;
      listarticles.getarticlemore(Params);
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:253", "到底了");
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        if (value === null) {
          selectedDomain.value = { field_id: 0, field_name: "全部" };
          Params.page = 1;
          Params.field_id = selectedDomain.value.field_id;
          listarticles.getlistpolicy(Params);
        } else {
          selectedDomain.value = value;
          Params.page = 1;
          Params.field_id = selectedDomain.value.field_id;
          listarticles.getlistpolicy(Params);
        }
      }
      if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function OnClick(id) {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:286", "测试的Id:" + id);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${id}`
      });
    }
    common_vendor.onShow(() => {
      const source = common_vendor.index.getStorageSync("tabSource") || "tabbar";
      field.getfield();
      if (source === "switchTab") {
        common_vendor.index.__f__("log", "at pages/policy/policy.vue:296", "来源：通过 uni.switchTab() 跳转");
        Params.is_selection = 1;
        Params.page = 1;
        listarticles.getlistpolicy(Params);
        Params.article_type = "NEWS";
        listarticles.getlistpolicy(Params);
        Params.article_type = activeTab.value.toUpperCase();
      } else {
        common_vendor.index.__f__("log", "at pages/policy/policy.vue:304", "来源：用户点击 tabBar 进入");
        isselected.value = 0;
        Params.page = 1;
        listarticles.getlistpolicy(Params);
        Params.article_type = "NEWS";
        listarticles.getlistpolicy(Params);
        Params.article_type = activeTab.value.toUpperCase();
      }
      common_vendor.index.removeStorageSync("tabSource");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#903749",
          fixed: "true"
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(($event) => searchbar.value = $event),
        e: common_vendor.p({
          placeholder: "搜索政策或新闻",
          modelValue: searchbar.value
        }),
        f: common_vendor.o(($event) => activeTab.value = $event),
        g: common_vendor.p({
          modelValue: activeTab.value
        }),
        h: activeTab.value === "policy"
      }, activeTab.value === "policy" ? {} : {}, {
        i: common_vendor.t(selectedDomain.value.field_name || "全部领域"),
        j: currentDropdown.value === "domain" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("domain")),
        l: common_vendor.t(selectedTime.value),
        m: currentDropdown.value === "time" ? 1 : "",
        n: common_vendor.o(($event) => toggleDropdown("time")),
        o: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        p: common_vendor.o(($event) => selectOption("domain", null)),
        q: selectedDomain.value.field_id === 0 ? 1 : "",
        r: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.field_name),
            b: item.field_id,
            c: common_vendor.o(($event) => selectOption("domain", item), item.field_id),
            d: selectedDomain.value.field_id === item.field_id ? 1 : ""
          };
        })
      } : {}, {
        s: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        t: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        v: activeTab.value === "policy"
      }, activeTab.value === "policy" ? common_vendor.e({
        w: common_vendor.f(common_vendor.unref(listarticles).listpolicy, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.article_id,
            c: common_vendor.o(($event) => OnClick(item.article_id), item.article_id),
            d: "52720678-3-" + i0,
            e: common_vendor.p({
              title: item.article_title,
              extra: common_vendor.unref(utils_data.Dataformat)(item.release_time)
            })
          };
        }),
        x: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        y: !common_vendor.unref(listarticles).hasMore,
        z: common_vendor.o(loadMore)
      }) : common_vendor.e({
        A: common_vendor.f(newsList.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(_ctx.handleNewsClick, item.id),
            c: "52720678-4-" + i0,
            d: common_vendor.p({
              newsData: item
            })
          };
        }),
        B: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        C: !common_vendor.unref(listarticles).hasMore,
        D: common_vendor.o(loadMore)
      }));
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
