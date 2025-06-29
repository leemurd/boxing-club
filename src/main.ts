// src/main.ts
import '@/presentation/styles/main.scss'
import { IonicVue } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/presentation/stores/authStore'

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

app.use(IonicVue, {
  // rippleEffect: false,
  mode: 'ios'
})
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)
// app.mount('#app')

router.isReady().then(() => app.mount('#app'))

const authStore = useAuthStore()
authStore.init()
useThemeStore()

document.addEventListener(
  'dblclick',
  function (e) {
    e.preventDefault()
  },
  { passive: false }
)

function updateVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
window.addEventListener('resize', updateVh)
updateVh()

// 3) На мобильных дополнительно ловим скрытие клавиатуры
if (Capacitor.getPlatform() !== 'web') {
  Keyboard.addListener('keyboardDidHide', updateVh)
}
