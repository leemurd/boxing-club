import { createRouter, createWebHistory } from 'vue-router'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Account from '@/presentation/components/pages/Account.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'
import NotFoundPage from '@/presentation/components/pages/auth/NotFoundPage.vue'
import { requireAuth } from './guards'
import PunchCounter from '@/presentation/components/pages/PunchCounter.vue'
import Trainings from '@/presentation/components/pages/Trainings.vue'
import ProgressPage from '@/presentation/components/pages/ProgressPage.vue'

const routes = [
  {
    path: '/',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
    beforeEnter: requireAuth,
    meta: {
      name: 'Combination Builder'
    }
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
    beforeEnter: requireAuth,
    meta: {
      name: 'Enemy Card'
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: requireAuth,
    meta: {
      name: 'Account'
    }
  },
  {
    path: '/progress',
    name: 'Progress',
    component: ProgressPage,
    beforeEnter: requireAuth,
    meta: {
      name: 'Progress'
    }
  },
  {
    path: '/trainings',
    name: 'Trainings',
    component: Trainings,
    beforeEnter: requireAuth,
    meta: {
      name: 'Trainings'
    }
  },
  {
    path: '/punch-counter',
    name: 'PunchCounter',
    component: PunchCounter,
    beforeEnter: requireAuth,
    meta: {
      name: 'Punch counter'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      name: 'Log in'
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      name: 'Sign up'
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
