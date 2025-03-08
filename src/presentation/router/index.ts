import { createRouter, createWebHistory } from 'vue-router'
import PunchesCatalog from '@/presentation/components/pages/PunchesCatalog.vue'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Profile from '@/presentation/components/pages/Profile.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'
import NotFoundPage from '@/presentation/components/pages/auth/NotFoundPage.vue'
import { requireAuth } from './guards'

const routes = [
  {
    path: '/',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
    beforeEnter: requireAuth
  },
  {
    path: '/punches',
    name: 'PunchesCatalog',
    component: PunchesCatalog,
    beforeEnter: requireAuth
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
    beforeEnter: requireAuth
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})
