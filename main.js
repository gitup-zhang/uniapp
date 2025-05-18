import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
// 导入Pinia
import * as Pinia from 'pinia'
Vue.config.productionTip = false
Vue.use(Pinia.createPinia()) // ✅ Vue2 中注册 Pinia

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'  // ✅ Vue3 中导入 Pinia
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
	Pinia
  }
}
// #endif