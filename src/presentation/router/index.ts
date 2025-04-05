import { createRouter, createWebHistory } from 'vue-router'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Account from '@/presentation/components/pages/Account.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'
import NotFoundPage from '@/presentation/components/pages/auth/NotFoundPage.vue'
import { requireAuth } from './guards'
import PunchCounter from '@/presentation/components/pages/PunchCounter.vue'
import ExercisesPage from '@/presentation/components/pages/ExercisesPage.vue'
import ProgressPage from '@/presentation/components/pages/ProgressPage.vue'

const routes = [
  {
    path: '/',
    name: 'Exercises',
    component: ExercisesPage,
    beforeEnter: requireAuth,
    meta: {
      name: 'Exercises',
      tags: ['userRoute']
    }
  },
  {
    path: '/progress',
    name: 'Progress',
    component: ProgressPage,
    beforeEnter: requireAuth,
    meta: {
      name: 'Progress',
      tags: ['userRoute']
    }
  },
  {
    path: '/combinations',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
    beforeEnter: requireAuth,
    meta: {
      name: 'Combos',
      tags: ['userRoute']
    }
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
    beforeEnter: requireAuth,
    meta: {
      name: 'Enemy Card',
      tags: ['userRoute']
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: requireAuth,
    meta: {
      name: 'Account',
      tags: ['userRoute']
    }
  },
  {
    path: '/punch-counter',
    name: 'PunchCounter',
    component: PunchCounter,
    beforeEnter: requireAuth,
    meta: {
      name: 'Punch counter'
      // tags: ['userRoute']
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      name: 'Log in',
      tags: ['authRoute']
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      name: 'Sign up',
      tags: ['authRoute']
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      name: 'Page Not Found'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})
