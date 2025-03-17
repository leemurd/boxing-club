import '@/presentation/styles/main.scss'
// import * as Popper from "@popperjs/core"
// import all as bootstrap from 'bootstrap'
// import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
import 'bootstrap/dist/js/bootstrap.min.js'
import { useAuthStore } from '@/presentation/stores/authStore'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './presentation/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const authStore = useAuthStore()
authStore.init()
