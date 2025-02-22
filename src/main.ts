// import '@/presentation/assets/main.css'
import '@/presentation/assets/main.scss'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './presentation/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
