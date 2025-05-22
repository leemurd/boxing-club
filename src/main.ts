import '@/presentation/styles/main.scss'
// import * as Popper from "@popperjs/core"
// import all as bootstrap from 'bootstrap'
import 'bootstrap/dist/js/bootstrap.min.js'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import { useAuthStore } from '@/presentation/stores/authStore'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './presentation/router'
import { useThemeStore } from '@/presentation/stores/themeStore'

const app = createApp(App)

const toastOptions: PluginOptions = {
  position: POSITION.TOP_CENTER,
  transition: 'fade',
  timeout: 2048,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.65,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: false,
  rtl: false,
  maxToasts: 2
}

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')

const authStore = useAuthStore()
authStore.init()
useThemeStore()
