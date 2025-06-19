import Login from '@/presentation/components/views/auth/Login.vue'
import Signup from '@/presentation/components/views/auth/Signup.vue'
import { RouterTags } from '@/presentation/router/routerTypes.ts'
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      name: 'Log in',
      tags: [RouterTags.authRoute]
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      name: 'Sign up',
      tags: [RouterTags.authRoute]
    }
  }
]
