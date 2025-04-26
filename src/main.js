import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 创建并使用 Pinia
const pinia = createPinia()
app.use(pinia)

// 挂载应用
app.mount('#app')

// 调试信息
console.log('Vue 应用已启动')
