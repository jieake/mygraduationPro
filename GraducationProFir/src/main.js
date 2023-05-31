import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'normalize.css'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
const app = createApp(App).use(store)

app.use(router)
app.use(ElementPlus)

app.mount('#app')
